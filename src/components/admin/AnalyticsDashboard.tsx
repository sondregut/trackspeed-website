"use client"

import { useEffect, useState } from "react"
import StatCard from "./StatCard"
import ActivityChart from "./ActivityChart"
import StartTypeChart from "./StartTypeChart"

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
    billingIssues: number
  }
  revenue: {
    totalRevenueCents: number
    mrrCents: number
    monthlySubscribers: number
    yearlySubscribers: number
    currency: string
  }
  engagement: {
    averageScore: number
    atRiskCount: number
    trendDistribution: {
      increasing: number
      stable: number
      decreasing: number
      inactive: number
    }
    atRiskUsers: Array<{
      user_id: string
      email: string | null
      days_inactive: number | null
      engagement_score: number
      risk_score: number
      activity_trend: string
    }>
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

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [chartMetric, setChartMetric] = useState<"sessions" | "users">("sessions")

  useEffect(() => {
    async function fetchData() {
      try {
        const analyticsRes = await fetch("/api/admin/analytics")

        if (!analyticsRes.ok) throw new Error("Failed to fetch analytics")

        const analyticsData = await analyticsRes.json()
        setAnalytics(analyticsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load analytics")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-[#3D3D3D] rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-[#2B2E32] rounded-xl" />
            ))}
          </div>
          <div className="h-80 bg-[#2B2E32] rounded-xl" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400">
          {error}
        </div>
      </div>
    )
  }

  if (!analytics) return null

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
        <p className="text-[#9B9A97] mt-1">TrackSpeed usage metrics and insights</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={analytics.overview.totalUsers.toLocaleString()}
          subtitle="Registered profiles"
          icon={<UserIcon />}
        />
        <StatCard
          title="Active Users (30d)"
          value={analytics.overview.activeUsers30d.toLocaleString()}
          subtitle="Users with sessions"
          icon={<ActivityIcon />}
        />
        <StatCard
          title="Pro Subscribers"
          value={analytics.subscriptions.activeSubscribers.toLocaleString()}
          subtitle="Active subscriptions"
          icon={<StarIcon />}
        />
        <StatCard
          title="Promo Redemptions"
          value={analytics.overview.promoRedemptions.toLocaleString()}
          subtitle="Codes redeemed"
          icon={<TicketIcon />}
        />
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(analytics.revenue.totalRevenueCents)}
          subtitle="Lifetime revenue"
          icon={<DollarIcon />}
        />
        <StatCard
          title="MRR"
          value={formatCurrency(analytics.revenue.mrrCents)}
          subtitle="Monthly recurring revenue"
          icon={<TrendIcon />}
        />
        <StatCard
          title="Monthly Plans"
          value={analytics.revenue.monthlySubscribers.toLocaleString()}
          subtitle="Active monthly subs"
          icon={<CalendarIcon />}
        />
        <StatCard
          title="Yearly Plans"
          value={analytics.revenue.yearlySubscribers.toLocaleString()}
          subtitle="Active yearly subs"
          icon={<CalendarYearIcon />}
        />
      </div>

      {/* Session Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Sessions"
          value={analytics.overview.totalSessions.toLocaleString()}
          icon={<TimerIcon />}
        />
        <StatCard
          title="Total Runs"
          value={analytics.overview.totalRuns.toLocaleString()}
          icon={<RunIcon />}
        />
        <StatCard
          title="Active Trials"
          value={analytics.subscriptions.activeTrials.toLocaleString()}
          subtitle="Trial subscriptions"
          icon={<ClockIcon />}
        />
        <StatCard
          title="Churned (30d)"
          value={analytics.subscriptions.churnedLast30d.toLocaleString()}
          subtitle="Expired subscriptions"
          icon={<ChurnIcon />}
        />
      </div>

      {/* Engagement & Retention Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="At-Risk Users"
          value={analytics.engagement.atRiskCount.toLocaleString()}
          subtitle="Risk score >= 40"
          icon={<AlertIcon />}
          highlight={analytics.engagement.atRiskCount > 0}
        />
        <StatCard
          title="Avg Engagement"
          value={analytics.engagement.averageScore.toLocaleString()}
          subtitle="Score out of 100"
          icon={<EngagementIcon />}
        />
        <StatCard
          title="Billing Issues"
          value={analytics.subscriptions.billingIssues.toLocaleString()}
          subtitle="Users in grace period"
          icon={<CreditCardIcon />}
          highlight={analytics.subscriptions.billingIssues > 0}
        />
        <StatCard
          title="Inactive Users"
          value={analytics.engagement.trendDistribution.inactive.toLocaleString()}
          subtitle="No recent activity"
          icon={<InactiveIcon />}
        />
      </div>

      {/* At-Risk Users Table */}
      {analytics.engagement.atRiskUsers.length > 0 && (
        <div className="bg-[#2B2E32] rounded-xl border border-[#3D3D3D] overflow-hidden">
          <div className="p-4 border-b border-[#3D3D3D] flex items-center gap-2">
            <AlertIcon />
            <h2 className="text-lg font-semibold text-white">At-Risk Users</h2>
            <span className="ml-2 px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
              {analytics.engagement.atRiskCount} users
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#1A1A1A]">
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#9B9A97]">Email</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#9B9A97]">Days Inactive</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#9B9A97]">Engagement</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#9B9A97]">Risk Score</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#9B9A97]">Trend</th>
                </tr>
              </thead>
              <tbody>
                {analytics.engagement.atRiskUsers.map((user) => (
                  <tr key={user.user_id} className="border-t border-[#3D3D3D] hover:bg-[#3D3D3D]/30">
                    <td className="px-4 py-3 text-sm text-white">
                      {user.email || <span className="text-[#9B9A97]">No email</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-white">
                      {user.days_inactive !== null ? `${user.days_inactive}d` : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded ${
                        user.engagement_score < 30 ? 'bg-red-500/20 text-red-400' :
                        user.engagement_score < 60 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {user.engagement_score}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded ${
                        user.risk_score >= 70 ? 'bg-red-500/20 text-red-400' :
                        user.risk_score >= 50 ? 'bg-orange-500/20 text-orange-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {user.risk_score}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded ${
                        user.activity_trend === 'inactive' ? 'bg-red-500/20 text-red-400' :
                        user.activity_trend === 'decreasing' ? 'bg-orange-500/20 text-orange-400' :
                        user.activity_trend === 'stable' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {user.activity_trend}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <div className="bg-[#2B2E32] rounded-xl p-6 border border-[#3D3D3D]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Daily Activity (30 days)</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setChartMetric("sessions")}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  chartMetric === "sessions"
                    ? "bg-[#5C8DB8] text-white"
                    : "bg-[#3D3D3D] text-[#9B9A97] hover:text-white"
                }`}
              >
                Sessions
              </button>
              <button
                onClick={() => setChartMetric("users")}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  chartMetric === "users"
                    ? "bg-[#5C8DB8] text-white"
                    : "bg-[#3D3D3D] text-[#9B9A97] hover:text-white"
                }`}
              >
                Users
              </button>
            </div>
          </div>
          <ActivityChart data={analytics.dailyActivity} metric={chartMetric} />
        </div>

        {/* Start Type Distribution */}
        <div className="bg-[#2B2E32] rounded-xl p-6 border border-[#3D3D3D]">
          <h2 className="text-lg font-semibold text-white mb-4">Start Type Distribution</h2>
          <StartTypeChart data={analytics.startTypeDistribution} />
        </div>
      </div>

      {/* Recent Sessions Table */}
      <div className="bg-[#2B2E32] rounded-xl border border-[#3D3D3D] overflow-hidden">
        <div className="p-4 border-b border-[#3D3D3D]">
          <h2 className="text-lg font-semibold text-white">Recent Sessions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#1A1A1A]">
                <th className="text-left px-4 py-3 text-sm font-medium text-[#9B9A97]">Time</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#9B9A97]">Start Type</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#9B9A97]">Runs</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#9B9A97]">Device</th>
              </tr>
            </thead>
            <tbody>
              {analytics.recentSessions.map((session) => (
                <tr key={session.id} className="border-t border-[#3D3D3D] hover:bg-[#3D3D3D]/30">
                  <td className="px-4 py-3 text-sm text-white">
                    {formatTimeAgo(session.created_at)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 bg-[#3D3D3D] rounded text-[#9B9A97]">
                      {session.start_type || "unknown"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-white">{session.run_count}</td>
                  <td className="px-4 py-3 text-sm text-[#9B9A97]">
                    {session.device_model || "—"}
                  </td>
                </tr>
              ))}
              {analytics.recentSessions.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-[#9B9A97]">
                    No sessions recorded yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Helper functions
function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

// Icon components
function UserIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}

function ActivityIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  )
}

function TicketIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
    </svg>
  )
}

function TimerIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function RunIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function ChurnIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
    </svg>
  )
}

function DollarIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function TrendIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}

function CalendarYearIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zM9 14l2 2 4-4" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  )
}

function EngagementIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )
}

function CreditCardIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  )
}

function InactiveIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  )
}
