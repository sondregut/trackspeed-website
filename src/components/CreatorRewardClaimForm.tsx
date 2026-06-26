"use client"

import { useMemo, useState } from "react"

interface CreatorRewardClaimFormProps {
  initialAppUserId?: string
  initialEmail?: string
  initialUsername?: string
}

interface ClaimStatus {
  claim_id: string
  status: string
  social_platform: string
  post_url: string
  submitted_view_count: number | null
  verified_view_count: number | null
  reward_percentage: number | null
  reward_amount: number | null
  reward_currency: string | null
  rejection_reason: string | null
  paid_at: string | null
  created_at: string
  updated_at: string
}

const statusLabels: Record<string, string> = {
  pending: "Pending review",
  needs_more_info: "Needs more info",
  approved_50: "Approved for 50%",
  approved_100: "Approved for 100%",
  rejected: "Rejected",
  paid: "Paid",
}

export default function CreatorRewardClaimForm({
  initialAppUserId = "",
  initialEmail = "",
  initialUsername = "",
}: CreatorRewardClaimFormProps) {
  const [country, setCountry] = useState("")
  const [payoutMethod, setPayoutMethod] = useState("paypal")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [submitResult, setSubmitResult] = useState<{ claim_id: string; status: string } | null>(null)
  const [claimLookup, setClaimLookup] = useState("")
  const [statusError, setStatusError] = useState("")
  const [statusResult, setStatusResult] = useState<ClaimStatus | null>(null)
  const [isCheckingStatus, setIsCheckingStatus] = useState(false)

  const isUs = useMemo(() => {
    const normalized = country.trim().toLowerCase()
    return ["us", "usa", "u.s.", "u.s.a.", "united states", "united states of america"].includes(normalized)
  }, [country])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitError("")
    setSubmitResult(null)

    const formData = new FormData(event.currentTarget)

    try {
      const response = await fetch("/api/creator-rewards/submit", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Could not submit creator reward claim.")
      }

      setSubmitResult({ claim_id: data.claim_id, status: data.status })
      setClaimLookup(data.claim_id)
      event.currentTarget.reset()
      setCountry("")
      setPayoutMethod("paypal")
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not submit creator reward claim.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleStatusLookup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsCheckingStatus(true)
    setStatusError("")
    setStatusResult(null)

    try {
      const response = await fetch(`/api/creator-rewards/status?claim_id=${encodeURIComponent(claimLookup.trim())}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Could not load claim status.")
      }

      setStatusResult(data)
    } catch (error) {
      setStatusError(error instanceof Error ? error.message : "Could not load claim status.")
    } finally {
      setIsCheckingStatus(false)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.78fr]">
      <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">Submit your post</h2>
          <p className="mt-2 text-sm text-muted">
            We use your email and contact details to match your Track Speed purchase, then review the post manually.
          </p>
        </div>

        <input type="hidden" name="account" value={initialAppUserId} />

        {submitError && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        )}

        {submitResult && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            Claim submitted. Your claim ID is{" "}
            <span className="font-mono font-semibold">{submitResult.claim_id}</span>.
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-foreground">Email</span>
            <input
              name="email"
              type="email"
              required
              defaultValue={initialEmail}
              autoComplete="email"
              className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#5C8DB8] focus:ring-2 focus:ring-[#5C8DB8]/20"
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-foreground">Name or username</span>
            <input
              name="username"
              type="text"
              defaultValue={initialUsername}
              autoComplete="name"
              className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#5C8DB8] focus:ring-2 focus:ring-[#5C8DB8]/20"
              placeholder="Optional"
              spellCheck={false}
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-foreground">Phone number</span>
            <input
              name="phone_number"
              type="tel"
              autoComplete="tel"
              className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#5C8DB8] focus:ring-2 focus:ring-[#5C8DB8]/20"
              placeholder="Optional"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-foreground">Platform</span>
            <select
              name="social_platform"
              required
              className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#5C8DB8] focus:ring-2 focus:ring-[#5C8DB8]/20"
            >
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram Reel</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-foreground">Submitted view count</span>
            <input
              name="submitted_view_count"
              type="number"
              min="0"
              inputMode="numeric"
              className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#5C8DB8] focus:ring-2 focus:ring-[#5C8DB8]/20"
              placeholder="Optional"
            />
          </label>
        </div>

        <label className="mt-4 block">
          <span className="text-sm font-semibold text-foreground">Post URL</span>
          <input
            name="post_url"
            type="url"
            required
            className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#5C8DB8] focus:ring-2 focus:ring-[#5C8DB8]/20"
            placeholder="https://www.tiktok.com/@.../video/..."
            spellCheck={false}
          />
        </label>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="text-sm font-semibold text-foreground">Country</span>
            <input
              name="country"
              type="text"
              required
              value={country}
              onChange={(event) => {
                const nextCountry = event.target.value
                const normalized = nextCountry.trim().toLowerCase()
                const nextIsUs = ["us", "usa", "u.s.", "u.s.a.", "united states", "united states of america"].includes(normalized)
                setCountry(nextCountry)
                if (!nextIsUs && payoutMethod !== "paypal") setPayoutMethod("paypal")
              }}
              className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#5C8DB8] focus:ring-2 focus:ring-[#5C8DB8]/20"
              placeholder="US, Norway, Canada..."
              autoComplete="country-name"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-foreground">Payout method</span>
            <select
              name="payout_method"
              value={payoutMethod}
              onChange={(event) => setPayoutMethod(event.target.value)}
              className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#5C8DB8] focus:ring-2 focus:ring-[#5C8DB8]/20"
            >
              <option value="paypal">PayPal</option>
              <option value="venmo" disabled={!isUs}>Venmo (US only)</option>
              <option value="cashapp" disabled={!isUs}>Cash App (US only)</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-foreground">Payout handle or email</span>
            <input
              name="payout_handle_or_email"
              type="text"
              required
              className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#5C8DB8] focus:ring-2 focus:ring-[#5C8DB8]/20"
              placeholder={
                payoutMethod === "paypal"
                  ? "PayPal email"
                  : payoutMethod === "venmo"
                    ? "@venmo"
                    : "$cashtag"
              }
              autoComplete="off"
              spellCheck={false}
            />
          </label>
        </div>

        <label className="mt-4 block">
          <span className="text-sm font-semibold text-foreground">Analytics screenshot</span>
          <input
            name="screenshot"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="mt-2 block w-full rounded-lg border border-dashed border-border bg-white px-3 py-3 text-sm text-muted file:mr-3 file:rounded-md file:border-0 file:bg-[#0E0E0C] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
          />
          <span className="mt-2 block text-xs text-muted">Optional. JPEG, PNG, or WebP up to 5 MB.</span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-[#0E0E0C] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1F2937] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isSubmitting ? "Submitting..." : "Submit your post"}
        </button>
      </form>

      <aside className="space-y-6">
        <div className="rounded-2xl border border-border bg-[#F7FBF8] p-5 sm:p-6">
          <h2 className="text-xl font-bold text-foreground">Check reward status</h2>
          <p className="mt-2 text-sm text-muted">
            Enter the claim ID you receive after submitting.
          </p>
          <form onSubmit={handleStatusLookup} className="mt-4 flex flex-col gap-3 sm:flex-row lg:flex-col">
            <input
              type="text"
              value={claimLookup}
              onChange={(event) => setClaimLookup(event.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-border bg-white px-3 py-2.5 font-mono text-sm outline-none transition focus:border-[#5C8DB8] focus:ring-2 focus:ring-[#5C8DB8]/20"
              placeholder="cr_..."
              spellCheck={false}
            />
            <button
              type="submit"
              disabled={isCheckingStatus}
              className="rounded-lg border border-[#0E0E0C] px-4 py-2.5 text-sm font-semibold text-[#0E0E0C] transition hover:bg-[#0E0E0C] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCheckingStatus ? "Checking..." : "Check status"}
            </button>
          </form>

          {statusError && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {statusError}
            </div>
          )}

          {statusResult && (
            <div className="mt-4 rounded-lg bg-white p-4 text-sm shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs text-muted">{statusResult.claim_id}</span>
                <span className="rounded-full bg-[#5C8DB8]/10 px-2.5 py-1 text-xs font-semibold text-[#325F85]">
                  {statusLabels[statusResult.status] ?? statusResult.status}
                </span>
              </div>
              <dl className="mt-4 space-y-2 text-muted">
                <div className="flex justify-between gap-4">
                  <dt>Verified views</dt>
                  <dd className="font-medium text-foreground">
                    {statusResult.verified_view_count?.toLocaleString() ?? "Not reviewed yet"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Reward</dt>
                  <dd className="font-medium text-foreground">
                    {statusResult.reward_amount != null
                      ? `${statusResult.reward_amount} ${statusResult.reward_currency ?? ""}`
                      : "Pending"}
                  </dd>
                </div>
                {statusResult.rejection_reason && (
                  <div>
                    <dt>Reason</dt>
                    <dd className="mt-1 text-foreground">{statusResult.rejection_reason}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 sm:p-6">
          <h2 className="text-xl font-bold text-foreground">Payout methods</h2>
          <p className="mt-2 text-sm text-muted">
            PayPal is available globally. Venmo and Cash App are optional US-only methods.
          </p>
          <p className="mt-4 text-xs leading-5 text-muted">
            Rewards are paid manually after approval. This program does not process or replace App Store refunds.
          </p>
        </div>
      </aside>
    </div>
  )
}
