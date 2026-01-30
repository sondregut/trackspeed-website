import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { verifyInfluencerToken } from '../auth/route'

// GET /api/influencer/stats - Get influencer dashboard stats
export async function GET(request: NextRequest) {
  try {
    const influencerId = await verifyInfluencerToken(request)

    if (!influencerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

    // Get recent referrals
    const { data: referrals } = await supabase
      .from('influencer_referrals')
      .select('*')
      .eq('influencer_id', influencerId)
      .order('created_at', { ascending: false })
      .limit(20)

    // Get commissions
    const { data: commissions } = await supabase
      .from('influencer_commissions')
      .select('*')
      .eq('influencer_id', influencerId)
      .order('created_at', { ascending: false })
      .limit(20)

    // Calculate pending vs transferred earnings
    const pendingEarningsCents = commissions
      ?.filter((c) => c.status === 'pending')
      .reduce((sum, c) => sum + c.commission_cents, 0) || 0

    const transferredEarningsCents = commissions
      ?.filter((c) => c.status === 'transferred')
      .reduce((sum, c) => sum + c.commission_cents, 0) || 0

    return NextResponse.json({
      influencer: {
        id: influencer.id,
        name: influencer.name,
        email: influencer.email,
        code: influencer.code,
        status: influencer.status,
        stripeConnected: influencer.stripe_onboarding_complete,
        totalSignups: influencer.total_signups,
        totalConversions: influencer.total_conversions,
        totalEarningsCents: influencer.total_earnings_cents,
      },
      earnings: {
        totalCents: influencer.total_earnings_cents,
        pendingCents: pendingEarningsCents,
        transferredCents: transferredEarningsCents,
      },
      referrals: referrals?.map((r) => ({
        id: r.id,
        createdAt: r.created_at,
        trialExpiresAt: r.trial_expires_at,
        convertedAt: r.converted_at,
        status: r.converted_at
          ? 'converted'
          : new Date(r.trial_expires_at) < new Date()
          ? 'expired'
          : 'trial',
      })) || [],
      commissions: commissions?.map((c) => ({
        id: c.id,
        createdAt: c.created_at,
        revenueCents: c.revenue_cents,
        commissionCents: c.commission_cents,
        status: c.status,
        transferredAt: c.transferred_at,
      })) || [],
    })
  } catch (error) {
    console.error('Influencer stats error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
