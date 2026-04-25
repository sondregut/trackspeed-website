import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { getSupabase } from "@/lib/supabase";
import { requireServerEnv, timingSafeEqualString } from "@/lib/server-secrets";

// Generate a token for an email address
export function generateUnsubscribeToken(email: string): string {
  return createHmac("sha256", requireServerEnv("UNSUBSCRIBE_SECRET"))
    .update(email.toLowerCase())
    .digest("hex");
}

// Validate a token for an email address
function validateToken(email: string, token: string): boolean {
  if (!/^[a-f0-9]{16}$|^[a-f0-9]{64}$/i.test(token)) {
    return false;
  }

  const expectedToken = generateUnsubscribeToken(email);
  return (
    timingSafeEqualString(token, expectedToken) ||
    (token.length === 16 && timingSafeEqualString(token, expectedToken.slice(0, 16)))
  );
}

// Unsubscribe the user
async function unsubscribeUser(email: string): Promise<boolean> {
  const supabase = getSupabase();

  const { error } = await supabase
    .from("user_email_state")
    .update({
      unsubscribed: true,
      unsubscribed_at: new Date().toISOString(),
    })
    .eq("email", email.toLowerCase());

  if (error) {
    console.error("Error unsubscribing user:", error);
    return false;
  }

  return true;
}

// POST handler - One-click unsubscribe (RFC 8058)
export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    const token = url.searchParams.get("token");

    if (!email || !token) {
      return new Response(null, { status: 400 });
    }

    if (!validateToken(email, token)) {
      return new Response(null, { status: 403 });
    }

    await unsubscribeUser(email);

    // RFC 8058 requires 200 OK with empty body for one-click
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Error in POST unsubscribe:", error);
    return new Response(null, { status: 500 });
  }
}

// GET handler - Show unsubscribe confirmation page
export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  const token = url.searchParams.get("token");

  if (!email || !token) {
    return new NextResponse(renderPage("Invalid Link", "This unsubscribe link is invalid or has expired."), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  let tokenIsValid: boolean;
  try {
    tokenIsValid = validateToken(email, token);
  } catch (error) {
    console.error("Unsubscribe secret not configured:", error);
    return new NextResponse(
      renderPage("Something Went Wrong", "We couldn't process your unsubscribe request. Please try again later."),
      { status: 500, headers: { "Content-Type": "text/html" } }
    );
  }

  if (!tokenIsValid) {
    return new NextResponse(renderPage("Invalid Link", "This unsubscribe link is invalid or has expired."), {
      status: 403,
      headers: { "Content-Type": "text/html" },
    });
  }

  const success = await unsubscribeUser(email);

  if (success) {
    return new NextResponse(
      renderPage(
        "Unsubscribed",
        `You've been unsubscribed from TrackSpeed emails. You won't receive any more marketing emails from us.`,
        true
      ),
      { headers: { "Content-Type": "text/html" } }
    );
  } else {
    return new NextResponse(
      renderPage("Something Went Wrong", "We couldn't process your unsubscribe request. Please try again later."),
      { status: 500, headers: { "Content-Type": "text/html" } }
    );
  }
}

function renderPage(title: string, message: string, success = false): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - TrackSpeed</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: #ffffff;
      border-radius: 16px;
      padding: 48px;
      max-width: 480px;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      font-size: 32px;
    }
    .icon.success { background: #d4edda; }
    .icon.error { background: #f8d7da; }
    h1 {
      font-size: 28px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 16px;
    }
    p {
      font-size: 16px;
      line-height: 26px;
      color: #525f7f;
      margin-bottom: 24px;
    }
    .logo {
      font-size: 14px;
      color: #8898aa;
      margin-top: 32px;
    }
    .logo span { color: #5C8DB8; font-weight: 600; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon ${success ? 'success' : 'error'}">${success ? '✓' : '!'}</div>
    <h1>${title}</h1>
    <p>${message}</p>
    <p class="logo"><span>TrackSpeed</span> - Sprint Timing Made Simple</p>
  </div>
</body>
</html>`;
}
