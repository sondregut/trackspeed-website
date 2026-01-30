"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

interface Influencer {
  id: string
  email: string
  name: string
  code: string
  social_links: Record<string, string>
  application_note: string | null
  stripe_account_id: string | null
  stripe_onboarding_complete: boolean
  status: "pending" | "approved" | "rejected" | "suspended"
  status_reason: string | null
  approved_at: string | null
  total_signups: number
  total_conversions: number
  total_earnings_cents: number
  created_at: string
}

export default function AdminInfluencersPage() {
  const router = useRouter()
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(
    null
  )
  const [actionLoading, setActionLoading] = useState(false)
  const [statusReason, setStatusReason] = useState("")

  const fetchInfluencers = useCallback(async () => {
    try {
      const url =
        statusFilter === "all"
          ? "/api/admin/influencers"
          : `/api/admin/influencers?status=${statusFilter}`

      const response = await fetch(url)

      if (response.status === 401) {
        router.push("/admin/login")
        return
      }

      if (!response.ok) {
        throw new Error("Failed to fetch influencers")
      }

      const data = await response.json()
      setInfluencers(data.influencers)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load influencers")
    } finally {
      setIsLoading(false)
    }
  }, [statusFilter, router])

  useEffect(() => {
    fetchInfluencers()
  }, [fetchInfluencers])

  const updateStatus = async (
    id: string,
    status: "approved" | "rejected" | "suspended"
  ) => {
    setActionLoading(true)
    try {
      const response = await fetch("/api/admin/influencers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status,
          statusReason: statusReason || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update status")
      }

      setSelectedInfluencer(null)
      setStatusReason("")
      fetchInfluencers()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update")
    } finally {
      setActionLoading(false)
    }
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

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-500/20 text-yellow-400",
      approved: "bg-green-500/20 text-green-400",
      rejected: "bg-red-500/20 text-red-400",
      suspended: "bg-orange-500/20 text-orange-400",
    }
    return styles[status] || "bg-[#3D3D3D] text-[#9B9A97]"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5C8DB8]"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Influencer Management</h1>
          <p className="text-[#9B9A97]">
            Review applications and manage affiliate accounts
          </p>
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-[#2B2E32] border border-[#3D3D3D] rounded-lg text-white focus:outline-none focus:border-[#5C8DB8]"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1A1A1A] rounded-xl p-4">
          <p className="text-sm text-[#9B9A97]">Total</p>
          <p className="text-2xl font-bold text-white">{influencers.length}</p>
        </div>
        <div className="bg-[#1A1A1A] rounded-xl p-4">
          <p className="text-sm text-[#9B9A97]">Pending</p>
          <p className="text-2xl font-bold text-yellow-400">
            {influencers.filter((i) => i.status === "pending").length}
          </p>
        </div>
        <div className="bg-[#1A1A1A] rounded-xl p-4">
          <p className="text-sm text-[#9B9A97]">Approved</p>
          <p className="text-2xl font-bold text-green-400">
            {influencers.filter((i) => i.status === "approved").length}
          </p>
        </div>
        <div className="bg-[#1A1A1A] rounded-xl p-4">
          <p className="text-sm text-[#9B9A97]">Total Paid Out</p>
          <p className="text-2xl font-bold text-[#5C8DB8]">
            {formatCurrency(
              influencers.reduce((sum, i) => sum + i.total_earnings_cents, 0)
            )}
          </p>
        </div>
      </div>

      {/* Influencers Table */}
      <div className="bg-[#1A1A1A] rounded-xl overflow-hidden">
        {influencers.length === 0 ? (
          <div className="p-8 text-center text-[#9B9A97]">
            No influencers found
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#3D3D3D]">
                <th className="px-4 py-3 text-left text-sm font-medium text-[#9B9A97]">
                  Influencer
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#9B9A97]">
                  Code
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#9B9A97]">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#9B9A97]">
                  Signups
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#9B9A97]">
                  Conversions
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#9B9A97]">
                  Earnings
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#9B9A97]">
                  Applied
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-[#9B9A97]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {influencers.map((influencer) => (
                <tr
                  key={influencer.id}
                  className="border-b border-[#2B2E32] hover:bg-[#2B2E32]/50"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-white font-medium">{influencer.name}</p>
                      <p className="text-sm text-[#9B9A97]">{influencer.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[#5C8DB8]">
                      {influencer.code}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(
                        influencer.status
                      )}`}
                    >
                      {influencer.status.charAt(0).toUpperCase() +
                        influencer.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white">
                    {influencer.total_signups}
                  </td>
                  <td className="px-4 py-3 text-white">
                    {influencer.total_conversions}
                  </td>
                  <td className="px-4 py-3 text-green-400">
                    {formatCurrency(influencer.total_earnings_cents)}
                  </td>
                  <td className="px-4 py-3 text-[#9B9A97] text-sm">
                    {formatDate(influencer.created_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelectedInfluencer(influencer)}
                      className="text-[#5C8DB8] hover:underline text-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Influencer Detail Modal */}
      {selectedInfluencer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-[#1A1A1A] rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {selectedInfluencer.name}
              </h2>
              <button
                onClick={() => {
                  setSelectedInfluencer(null)
                  setStatusReason("")
                }}
                className="text-[#9B9A97] hover:text-white"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#9B9A97]">Email</p>
                <p className="text-white">{selectedInfluencer.email}</p>
              </div>

              <div>
                <p className="text-sm text-[#9B9A97]">Promo Code</p>
                <p className="text-[#5C8DB8] font-mono">
                  {selectedInfluencer.code}
                </p>
              </div>

              <div>
                <p className="text-sm text-[#9B9A97]">Status</p>
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusBadge(
                    selectedInfluencer.status
                  )}`}
                >
                  {selectedInfluencer.status.charAt(0).toUpperCase() +
                    selectedInfluencer.status.slice(1)}
                </span>
                {selectedInfluencer.status_reason && (
                  <p className="text-sm text-[#9B9A97] mt-1">
                    Reason: {selectedInfluencer.status_reason}
                  </p>
                )}
              </div>

              {Object.keys(selectedInfluencer.social_links).length > 0 && (
                <div>
                  <p className="text-sm text-[#9B9A97] mb-2">Social Links</p>
                  <div className="space-y-1">
                    {Object.entries(selectedInfluencer.social_links).map(
                      ([platform, handle]) => (
                        <p key={platform} className="text-white text-sm">
                          <span className="text-[#9B9A97] capitalize">
                            {platform}:
                          </span>{" "}
                          {handle}
                        </p>
                      )
                    )}
                  </div>
                </div>
              )}

              {selectedInfluencer.application_note && (
                <div>
                  <p className="text-sm text-[#9B9A97] mb-1">Application Note</p>
                  <p className="text-white text-sm bg-[#2B2E32] rounded p-3">
                    {selectedInfluencer.application_note}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 py-4 border-t border-[#3D3D3D]">
                <div>
                  <p className="text-sm text-[#9B9A97]">Signups</p>
                  <p className="text-xl font-bold text-white">
                    {selectedInfluencer.total_signups}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#9B9A97]">Conversions</p>
                  <p className="text-xl font-bold text-white">
                    {selectedInfluencer.total_conversions}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#9B9A97]">Earnings</p>
                  <p className="text-xl font-bold text-green-400">
                    {formatCurrency(selectedInfluencer.total_earnings_cents)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-[#9B9A97]">Stripe Connected</p>
                <p className="text-white">
                  {selectedInfluencer.stripe_onboarding_complete ? "Yes" : "No"}
                </p>
              </div>

              {/* Status Change Actions */}
              {selectedInfluencer.status === "pending" && (
                <div className="pt-4 border-t border-[#3D3D3D]">
                  <p className="text-sm text-[#9B9A97] mb-2">Review Application</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(selectedInfluencer.id, "approved")}
                      disabled={actionLoading}
                      className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      {actionLoading ? "..." : "Approve"}
                    </button>
                    <button
                      onClick={() => updateStatus(selectedInfluencer.id, "rejected")}
                      disabled={actionLoading}
                      className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      {actionLoading ? "..." : "Reject"}
                    </button>
                  </div>
                </div>
              )}

              {selectedInfluencer.status === "approved" && (
                <div className="pt-4 border-t border-[#3D3D3D]">
                  <p className="text-sm text-[#9B9A97] mb-2">Suspend Account</p>
                  <input
                    type="text"
                    value={statusReason}
                    onChange={(e) => setStatusReason(e.target.value)}
                    placeholder="Reason for suspension (optional)"
                    className="w-full px-3 py-2 bg-[#2B2E32] border border-[#3D3D3D] rounded-lg text-white text-sm mb-2 focus:outline-none focus:border-[#5C8DB8]"
                  />
                  <button
                    onClick={() => updateStatus(selectedInfluencer.id, "suspended")}
                    disabled={actionLoading}
                    className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? "..." : "Suspend"}
                  </button>
                </div>
              )}

              {selectedInfluencer.status === "suspended" && (
                <div className="pt-4 border-t border-[#3D3D3D]">
                  <button
                    onClick={() => updateStatus(selectedInfluencer.id, "approved")}
                    disabled={actionLoading}
                    className="w-full py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? "..." : "Reactivate Account"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
