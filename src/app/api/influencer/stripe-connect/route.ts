import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { verifyInfluencerToken } from '../auth/route'

const STRIPE_ACCOUNT_MODEL_V2 = 'v2_core'
const STRIPE_ACCOUNT_MODEL_V1 = 'v1_connect'

// POST /api/influencer/stripe-connect - Create Stripe Connect account and onboarding link
export async function POST(request: NextRequest) {
  try {
    const influencerId = await verifyInfluencerToken()

    if (!influencerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      )
    }

    const supabase = getSupabase()

    // Get influencer data
    const { data: influencer, error: influencerError } = await supabase
      .from('influencers')
      .select('*')
      .eq('id', influencerId)
      .single()

    if (influencerError || !influencer) {
      return NextResponse.json({ error: 'Influencer not found' }, { status: 404 })
    }

    // Dynamic import Stripe
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(stripeSecretKey)

    let accountId = influencer.stripe_account_id
    let accountModel = influencer.stripe_account_model || STRIPE_ACCOUNT_MODEL_V1

    // Create a new Accounts v2 recipient account if one does not exist.
    if (!accountId) {
      const account = await stripe.v2.core.accounts.create({
        contact_email: influencer.email,
        display_name: influencer.name,
        dashboard: 'express',
        metadata: { influencer_id: influencer.id },
        defaults: {
          currency: 'usd',
          profile: {
            business_url: process.env.NEXT_PUBLIC_SITE_URL || 'https://mytrackspeed.com',
            product_description: 'Track Speed affiliate referral payouts',
          },
          responsibilities: {
            fees_collector: 'application',
            losses_collector: 'stripe',
          },
        },
        configuration: {
          recipient: {
            capabilities: {
              stripe_balance: {
                stripe_transfers: { requested: true },
              },
            },
          },
        },
      })

      accountId = account.id
      accountModel = STRIPE_ACCOUNT_MODEL_V2

      // Save account ID
      await supabase
        .from('influencers')
        .update({
          stripe_account_id: accountId,
          stripe_account_model: accountModel,
        })
        .eq('id', influencerId)
    }

    // Get the base URL from request
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const host = request.headers.get('host') || 'localhost:3000'
    const baseUrl = `${protocol}://${host}`

    const refreshUrl = `${baseUrl}/influencer/connect?refresh=true`
    const returnUrl = `${baseUrl}/influencer/connect?success=true`
    const accountLink =
      accountModel === STRIPE_ACCOUNT_MODEL_V2
        ? await stripe.v2.core.accountLinks.create({
            account: accountId,
            use_case: {
              type: 'account_onboarding',
              account_onboarding: {
                configurations: ['recipient'],
                collection_options: {
                  fields: 'eventually_due',
                  future_requirements: 'include',
                },
                refresh_url: refreshUrl,
                return_url: returnUrl,
              },
            },
          })
        : await stripe.accountLinks.create({
            account: accountId,
            refresh_url: refreshUrl,
            return_url: returnUrl,
            type: 'account_onboarding',
          })

    return NextResponse.json({
      success: true,
      url: accountLink.url,
    })
  } catch (error) {
    console.error('Stripe Connect error:', error)
    return NextResponse.json({ error: 'Failed to create Stripe account' }, { status: 500 })
  }
}

// GET /api/influencer/stripe-connect - Check Stripe Connect status
export async function GET() {
  try {
    const influencerId = await verifyInfluencerToken()

    if (!influencerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      return NextResponse.json({ connected: false, error: 'Stripe not configured' })
    }

    const supabase = getSupabase()

    // Get influencer data
    const { data: influencer } = await supabase
      .from('influencers')
      .select('stripe_account_id, stripe_account_model, stripe_onboarding_complete')
      .eq('id', influencerId)
      .single()

    if (!influencer?.stripe_account_id) {
      return NextResponse.json({ connected: false })
    }

    // Always recheck Stripe. Cached completion can become stale when payouts
    // are disabled or account requirements become past due.
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(stripeSecretKey)
    const accountModel = influencer.stripe_account_model || STRIPE_ACCOUNT_MODEL_V1
    const checkedAt = new Date().toISOString()

    if (accountModel === STRIPE_ACCOUNT_MODEL_V2) {
      const account = await stripe.v2.core.accounts.retrieve(
        influencer.stripe_account_id,
        { include: ['configuration.recipient', 'requirements'] }
      )
      const recipient = account.configuration?.recipient
      const stripeTransfersStatus =
        recipient?.capabilities?.stripe_balance?.stripe_transfers?.status ?? null
      const payoutsStatus =
        recipient?.capabilities?.stripe_balance?.payouts?.status ?? null
      const requirementsStatus =
        account.requirements?.summary?.minimum_deadline?.status ?? null
      const connected =
        recipient?.applied === true &&
        stripeTransfersStatus === 'active' &&
        payoutsStatus === 'active' &&
        requirementsStatus !== 'past_due'

      await supabase
        .from('influencers')
        .update({
          stripe_onboarding_complete: connected,
          stripe_payouts_enabled: payoutsStatus === 'active',
          stripe_details_submitted: connected,
          stripe_charges_enabled: false,
          stripe_requirements_status: requirementsStatus,
          stripe_status_checked_at: checkedAt,
        })
        .eq('id', influencerId)

      return NextResponse.json({
        connected,
        accountId: influencer.stripe_account_id,
        accountModel,
        recipientApplied: recipient?.applied ?? false,
        stripeTransfersStatus,
        payoutsStatus,
        requirementsStatus,
      })
    }

    const account = await stripe.accounts.retrieve(influencer.stripe_account_id)

    const requirementsStatus =
      account.requirements?.disabled_reason ||
      (account.requirements?.past_due?.length
        ? 'past_due'
        : account.requirements?.currently_due?.length
          ? 'currently_due'
          : null)

    // Check if onboarding is complete and payouts are still enabled.
    const isComplete = Boolean(account.details_submitted && account.payouts_enabled)

    await supabase
      .from('influencers')
      .update({
        stripe_onboarding_complete: isComplete,
        stripe_payouts_enabled: Boolean(account.payouts_enabled),
        stripe_details_submitted: Boolean(account.details_submitted),
        stripe_charges_enabled: Boolean(account.charges_enabled),
        stripe_requirements_status: requirementsStatus,
        stripe_status_checked_at: checkedAt,
      })
      .eq('id', influencerId)

    return NextResponse.json({
      connected: isComplete,
      accountId: influencer.stripe_account_id,
      accountModel,
      detailsSubmitted: account.details_submitted,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      requirementsStatus,
    })
  } catch (error) {
    console.error('Stripe Connect status error:', error)
    return NextResponse.json({ connected: false, error: 'Failed to check status' })
  }
}
