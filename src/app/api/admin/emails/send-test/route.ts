import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "TrackSpeed <noreply@hello.mytrackspeed.com>";

// Import templates inline to avoid edge function dependency
const baseStyles = `
  body { background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 0; }
  .container { background-color: #ffffff; margin: 0 auto; max-width: 600px; padding: 0; }
  .header { padding: 32px 48px 24px; border-bottom: 1px solid #e6ebf1; }
  .logo { font-size: 24px; font-weight: 700; color: #5C8DB8; margin: 0; }
  .content { padding: 32px 48px; }
  .footer { padding: 24px 48px; border-top: 1px solid #e6ebf1; text-align: center; }
  h1 { font-size: 28px; font-weight: 700; color: #1a1a1a; margin: 0 0 24px; }
  p { font-size: 16px; line-height: 26px; color: #525f7f; margin: 0 0 16px; }
  .btn { display: inline-block; background-color: #5C8DB8; color: #ffffff !important; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; }
  .feature-box { background-color: #f9fafb; border-radius: 8px; padding: 20px 24px; margin: 24px 0; }
  hr { border: none; border-top: 1px solid #e6ebf1; margin: 32px 0; }
  .muted { color: #8898aa; font-size: 12px; }
  a { color: #5C8DB8; }
`;

function wrapTemplate(content: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${baseStyles}</style></head><body>
<div class="container"><div class="header"><p class="logo">TrackSpeed</p></div><div class="content">${content}</div>
<div class="footer"><p style="margin:0 0 8px;font-size:14px;color:#525f7f;">TrackSpeed - Sprint Timing Made Simple</p>
<p class="muted">&copy; 2026 Track Speed LLC. All rights reserved.</p></div></div></body></html>`;
}

interface TemplateData {
  name: string;
  sessionCount: number;
  daysLeft: number;
  featureTitle: string;
  featureDescription: string;
}

const templates: Record<string, (d: TemplateData) => { subject: string; html: string }> = {
  welcome: (d) => ({
    subject: "[TEST] Welcome to TrackSpeed!",
    html: wrapTemplate(`<h1>Welcome to TrackSpeed!</h1><p>Hi ${d.name},</p>
      <p>Thanks for downloading TrackSpeed! You're now ready to time sprints with professional-level accuracy using just your phone.</p>
      <div class="feature-box"><p style="font-weight:600;color:#1a1a1a;margin:0 0 12px;">Here's what you can do:</p>
      <p style="margin:0 0 8px;font-size:14px;"><strong>Multiple Start Types</strong> - Flying, countdown, voice command, touch release & more</p>
      <p style="margin:0 0 8px;font-size:14px;"><strong>Multi-Device</strong> - Connect two or more phones for start/finish timing</p>
      <p style="margin:0 0 8px;font-size:14px;"><strong>Photo Finish</strong> - Sub-frame accuracy with high-speed capture</p>
      <p style="margin:0;font-size:14px;"><strong>Track History</strong> - Monitor your progress over time</p></div>
      <hr><p>Happy sprinting!<br>The TrackSpeed Team</p>`),
  }),
  tips_day3: (d) => ({
    subject: "[TEST] 3 tips for more accurate sprint times",
    html: wrapTemplate(`<h1>Get the Most Accurate Times</h1><p>Hi ${d.name},</p>
      <p>Here are some tips to make sure you're getting the most accurate times possible.</p>
      <div class="feature-box"><p><strong>1. Stable Position</strong> - Use a tripod for best results</p>
      <p><strong>2. Good Lighting</strong> - Outdoors works best</p>
      <p style="margin:0;"><strong>3. Camera Angle</strong> - Position perpendicular to the track</p></div>
      <p>Keep pushing!<br>The TrackSpeed Team</p>`),
  }),
  convert_day7: (d) => ({
    subject: `[TEST] You've run ${d.sessionCount} sessions - here's what's next`,
    html: wrapTemplate(`<h1>You've run ${d.sessionCount} sessions!</h1><p>Hi ${d.name},</p>
      <p>Great progress! Here's what you're missing with the free version:</p>
      <div class="feature-box"><p><strong>Pro Features:</strong></p>
      <p style="font-size:14px;margin:0 0 8px;">Unlimited sessions, Full history & analytics, Multi-device mode</p></div>
      <p style="text-align:center;"><a href="#" class="btn">Upgrade to Pro</a></p>
      <p>Run fast,<br>The TrackSpeed Team</p>`),
  }),
  trial_cancelled: (d) => ({
    subject: `[TEST] Your TrackSpeed Pro access ends in ${d.daysLeft} days`,
    html: wrapTemplate(`<h1>We noticed you cancelled</h1><p>Hi ${d.name},</p>
      <p>Your Pro access ends in ${d.daysLeft} days. You've timed <strong>${d.sessionCount} sessions</strong> - that's great progress!</p>
      <p>If you change your mind, you can resubscribe anytime to keep your unlimited sessions and multi-device timing.</p>
      <p style="text-align:center;"><a href="#" class="btn">Resubscribe to Pro</a></p>
      <p>Keep training,<br>The TrackSpeed Team</p>`),
  }),
  winback: (d) => ({
    subject: "[TEST] We miss you at the track!",
    html: wrapTemplate(`<h1>We Miss You at the Track</h1><p>Hi ${d.name},</p>
      <p>It's been a while since you used TrackSpeed. Here's what you've been missing:</p>
      <div class="feature-box"><p><strong>Professional accuracy</strong> - Same precision as $3,000+ timing gates</p>
      <p><strong>Multi-device mode</strong> - Use 2+ phones for start/finish/splits</p>
      <p style="margin:0;"><strong>Multiple start types</strong> - Flying, countdown, voice command, touch release & more</p></div>
      <div class="feature-box" style="text-align:center;border:2px dashed #5C8DB8;">
      <p style="font-size:20px;font-weight:700;color:#5C8DB8;margin:0 0 8px;">Welcome Back: 50% Off</p>
      <p style="font-family:monospace;font-size:18px;font-weight:700;margin:0;">COMEBACK50</p></div>
      <p style="text-align:center;"><a href="#" class="btn">Reactivate Pro</a></p>
      <p>See you at the track,<br>The TrackSpeed Team</p>`),
  }),
  feature_update: (d) => ({
    subject: `[TEST] New in TrackSpeed: ${d.featureTitle}`,
    html: wrapTemplate(`<p style="display:inline-block;background:#5C8DB8;color:#fff;font-size:12px;font-weight:700;padding:4px 12px;border-radius:4px;margin:0 0 16px;">NEW FEATURE</p>
      <h1>${d.featureTitle}</h1><p>Hi ${d.name},</p><p>${d.featureDescription}</p>
      <div class="feature-box"><p style="font-weight:600;margin:0 0 12px;">How to use it:</p>
      <p style="font-size:14px;margin:0;">1. Update to the latest version<br>2. Open TrackSpeed<br>3. Find the new feature in Settings</p></div>
      <p style="text-align:center;"><a href="#" class="btn">Try It Now</a></p>
      <p>Keep improving,<br>The TrackSpeed Team</p>`),
  }),
};

