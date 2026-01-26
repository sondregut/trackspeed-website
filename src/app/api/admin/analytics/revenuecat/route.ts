import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

interface RevenueCatOverview {
  activeSubscribers: number
  activeTrials: number
  churnedLast30d: number
  totalSubscriptions: number
}

export async function GET() {
  try {
    const supabase = getSupabase()
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()

    // Fetch subscription metrics in parallel
    const [
      activeSubscribersResult,
      activeTrialsResult,
      churnedResult,
      totalResult,
    ] = await Promise.all([
      // Active subscribers (non-trial, not expired)
      supabase
        .from('subscriptions')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'active')
        .eq('is_trial', false)
        .gt('expires_at', now.toISOString()),

      // Active trials
      supabase
        .from('subscriptions')
        .select('id', { count: 'exact', head: true })
        .eq('is_trial', true)
        .gt('expires_at', now.toISOString()),

      // Churned in last 30 days
      supabase
        .from('subscriptions')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'expired')
        .gte('expires_at', thirtyDaysAgo),

      // Total subscriptions ever
      supabase
        .from('subscriptions')
        .select('id', { count: 'exact', head: true }),
    ])

    return NextResponse.json({
      activeSubscribers: activeSubscribersResult.count || 0,
      activeTrials: activeTrialsResult.count || 0,
      churnedLast30d: churnedResult.count || 0,
      totalSubscriptions: totalResult.count || 0,
    } satisfies RevenueCatOverview)
  } catch (error) {
    console.error('RevenueCat analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscription data' },
      { status: 500 }
    )
  }
}
