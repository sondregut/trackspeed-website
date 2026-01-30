"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

interface StripeStatus {
  connected: boolean
  accountId?: string
  detailsSubmitted?: boolean
  payoutsEnabled?: boolean
  error?: string
}

function StripeConnectContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<StripeStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState("")

  const success = searchParams.get("success") === "true"
  const refresh = searchParams.get("refresh") === "true"

  const checkStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/influencer/stripe-connect")

      if (response.status === 401) {
        router.push("/influencer/login")
        return
      }

      const data = await response.json()
      setStatus(data)
    } catch (err) {
      setError("Failed to check Stripe status")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  useEffect(() => {
    checkStatus()
  }, [checkStatus])

  // If returning from Stripe with success, refresh status
  useEffect(() => {
    if (success) {
      checkStatus()
    }
  }, [success, checkStatus])

  const handleConnect = async () => {
    setIsConnecting(true)
    setError("")

    try {
      const response = await fetch("/api/influencer/stripe-connect", {
        method: "POST",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create Stripe account")
      }

      const data = await response.json()
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect Stripe")
      setIsConnecting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5C8DB8]"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link
        href="/influencer/dashboard"
        className="inline-flex items-center text-[#9B9A97] hover:text-white mb-6"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold text-white mb-2">Payout Settings</h1>
      <p className="text-[#9B9A97] mb-8">
        Connect your Stripe account to receive automatic payouts
      </p>

      {/* Success Message */}
      {success && status?.connected && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="text-green-400">
              Stripe account connected successfully! You&apos;ll now receive automatic
              payouts.
            </p>
          </div>
        </div>
      )}

      {/* Refresh Message */}
      {refresh && (
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-yellow-400">
            Please complete the Stripe onboarding process to receive payouts.
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Status Card */}
      <div className="bg-[#1A1A1A] rounded-xl p-6">
        {status?.connected ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Stripe Connected
                </h2>
                <p className="text-sm text-[#9B9A97]">
                  Your payouts are set up and ready
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#2B2E32] rounded-lg mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#9B9A97]">Account ID</span>
                <span className="text-sm text-white font-mono">
                  {status.accountId}
                </span>
              </div>
            </div>

            <p className="text-sm text-[#9B9A97]">
              Commissions are automatically transferred to your connected bank
              account when a referred user subscribes to a yearly plan.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#5C8DB8]/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-[#5C8DB8]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Connect Stripe
                </h2>
                <p className="text-sm text-[#9B9A97]">
                  Set up automatic payouts for your earnings
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-[#5C8DB8] mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p className="text-sm text-[#9B9A97]">
                  Secure payments powered by Stripe
                </p>
              </div>
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-[#5C8DB8] mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p className="text-sm text-[#9B9A97]">
                  Automatic transfers when commissions are earned
                </p>
              </div>
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-[#5C8DB8] mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p className="text-sm text-[#9B9A97]">
                  No fees for receiving payouts
                </p>
              </div>
            </div>

            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full py-3 bg-[#5C8DB8] hover:bg-[#4A7A9E] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnecting ? "Connecting..." : "Connect with Stripe"}
            </button>
          </div>
        )}
      </div>

      {/* FAQ */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white mb-4">
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          <div className="bg-[#1A1A1A] rounded-lg p-4">
            <h4 className="text-white font-medium mb-1">
              When do I get paid?
            </h4>
            <p className="text-sm text-[#9B9A97]">
              Commissions are transferred automatically when a referred user
              subscribes to a yearly plan. Stripe typically deposits funds within
              2-3 business days.
            </p>
          </div>
          <div className="bg-[#1A1A1A] rounded-lg p-4">
            <h4 className="text-white font-medium mb-1">
              What about refunds?
            </h4>
            <p className="text-sm text-[#9B9A97]">
              If a user requests a refund within 60 days, the commission will be
              deducted from future earnings (not clawed back from already-transferred
              funds).
            </p>
          </div>
          <div className="bg-[#1A1A1A] rounded-lg p-4">
            <h4 className="text-white font-medium mb-1">
              How much do I earn?
            </h4>
            <p className="text-sm text-[#9B9A97]">
              You earn 20% commission (~$10) on yearly subscriptions. Monthly
              subscriptions don&apos;t generate commissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function InfluencerConnectPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5C8DB8]"></div>
        </div>
      }
    >
      <StripeConnectContent />
    </Suspense>
  )
}
