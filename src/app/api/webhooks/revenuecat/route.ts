import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { getSupabaseAdmin } from '@/lib/supabase'
import { timingSafeEqualString } from '@/lib/server-secrets'

// Map RevenueCat event types to PostHog event names. The rc_* names preserve
// the existing webhook taxonomy; the second names match the product metrics doc.
const POSTHOG_EVENT_NAMES: Partial<Record<RevenueCatEventType, string[]>> = {
  INITIAL_PURCHASE: ['rc_initial_purchase', 'subscription_started'],
  RENEWAL: ['rc_renewal', 'subscription_renewed'],
  CANCELLATION: ['rc_cancellation', 'subscription_canceled'],
  UNCANCELLATION: ['rc_uncancellation', 'subscription_uncanceled'],
  EXPIRATION: ['rc_expiration', 'subscription_expired'],
  BILLING_ISSUE: ['rc_billing_issue', 'subscription_billing_issue'],
  TRIAL_STARTED: ['rc_trial_started', 'trial_started'],
  TRIAL_CONVERTED: ['rc_trial_converted', 'trial_converted', 'subscription_started'],
  TRIAL_CANCELLED: ['rc_trial_cancelled', 'trial_cancelled'],
  PRODUCT_CHANGE: ['rc_product_change', 'subscription_product_changed'],
}

type SubscriptionPlanType = 'weekly' | 'monthly' | 'yearly'

function getPostHogHost() {
  const host =
    process.env.POSTHOG_HOST ??
    process.env.NEXT_PUBLIC_POSTHOG_HOST ??
    'https://eu.i.posthog.com'

  return host.replace(/\/+$/, '')
}

