import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

interface AnalyticsData {
  overview: {
    totalUsers: number
    activeUsers30d: number
    totalSessions: number
    totalRuns: number
    promoRedemptions: number
  }
  subscriptions: {
    activeSubscribers: number
    activeTrials: number
    churnedLast30d: number
  }
  revenue: {
    totalRevenueCents: number
    mrrCents: number
    monthlySubscribers: number
    yearlySubscribers: number
    currency: string
  }
  dailyActivity: Array<{
    date: string
    sessions: number
    users: number
  }>
  startTypeDistribution: Array<{
    type: string
    count: number
  }>
  recentSessions: Array<{
    id: string
    created_at: string
    start_type: string | null
    run_count: number
    device_model: string | null
  }>
}

export async function GET() {
  try {
    const supabase = getSupabase()
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()

    // Fetch all data in parallel
    const [
      profilesResult,
      activeUsersResult,
      sessionsResult,
      runsResult,
      redemptionsResult,
      dailySessionsResult,
      startTypesResult,
      recentSessionsResult,
      activeSubscribersResult,
      activeTrialsResult,
      churnedResult,
      subscriptionEventsResult,
      activeSubscriptionsForMrrResult,
    ] = await Promise.all([
      // Total users
      supabase.from('profiles').select('id', { count: 'exact', head: true }),

      // Active users (30 days) - users with sessions in last 30 days
      supabase
        .from('sessions')
        .select('user_id')
        .gte('created_at', thirtyDaysAgo)
        .not('user_id', 'is', null),

      // Total sessions
      supabase.from('sessions').select('id', { count: 'exact', head: true }),

      // Total runs
      supabase.from('runs').select('id', { count: 'exact', head: true }),

      // Promo redemptions
      supabase.from('promo_redemptions').select('id', { count: 'exact', head: true }),

      // Daily sessions (last 30 days)
      supabase
        .from('sessions')
        .select('created_at, user_id')
        .gte('created_at', thirtyDaysAgo)
        .order('created_at', { ascending: true }),

      // Start type distribution
      supabase
        .from('sessions')
        .select('start_type'),

      // Recent sessions with run counts
      supabase
        .from('sessions')
        .select(`
          id,
          created_at,
          start_type,
          device_model,
          runs(id)
        `)
        .order('created_at', { ascending: false })
        .limit(10),

      // Active subscribers (status = active AND expires_at > now)
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

      // Churned in last 30 days (expired status, expires_at in last 30 days)
      supabase
        .from('subscriptions')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'expired')
        .gte('expires_at', thirtyDaysAgo),

      // All subscription events for total revenue (production only)
      supabase
        .from('subscription_events')
        .select('price_cents, currency')
        .eq('environment', 'PRODUCTION'),

      // Active subscriptions with price/plan for MRR calculation
      supabase
        .from('subscriptions')
        .select('price_cents, plan_type')
        .eq('status', 'active')
        .eq('is_trial', false)
        .eq('environment', 'PRODUCTION')
        .gt('expires_at', now.toISOString()),
    ])

    // Count unique active users
    const uniqueActiveUsers = new Set(
      activeUsersResult.data?.map((s: { user_id: string }) => s.user_id) || []
    ).size

    // Aggregate daily sessions
    const dailyMap = new Map<string, { sessions: number; users: Set<string> }>()
    for (const session of dailySessionsResult.data || []) {
      const date = session.created_at.split('T')[0]
      if (!dailyMap.has(date)) {
        dailyMap.set(date, { sessions: 0, users: new Set() })
      }
      const day = dailyMap.get(date)!
      day.sessions++
      if (session.user_id) {
        day.users.add(session.user_id)
      }
    }

    const dailyActivity = Array.from(dailyMap.entries())
      .map(([date, data]) => ({
        date,
        sessions: data.sessions,
        users: data.users.size,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Aggregate start types
    const startTypeMap = new Map<string, number>()
    for (const session of startTypesResult.data || []) {
      const type = session.start_type || 'unknown'
      startTypeMap.set(type, (startTypeMap.get(type) || 0) + 1)
    }

    const startTypeDistribution = Array.from(startTypeMap.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)

    // Format recent sessions
    const recentSessions = (recentSessionsResult.data || []).map((s: {
      id: string
      created_at: string
      start_type: string | null
      device_model: string | null
      runs: { id: string }[]
    }) => ({
      id: s.id,
      created_at: s.created_at,
      start_type: s.start_type,
      run_count: Array.isArray(s.runs) ? s.runs.length : 0,
      device_model: s.device_model,
    }))

    // Calculate total revenue from all payment events
    const totalRevenueCents = (subscriptionEventsResult.data || []).reduce(
      (sum: number, event: { price_cents: number }) => sum + (event.price_cents || 0),
      0
    )

    // Calculate MRR from active subscriptions
    // Monthly subs contribute their full price, yearly subs contribute price/12
    let mrrCents = 0
    let monthlySubscribers = 0
    let yearlySubscribers = 0

    for (const sub of activeSubscriptionsForMrrResult.data || []) {
      const typedSub = sub as { price_cents: number | null; plan_type: string | null }
      const price = typedSub.price_cents || 0
      if (typedSub.plan_type === 'yearly') {
        mrrCents += Math.round(price / 12)
        yearlySubscribers++
      } else {
        // Default to monthly if plan_type is null or 'monthly'
        mrrCents += price
        monthlySubscribers++
      }
    }

    const analyticsData: AnalyticsData = {
      overview: {
        totalUsers: profilesResult.count || 0,
        activeUsers30d: uniqueActiveUsers,
        totalSessions: sessionsResult.count || 0,
        totalRuns: runsResult.count || 0,
        promoRedemptions: redemptionsResult.count || 0,
      },
      subscriptions: {
        activeSubscribers: activeSubscribersResult.count || 0,
        activeTrials: activeTrialsResult.count || 0,
        churnedLast30d: churnedResult.count || 0,
      },
      revenue: {
        totalRevenueCents,
        mrrCents,
        monthlySubscribers,
        yearlySubscribers,
        currency: 'USD',
      },
      dailyActivity,
      startTypeDistribution,
      recentSessions,
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
