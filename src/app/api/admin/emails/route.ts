import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("email_send_log")
    .select("id, sent_at, email, template, status, resend_id, error_message")
    .order("sent_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching email logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch email logs" },
      { status: 500 }
    );
  }

  return NextResponse.json(data || []);
}
