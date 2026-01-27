import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

// SMS templates (keep in sync with supabase/functions/_shared/sms-templates.ts)
const smsTemplates: Record<string, (d: { name: string; sessionCount: number }) => string> = {
  welcome: () =>
    "Welcome to TrackSpeed! 🏃 Start your first timing session today. Need help? Reply HELP. Reply STOP to opt out.",
  tips_day3: () =>
    "TrackSpeed tip: Use 2 phones for split times! Place one at start, one at finish. 📱⏱️",
  convert_day7: () =>
    "Special offer: 20% off TrackSpeed Pro! Unlimited timing & multi-device mode. Tap to claim: https://mytrackspeed.com/pro",
  winback: () =>
    "We miss you at TrackSpeed! Come back & get 20% off Pro. Tap to claim: https://mytrackspeed.com/pro",
};

export async function POST(request: Request) {
  try {
    const { template, phone } = await request.json();

    if (!template || !phone) {
      return NextResponse.json(
        { error: "Missing required fields: template and phone" },
        { status: 400 }
      );
    }

    if (!smsTemplates[template]) {
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

    // Generate SMS content with test data
    const data = {
      name: "Test User",
      sessionCount: 5,
    };

    const message = "[TEST] " + smsTemplates[template](data);

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
