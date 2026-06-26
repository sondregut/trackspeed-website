"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

interface CreatorRewardSubmission {
  id: string
  email: string
  username: string | null
  phone_number: string | null
  revenuecat_app_user_id: string
  revenuecat_product_id: string
  revenuecat_original_transaction_id: string | null
  purchase_price: number
  purchase_currency: string
  entitlement_id: string
  social_platform: "tiktok" | "instagram"
  post_url: string
  submitted_view_count: number | null
  verified_view_count: number | null
  screenshot_url: string | null
  screenshot_signed_url: string | null
  country: string
  payout_method: "paypal" | "venmo" | "cashapp"
  payout_handle_or_email: string
  claim_id: string
  status: "pending" | "needs_more_info" | "approved_50" | "approved_100" | "rejected" | "paid"
  reward_percentage: number | null
  reward_amount: number | null
  reward_currency: string | null
  admin_notes: string | null
  rejection_reason: string | null
  paid_at: string | null
  created_at: string
  updated_at: string
}

const statuses = [
  "all",
  "pending",
  "needs_more_info",
  "approved_50",
  "approved_100",
  "rejected",
  "paid",
]

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-300",
  needs_more_info: "bg-blue-500/20 text-blue-300",
  approved_50: "bg-green-500/20 text-green-300",
  approved_100: "bg-emerald-500/20 text-emerald-300",
  rejected: "bg-red-500/20 text-red-300",
  paid: "bg-[#5C8DB8]/20 text-[#8EC5F3]",
}

function formatCurrency(amount: number | null, currency: string | null) {
  if (amount == null) return "Pending"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(amount)
}

