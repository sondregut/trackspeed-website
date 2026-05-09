import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { verifyAdminSession } from "@/lib/admin-auth";
import { requireServerEnv } from "@/lib/server-secrets";

// GET - Fetch notification history
export async function GET() {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("notification_log")
      .select("*")
      .order("sent_at", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch logs" },
      { status: 500 }
    );
  }
}

// POST - Send a push notification via the edge function
export async function POST(req: Request) {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, body: notifBody, data, target, target_ids } = body;

    if (!title || !notifBody) {
      return NextResponse.json(
        { error: "title and body are required" },
        { status: 400 }
      );
    }

    const supabaseUrl = requireServerEnv("NEXT_PUBLIC_SUPABASE_URL");
    const supabaseServiceKey = requireServerEnv("SUPABASE_SERVICE_ROLE_KEY");

    // Call the Supabase edge function
    const response = await fetch(
      `${supabaseUrl}/functions/v1/send-push-notification`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({ title, body: notifBody, data, target, target_ids }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: result.error || "Failed to send notification" },
        { status: response.status }
      );
    }

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to send notification" },
      { status: 500 }
    );
  }
}
