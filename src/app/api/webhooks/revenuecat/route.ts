import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

// RevenueCat webhook event types
// https://www.revenuecat.com/docs/integrations/webhooks/event-types-and-fields
type RevenueCatEventType =
  | 'INITIAL_PURCHASE'
  | 'RENEWAL'
  | 'CANCELLATION'
  | 'UNCANCELLATION'
  | 'EXPIRATION'
  | 'BILLING_ISSUE'
  | 'SUBSCRIBER_ALIAS'
  | 'TRIAL_STARTED'
  | 'TRIAL_CONVERTED'
  | 'TRIAL_CANCELLED'
  | 'PRODUCT_CHANGE'
  | 'TRANSFER'

interface RevenueCatWebhookEvent {
  api_version: string
  event: {
    type: RevenueCatEventType
    id: string
    app_id: string
    app_user_id: string
    original_app_user_id: string
    product_id: string
    period_type: 'TRIAL' | 'INTRO' | 'NORMAL'
    purchased_at_ms: number
    expiration_at_ms: number | null
    environment: 'SANDBOX' | 'PRODUCTION'
    store: 'APP_STORE' | 'PLAY_STORE' | 'STRIPE' | 'PROMOTIONAL'
    is_trial_conversion?: boolean
    cancel_reason?: string
    new_product_id?: string
    presented_offering_id?: string
    price?: number
    currency?: string
    price_in_purchased_currency?: number
    subscriber_attributes?: Record<string, { value: string; updated_at_ms: number }>
    // Grace period fields (for BILLING_ISSUE events)
    grace_period_expiration_at_ms?: number
  }
}

// Detect plan type from product_id
// Product IDs typically contain "monthly" or "yearly"/"annual"
function detectPlanType(productId: string): 'monthly' | 'yearly' | null {
  const lower = productId.toLowerCase()
  if (lower.includes('monthly') || lower.includes('month')) {
    return 'monthly'
  }
  if (lower.includes('yearly') || lower.includes('annual') || lower.includes('year')) {
    return 'yearly'
  }
  return null
}

// Events that represent a payment
const PAYMENT_EVENTS: RevenueCatEventType[] = [
  'INITIAL_PURCHASE',
  'RENEWAL',
  'TRIAL_CONVERTED',
]

