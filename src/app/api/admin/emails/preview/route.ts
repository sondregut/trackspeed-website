import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";

// Email template preview generator (mirrors the edge function templates)
const baseStyles = `
  body {
    background-color: #f6f9fc;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    margin: 0;
    padding: 0;
  }
  .container {
    background-color: #ffffff;
    margin: 0 auto;
    max-width: 600px;
    padding: 0;
  }
  .header {
    padding: 32px 48px 24px;
    border-bottom: 1px solid #e6ebf1;
  }
  .logo {
    font-size: 24px;
    font-weight: 700;
    color: #5C8DB8;
    margin: 0;
  }
  .content { padding: 32px 48px; }
  .footer {
    padding: 24px 48px;
    border-top: 1px solid #e6ebf1;
    text-align: center;
  }
  h1 { font-size: 28px; font-weight: 700; color: #1a1a1a; margin: 0 0 24px; }
  p { font-size: 16px; line-height: 26px; color: #525f7f; margin: 0 0 16px; }
  .btn {
    display: inline-block;
    background-color: #5C8DB8;
    color: #ffffff !important;
    padding: 14px 32px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    font-size: 16px;
  }
  .btn-secondary {
    background-color: #ffffff;
    color: #5C8DB8 !important;
    border: 2px solid #5C8DB8;
  }
  .feature-box {
    background-color: #ffffff;
    border: 1px solid #e6ebf1;
    border-left: 3px solid #5C8DB8;
    border-radius: 6px;
    padding: 18px 20px;
    margin: 24px 0;
  }
  .pro-tip {
    background-color: #ffffff;
    border: 1px solid #e6ebf1;
    border-left: 3px solid #5C8DB8;
    border-radius: 6px;
    padding: 18px 20px;
    margin: 24px 0;
  }
  .warning-box {
    background-color: #ffffff;
    border: 1px solid #e6ebf1;
    border-left: 3px solid #d99a00;
    border-radius: 6px;
    padding: 18px 20px;
    margin: 24px 0;
  }
  .offer-box {
    background-color: #ffffff;
    border: 1px solid #e6ebf1;
    border-left: 3px solid #5C8DB8;
    border-radius: 6px;
    padding: 18px 20px;
    margin: 24px 0;
    text-align: center;
  }
  hr { border: none; border-top: 1px solid #e6ebf1; margin: 32px 0; }
  .muted { color: #8898aa; font-size: 12px; }
  a { color: #5C8DB8; }
`;

function wrapTemplate(content: string, previewText: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TrackSpeed Email Preview</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div style="display:none;max-height:0;overflow:hidden;">${previewText}</div>
  <div class="container">
    <div class="header">
      <p class="logo">TrackSpeed</p>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p style="margin:0 0 8px;font-size:14px;color:#525f7f;">TrackSpeed - Sprint Timing Made Simple</p>
      <p class="muted">
        <a href="https://mytrackspeed.com">Website</a> •
        <a href="mailto:support@mytrackspeed.com">Support</a> •
        <a href="/api/unsubscribe?email=test@example.com&token=preview">Unsubscribe</a>
      </p>
      <p class="muted">&copy; 2026 Track Speed LLC. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}

interface TemplateData {
  name?: string;
  sessionCount?: number;
  daysLeft?: number;
  featureTitle?: string;
  featureDescription?: string;
  sprintTime?: string;
  bestTime?: string;
  averageTime?: string;
  runCount?: number;
  distance?: string;
}

