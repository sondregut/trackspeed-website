import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("sms_send_log")
    .select("id, sent_at, phone, template, message, status, twilio_sid, error_message")
    .order("sent_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching SMS logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch SMS logs" },
      { status: 500 }
    );
  }

  return NextResponse.json(data || []);
}
