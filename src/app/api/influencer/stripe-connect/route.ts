import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { verifyInfluencerToken } from '../auth/route'

// POST /api/influencer/stripe-connect - Create Stripe Connect account and onboarding link
export async function POST(request: NextRequest) {
  try {
    const influencerId = await verifyInfluencerToken(request)

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

    // Create Stripe Express account if doesn't exist
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        email: influencer.email,
        metadata: { influencer_id: influencer.id },
        capabilities: {
          transfers: { requested: true },
        },
      })

      accountId = account.id

      // Save account ID
      await supabase
        .from('influencers')
        .update({ stripe_account_id: accountId })
        .eq('id', influencerId)
    }

    // Get the base URL from request
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const host = request.headers.get('host') || 'localhost:3000'
    const baseUrl = `${protocol}://${host}`

    // Create onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${baseUrl}/influencer/connect?refresh=true`,
      return_url: `${baseUrl}/influencer/connect?success=true`,
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
export async function GET(request: NextRequest) {
  try {
    const influencerId = await verifyInfluencerToken(request)

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
      .select('stripe_account_id, stripe_onboarding_complete')
      .eq('id', influencerId)
      .single()

    if (!influencer?.stripe_account_id) {
      return NextResponse.json({ connected: false })
    }

    // If already marked as complete, return that
    if (influencer.stripe_onboarding_complete) {
      return NextResponse.json({
        connected: true,
        accountId: influencer.stripe_account_id,
      })
    }

    // Check account status with Stripe
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(stripeSecretKey)

    const account = await stripe.accounts.retrieve(influencer.stripe_account_id)

    // Check if onboarding is complete
    const isComplete = account.details_submitted && account.payouts_enabled

    if (isComplete && !influencer.stripe_onboarding_complete) {
      // Update database
      await supabase
        .from('influencers')
        .update({ stripe_onboarding_complete: true })
        .eq('id', influencerId)
    }

    return NextResponse.json({
      connected: isComplete,
      accountId: influencer.stripe_account_id,
      detailsSubmitted: account.details_submitted,
      payoutsEnabled: account.payouts_enabled,
    })
  } catch (error) {
    console.error('Stripe Connect status error:', error)
    return NextResponse.json({ connected: false, error: 'Failed to check status' })
  }
}