const templates: Record<string, (data: TemplateData) => { subject: string; html: string }> = {
  welcome: (data) => ({
    subject: "Welcome to TrackSpeed!",
    html: wrapTemplate(`
      <h1>Welcome to TrackSpeed!</h1>
      <p>Hi ${data.name || "Athlete"},</p>
      <p>Thanks for downloading TrackSpeed! You're now ready to time sprints with professional-level accuracy using just your phone.</p>

      <div class="feature-box">
        <p style="font-weight:600;color:#1a1a1a;margin:0 0 12px;">Here's what you can do:</p>
        <p style="margin:0 0 8px;font-size:14px;"><strong>Multiple Start Types</strong> - Flying, countdown, voice command, touch release & more</p>
        <p style="margin:0 0 8px;font-size:14px;"><strong>Multi-Device</strong> - Connect two or more phones for start/finish timing</p>
        <p style="margin:0 0 8px;font-size:14px;"><strong>Photo Finish</strong> - Precise line-crossing detection</p>
        <p style="margin:0;font-size:14px;"><strong>Track History</strong> - Monitor your progress over time</p>
      </div>

      <hr>

      <p>Get started by opening the app before your next sprint session and choosing the setup that fits the day.</p>

      <p style="text-align:center;margin:32px 0;">
        <a href="#" class="btn">Open TrackSpeed</a>
      </p>

      <p>Questions? Just reply to this email - we read every message.</p>
      <p>Happy sprinting!<br>The TrackSpeed Team</p>
    `, "Welcome to TrackSpeed - Let's get you timing!"),
  }),

  nudge_day1: (data) => ({
    subject: "Set up TrackSpeed for your next sprint session",
    html: wrapTemplate(`
      <h1>Set Up Your Next Sprint Session</h1>
      <p>Hi ${data.name || "Athlete"},</p>
      <p>When your next sprint session comes up, TrackSpeed can time the run with phones placed at the key points on the track.</p>
      <p>For the cleanest setup, use two phones: one at the start and one at the finish. Add more phones if you want split points.</p>

      <div class="feature-box">
        <p style="font-weight:600;color:#1a1a1a;margin:0 0 12px;">Next session setup:</p>
        <p style="font-size:14px;margin:0 0 8px;">1. Place one phone at the start line</p>
        <p style="font-size:14px;margin:0 0 8px;">2. Place another phone at the finish line</p>
        <p style="font-size:14px;margin:0;">3. Join both phones to the same TrackSpeed session</p>
      </div>

      <p>When you run, TrackSpeed pairs the start and finish events and saves the result to your session history.</p>

      <p style="text-align:center;margin:32px 0;">
        <a href="#" class="btn">Set Up My Next Session</a>
      </p>

      <hr>

      <div class="pro-tip">
        <p style="font-weight:600;color:#1a1a1a;margin:0 0 8px;">Did you know?</p>
        <p style="font-size:14px;margin:0;">TrackSpeed uses Photo Finish technology to detect when you cross the line - the same approach used in professional athletics. Your phone camera helps capture precise line-crossing moments.</p>
      </div>

      <p>Questions? Just reply to this email.</p>
      <p>See you at the track!<br>The TrackSpeed Team</p>
    `, "How to set up TrackSpeed for your next sprint session"),
  }),

  tips_day3: (data) => ({
    subject: "3 tips for more accurate sprint times",
    html: wrapTemplate(`
      <h1>Get the Most Accurate Times</h1>
      <p>Hi ${data.name || "Athlete"},</p>
      <p>After a few days with TrackSpeed, here are some tips to make sure you're getting the most accurate times possible:</p>

      <div style="margin:24px 0;">
        <p><span style="display:inline-block;width:28px;height:28px;background:#5C8DB8;color:#fff;border-radius:50%;text-align:center;line-height:28px;font-weight:700;margin-right:12px;">1</span><strong>Stable Phone Position</strong></p>
        <p style="margin-left:40px;font-size:14px;">Use a tripod for best results. The app detects movement, so a steady position means more accurate detection.</p>
      </div>

      <div style="margin:24px 0;">
        <p><span style="display:inline-block;width:28px;height:28px;background:#5C8DB8;color:#fff;border-radius:50%;text-align:center;line-height:28px;font-weight:700;margin-right:12px;">2</span><strong>Good Lighting</strong></p>
        <p style="margin-left:40px;font-size:14px;">Outdoors works best. If training indoors, make sure there's enough light. Avoid backlighting (sun behind the runner).</p>
      </div>

      <div style="margin:24px 0;">
        <p><span style="display:inline-block;width:28px;height:28px;background:#5C8DB8;color:#fff;border-radius:50%;text-align:center;line-height:28px;font-weight:700;margin-right:12px;">3</span><strong>Camera Angle</strong></p>
        <p style="margin-left:40px;font-size:14px;">Position your phone perpendicular to the track. Make sure the runner crosses through the center of the frame for best detection.</p>
      </div>

      <hr>

      <div class="pro-tip">
        <p style="font-weight:600;color:#1a1a1a;margin:0 0 8px;">Pro Tip: Multi-Device Mode</p>
        <p style="font-size:14px;margin:0;">For the most accurate times, use two or more phones - one at start, one at finish (and optionally at split points). This eliminates reaction time from your measurements.</p>
      </div>

      <p style="text-align:center;margin:32px 0;">
        <a href="#" class="btn">Adjust Settings</a>
      </p>

      <p>Keep pushing!<br>The TrackSpeed Team</p>
    `, "3 tips to get accurate sprint times with TrackSpeed"),
  }),

  checkin_day14: (data) => ({
    subject: "Two weeks in - here's how to level up your training",
    html: wrapTemplate(`
      <h1>Two Weeks In - How's It Going?</h1>
      <p>Hi ${data.name || "Athlete"},</p>
      ${data.sessionCount && data.sessionCount > 0
        ? `<p>You've logged <strong>${data.sessionCount} session${data.sessionCount > 1 ? 's' : ''}</strong> so far. That's real commitment!</p>
           <p>Want to take your training to the next level? Here's what Pro unlocks:</p>`
        : `<p>It's been two weeks since you joined TrackSpeed. We'd love to help you get started with sprint timing.</p>
           <p>If you haven't had a chance to try it yet, here's what you can do with Pro:</p>`
      }

      <div style="margin:0 0 24px;">
        <p style="margin:0 0 12px;font-size:15px;">✓ <strong>Multi-device timing</strong> - One phone at start, one at finish for professional accuracy</p>
        <p style="margin:0 0 12px;font-size:15px;">✓ <strong>Unlimited sessions</strong> - Train as much as you want, no limits</p>
        <p style="margin:0 0 12px;font-size:15px;">✓ <strong>Full history & analytics</strong> - See your progress over weeks and months</p>
        <p style="margin:0;font-size:15px;">✓ <strong>Video export</strong> - Share your runs with time overlay</p>
      </div>

      <div class="offer-box">
        <p style="font-size:12px;font-weight:700;color:#5C8DB8;margin:0 0 8px;letter-spacing:1px;">PRO PLANS</p>
        <p style="font-size:20px;font-weight:700;color:#1a1a1a;margin:0 0 4px;">$7.99/week or $59.99/year</p>
        <p style="font-size:14px;color:#8898aa;margin:0;">Best value with annual</p>
      </div>

      <p style="text-align:center;margin:32px 0;">
        <a href="#" class="btn">Upgrade to Pro</a>
      </p>

      <hr>

      <p>Not ready yet? No worries - you can keep using TrackSpeed for free. We're here whenever you're ready to level up.</p>
      <p>Keep pushing!<br>The TrackSpeed Team</p>
    `, "Two weeks in - here's how to level up your training"),
  }),

  first_session: (data) => ({
    subject: "Your first TrackSpeed session summary is ready",
    html: wrapTemplate(`
      <h1>Your First Session Summary</h1>
      <p>Hi ${data.name || "Athlete"},</p>
      <p>Nice work finishing a TrackSpeed session. Here's the full summary from that run day.</p>

      <div class="feature-box">
        <p style="font-weight:600;color:#1a1a1a;margin:0 0 12px;">Session summary</p>
        <p style="font-size:14px;margin:0 0 8px;"><strong>Distance</strong> - ${data.distance || "100m"}</p>
        <p style="font-size:14px;margin:0 0 8px;"><strong>Best time</strong> - ${data.bestTime || data.sprintTime || "12.34s"}</p>
        <p style="font-size:14px;margin:0 0 8px;"><strong>Latest run</strong> - ${data.sprintTime || "12.34s"}</p>
        <p style="font-size:14px;margin:0 0 8px;"><strong>Average time</strong> - ${data.averageTime || data.sprintTime || "12.34s"}</p>
        <p style="font-size:14px;margin:0;"><strong>Runs recorded</strong> - ${data.runCount || 1}</p>
      </div>

      <p>Use this as your baseline. After your next sprint session, compare the summary to see how your times are moving.</p>

      <div class="pro-tip">
        <p style="font-weight:600;color:#1a1a1a;margin:0 0 8px;">What's next?</p>
        <p style="font-size:14px;margin:0 0 8px;">• Repeat the same distance when you want a clean comparison</p>
        <p style="font-size:14px;margin:0 0 8px;">• Add start and finish phones for a full session setup</p>
        <p style="font-size:14px;margin:0;">• Review the saved session history after training</p>
      </div>

      <p style="text-align:center;margin:32px 0;">
        <a href="#" class="btn">Run Another Sprint</a>
      </p>

      <hr>

      <p>Keep it up - consistency is what separates good sprinters from great ones.</p>
      <p>Run fast!<br>The TrackSpeed Team</p>
    `, "Your first TrackSpeed session summary is ready"),
  }),

  convert_day7: (data) => ({
    subject: "Unlock TrackSpeed Pro",
    html: wrapTemplate(`
      <h1>Train with the Full Setup</h1>
      <p>Hi ${data.name || "there"},</p>
      <p>TrackSpeed Pro unlocks the full timing setup for serious sprint training.</p>

      <div class="offer-box">
        <p style="font-size:12px;font-weight:700;color:#5C8DB8;margin:0 0 8px;letter-spacing:1px;">TRACKSPEED PRO</p>
        <p style="font-size:28px;font-weight:700;color:#1a1a1a;margin:0 0 8px;">Multi-Device Sprint Timing</p>
        <p style="font-size:16px;color:#525f7f;margin:0;">Use TrackSpeed as a complete timing system for starts, finishes, history, and review.</p>
      </div>

      <p style="text-align:center;margin:32px 0;">
        <a href="trackspeed://subscribe" class="btn">Open TrackSpeed Pro</a>
      </p>

      <p style="font-weight:600;color:#1a1a1a;margin:24px 0 16px;">What you get with Pro:</p>

      <div style="margin:0 0 24px;">
        <p style="margin:0 0 12px;font-size:15px;">✓ <strong>Multi-device timing</strong> - Use 2+ phones as start/finish gates</p>
        <p style="margin:0 0 12px;font-size:15px;">✓ <strong>Unlimited sessions</strong> - No monthly limits</p>
        <p style="margin:0 0 12px;font-size:15px;">✓ <strong>Full history & analytics</strong> - Track your progress over time</p>
        <p style="margin:0 0 12px;font-size:15px;">✓ <strong>Video export</strong> - Share runs with time overlay</p>
        <p style="margin:0;font-size:15px;">✓ <strong>Priority support</strong> - Get help when you need it</p>
      </div>

      <p>Not ready yet? No problem - your sessions stay in TrackSpeed when you're ready to train with the full setup.</p>
      <p>Run fast,<br>The TrackSpeed Team</p>
    `, "Unlock TrackSpeed Pro for full sprint timing"),
  }),

  trial_cancelled: (data) => ({
    subject: `Your TrackSpeed Pro access ends in ${data.daysLeft || 7} day${(data.daysLeft || 7) > 1 ? 's' : ''}`,
    html: wrapTemplate(`
      <h1>We noticed you cancelled</h1>
      <p>Hi ${data.name || "Athlete"},</p>
      <p>Your Pro access ends in <strong>${data.daysLeft || 7} days</strong>.</p>
      ${data.sessionCount && data.sessionCount > 0
        ? `<p>You've timed <strong>${data.sessionCount} sessions</strong> during your subscription. That's great progress!</p>`
        : ``
      }

      <div class="warning-box">
        <p style="font-weight:600;color:#856404;margin:0 0 12px;">What happens when your access ends?</p>
        <p style="font-size:14px;color:#856404;margin:0;">
          • You'll lose access to multi-device mode<br>
          • Pro-only features pause until you resubscribe<br>
          • Your history stays safe - just resubscribe to access it
        </p>
      </div>

      <p>If you change your mind, you can resubscribe anytime to keep your unlimited sessions and multi-device timing.</p>

      <p style="text-align:center;margin:32px 0;">
        <a href="#" class="btn">Resubscribe to Pro</a>
      </p>

      <hr>

      <p><strong>Changed your mind?</strong> Resubscribing takes just a few seconds and you won't lose any data.</p>
      <p>Keep training,<br>The TrackSpeed Team</p>
    `, `Your TrackSpeed Pro access ends in ${data.daysLeft || 7} day${(data.daysLeft || 7) > 1 ? 's' : ''}`),
  }),

  winback: (data) => ({
    subject: "We miss you at the track",
    html: wrapTemplate(`
      <h1>We Miss You at the Track</h1>
      <p>Hi ${data.name || "there"},</p>
      <p>It's been a while since you used TrackSpeed. We'd love to have you back.</p>

      <div class="offer-box">
        <p style="font-size:12px;font-weight:700;color:#5C8DB8;margin:0 0 8px;letter-spacing:1px;">TRACKSPEED PRO</p>
        <p style="font-size:28px;font-weight:700;color:#1a1a1a;margin:0 0 8px;">Pick Up Where You Left Off</p>
        <p style="font-size:16px;color:#525f7f;margin:0;">Open the app to keep training with accurate timing, session history, and video review.</p>
      </div>

      <p style="text-align:center;margin:32px 0;">
        <a href="trackspeed://subscribe" class="btn">Open TrackSpeed Pro</a>
      </p>

      <p style="font-weight:600;color:#1a1a1a;margin:24px 0 16px;">What you'll get with Pro:</p>

      <div style="margin:0 0 24px;">
        <p style="margin:0 0 12px;font-size:15px;">✓ <strong>Multi-device timing</strong> - Use 2+ phones as start/finish gates</p>
        <p style="margin:0 0 12px;font-size:15px;">✓ <strong>Unlimited sessions</strong> - No monthly limits</p>
        <p style="margin:0 0 12px;font-size:15px;">✓ <strong>Full history & analytics</strong> - Track your progress over time</p>
        <p style="margin:0;font-size:15px;">✓ <strong>Video export</strong> - Share runs with time overlay</p>
      </div>

      <hr>

      <p>Not ready yet? Your previous data is still there whenever you come back.</p>

      <p style="text-align:center;margin:32px 0;">
        <a href="trackspeed://open" class="btn btn-secondary">Open TrackSpeed</a>
      </p>

      <p>See you at the track,<br>The TrackSpeed Team</p>
    `, "We miss you at the track"),
  }),

  feature_update: (data) => ({
    subject: `TrackSpeed feature spotlight: ${data.featureTitle || 'Featured tool'}`,
    html: wrapTemplate(`
      <p style="display:inline-block;background:#5C8DB8;color:#fff;font-size:12px;font-weight:700;padding:4px 12px;border-radius:4px;margin:0 0 16px;letter-spacing:0.5px;">FEATURE SPOTLIGHT</p>
      <h1>${data.featureTitle || 'Featured tool'}</h1>
      <p>Hi ${data.name || "Athlete"},</p>
      <p>${data.featureDescription || "Here's a TrackSpeed feature that can help you train better."}</p>

      <div class="feature-box">
        <p style="font-weight:600;color:#1a1a1a;margin:0 0 12px;">How to use it:</p>
        <p style="font-size:14px;margin:0 0 4px;">1. Open TrackSpeed</p>
        <p style="font-size:14px;margin:0 0 4px;">2. Look for ${data.featureTitle || 'the featured tool'} in the app</p>
        <p style="font-size:14px;margin:0;">3. Try it during your next session</p>
      </div>

      <p style="text-align:center;margin:32px 0;">
        <a href="#" class="btn">Try It Now</a>
      </p>

      <hr>

      <p>Have feedback on this feature? Reply to this email - we'd love to hear what you think.</p>
      <p>Keep improving,<br>The TrackSpeed Team</p>
    `, `TrackSpeed feature spotlight: ${data.featureTitle || 'Featured tool'}`),
  }),
};

export async function GET(request: Request) {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const template = searchParams.get("template");

  if (!template || !templates[template]) {
    return NextResponse.json(
      { error: `Invalid template: ${template}` },
      { status: 400 }
    );
  }

  const sampleData: TemplateData = {
    name: "Test User",
    sessionCount: 5,
    daysLeft: 7,
    featureTitle: "Video Export",
    featureDescription: "You can now export your sprint videos with time overlays! Share your progress with coaches and teammates.",
    sprintTime: "12.62s",
    bestTime: "12.34s",
    averageTime: "12.58s",
    runCount: 4,
    distance: "100m",
  };

  const { html } = templates[template](sampleData);

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
