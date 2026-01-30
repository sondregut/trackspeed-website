import { getSupabase } from '@/lib/supabase'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.FROM_EMAIL || 'TrackSpeed <noreply@hello.mytrackspeed.com>'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://mytrackspeed.com'

// Base styles for all emails
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
  .code-box { background-color: #f9fafb; border: 2px dashed #5C8DB8; border-radius: 8px; padding: 20px 24px; margin: 24px 0; text-align: center; }
  hr { border: none; border-top: 1px solid #e6ebf1; margin: 32px 0; }
  .muted { color: #8898aa; font-size: 12px; }
  a { color: #5C8DB8; }
`

function wrapTemplate(content: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${baseStyles}</style></head><body>
<div class="container"><div class="header"><p class="logo">TrackSpeed</p></div><div class="content">${content}</div>
<div class="footer"><p style="margin:0 0 8px;font-size:14px;color:#525f7f;">TrackSpeed - Sprint Timing Made Simple</p>
<p class="muted">&copy; 2026 Track Speed LLC. All rights reserved.</p></div></div></body></html>`
}

// Email templates
export const emailTemplates = {
  influencer_application_received: (data: { name: string }) => ({
    subject: "We've received your TrackSpeed affiliate application!",
    html: wrapTemplate(`
      <h1>Thanks for Applying!</h1>
      <p>Hi ${data.name},</p>
      <p>We've received your application to join the TrackSpeed affiliate program and we're excited to review it.</p>
      <div class="feature-box">
        <p style="font-weight:600;color:#1a1a1a;margin:0 0 12px;">What happens next?</p>
        <p style="font-size:14px;margin:0 0 8px;">We'll review your application within 24-48 hours.</p>
        <p style="font-size:14px;margin:0 0 8px;">Once approved, you'll receive an email with:</p>
        <p style="font-size:14px;margin:0 0 4px;padding-left:16px;">• Your unique promo code</p>
        <p style="font-size:14px;margin:0 0 4px;padding-left:16px;">• Access to your affiliate dashboard</p>
        <p style="font-size:14px;margin:0;padding-left:16px;">• Instructions to start earning</p>
      </div>
      <p>In the meantime, feel free to explore TrackSpeed at <a href="${BASE_URL}">${BASE_URL.replace('https://', '')}</a></p>
      <hr>
      <p>Thanks for your interest in partnering with us!</p>
      <p style="margin:0;">The TrackSpeed Team</p>
    `),
  }),

  influencer_approved: (data: { name: string; code: string }) => ({
    subject: "You're approved! Welcome to TrackSpeed Affiliates",
    html: wrapTemplate(`
      <h1>Congratulations, You're Approved!</h1>
      <p>Hi ${data.name},</p>
      <p>Great news - your affiliate application has been approved! You're now officially part of the TrackSpeed affiliate program.</p>
      <div class="code-box">
        <p style="font-size:14px;color:#525f7f;margin:0 0 8px;">YOUR PROMO CODE</p>
        <p style="font-size:28px;font-weight:700;color:#5C8DB8;margin:0;font-family:monospace;">${data.code}</p>
      </div>
      <div class="feature-box">
        <p style="font-weight:600;color:#1a1a1a;margin:0 0 12px;">How it works:</p>
        <p style="font-size:14px;margin:0 0 8px;">When users sign up with your code, they get a <strong>30-day Pro trial</strong> (instead of the standard 7 days).</p>
        <p style="font-size:14px;margin:0;">You earn <strong>$10 (20% commission)</strong> for each yearly subscription.</p>
      </div>
      <p style="text-align:center;margin:32px 0;">
        <a href="${BASE_URL}/influencer/login" class="btn">Access Your Dashboard</a>
      </p>
      <div class="feature-box">
        <p style="font-weight:600;color:#1a1a1a;margin:0 0 12px;">Next steps:</p>
        <p style="font-size:14px;margin:0 0 8px;"><strong>1.</strong> Log in to your dashboard</p>
        <p style="font-size:14px;margin:0 0 8px;"><strong>2.</strong> Connect Stripe to receive payouts</p>
        <p style="font-size:14px;margin:0;"><strong>3.</strong> Share your code with your audience</p>
      </div>
      <hr>
      <p>Thanks for partnering with us!</p>
      <p style="margin:0;">The TrackSpeed Team</p>
    `),
  }),
}

export type EmailTemplate = keyof typeof emailTemplates

interface SendEmailOptions {
  to: string
  template: EmailTemplate
  data: Record<string, string>
  metadata?: Record<string, unknown>
}

interface SendEmailResult {
  success: boolean
  id?: string
  error?: string
}

export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const { to, template, data, metadata } = options

  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured')
    return { success: false, error: 'Email service not configured' }
  }

  const templateFn = emailTemplates[template]
  if (!templateFn) {
    return { success: false, error: `Invalid template: ${template}` }
  }

  try {
    // Generate email content
    const { subject, html } = templateFn(data as never)

    // Send via Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to,
        subject,
        html,
        reply_to: 'support@trackspeed.app',
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('Resend API error:', result)
      return { success: false, error: result.message || 'Failed to send email' }
    }

    // Log the send in the database
    const supabase = getSupabase()
    await supabase.from('email_send_log').insert({
      email: to,
      template,
      subject,
      status: 'sent',
      resend_id: result.id,
      metadata: metadata || {},
    })

    console.log(`Email sent: ${template} to ${to} (${result.id})`)
    return { success: true, id: result.id }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
