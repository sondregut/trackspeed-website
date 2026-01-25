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

    const analyticsData: AnalyticsData = {
      overview: {
        totalUsers: profilesResult.count || 0,
        activeUsers30d: uniqueActiveUsers,
        totalSessions: sessionsResult.count || 0,
        totalRuns: runsResult.count || 0,
        promoRedemptions: redemptionsResult.count || 0,
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
