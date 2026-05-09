import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyAdminSession } from "@/lib/admin-auth";
import { renderSMSTemplate } from "@/lib/sms-templates";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

export async function POST(request: Request) {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { template, phone } = await request.json();

    if (!template || !phone) {
      return NextResponse.json(
        { error: "Missing required fields: template and phone" },
        { status: 400 }
      );
    }

    let smsBody: string;
    try {
      smsBody = renderSMSTemplate(template, {
        name: "Test User",
        sessionCount: 5,
      });
    } catch {
      return NextResponse.json(
        { error: `Invalid template: ${template}` },
        { status: 400 }
      );
    }

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      return NextResponse.json(
        { error: "Twilio credentials not configured" },
        { status: 500 }
      );
    }

    // Normalize phone to E.164
    const normalizedPhone = phone.startsWith("+") ? phone : `+${phone}`;

    const message = "[TEST] " + smsBody;

    // Send via Twilio API
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;

    const response = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString(
            "base64"
          ),
      },
      body: new URLSearchParams({
        To: normalizedPhone,
        From: TWILIO_PHONE_NUMBER,
        Body: message,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Twilio API error:", result);

      // Log the failed attempt
      await supabase.from("sms_send_log").insert({
        phone: normalizedPhone,
        template,
        message,
        status: "failed",
        error_message: result.message || `Twilio error: ${result.code}`,
      });

      return NextResponse.json(
        { error: result.message || "Failed to send SMS" },
        { status: response.status }
      );
    }

    // Log the successful send
    await supabase.from("sms_send_log").insert({
      phone: normalizedPhone,
      template,
      message,
      status: "sent",
      twilio_sid: result.sid,
    });

    return NextResponse.json({
      success: true,
      message: `Test SMS sent to ${normalizedPhone}`,
      sid: result.sid,
    });
  } catch (error) {
    console.error("Error in sms send-test:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send SMS" },
      { status: 500 }
    );
  }
}
