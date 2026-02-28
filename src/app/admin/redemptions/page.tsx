"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import type { PromoRedemption } from "@/lib/supabase";

export default function RedemptionsPage() {
  const [redemptions, setRedemptions] = useState<PromoRedemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterCode, setFilterCode] = useState<string>("all");

  useEffect(() => {
    async function fetchRedemptions() {
      try {
        const res = await fetch("/api/admin/redemptions");
        if (!res.ok) throw new Error("Failed to fetch redemptions");
        const data = await res.json();
        setRedemptions(data);
      } catch {
        setError("Failed to load redemptions");
      } finally {
        setLoading(false);
      }
    }

    fetchRedemptions();
  }, []);

  // Compute stats
  const stats = useMemo(() => {
    const uniqueCodes = new Set(redemptions.map((r) => r.promo_codes?.code).filter(Boolean));
    const uniqueDevices = new Set(redemptions.map((r) => r.device_id));
    const activeRedemptions = redemptions.filter((r) => {
      if (!r.pro_expires_at) return true; // Forever
      const expires = new Date(r.pro_expires_at);
      // Date.distantPast check — trial codes set this to year 0001
      if (expires.getFullYear() < 2000) return false;
      return expires > new Date();
    });

    // Per-code breakdown
    const codeCounts: Record<string, number> = {};
    for (const r of redemptions) {
      const code = r.promo_codes?.code || "Unknown";
      codeCounts[code] = (codeCounts[code] || 0) + 1;
    }

    return {
      total: redemptions.length,
      uniqueCodes: uniqueCodes.size,
      uniqueDevices: uniqueDevices.size,
      activeProUsers: activeRedemptions.length,
      codeCounts,
    };
  }, [redemptions]);

  // Filter redemptions
  const filteredRedemptions = useMemo(() => {
    if (filterCode === "all") return redemptions;
    return redemptions.filter((r) => r.promo_codes?.code === filterCode);
  }, [redemptions, filterCode]);

  // Sorted code list for dropdown
  const codeList = useMemo(() => {
    return Object.entries(stats.codeCounts)
      .sort((a, b) => b[1] - a[1]);
  }, [stats.codeCounts]);

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin"
          className="text-[#9B9A97] hover:text-white transition-colors mb-4 inline-block"
        >
          &larr; Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-white">Redemptions</h1>
        <p className="text-[#9B9A97] mt-1">Track all promo code usage</p>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-[#FC0726]/10 border border-[#FC0726]/20 text-[#FC0726]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="card-gunmetal rounded-xl p-8 text-center text-[#9B9A97]">
          Loading...
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="card-gunmetal rounded-xl p-4">
              <p className="text-sm text-[#9B9A97]">Total Redemptions</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="card-gunmetal rounded-xl p-4">
              <p className="text-sm text-[#9B9A97]">Active Pro Users</p>
              <p className="text-2xl font-bold text-[#22C55E]">{stats.activeProUsers}</p>
            </div>
            <div className="card-gunmetal rounded-xl p-4">
              <p className="text-sm text-[#9B9A97]">Unique Devices</p>
              <p className="text-2xl font-bold text-white">{stats.uniqueDevices}</p>
            </div>
            <div className="card-gunmetal rounded-xl p-4">
              <p className="text-sm text-[#9B9A97]">Codes Used</p>
              <p className="text-2xl font-bold text-white">{stats.uniqueCodes}</p>
            </div>
          </div>

          {/* Per-Code Breakdown */}
          {codeList.length > 0 && (
            <div className="card-gunmetal rounded-xl p-4 mb-6">
              <p className="text-sm font-medium text-[#9B9A97] mb-3">Redemptions by Code</p>
              <div className="flex flex-wrap gap-2">
                {codeList.map(([code, count]) => (
                  <button
                    key={code}
                    onClick={() => setFilterCode(filterCode === code ? "all" : code)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-mono transition-colors ${
                      filterCode === code
                        ? "bg-[#5C8DB8] text-white"
                        : "bg-[#2B2E32] text-[#9B9A97] hover:text-white hover:bg-[#3D3D3D]"
                    }`}
                  >
                    <span>{code}</span>
                    <span className={`font-sans font-medium ${
                      filterCode === code ? "text-white/80" : "text-white"
                    }`}>
                      {count}
                    </span>
                  </button>
                ))}
              </div>
              {filterCode !== "all" && (
                <button
                  onClick={() => setFilterCode("all")}
                  className="mt-3 text-xs text-[#9B9A97] hover:text-white transition-colors"
                >
                  Clear filter
                </button>
              )}
            </div>
          )}

          {/* Redemption Table */}
          {filteredRedemptions.length === 0 ? (
            <div className="card-gunmetal rounded-xl p-8 text-center">
              <p className="text-[#9B9A97]">No redemptions{filterCode !== "all" ? ` for ${filterCode}` : " yet"}</p>
            </div>
          ) : (
            <div className="card-gunmetal rounded-xl overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-[#3D3D3D]">
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#9B9A97]">Code</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#9B9A97]">Device ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#9B9A97]">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#9B9A97]">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#9B9A97]">Redeemed</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRedemptions.map((redemption) => {
                    const expiresAt = redemption.pro_expires_at ? new Date(redemption.pro_expires_at) : null;
                    const isDistantPast = expiresAt && expiresAt.getFullYear() < 2000;
                    const isExpired = expiresAt && !isDistantPast && expiresAt <= new Date();
                    const isForever = !expiresAt;
                    const isActive = isForever || (!isDistantPast && !isExpired);
                    const isTrial = isDistantPast; // Trial codes set distantPast

                    return (
                      <tr key={redemption.id} className="border-b border-[#3D3D3D] last:border-0 hover:bg-[#2B2E32]/50">
                        <td className="px-4 py-4">
                          <code className="px-2 py-1 rounded bg-[#2B2E32] text-[#68A1D6] font-mono text-sm">
                            {redemption.promo_codes?.code || "Unknown"}
                          </code>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-[#9B9A97] font-mono">
                            {redemption.device_id.substring(0, 12)}...
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm capitalize text-[#9B9A97]">
                          {redemption.promo_codes?.type || "Unknown"}
                        </td>
                        <td className="px-4 py-4">
                          {isTrial ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#5C8DB8]/10 text-[#5C8DB8]">
                              Trial Offer
                            </span>
                          ) : isActive ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#22C55E]/10 text-[#22C55E]">
                              {isForever ? "Pro (Forever)" : `Pro until ${expiresAt!.toLocaleDateString()}`}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#FC0726]/10 text-[#FC0726]">
                              Expired
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm text-[#9B9A97]">
                          {new Date(redemption.redeemed_at).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