// Map RevenueCat event types to subscription status
function getStatusFromEvent(eventType: RevenueCatEventType): string {
  switch (eventType) {
    case 'INITIAL_PURCHASE':
    case 'RENEWAL':
    case 'UNCANCELLATION':
    case 'TRIAL_STARTED':
    case 'TRIAL_CONVERTED':
      return 'active'
    case 'CANCELLATION':
    case 'TRIAL_CANCELLED':
      return 'cancelled' // Still active until expires_at
    case 'EXPIRATION':
      return 'expired'
    case 'BILLING_ISSUE':
      return 'billing_issue'
    default:
      return 'active'
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authorization header
    const authHeader = request.headers.get('authorization')
    const expectedAuthKey = process.env.REVENUECAT_WEBHOOK_AUTH_KEY

    if (!expectedAuthKey) {
      console.error('REVENUECAT_WEBHOOK_AUTH_KEY not configured')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // RevenueCat sends the auth key as "Bearer <key>" or just the key
    const providedKey = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader

    if (providedKey !== expectedAuthKey) {
      console.error('Invalid webhook authorization')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse the webhook payload
    const payload: RevenueCatWebhookEvent = await request.json()
    const event = payload.event

    console.log(`RevenueCat webhook: ${event.type} for user ${event.app_user_id}`)

    // Handle subscriber alias - update app_user_id reference
    if (event.type === 'SUBSCRIBER_ALIAS') {
      // When aliases happen, the original_app_user_id is the one we should keep tracking
      // No subscription status change needed
      console.log(`Subscriber alias: ${event.original_app_user_id} -> ${event.app_user_id}`)
      return NextResponse.json({ success: true })
    }

    // Handle product change - might need to update product_id
    if (event.type === 'PRODUCT_CHANGE' && event.new_product_id) {
      const supabase = getSupabase()
      await supabase
        .from('subscriptions')
        .update({
          product_id: event.new_product_id,
          updated_at: new Date().toISOString(),
        })
        .eq('app_user_id', event.app_user_id)

      return NextResponse.json({ success: true })
    }

    // Handle transfer - update the app_user_id
    if (event.type === 'TRANSFER') {
      const supabase = getSupabase()
      await supabase
        .from('subscriptions')
        .update({
          app_user_id: event.app_user_id,
          updated_at: new Date().toISOString(),
        })
        .eq('app_user_id', event.original_app_user_id)

      return NextResponse.json({ success: true })
    }

    // Determine subscription status and trial state
    const status = getStatusFromEvent(event.type)
    const isTrial = event.period_type === 'TRIAL' || event.type === 'TRIAL_STARTED'
    const isTrialConverted = event.type === 'TRIAL_CONVERTED'

    // Detect plan type and price
    const planType = detectPlanType(event.product_id)
    // RevenueCat sends price in currency units, convert to cents
    const priceCents = event.price_in_purchased_currency
      ? Math.round(event.price_in_purchased_currency * 100)
      : event.price
        ? Math.round(event.price * 100)
        : null

    // Prepare subscription data
    const subscriptionData: Record<string, unknown> = {
      app_user_id: event.app_user_id,
      status,
      product_id: event.product_id,
      expires_at: event.expiration_at_ms
        ? new Date(event.expiration_at_ms).toISOString()
        : null,
      is_trial: isTrial && !isTrialConverted, // Clear trial flag when converted
      original_purchase_at: new Date(event.purchased_at_ms).toISOString(),
      store: event.store,
      environment: event.environment,
      updated_at: new Date().toISOString(),
    }

    // Handle grace period expiration for billing issues
    if (event.type === 'BILLING_ISSUE' && event.grace_period_expiration_at_ms) {
      subscriptionData.grace_period_expires_at = new Date(event.grace_period_expiration_at_ms).toISOString()
      console.log(`Billing issue detected. Grace period expires: ${subscriptionData.grace_period_expires_at}`)
    } else if (status === 'active') {
      // Clear grace period when subscription becomes active again
      subscriptionData.grace_period_expires_at = null
    }

    // Add revenue fields if available
    if (priceCents !== null) {
      subscriptionData.price_cents = priceCents
    }
    if (event.currency) {
      subscriptionData.currency = event.currency
    }
    if (planType) {
      subscriptionData.plan_type = planType
    }

    const supabase = getSupabase()

    // Upsert the subscription record
    const { error } = await supabase
      .from('subscriptions')
      .upsert(subscriptionData, {
        onConflict: 'app_user_id',
      })

    if (error) {
      console.error('Failed to upsert subscription:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Record payment event for revenue tracking
    if (PAYMENT_EVENTS.includes(event.type) && priceCents !== null && priceCents > 0) {
      const { error: eventError } = await supabase
        .from('subscription_events')
        .insert({
          app_user_id: event.app_user_id,
          event_type: event.type,
          product_id: event.product_id,
          price_cents: priceCents,
          currency: event.currency || 'USD',
          plan_type: planType,
          environment: event.environment,
          store: event.store,
          purchased_at: new Date(event.purchased_at_ms).toISOString(),
        })

      if (eventError) {
        // Log but don't fail - subscription record is more important
        console.error('Failed to insert subscription event:', eventError)
      } else {
        console.log(`Payment event recorded: ${event.type} $${(priceCents / 100).toFixed(2)} ${event.currency}`)
      }
    }

    console.log(`Subscription updated: ${event.app_user_id} -> ${status}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Processing error' }, { status: 500 })
  }
}

// RevenueCat may send GET requests to verify the endpoint is reachable
export async function GET() {
  return NextResponse.json({ status: 'ok' })
}
