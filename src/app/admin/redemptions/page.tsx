"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RedemptionTable from "@/components/admin/RedemptionTable";
import type { PromoRedemption } from "@/lib/supabase";

export default function RedemptionsPage() {
  const [redemptions, setRedemptions] = useState<PromoRedemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin"
          className="text-[#9B9A97] hover:text-white transition-colors mb-4 inline-block"
        >
          &larr; Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-white">Redemptions</h1>
        <p className="text-[#9B9A97] mt-1">View all promo code redemptions</p>
      </div>

      {/* Content */}
      {error && (
        <div className="mb-4 p-4 rounded-lg bg-[#FC0726]/10 border border-[#FC0726]/20 text-[#FC0726]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="card-gunmetal rounded-xl p-8 text-center text-[#9B9A97]">
          Loading...
        </div>
      ) : redemptions.length === 0 ? (
        <div className="card-gunmetal rounded-xl p-8 text-center">
          <p className="text-[#9B9A97]">No redemptions yet</p>
        </div>
      ) : (
        <RedemptionTable redemptions={redemptions} />
      )}
    </div>
  );
}