// Server-side RevenueCat → PostHog bridge. Fires even when the user isn't in
// the app (renewals, expirations, billing issues), so the PostHog person
// record reflects the real subscription lifecycle.
async function forwardToPostHog(
  event: RevenueCatWebhookEvent['event'],
  priceCents: number | null,
  planType: SubscriptionPlanType | null,
) {
  const eventNames = POSTHOG_EVENT_NAMES[event.type]
  if (!eventNames?.length) return

  // Prefer the PostHog distinct id the iOS app forwarded as RevenueCat's
  // reserved subscriber attribute; fall back through legacy app attributes and
  // then app_user_id.
  const posthogDistinctId =
    event.subscriber_attributes?.['$posthogUserId']?.value ??
    event.subscriber_attributes?.posthog_distinct_id?.value ??
    event.subscriber_attributes?.['$posthogDistinctId']?.value ??
    event.app_user_id

  const host = getPostHogHost()
  const apiKey = process.env.POSTHOG_API_KEY ?? process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!apiKey) {
    console.warn('PostHog key not set — skipping PostHog forward for', event.type)
    return
  }

  const subscriptionStatus = getStatusFromEvent(event.type)
  const rcSubscriptionStatus = getRevenueCatPostHogStatus(event)
  const effectiveExpirationMs = event.grace_period_expiration_at_ms ?? event.expiration_at_ms
  const entitlementCurrentlyActive =
    subscriptionStatus !== 'expired' &&
    (effectiveExpirationMs == null || effectiveExpirationMs > Date.now())
  const eventTimestampMs = event.event_timestamp_ms ?? event.purchased_at_ms
  const eventTimestamp = new Date(eventTimestampMs).toISOString()

  const properties: Record<string, unknown> = {
    product_id: event.product_id,
    period_type: event.period_type,
    environment: event.environment,
    store: event.store,
    is_trial_conversion: event.is_trial_conversion ?? false,
    cancel_reason: event.cancel_reason ?? null,
    plan_type: planType,
    revenuecat_event_type: event.type,
    revenuecat_event_id: event.id,
    rc_subscription_status: rcSubscriptionStatus,
    source: 'revenuecat_webhook',
    $set: {
      has_rc_subscription: entitlementCurrentlyActive,
      is_pro: entitlementCurrentlyActive,
      is_billing_grace_period: event.type === 'BILLING_ISSUE',
      rc_subscription_status: rcSubscriptionStatus,
      subscription_status: subscriptionStatus,
      subscription_plan_type: planType,
      subscription_product_id: event.product_id,
      subscription_period_type: event.period_type,
      revenuecat_environment: event.environment,
      last_revenuecat_event: event.type,
      last_revenuecat_event_at: eventTimestamp,
    },
  }
  if (priceCents !== null && priceCents > 0) {
    // PostHog's revenue analytics keys off `$revenue` (in whole currency units).
    properties.$revenue = priceCents / 100
    properties.currency = event.currency ?? 'USD'
  }

  for (const eventName of eventNames) {
    try {
      const response = await fetch(`${host}/i/v0/e/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: apiKey,
          event: eventName,
          distinct_id: posthogDistinctId,
          properties,
          timestamp: eventTimestamp,
        }),
      })
      if (!response.ok) {
        console.warn(`PostHog forward ${eventName} returned ${response.status}`)
      }
    } catch (err) {
      console.warn(`PostHog forward ${eventName} failed:`, err)
    }
  }
}

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
    event_timestamp_ms?: number
    product_id: string
    period_type: 'TRIAL' | 'INTRO' | 'NORMAL'
    purchased_at_ms: number
    expiration_at_ms: number | null
    environment: 'SANDBOX' | 'PRODUCTION'
    store:
      | 'AMAZON'
      | 'APP_STORE'
      | 'MAC_APP_STORE'
      | 'PLAY_STORE'
      | 'RC_BILLING'
      | 'STRIPE'
      | 'PROMOTIONAL'
    is_trial_conversion?: boolean
    cancel_reason?: string
    new_product_id?: string
    presented_offering_id?: string
    entitlement_id?: string
    entitlement_ids?: string[]
    transaction_id?: string
    original_transaction_id?: string
    price?: number
    currency?: string
    price_in_purchased_currency?: number
    subscriber_attributes?: Record<string, { value: string; updated_at_ms: number }>
    // Grace period fields (for BILLING_ISSUE events)
    grace_period_expiration_at_ms?: number
  }
}

// Detect plan type from product_id
// Product IDs typically contain "weekly", "monthly", or "yearly"/"annual".
// Monthly remains supported for legacy subscribers while new paywalls feature weekly.
function detectPlanType(productId: string): SubscriptionPlanType | null {
  const lower = productId.toLowerCase()
  if (lower.includes('weekly') || lower.includes('week')) {
    return 'weekly'
  }
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

function getRevenueCatPostHogStatus(event: RevenueCatWebhookEvent['event']): string {
  switch (event.type) {
    case 'TRIAL_STARTED':
      return 'trial'
    case 'TRIAL_CANCELLED':
      return 'cancelled_trial'
    case 'BILLING_ISSUE':
      return event.period_type === 'TRIAL' ? 'grace_period_trial' : 'grace_period'
    case 'EXPIRATION':
      return 'expired'
    case 'CANCELLATION':
      return event.period_type === 'TRIAL' ? 'cancelled_trial' : 'cancelled'
    case 'INITIAL_PURCHASE':
    case 'RENEWAL':
    case 'UNCANCELLATION':
    case 'TRIAL_CONVERTED':
    case 'PRODUCT_CHANGE':
      return event.period_type === 'INTRO' ? 'intro' : 'active'
    default:
      return 'active'
  }
}

function getEntitlementId(event: RevenueCatWebhookEvent['event']): string | null {
  return (
    event.entitlement_id ??
    event.entitlement_ids?.[0] ??
    process.env.REVENUECAT_ENTITLEMENT_ID ??
    null
  )
}

function getCheckoutEmailFromEvent(event: RevenueCatWebhookEvent['event']): string | null {
  const email =
    event.subscriber_attributes?.email?.value ??
    event.subscriber_attributes?.Email?.value ??
    event.subscriber_attributes?.['$email']?.value ??
    null

  const normalized = email?.trim()
  return normalized && normalized.includes('@') ? normalized : null
}

async function getAuthEmail(appUserId: string): Promise<string | null> {
  try {
    const { data, error } = await getSupabaseAdmin().auth.admin.getUserById(appUserId)

    if (error) {
      console.warn(`Could not look up checkout user email for ${appUserId}:`, error.message)
      return null
    }

    return data.user?.email ?? null
  } catch (error) {
    console.warn(`Checkout email lookup failed for ${appUserId}:`, error)
    return null
  }
}

async function hasSentWebProPurchaseReadyEmail(eventId: string): Promise<boolean> {
  const { data, error } = await getSupabaseAdmin()
    .from('email_send_log')
    .select('id')
    .eq('template', 'web_pro_purchase_ready')
    .eq('status', 'sent')
    .eq('metadata->>revenuecat_event_id', eventId)
    .maybeSingle()

  if (error) {
    throw new Error(`Could not check web Pro purchase email status: ${error.message}`)
  }

  return Boolean(data)
}

async function sendWebProPurchaseReadyEmail(
  event: RevenueCatWebhookEvent['event'],
  planType: SubscriptionPlanType | null,
) {
  if (event.store !== 'STRIPE' && event.store !== 'RC_BILLING') return
  if (event.type !== 'INITIAL_PURCHASE' && event.type !== 'TRIAL_CONVERTED') return
  if (await hasSentWebProPurchaseReadyEmail(event.id)) return

  const email = getCheckoutEmailFromEvent(event) ?? await getAuthEmail(event.app_user_id)
  if (!email) {
    throw new Error(`No email found for web checkout event ${event.id}`)
  }

  const result = await sendEmail({
    to: email,
    template: 'web_pro_purchase_ready',
    data: { email },
    metadata: {
      app_user_id: event.app_user_id,
      revenuecat_event_id: event.id,
      product_id: event.product_id,
      plan_type: planType,
      store: event.store,
      source: 'revenuecat_web_checkout',
    },
  })

  if (!result.success) {
    throw new Error(`Failed to send web Pro purchase email for ${event.id}: ${result.error}`)
  }
}

type RevenueCatReservationResult = 'reserved' | 'duplicate' | 'error'

function isUniqueViolation(error: { code?: string } | null): boolean {
  return error?.code === '23505'
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

async function reserveRevenueCatWebhookEvent(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  event: RevenueCatWebhookEvent['event']
): Promise<RevenueCatReservationResult> {
  const now = new Date().toISOString()
  const { error: insertError } = await supabase
    .from('revenuecat_webhook_events')
    .insert({
      event_id: event.id,
      event_type: event.type,
      app_user_id: event.app_user_id,
      processing_started_at: now,
      updated_at: now,
    })

  if (!insertError) {
    return 'reserved'
  }

  if (!isUniqueViolation(insertError)) {
    console.error('Failed to reserve RevenueCat event:', insertError)
    return 'error'
  }

  const { data: existingEvent, error: existingError } = await supabase
    .from('revenuecat_webhook_events')
    .select('processed_at, failed_at')
    .eq('event_id', event.id)
    .maybeSingle()

  if (existingError) {
    console.error('Failed to inspect existing RevenueCat event:', existingError)
    return 'error'
  }

  if (existingEvent?.failed_at && !existingEvent.processed_at) {
    const { error: retryError } = await supabase
      .from('revenuecat_webhook_events')
      .update({
        failed_at: null,
        failure_message: null,
        processing_started_at: now,
        updated_at: now,
      })
      .eq('event_id', event.id)
      .is('processed_at', null)

    if (retryError) {
      console.error('Failed to reserve RevenueCat retry:', retryError)
      return 'error'
    }

    return 'reserved'
  }

  return 'duplicate'
}

async function markRevenueCatEventProcessed(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  eventId: string
) {
  const now = new Date().toISOString()
  const { error } = await supabase
    .from('revenuecat_webhook_events')
    .update({
      processed_at: now,
      failed_at: null,
      failure_message: null,
      updated_at: now,
    })
    .eq('event_id', eventId)

  if (error) {
    console.error('Failed to mark RevenueCat event processed:', error)
  }
}

async function markRevenueCatEventFailed(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  eventId: string,
  error: unknown
) {
  const now = new Date().toISOString()
  const { error: updateError } = await supabase
    .from('revenuecat_webhook_events')
    .update({
      failed_at: now,
      failure_message: errorMessage(error).slice(0, 1000),
      updated_at: now,
    })
    .eq('event_id', eventId)
    .is('processed_at', null)

  if (updateError) {
    console.error('Failed to mark RevenueCat event failed:', updateError)
  }
}

export async function POST(request: NextRequest) {
  let supabase: ReturnType<typeof getSupabaseAdmin> | null = null
  let reservedRevenueCatEventId: string | null = null

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

    if (!providedKey || !timingSafeEqualString(providedKey, expectedAuthKey)) {
      console.error('Invalid webhook authorization')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse the webhook payload
    const payload: RevenueCatWebhookEvent = await request.json()
    const event = payload.event

    console.log(`RevenueCat webhook: ${event.type} for user ${event.app_user_id}`)

    supabase = getSupabaseAdmin()
    const reservation = await reserveRevenueCatWebhookEvent(supabase, event)
    if (reservation === 'duplicate') {
      console.log(`Duplicate RevenueCat webhook skipped: ${event.id}`)
      return NextResponse.json({ success: true, duplicate: true })
    }
    if (reservation === 'error') {
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
    reservedRevenueCatEventId = event.id

    // Handle subscriber alias - update app_user_id reference
    if (event.type === 'SUBSCRIBER_ALIAS') {
      // When aliases happen, the original_app_user_id is the one we should keep tracking
      // No subscription status change needed
      console.log(`Subscriber alias: ${event.original_app_user_id} -> ${event.app_user_id}`)
      await markRevenueCatEventProcessed(supabase, event.id)
      return NextResponse.json({ success: true })
    }

    // Handle product change - might need to update product_id
    if (event.type === 'PRODUCT_CHANGE' && event.new_product_id) {
      await supabase
        .from('subscriptions')
        .update({
          product_id: event.new_product_id,
          updated_at: new Date().toISOString(),
        })
        .eq('app_user_id', event.app_user_id)

      await markRevenueCatEventProcessed(supabase, event.id)
      return NextResponse.json({ success: true })
    }

    // Handle transfer - update the app_user_id
    if (event.type === 'TRANSFER') {
      await supabase
        .from('subscriptions')
        .update({
          app_user_id: event.app_user_id,
          updated_at: new Date().toISOString(),
        })
        .eq('app_user_id', event.original_app_user_id)

      await markRevenueCatEventProcessed(supabase, event.id)
      return NextResponse.json({ success: true })
    }

    // Determine subscription status and trial state
    const status = getStatusFromEvent(event.type)
    const isTrial = event.period_type === 'TRIAL' || event.type === 'TRIAL_STARTED'
    const isTrialConverted = event.type === 'TRIAL_CONVERTED'
    const entitlementId = getEntitlementId(event)

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
      entitlement_id: entitlementId,
      original_transaction_id: event.original_transaction_id ?? null,
      latest_transaction_id: event.transaction_id ?? null,
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

    let shouldProcessPaymentSideEffects = true

    // Record payment event for revenue tracking
    if (PAYMENT_EVENTS.includes(event.type) && priceCents !== null && priceCents > 0) {
      const { error: eventError } = await supabase
        .from('subscription_events')
        .insert({
          revenuecat_event_id: event.id,
          app_user_id: event.app_user_id,
          event_type: event.type,
          product_id: event.product_id,
          price_cents: priceCents,
          currency: event.currency || 'USD',
          plan_type: planType,
          environment: event.environment,
          store: event.store,
          entitlement_id: entitlementId,
          original_transaction_id: event.original_transaction_id ?? null,
          transaction_id: event.transaction_id ?? null,
          purchased_at: new Date(event.purchased_at_ms).toISOString(),
        })

      if (eventError) {
        if (isUniqueViolation(eventError)) {
          shouldProcessPaymentSideEffects = false
          console.log(`Duplicate subscription payment event skipped: ${event.id}`)
        } else {
          // Log but don't fail - subscription record is more important
          console.error('Failed to insert subscription event:', eventError)
        }
      } else {
        console.log(`Payment event recorded: ${event.type} $${(priceCents / 100).toFixed(2)} ${event.currency}`)
      }
    }

    console.log(`Subscription updated: ${event.app_user_id} -> ${status}`)

    // Forward to PostHog for revenue analytics + lifecycle funnels.
    // Awaited so we don't drop events if the Node runtime exits after the
    // response — the POST is fast and idempotent.
    if (shouldProcessPaymentSideEffects) {
      await forwardToPostHog(event, priceCents, planType)
    }

    // Handle influencer commission for yearly conversions
    if (
      (event.type === 'TRIAL_CONVERTED' || event.type === 'INITIAL_PURCHASE') &&
      planType === 'yearly' &&
      priceCents &&
      shouldProcessPaymentSideEffects
    ) {
      await handleInfluencerConversion(event.app_user_id, priceCents, supabase)
    }

    // Handle referral reward - grant 1 free month to referrer when referred user subscribes
    if (
      shouldProcessPaymentSideEffects &&
      (event.type === 'INITIAL_PURCHASE' || event.type === 'TRIAL_CONVERTED')
    ) {
      await handleReferralReward(event.app_user_id, supabase)
    }

    await sendWebProPurchaseReadyEmail(event, planType)

    // Handle refund - clawback commission if within 60 days
    if (event.type === 'EXPIRATION' && event.cancel_reason === 'CUSTOMER_SUPPORT') {
      // This is likely a refund
      await handleInfluencerRefund(event.app_user_id, supabase)
      await handleCreatorRewardRefund(event, supabase)
    }

    await markRevenueCatEventProcessed(supabase, event.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    if (supabase && reservedRevenueCatEventId) {
      await markRevenueCatEventFailed(supabase, reservedRevenueCatEventId, error)
    }
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Processing error' }, { status: 500 })
  }
}

// Handle referral reward - grant 1 free month to referrer when referred user subscribes
async function handleReferralReward(
  appUserId: string,
  supabase: ReturnType<typeof getSupabaseAdmin>
) {
  try {
    // Find the referral record for this user (by device_id which is the app_user_id)
    const { data: referral, error: referralError } = await supabase
      .from('user_referrals')
      .select('id, referrer_code, referred_device_id, status')
      .eq('referred_device_id', appUserId)
      .eq('status', 'pending')
      .single()

    if (referralError || !referral) {
      // Not a referred user, nothing to do
      return
    }

    console.log(`Processing referral reward for referrer code: ${referral.referrer_code}`)

    // Look up the referrer's device_id from their referral code
    const { data: referrerCode, error: codeError } = await supabase
      .from('user_referral_codes')
      .select('device_id')
      .eq('code', referral.referrer_code)
      .single()

    if (codeError || !referrerCode?.device_id) {
      console.error(`Could not find referrer device_id for code: ${referral.referrer_code}`)
      return
    }

    const referrerDeviceId = referrerCode.device_id

    // Defense-in-depth: the Swift client already blocks self-referral via
    // ReferralService.trackReferralSignup, but a compromised client could
    // bypass it. Never grant a reward to the subscriber themselves.
    if (referrerDeviceId === appUserId) {
      console.warn(`Refusing self-referral reward for ${appUserId}`)
      await supabase
        .from('user_referrals')
        .update({ status: 'self_referral_blocked' })
        .eq('id', referral.id)
      return
    }

    // Update referral status to 'subscribed'
    const { error: updateError } = await supabase
      .from('user_referrals')
      .update({ status: 'subscribed' })
      .eq('id', referral.id)

    if (updateError) {
      console.error('Failed to update referral status to subscribed:', updateError)
      // Continue anyway - we still want to try granting the reward
    }

    // Grant 1 free month to referrer via RevenueCat Promotional Entitlement.
    // Accepts either env name for historical reasons: the project was
    // originally provisioned with REVENUECAT_API_KEY, but the intended
    // value here is a **secret** key (publishable keys cannot grant
    // promotional entitlements — the API returns 401).
    const revenueCatSecretKey =
      process.env.REVENUECAT_SECRET_KEY || process.env.REVENUECAT_API_KEY
    if (!revenueCatSecretKey) {
      console.error('RevenueCat secret key not configured - skipping promotional entitlement')
      return
    }

    // Must match AppConfig.RevenueCat.entitlementID on iOS. Env-driven so
    // web and mobile stay in sync without a code change.
    const entitlementId = process.env.REVENUECAT_ENTITLEMENT_ID || 'Track Speed Pro'

    // Grant promotional entitlement with retry
    // https://www.revenuecat.com/docs/api-v1#tag/Entitlements/operation/grant-a-promotional-entitlement
    let response: Response | null = null
    let lastError = ''

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        response = await fetch(
          `https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(referrerDeviceId)}/entitlements/${encodeURIComponent(entitlementId)}/promotional`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${revenueCatSecretKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              duration: 'monthly', // 30 days
            }),
          }
        )

        if (response.ok) break

        lastError = await response.text()

        // Don't retry on 4xx errors (client errors)
        if (response.status >= 400 && response.status < 500) break

        // Wait before retry (exponential backoff)
        if (attempt < 2) {
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)))
        }
      } catch (fetchError) {
        lastError = fetchError instanceof Error ? fetchError.message : 'Unknown fetch error'
        if (attempt < 2) {
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)))
        }
      }
    }

    if (!response?.ok) {
      console.error(`Failed to grant promotional entitlement after retries: ${lastError}`)
      // Leave status as 'subscribed' so we know they subscribed but reward failed
      // Could be retried manually or via a background job
      return
    }

    // Update referral status to 'rewarded'
    const { error: rewardError } = await supabase
      .from('user_referrals')
      .update({
        status: 'rewarded',
        rewarded_at: new Date().toISOString(),
      })
      .eq('id', referral.id)

    if (rewardError) {
      console.error('Failed to update referral status to rewarded:', rewardError)
      // The reward was granted, just logging failed - not critical
    }

    console.log(`Granted 1 free month to referrer ${referrerDeviceId} for referring ${appUserId}`)
  } catch (error) {
    console.error('Failed to handle referral reward:', error)
    // Don't throw - subscription processing should continue
  }
}

// Handle influencer commission when a referred user converts to yearly subscription
async function handleInfluencerConversion(
  appUserId: string,
  priceCents: number,
  supabase: ReturnType<typeof getSupabaseAdmin>
) {
  try {
    // Find unconverted referral for this user
    const { data: referral, error: referralError } = await supabase
      .from('influencer_referrals')
      .select('*, influencers!inner(*)')
      .eq('app_user_id', appUserId)
      .is('converted_at', null)
      .single()

    if (referralError || !referral) {
      // Not an influencer referral, nothing to do
      return
    }

    const commissionCents = Math.round(priceCents * 0.20) // 20% commission

    // Create one commission per referral. The database uniqueness constraint
    // keeps RevenueCat retries from producing duplicate payout rows.
    const { data: createdCommission, error: commissionInsertError } = await supabase
      .from('influencer_commissions')
      .insert({
        influencer_id: referral.influencer_id,
        referral_id: referral.id,
        revenue_cents: priceCents,
        commission_cents: commissionCents,
        status: 'pending',
      })
      .select('id, status')
      .single()

    let commission = createdCommission
    const didCreateCommission = !commissionInsertError

    if (commissionInsertError) {
      if (!isUniqueViolation(commissionInsertError)) {
        console.error('Failed to create influencer commission:', commissionInsertError)
        return
      }

      const { data: existingCommission, error: existingCommissionError } = await supabase
        .from('influencer_commissions')
        .select('id, status')
        .eq('referral_id', referral.id)
        .single()

      if (existingCommissionError || !existingCommission) {
        console.error('Failed to load existing influencer commission:', existingCommissionError)
        return
      }

      commission = existingCommission
    }

    // Update referral as converted after the commission row exists.
    await supabase
      .from('influencer_referrals')
      .update({ converted_at: new Date().toISOString() })
      .eq('id', referral.id)
      .is('converted_at', null)

    if (didCreateCommission) {
      // Update influencer totals once for the newly created commission.
      await supabase.rpc('update_influencer_conversion_stats', {
        influencer_uuid: referral.influencer_id,
        commission_amount: commissionCents,
      })

      console.log(
        `Influencer commission created: $${(commissionCents / 100).toFixed(2)} for influencer ${referral.influencer_id}`
      )
    }

    // Auto-transfer via Stripe Connect if account is set up
    const influencer = referral.influencers
    if (
      commission?.status === 'pending' &&
      influencer?.stripe_account_id &&
      influencer?.stripe_onboarding_complete
    ) {
      await transferCommission(
        commission.id,
        referral.influencer_id,
        commissionCents,
        influencer.stripe_account_id,
        supabase
      )
    }
  } catch (error) {
    console.error('Failed to handle influencer conversion:', error)
    // Don't throw - subscription processing should continue
  }
}

// Handle refund - clawback commission if within 60 days
async function handleInfluencerRefund(
  appUserId: string,
  supabase: ReturnType<typeof getSupabaseAdmin>
) {
  try {
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()

    // Find commission within clawback period
    const { data: commission, error: commissionError } = await supabase
      .from('influencer_commissions')
      .select('*, influencer_referrals!inner(*)')
      .eq('influencer_referrals.app_user_id', appUserId)
      .gte('created_at', sixtyDaysAgo)
      .eq('status', 'pending') // Only pending (not yet transferred)
      .single()

    if (commissionError || !commission) {
      // No clawback needed
      return
    }

    // Mark commission as clawed back
    await supabase
      .from('influencer_commissions')
      .update({ status: 'clawback' })
      .eq('id', commission.id)

    // Update influencer totals
    await supabase.rpc('decrement_influencer_earnings', {
      influencer_uuid: commission.influencer_id,
      amount: commission.commission_cents,
    })

    console.log(
      `Clawed back $${(commission.commission_cents / 100).toFixed(2)} from influencer ${commission.influencer_id}`
    )
  } catch (error) {
    console.error('Failed to handle influencer refund:', error)
    // Don't throw - subscription processing should continue
  }
}

async function handleCreatorRewardRefund(
  event: RevenueCatWebhookEvent['event'],
  supabase: ReturnType<typeof getSupabaseAdmin>
) {
  try {
    const now = new Date().toISOString()
    const refundNote = `RevenueCat refund signal received at ${now} for ${event.type}/${event.cancel_reason}. Apple refund handling is separate from Creator Reward payouts.`

    const matchQuery = (statuses: string[]) => {
      return supabase
        .from('creator_reward_submissions')
        .select('id, status, admin_notes')
        .eq('revenuecat_app_user_id', event.app_user_id)
        .in('status', statuses)
    }

    const { data: pendingClaims, error: pendingError } = await matchQuery([
      'pending',
      'needs_more_info',
    ])

    if (pendingError) {
      console.error('Failed to load pending creator reward claims for refund handling:', pendingError)
    } else if (pendingClaims?.length) {
      await supabase
        .from('creator_reward_submissions')
        .update({
          status: 'rejected',
          rejection_reason: 'Apple refund detected for the underlying purchase.',
          admin_notes: refundNote,
        })
        .in('id', pendingClaims.map((claim) => claim.id))
    }

    const { data: approvedClaims, error: approvedError } = await matchQuery([
      'approved_50',
      'approved_100',
      'paid',
    ])

    if (approvedError) {
      console.error('Failed to load approved creator reward claims for refund handling:', approvedError)
      return
    }

    for (const claim of approvedClaims ?? []) {
      const nextNotes = claim.admin_notes
        ? `${claim.admin_notes}\n${refundNote}`
        : refundNote

      await supabase
        .from('creator_reward_submissions')
        .update({
          status: claim.status === 'paid' ? 'paid' : 'needs_more_info',
          admin_notes: nextNotes,
        })
        .eq('id', claim.id)
    }
  } catch (error) {
    console.error('Failed to handle creator reward refund signal:', error)
  }
}

// Transfer commission to influencer via Stripe Connect
async function transferCommission(
  commissionId: string,
  influencerId: string,
  amountCents: number,
  stripeAccountId: string,
  supabase: ReturnType<typeof getSupabaseAdmin>
) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY not configured - skipping transfer')
      return
    }

    // Dynamic import to avoid requiring stripe in all environments
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(stripeSecretKey)

    const transfer = await stripe.transfers.create(
      {
        amount: amountCents,
        currency: 'usd',
        destination: stripeAccountId,
        metadata: {
          influencer_id: influencerId,
          commission_id: commissionId,
        },
      },
      { idempotencyKey: `influencer_commission_${commissionId}` }
    )

    // Update commission record
    await supabase
      .from('influencer_commissions')
      .update({
        status: 'transferred',
        stripe_transfer_id: transfer.id,
        transferred_at: new Date().toISOString(),
      })
      .eq('id', commissionId)
      .eq('status', 'pending')

    console.log(`Transferred $${(amountCents / 100).toFixed(2)} to influencer ${influencerId}`)
  } catch (error) {
    console.error('Failed to transfer commission:', error)
    // Mark commission as failed
    await supabase
      .from('influencer_commissions')
      .update({ status: 'failed' })
      .eq('id', commissionId)
      .eq('status', 'pending')
  }
}

// RevenueCat may send GET requests to verify the endpoint is reachable
export async function GET() {
  return NextResponse.json({ status: 'ok' })
}
