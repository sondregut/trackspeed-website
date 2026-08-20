import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { enforceRateLimit } from "@/lib/rate-limit"
import {
  buildRevenueCatWebPurchaseUrl,
  getRevenueCatWebCheckoutConfigIssues,
  normalizeProCheckoutPlan,
} from "@/lib/revenuecat-web"
import {
  checkoutEmailRedirectUrl,
  normalizeCheckoutEmail,
  normalizeCheckoutMode,
  normalizeCheckoutPassword,
  type CheckoutMode,
} from "@/lib/checkout-security"

function createAuthClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase public environment variables")
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}

async function resolveAppUserId({
  mode,
  email,
  password,
}: {
  mode: CheckoutMode
  email: string
  password: string
}): Promise<{ appUserId: string } | { response: NextResponse }> {
  if (mode === "sign-in") {
    const supabase = createAuthClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.user) {
      return {
        response: NextResponse.json(
          { error: "That email and password did not match a TrackSpeed account." },
          { status: 401 }
        ),
      }
    }

    return { appUserId: data.user.id }
  }

  const supabase = createAuthClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: checkoutEmailRedirectUrl(),
      data: { source: "web_checkout" },
    },
  })

  if (error) {
    console.error("Failed to create checkout account:", error)
    return {
      response: NextResponse.json(
        { error: "Could not create a TrackSpeed account right now." },
        { status: 500 }
      ),
    }
  }

  // Never generate a purchase URL from a just-submitted email address. The
  // athlete must prove mailbox control and then sign in before checkout can be
  // tied to the stable Supabase/RevenueCat app user ID.
  return {
    response: NextResponse.json({
      verificationRequired: true,
      message: "Check your email, confirm the account, then return and sign in to continue.",
    }),
  }
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const email = normalizeCheckoutEmail(body.email)
  const password = normalizeCheckoutPassword(body.password)
  const mode = normalizeCheckoutMode(body.mode)
  const plan = normalizeProCheckoutPlan(body.plan)

  if (!email) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 })
  }

  if (!password) {
    return NextResponse.json(
      { error: "Enter a password between 8 and 128 characters." },
      { status: 400 }
    )
  }

  const configIssues = getRevenueCatWebCheckoutConfigIssues(plan)

  if (configIssues.length > 0) {
    console.error("RevenueCat web checkout config missing:", configIssues)
    return NextResponse.json(
      { error: "Online checkout is unavailable right now. Use the app paywall for now." },
      { status: 503 }
    )
  }

  const rateLimitResponse = await enforceRateLimit(request, {
    scope: "web_pro_checkout",
    identifier: email,
    limit: 8,
    windowSeconds: 15 * 60,
  })

  if (rateLimitResponse) return rateLimitResponse

  const userResult = await resolveAppUserId({ mode, email, password })
  if ("response" in userResult) return userResult.response

  try {
    const url = buildRevenueCatWebPurchaseUrl({
      plan,
      appUserId: userResult.appUserId,
      email,
    })

    return NextResponse.json({ url })
  } catch (error) {
    console.error("Failed to build RevenueCat checkout URL:", error)
    return NextResponse.json(
      { error: "Online checkout is unavailable right now." },
      { status: 503 }
    )
  }
}