function formatDate(value: string | null) {
  if (!value) return "-"
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function AdminCreatorRewardsPage() {
  const router = useRouter()
  const [submissions, setSubmissions] = useState<CreatorRewardSubmission[]>([])
  const [selected, setSelected] = useState<CreatorRewardSubmission | null>(null)
  const [statusFilter, setStatusFilter] = useState("pending")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    status: "pending",
    verified_view_count: "",
    reward_percentage: "",
    reward_amount: "",
    reward_currency: "",
    admin_notes: "",
    rejection_reason: "",
  })

  const fetchSubmissions = useCallback(async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/admin/creator-rewards?status=${encodeURIComponent(statusFilter)}`)
      if (response.status === 401) {
        router.push("/admin/login")
        return
      }
      if (!response.ok) throw new Error("Failed to load creator reward submissions")
      const data = await response.json()
      setSubmissions(data.submissions)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load creator reward submissions")
    } finally {
      setIsLoading(false)
    }
  }, [router, statusFilter])

  useEffect(() => {
    fetchSubmissions()
  }, [fetchSubmissions])

  useEffect(() => {
    if (!selected) return
    setForm({
      status: selected.status,
      verified_view_count: selected.verified_view_count?.toString() ?? "",
      reward_percentage: selected.reward_percentage?.toString() ?? "",
      reward_amount: selected.reward_amount?.toString() ?? "",
      reward_currency: selected.reward_currency ?? selected.purchase_currency,
      admin_notes: selected.admin_notes ?? "",
      rejection_reason: selected.rejection_reason ?? "",
    })
  }, [selected])

  const stats = useMemo(() => {
    return {
      total: submissions.length,
      pending: submissions.filter((submission) => submission.status === "pending").length,
      approved: submissions.filter((submission) => submission.status === "approved_50" || submission.status === "approved_100").length,
      paid: submissions.filter((submission) => submission.status === "paid").length,
    }
  }, [submissions])

  async function saveSelected() {
    if (!selected) return
    setIsSaving(true)
    setError("")

    try {
      const payload = {
        status: form.status,
        verified_view_count: form.verified_view_count || null,
        reward_percentage: form.reward_percentage || null,
        reward_amount: form.reward_amount || null,
        reward_currency: form.reward_currency || null,
        admin_notes: form.admin_notes || null,
        rejection_reason: form.rejection_reason || null,
      }

      const response = await fetch(`/api/admin/creator-rewards/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to save submission")

      setSelected(null)
      await fetchSubmissions()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save submission")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Creator Rewards</h1>
          <p className="text-sm text-[#9B9A97]">Review social posts and track manual payouts.</p>
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="self-start rounded-lg border border-[#3D3D3D] bg-[#2B2E32] px-4 py-2 text-white focus:outline-none focus:border-[#5C8DB8]"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status === "all" ? "All Status" : status.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-xl bg-[#1A1A1A] p-4">
          <p className="text-sm text-[#9B9A97]">Loaded</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="rounded-xl bg-[#1A1A1A] p-4">
          <p className="text-sm text-[#9B9A97]">Pending</p>
          <p className="text-2xl font-bold text-yellow-300">{stats.pending}</p>
        </div>
        <div className="rounded-xl bg-[#1A1A1A] p-4">
          <p className="text-sm text-[#9B9A97]">Approved</p>
          <p className="text-2xl font-bold text-green-300">{stats.approved}</p>
        </div>
        <div className="rounded-xl bg-[#1A1A1A] p-4">
          <p className="text-sm text-[#9B9A97]">Paid</p>
          <p className="text-2xl font-bold text-[#8EC5F3]">{stats.paid}</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl bg-[#1A1A1A]">
        {isLoading ? (
          <div className="p-8 text-center text-[#9B9A97]">Loading...</div>
        ) : submissions.length === 0 ? (
          <div className="p-8 text-center text-[#9B9A97]">No creator reward submissions found.</div>
        ) : (
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-[#3D3D3D]">
                <th className="px-4 py-3 text-left text-sm font-medium text-[#9B9A97]">Claim</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#9B9A97]">User</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#9B9A97]">Post</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#9B9A97]">Views</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#9B9A97]">Purchase</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#9B9A97]">Reward</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#9B9A97]">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-[#9B9A97]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.id} className="border-b border-[#2B2E32] hover:bg-[#2B2E32]/50">
                  <td className="px-4 py-3">
                    <p className="font-mono text-sm text-white">{submission.claim_id}</p>
                    <p className="text-xs text-[#9B9A97]">{formatDate(submission.created_at)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-white">{submission.email}</p>
                    {submission.username && (
                      <p className="max-w-[220px] truncate text-xs text-[#9B9A97]">{submission.username}</p>
                    )}
                    {submission.phone_number && (
                      <p className="max-w-[220px] truncate text-xs text-[#9B9A97]">{submission.phone_number}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={submission.post_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-[#8EC5F3] hover:underline"
                    >
                      {submission.social_platform}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-sm text-white">
                    {submission.verified_view_count?.toLocaleString() ??
                      submission.submitted_view_count?.toLocaleString() ??
                      "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-white">
                    {formatCurrency(Number(submission.purchase_price), submission.purchase_currency)}
                  </td>
                  <td className="px-4 py-3 text-sm text-white">
                    {formatCurrency(submission.reward_amount, submission.reward_currency)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded px-2 py-1 text-xs font-semibold ${statusStyles[submission.status]}`}>
                      {submission.status.replaceAll("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelected(submission)}
                      className="text-sm text-[#8EC5F3] hover:underline"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-6">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl bg-[#1A1A1A] p-5 sm:rounded-2xl sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">{selected.claim_id}</h2>
                <p className="text-sm text-[#9B9A97]">{selected.email}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg px-2 py-1 text-[#9B9A97] hover:bg-[#2B2E32] hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-[#9B9A97]">Contact</p>
                  <p className="break-all text-white">{selected.email}</p>
                  {selected.username && <p className="text-[#9B9A97]">{selected.username}</p>}
                  {selected.phone_number && <p className="text-[#9B9A97]">{selected.phone_number}</p>}
                </div>
                <div>
                  <p className="text-[#9B9A97]">Post URL</p>
                  <a href={selected.post_url} target="_blank" rel="noreferrer" className="break-all text-[#8EC5F3] hover:underline">
                    {selected.post_url}
                  </a>
                </div>
                <div>
                  <p className="text-[#9B9A97]">RevenueCat</p>
                  <p className="break-all font-mono text-white">{selected.revenuecat_app_user_id}</p>
                  <p className="mt-1 text-[#9B9A97]">{selected.revenuecat_product_id}</p>
                  {selected.revenuecat_original_transaction_id && (
                    <p className="mt-1 break-all font-mono text-xs text-[#9B9A97]">
                      {selected.revenuecat_original_transaction_id}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-[#9B9A97]">Purchase</p>
                  <p className="text-white">{formatCurrency(Number(selected.purchase_price), selected.purchase_currency)}</p>
                </div>
                <div>
                  <p className="text-[#9B9A97]">Payout</p>
                  <p className="text-white">
                    {selected.payout_method.toUpperCase()} · {selected.payout_handle_or_email}
                  </p>
                  <p className="text-[#9B9A97]">{selected.country}</p>
                </div>
                {selected.screenshot_signed_url && (
                  <a
                    href={selected.screenshot_signed_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-lg border border-[#3D3D3D] px-3 py-2 text-sm font-medium text-[#8EC5F3] hover:bg-[#2B2E32]"
                  >
                    Open screenshot
                  </a>
                )}
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-[#9B9A97]">Status</span>
                  <select
                    value={form.status}
                    onChange={(event) => setForm({ ...form, status: event.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#3D3D3D] bg-[#2B2E32] px-3 py-2 text-white focus:outline-none focus:border-[#5C8DB8]"
                  >
                    {statuses.filter((status) => status !== "all").map((status) => (
                      <option key={status} value={status}>{status.replaceAll("_", " ")}</option>
                    ))}
                  </select>
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-sm font-medium text-[#9B9A97]">Verified views</span>
                    <input
                      type="number"
                      min="0"
                      value={form.verified_view_count}
                      onChange={(event) => setForm({ ...form, verified_view_count: event.target.value })}
                      className="mt-1 w-full rounded-lg border border-[#3D3D3D] bg-[#2B2E32] px-3 py-2 text-white focus:outline-none focus:border-[#5C8DB8]"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-[#9B9A97]">Reward %</span>
                    <select
                      value={form.reward_percentage}
                      onChange={(event) => setForm({ ...form, reward_percentage: event.target.value })}
                      className="mt-1 w-full rounded-lg border border-[#3D3D3D] bg-[#2B2E32] px-3 py-2 text-white focus:outline-none focus:border-[#5C8DB8]"
                    >
                      <option value="">Auto</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </label>
                </div>

                <div className="grid grid-cols-[1fr_90px] gap-3">
                  <label className="block">
                    <span className="text-sm font-medium text-[#9B9A97]">Reward amount</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.reward_amount}
                      onChange={(event) => setForm({ ...form, reward_amount: event.target.value })}
                      className="mt-1 w-full rounded-lg border border-[#3D3D3D] bg-[#2B2E32] px-3 py-2 text-white focus:outline-none focus:border-[#5C8DB8]"
                      placeholder="Auto"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-[#9B9A97]">Currency</span>
                    <input
                      type="text"
                      value={form.reward_currency}
                      onChange={(event) => setForm({ ...form, reward_currency: event.target.value })}
                      className="mt-1 w-full rounded-lg border border-[#3D3D3D] bg-[#2B2E32] px-3 py-2 text-white focus:outline-none focus:border-[#5C8DB8]"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-sm font-medium text-[#9B9A97]">Rejection reason</span>
                  <input
                    type="text"
                    value={form.rejection_reason}
                    onChange={(event) => setForm({ ...form, rejection_reason: event.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#3D3D3D] bg-[#2B2E32] px-3 py-2 text-white focus:outline-none focus:border-[#5C8DB8]"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-[#9B9A97]">Internal notes</span>
                  <textarea
                    value={form.admin_notes}
                    onChange={(event) => setForm({ ...form, admin_notes: event.target.value })}
                    rows={4}
                    className="mt-1 w-full rounded-lg border border-[#3D3D3D] bg-[#2B2E32] px-3 py-2 text-white focus:outline-none focus:border-[#5C8DB8]"
                  />
                </label>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setForm({ ...form, status: "approved_50", reward_percentage: "50" })}
                className="rounded-lg border border-[#3D3D3D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2B2E32]"
              >
                Approve 50%
              </button>
              <button
                onClick={() => setForm({ ...form, status: "approved_100", reward_percentage: "100" })}
                className="rounded-lg border border-[#3D3D3D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2B2E32]"
              >
                Approve 100%
              </button>
              <button
                onClick={() => setForm({ ...form, status: "paid" })}
                className="rounded-lg border border-[#5C8DB8] bg-[#5C8DB8] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4A7AA3]"
              >
                Mark paid
              </button>
              <button
                onClick={saveSelected}
                disabled={isSaving}
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#0E0E0C] hover:bg-white/90 disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
