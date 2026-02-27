"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CreateCodeForm from "@/components/admin/CreateCodeForm";

export default function CreateCodePage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(data: {
    code: string;
    type: 'free' | 'trial';
    duration_days: number | null;
    max_uses: number | null;
    expires_at: string | null;
    note: string | null;
  }) {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create code");
      }

      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin"
          className="text-[#9B9A97] hover:text-white transition-colors mb-4 inline-block"
        >
          &larr; Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-white">Create Promo Code</h1>
        <p className="text-[#9B9A97] mt-1">Create a new promotional code</p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 rounded-lg bg-[#FC0726]/10 border border-[#FC0726]/20 text-[#FC0726]">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="card-gunmetal rounded-xl p-6">
        <CreateCodeForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