export async function POST(request: Request) {
  try {
    const { template, email } = await request.json();

    if (!template || !email) {
      return NextResponse.json(
        { error: "Missing required fields: template and email" },
        { status: 400 }
      );
    }

    if (!templates[template]) {
      return NextResponse.json(
        { error: `Invalid template: ${template}` },
        { status: 400 }
      );
    }

    if (!RESEND_API_KEY) {
      return NextResponse.json(
        { error: "RESEND_API_KEY not configured" },
        { status: 500 }
      );
    }

    // Generate email content
    const data: TemplateData = {
      name: "Test User",
      sessionCount: 5,
      daysLeft: 7,
      featureTitle: "Video Export",
      featureDescription:
        "You can now export your sprint videos with time overlays! Share your progress with coaches and teammates.",
    };

    const { subject, html } = templates[template](data);

    // Send via Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: email,
        subject,
        html,
        reply_to: "support@trackspeed.app",
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Resend API error:", result);
      return NextResponse.json(
        { error: result.message || "Failed to send email" },
        { status: response.status }
      );
    }

    // Log the send in the database
    await supabase.from("email_send_log").insert({
      email,
      template,
      subject,
      status: "sent",
      resend_id: result.id,
      metadata: { test: true },
    });

    return NextResponse.json({
      success: true,
      message: `Test email sent to ${email}`,
      id: result.id,
    });
  } catch (error) {
    console.error("Error in send-test:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send email" },
      { status: 500 }
    );
  }
}
