import { NextResponse } from "next/server";

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
    background-color: #f9fafb;
    border-radius: 8px;
    padding: 20px 24px;
    margin: 24px 0;
  }
  .pro-tip {
    background-color: #fff7ed;
    border-radius: 8px;
    padding: 20px 24px;
    border-left: 4px solid #5C8DB8;
    margin: 24px 0;
  }
  .warning-box {
    background-color: #fef3cd;
    border-radius: 8px;
    padding: 20px 24px;
    border-left: 4px solid #ffc107;
    margin: 24px 0;
  }
  .offer-box {
    background-color: #fff7ed;
    border: 2px dashed #5C8DB8;
    border-radius: 8px;
    padding: 24px;
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
}

const templates: Record<string, (data: TemplateData) => { subject: string; html: string }> = {
  welcome: (data) => ({
    subject: "Welcome to TrackSpeed!",
    html: wrapTemplate(`
      <h1>Welcome to TrackSpeed!</h1>
      <p>Hi ${data.name || "Athlete"},</p>
      <p>Thanks for downloading TrackSpeed! You're now ready to time sprints with professional-level accuracy using just your iPhone.</p>

      <div class="feature-box">
        <p style="font-weight:600;color:#1a1a1a;margin:0 0 12px;">Here's what you can do:</p>
        <p style="margin:0 0 8px;font-size:14px;"><strong>Multiple Start Types</strong> - Flying, countdown, voice command, touch release & more</p>
        <p style="margin:0 0 8px;font-size:14px;"><strong>Multi-Device</strong> - Connect two or more iPhones for start/finish timing</p>
        <p style="margin:0 0 8px;font-size:14px;"><strong>Photo Finish</strong> - Sub-frame accuracy with high-speed capture</p>
        <p style="margin:0;font-size:14px;"><strong>Track History</strong> - Monitor your progress over time</p>
      </div>

      <hr>

      <p>Get started by opening the app and running your first timed sprint. No calibration needed - just point and run!</p>

      <p style="text-align:center;margin:32px 0;">
        <a href="#" class="btn">Open TrackSpeed</a>
      </p>

      <p>Questions? Just reply to this email - we read every message.</p>
      <p>Happy sprinting!<br>The TrackSpeed Team</p>
    `, "Welcome to TrackSpeed - Let's get you timing!"),
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

  convert_day7: (data) => ({
    subject: "Special offer: 20% off TrackSpeed Pro",
    html: wrapTemplate(`
      <h1>Your Exclusive Offer Inside</h1>
      <p>Hi ${data.name || "there"},</p>
      <p>As a TrackSpeed user, we're giving you early access to a special discount.</p>

      <div class="offer-box">
        <p style="font-size:12px;font-weight:700;color:#5C8DB8;margin:0 0 8px;letter-spacing:1px;">LIMITED TIME OFFER</p>
        <p style="font-size:28px;font-weight:700;color:#1a1a1a;margin:0 0 8px;">20% Off Your First Year</p>
        <p style="font-size:16px;color:#525f7f;margin:0;">Get Pro for just <strong>$39.99/year</strong> <span style="text-decoration:line-through;color:#8898aa;">$49.99</span></p>
      </div>

      <p style="text-align:center;margin:32px 0;">
        <a href="trackspeed://promo?offer=yearly_20_off" class="btn">Claim 20% Off</a>
      </p>

      <p style="font-weight:600;color:#1a1a1a;margin:24px 0 16px;">What you get with Pro:</p>

      <div style="margin:0 0 24px;">
        <p style="margin:0 0 12px;font-size:15px;">✓ <strong>Multi-device timing</strong> - Use 2+ phones as start/finish gates</p>
        <p style="margin:0 0 12px;font-size:15px;">✓ <strong>Unlimited sessions</strong> - No monthly limits</p>
        <p style="margin:0 0 12px;font-size:15px;">✓ <strong>Full history & analytics</strong> - Track your progress over time</p>
        <p style="margin:0 0 12px;font-size:15px;">✓ <strong>Video export</strong> - Share runs with time overlay</p>
        <p style="margin:0;font-size:15px;">✓ <strong>Priority support</strong> - Get help when you need it</p>
      </div>

      <hr>

      <div class="feature-box" style="text-align:center;">
        <p style="font-style:italic;margin:0 0 12px;">"Professional timing gates cost $3,000+. TrackSpeed gives me the same accuracy for the price of coffee."</p>
        <p class="muted" style="margin:0;">— Marcus T., College Sprinter</p>
      </div>

      <p>Not ready yet? No problem - you can keep using the free version.</p>
      <p>Run fast,<br>The TrackSpeed Team</p>
    `, "Special offer: 20% off TrackSpeed Pro for one year"),
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
          • Sessions will be limited to 5/month<br>
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
    subject: "We miss you - here's 20% off to come back",
    html: wrapTemplate(`
      <h1>We Miss You at the Track</h1>
      <p>Hi ${data.name || "there"},</p>
      <p>It's been a while since you used TrackSpeed. We'd love to have you back.</p>

      <div class="offer-box">
        <p style="font-size:12px;font-weight:700;color:#5C8DB8;margin:0 0 8px;letter-spacing:1px;">WELCOME BACK OFFER</p>
        <p style="font-size:28px;font-weight:700;color:#1a1a1a;margin:0 0 8px;">20% Off Pro</p>
        <p style="font-size:16px;color:#525f7f;margin:0;">Get a full year for just <strong>$39.99</strong> <span style="text-decoration:line-through;color:#8898aa;">$49.99</span></p>
      </div>

      <p style="text-align:center;margin:32px 0;">
        <a href="trackspeed://promo?offer=yearly_20_off" class="btn">Claim 20% Off</a>
      </p>

      <p style="font-weight:600;color:#1a1a1a;margin:24px 0 16px;">What you'll get with Pro:</p>

      <div style="margin:0 0 24px;">
        <p style="margin:0 0 12px;font-size:15px;">✓ <strong>Multi-device timing</strong> - Use 2+ phones as start/finish gates</p>
        <p style="margin:0 0 12px;font-size:15px;">✓ <strong>Unlimited sessions</strong> - No monthly limits</p>
        <p style="margin:0 0 12px;font-size:15px;">✓ <strong>Full history & analytics</strong> - Track your progress over time</p>
        <p style="margin:0;font-size:15px;">✓ <strong>Video export</strong> - Share runs with time overlay</p>
      </div>

      <hr>

      <p>Not ready yet? You can still use the free version - your previous data is still there.</p>

      <p style="text-align:center;margin:32px 0;">
        <a href="trackspeed://open" class="btn btn-secondary">Open TrackSpeed</a>
      </p>

      <p>See you at the track,<br>The TrackSpeed Team</p>
    `, "We miss you - here's 20% off to come back"),
  }),

  feature_update: (data) => ({
    subject: `New in TrackSpeed: ${data.featureTitle || 'New Feature'}`,
    html: wrapTemplate(`
      <p style="display:inline-block;background:#5C8DB8;color:#fff;font-size:12px;font-weight:700;padding:4px 12px;border-radius:4px;margin:0 0 16px;letter-spacing:0.5px;">NEW FEATURE</p>
      <h1>${data.featureTitle || 'New Feature'}</h1>
      <p>Hi ${data.name || "Athlete"},</p>
      <p>${data.featureDescription || "We've added something new to help you train better."}</p>

      <div class="feature-box">
        <p style="font-weight:600;color:#1a1a1a;margin:0 0 12px;">How to use it:</p>
        <p style="font-size:14px;margin:0 0 4px;">1. Update to the latest version</p>
        <p style="font-size:14px;margin:0 0 4px;">2. Open TrackSpeed</p>
        <p style="font-size:14px;margin:0;">3. Find the new feature in Settings</p>
      </div>

      <p style="text-align:center;margin:32px 0;">
        <a href="#" class="btn">Try It Now</a>
      </p>

      <hr>

      <p>Have feedback on this feature? Reply to this email - we'd love to hear what you think.</p>
      <p>Keep improving,<br>The TrackSpeed Team</p>
    `, `New in TrackSpeed: ${data.featureTitle || 'New Feature'}`),
  }),
};

export async function GET(request: Request) {
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
  };

  const { subject, html } = templates[template](sampleData);

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
