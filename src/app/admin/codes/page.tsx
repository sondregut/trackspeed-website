"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PromoCodeTable from "@/components/admin/PromoCodeTable";
import type { PromoCode } from "@/lib/supabase";

export default function PromoCodesPage() {
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchCodes() {
    try {
      const res = await fetch("/api/admin/codes");
      if (!res.ok) throw new Error("Failed to fetch codes");
      const data = await res.json();
      setCodes(data);
    } catch {
      setError("Failed to load promo codes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCodes();
  }, []);

  async function handleToggle(id: string, isActive: boolean) {
    try {
      const res = await fetch(`/api/admin/codes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !isActive }),
      });
      if (!res.ok) throw new Error("Failed to toggle code");
      fetchCodes();
    } catch {
      setError("Failed to toggle code");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this code?")) return;

    try {
      const res = await fetch(`/api/admin/codes/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete code");
      fetchCodes();
    } catch {
      setError("Failed to delete code");
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Promo Codes</h1>
          <p className="text-[#9B9A97] mt-1">Manage promotional codes for TrackSpeed</p>
        </div>
        <Link
          href="/admin/codes/new"
          className="btn-primary px-4 py-2 rounded-lg font-medium"
        >
          Create Code
        </Link>
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
      ) : codes.length === 0 ? (
        <div className="card-gunmetal rounded-xl p-8 text-center">
          <p className="text-[#9B9A97] mb-4">No promo codes yet</p>
          <Link href="/admin/codes/new" className="btn-primary px-4 py-2 rounded-lg font-medium">
            Create your first code
          </Link>
        </div>
      ) : (
        <PromoCodeTable
          codes={codes}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
