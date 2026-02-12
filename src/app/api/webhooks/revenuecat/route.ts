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

    // Handle influencer commission for yearly conversions
    if (
      (event.type === 'TRIAL_CONVERTED' || event.type === 'INITIAL_PURCHASE') &&
      planType === 'yearly' &&
      priceCents
    ) {
      await handleInfluencerConversion(event.app_user_id, priceCents, supabase)
    }

    // Handle referral reward - grant 1 free month to referrer when referred user subscribes
    if (event.type === 'INITIAL_PURCHASE' || event.type === 'TRIAL_CONVERTED') {
      await handleReferralReward(event.app_user_id, supabase)
    }

    // Handle refund - clawback commission if within 60 days
    if (event.type === 'EXPIRATION' && event.cancel_reason === 'CUSTOMER_SUPPORT') {
      // This is likely a refund
      await handleInfluencerRefund(event.app_user_id, supabase)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Processing error' }, { status: 500 })
  }
}

// Handle referral reward - grant 1 free month to referrer when referred user subscribes
async function handleReferralReward(
  appUserId: string,
  supabase: ReturnType<typeof getSupabase>
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

    // Update referral status to 'subscribed'
    const { error: updateError } = await supabase
      .from('user_referrals')
      .update({ status: 'subscribed' })
      .eq('id', referral.id)

    if (updateError) {
      console.error('Failed to update referral status to subscribed:', updateError)
      // Continue anyway - we still want to try granting the reward
    }

    // Grant 1 free month to referrer via RevenueCat Promotional Entitlement
    const revenueCatSecretKey = process.env.REVENUECAT_SECRET_KEY
    if (!revenueCatSecretKey) {
      console.error('REVENUECAT_SECRET_KEY not configured - skipping promotional entitlement')
      return
    }

    // Grant promotional entitlement with retry
    // https://www.revenuecat.com/docs/api-v1#tag/Entitlements/operation/grant-a-promotional-entitlement
    let response: Response | null = null
    let lastError = ''

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        response = await fetch(
          `https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(referrerDeviceId)}/entitlements/Pro/promotional`,
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
  supabase: ReturnType<typeof getSupabase>
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

    // Update referral as converted
    await supabase
      .from('influencer_referrals')
      .update({ converted_at: new Date().toISOString() })
      .eq('id', referral.id)

    // Create commission record
    await supabase
      .from('influencer_commissions')
      .insert({
        influencer_id: referral.influencer_id,
        referral_id: referral.id,
        revenue_cents: priceCents,
        commission_cents: commissionCents,
        status: 'pending',
      })

    // Update influencer totals
    await supabase.rpc('update_influencer_conversion_stats', {
      influencer_uuid: referral.influencer_id,
      commission_amount: commissionCents,
    })

    console.log(
      `Influencer commission created: $${(commissionCents / 100).toFixed(2)} for influencer ${referral.influencer_id}`
    )

    // Auto-transfer via Stripe Connect if account is set up
    const influencer = referral.influencers
    if (influencer?.stripe_account_id && influencer?.stripe_onboarding_complete) {
      await transferCommission(
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
  supabase: ReturnType<typeof getSupabase>
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

// Transfer commission to influencer via Stripe Connect
async function transferCommission(
  influencerId: string,
  amountCents: number,
  stripeAccountId: string,
  supabase: ReturnType<typeof getSupabase>
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

    const transfer = await stripe.transfers.create({
      amount: amountCents,
      currency: 'usd',
      destination: stripeAccountId,
      metadata: { influencer_id: influencerId },
    })

    // Update commission record
    await supabase
      .from('influencer_commissions')
      .update({
        status: 'transferred',
        stripe_transfer_id: transfer.id,
        transferred_at: new Date().toISOString(),
      })
      .eq('influencer_id', influencerId)
      .eq('status', 'pending')

    console.log(`Transferred $${(amountCents / 100).toFixed(2)} to influencer ${influencerId}`)
  } catch (error) {
    console.error('Failed to transfer commission:', error)
    // Mark commission as failed
    await supabase
      .from('influencer_commissions')
      .update({ status: 'failed' })
      .eq('influencer_id', influencerId)
      .eq('status', 'pending')
  }
}

// RevenueCat may send GET requests to verify the endpoint is reachable
export async function GET() {
  return NextResponse.json({ status: 'ok' })
}
