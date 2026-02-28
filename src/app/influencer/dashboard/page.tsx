"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface InfluencerStats {
  influencer: {
    id: string
    name: string
    email: string
    code: string
    status: "pending" | "approved" | "rejected" | "suspended"
    stripeConnected: boolean
    totalSignups: number
    totalConversions: number
    totalEarningsCents: number
  }
  earnings: {
    totalCents: number
    pendingCents: number
    transferredCents: number
  }
  referrals: Array<{
    id: string
    createdAt: string
    trialExpiresAt: string
    convertedAt: string | null
    status: "trial" | "converted" | "expired"
  }>
  commissions: Array<{
    id: string
    createdAt: string
    revenueCents: number
    commissionCents: number
    status: string
    transferredAt: string | null
  }>
}

export default function InfluencerDashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<InfluencerStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [codeCopied, setCodeCopied] = useState(false)
  const [freeCodeCopied, setFreeCodeCopied] = useState(false)

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch("/api/influencer/stats")

      if (response.status === 401) {
        router.push("/influencer/login")
        return
      }

      if (!response.ok) {
        throw new Error("Failed to fetch stats")
      }

      const data = await response.json()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load stats")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const copyCode = async () => {
    if (!stats) return
    await navigator.clipboard.writeText(stats.influencer.code)
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
  }

  const copyFreeCode = async () => {
    await navigator.clipboard.writeText("TRACKSPEED0106")
    setFreeCodeCopied(true)
    setTimeout(() => setFreeCodeCopied(false), 2000)
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5C8DB8]"></div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || "Failed to load stats"}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-[#5C8DB8] hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  // Show pending approval screen
  if (stats.influencer.status === "pending") {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-[#1A1A1A] rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Application Under Review
          </h1>
          <p className="text-[#9B9A97] mb-6">
            Thanks for applying, {stats.influencer.name}! We&apos;re reviewing your
            application and will get back to you within 24-48 hours.
          </p>
          <p className="text-sm text-[#9B9A97]">
            Once approved, you&apos;ll receive an email with instructions to start
            earning commissions.
          </p>
        </div>
      </div>
    )
  }

  // Show rejected/suspended message
  if (stats.influencer.status === "rejected" || stats.influencer.status === "suspended") {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-[#1A1A1A] rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Account {stats.influencer.status === "rejected" ? "Not Approved" : "Suspended"}
          </h1>
          <p className="text-[#9B9A97] mb-6">
            {stats.influencer.status === "rejected"
              ? "Unfortunately, your application wasn't approved at this time."
              : "Your affiliate account has been suspended."}
          </p>
          <p className="text-sm text-[#9B9A97]">
            If you have questions, please contact{" "}
            <a href="mailto:support@trackspeed.app" className="text-[#5C8DB8] hover:underline">
              support@trackspeed.app
            </a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">
          Welcome, {stats.influencer.name}
        </h1>
        <p className="text-[#9B9A97]">
          Track your referrals and earnings
        </p>
      </div>

      {/* Promo Code Card */}
      <div className="bg-[#1A1A1A] rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#9B9A97] mb-1">Your Promo Code</p>
            <p className="text-2xl font-bold text-white font-mono">
              {stats.influencer.code}
            </p>
            <p className="text-xs text-[#9B9A97] mt-1">
              Users get 30-day trial when they use your code
            </p>
          </div>
          <button
            onClick={copyCode}
            className="px-4 py-2 bg-[#5C8DB8] hover:bg-[#4A7A9E] text-white text-sm font-medium rounded-lg transition-colors"
          >
            {codeCopied ? "Copied!" : "Copy Code"}
          </button>
        </div>
      </div>

      {/* Free Access Card */}
      <div className="bg-[#1A1A1A] rounded-2xl p-6 mb-6 border border-[#5C8DB8]/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#9B9A97] mb-1">Your Free Access</p>
            <p className="text-2xl font-bold text-[#5C8DB8] font-mono">
              TRACKSPEED0106
            </p>
            <p className="text-xs text-[#9B9A97] mt-1">
              Enter this code in the app to get free Pro access
            </p>
          </div>
          <button
            onClick={copyFreeCode}
            className="px-4 py-2 bg-[#2B2E32] hover:bg-[#3D3D3D] text-white text-sm font-medium rounded-lg transition-colors border border-[#5C8DB8]/30"
          >
            {freeCodeCopied ? "Copied!" : "Copy Code"}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#1A1A1A] rounded-xl p-5">
          <p className="text-sm text-[#9B9A97] mb-1">Total Signups</p>
          <p className="text-3xl font-bold text-white">
            {stats.influencer.totalSignups}
          </p>
        </div>
        <div className="bg-[#1A1A1A] rounded-xl p-5">
          <p className="text-sm text-[#9B9A97] mb-1">Conversions</p>
          <p className="text-3xl font-bold text-white">
            {stats.influencer.totalConversions}
          </p>
        </div>
        <div className="bg-[#1A1A1A] rounded-xl p-5">
          <p className="text-sm text-[#9B9A97] mb-1">Total Earnings</p>
          <p className="text-3xl font-bold text-green-400">
            {formatCurrency(stats.earnings.totalCents)}
          </p>
        </div>
        <div className="bg-[#1A1A1A] rounded-xl p-5">
          <p className="text-sm text-[#9B9A97] mb-1">Pending Payout</p>
          <p className="text-3xl font-bold text-yellow-400">
            {formatCurrency(stats.earnings.pendingCents)}
          </p>
        </div>
      </div>

      {/* Stripe Connect Status */}
      {!stats.influencer.stripeConnected && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-5 mb-8">
          <div className="flex items-start gap-4">
            <div className="text-yellow-500">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium mb-1">
                Connect Stripe to receive payouts
              </h3>
              <p className="text-sm text-[#9B9A97] mb-3">
                You have {formatCurrency(stats.earnings.pendingCents)} in pending
                earnings. Connect your Stripe account to start receiving automatic
                payouts.
              </p>
              <Link
                href="/influencer/connect"
                className="inline-block px-4 py-2 bg-[#5C8DB8] hover:bg-[#4A7A9E] text-white text-sm font-medium rounded-lg transition-colors"
              >
                Connect Stripe
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Referrals */}
        <div className="bg-[#1A1A1A] rounded-xl p-5">
          <h2 className="text-lg font-semibold text-white mb-4">
            Recent Referrals
          </h2>
          {stats.referrals.length === 0 ? (
            <p className="text-[#9B9A97] text-sm">
              No referrals yet. Share your code to start earning!
            </p>
          ) : (
            <div className="space-y-3">
              {stats.referrals.slice(0, 10).map((referral) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between py-2 border-b border-[#2B2E32] last:border-0"
                >
                  <div>
                    <p className="text-sm text-white">
                      {formatDate(referral.createdAt)}
                    </p>
                    <p className="text-xs text-[#9B9A97]">
                      Trial expires {formatDate(referral.trialExpiresAt)}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      referral.status === "converted"
                        ? "bg-green-500/20 text-green-400"
                        : referral.status === "trial"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-[#3D3D3D] text-[#9B9A97]"
                    }`}
                  >
                    {referral.status === "converted"
                      ? "Converted"
                      : referral.status === "trial"
                      ? "In Trial"
                      : "Expired"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Commission History */}
        <div className="bg-[#1A1A1A] rounded-xl p-5">
          <h2 className="text-lg font-semibold text-white mb-4">
            Commission History
          </h2>
          {stats.commissions.length === 0 ? (
            <p className="text-[#9B9A97] text-sm">
              No commissions yet. You&apos;ll earn $10 for each yearly conversion!
            </p>
          ) : (
            <div className="space-y-3">
              {stats.commissions.slice(0, 10).map((commission) => (
                <div
                  key={commission.id}
                  className="flex items-center justify-between py-2 border-b border-[#2B2E32] last:border-0"
                >
                  <div>
                    <p className="text-sm text-white">
                      {formatCurrency(commission.commissionCents)}
                    </p>
                    <p className="text-xs text-[#9B9A97]">
                      {formatDate(commission.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      commission.status === "transferred"
                        ? "bg-green-500/20 text-green-400"
                        : commission.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : commission.status === "clawback"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-[#3D3D3D] text-[#9B9A97]"
                    }`}
                  >
                    {commission.status === "transferred"
                      ? "Paid"
                      : commission.status === "pending"
                      ? "Pending"
                      : commission.status === "clawback"
                      ? "Refunded"
                      : "Failed"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* How It Works */}
      <div className="mt-8 bg-[#1A1A1A] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-10 h-10 bg-[#5C8DB8]/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-[#5C8DB8] font-bold">1</span>
            </div>
            <h3 className="text-white font-medium mb-1">Share Your Code</h3>
            <p className="text-sm text-[#9B9A97]">
              Share {stats.influencer.code} with your audience
            </p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-[#5C8DB8]/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-[#5C8DB8] font-bold">2</span>
            </div>
            <h3 className="text-white font-medium mb-1">Users Get 30-Day Trial</h3>
            <p className="text-sm text-[#9B9A97]">
              Extended trial (vs 7-day) with full Pro features
            </p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-[#5C8DB8]/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-[#5C8DB8] font-bold">3</span>
            </div>
            <h3 className="text-white font-medium mb-1">Earn $10 per Conversion</h3>
            <p className="text-sm text-[#9B9A97]">
              20% commission on yearly subscriptions
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
