"use client";

import { useState } from "react";

interface CreateCodeFormProps {
  onSubmit: (data: {
    code: string;
    type: 'free' | 'trial';
    duration_days: number | null;
    max_uses: number | null;
    expires_at: string | null;
    note: string | null;
  }) => void;
  loading: boolean;
}

export default function CreateCodeForm({ onSubmit, loading }: CreateCodeFormProps) {
  const [code, setCode] = useState("");
  const [type, setType] = useState<'free' | 'trial'>('free');
  const [durationDays, setDurationDays] = useState<string>("");
  const [maxUses, setMaxUses] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [note, setNote] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      code,
      type,
      duration_days: durationDays ? parseInt(durationDays) : null,
      max_uses: maxUses ? parseInt(maxUses) : null,
      expires_at: expiresAt || null,
      note: note || null,
    });
  }

  function generateCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCode(result);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Code */}
      <div>
        <label htmlFor="code" className="block text-sm text-[#9B9A97] mb-2">
          Code
        </label>
        <div className="flex gap-2">
          <input
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="flex-1 px-4 py-3 rounded-lg bg-[#2B2E32] border border-[#3D3D3D] text-white placeholder-[#787774] focus:outline-none focus:border-[#5C8DB8] transition-colors font-mono uppercase"
            placeholder="e.g., SUMMER2024"
            required
          />
          <button
            type="button"
            onClick={generateCode}
            className="px-4 py-3 rounded-lg bg-[#2B2E32] border border-[#3D3D3D] text-[#9B9A97] hover:text-white hover:border-[#5C8DB8] transition-colors"
          >
            Generate
          </button>
        </div>
      </div>

      {/* Type */}
      <div>
        <label htmlFor="type" className="block text-sm text-[#9B9A97] mb-2">
          Type
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as 'free' | 'trial')}
          className="w-full px-4 py-3 rounded-lg bg-[#2B2E32] border border-[#3D3D3D] text-white focus:outline-none focus:border-[#5C8DB8] transition-colors"
        >
          <option value="free">Free (Full Pro access)</option>
          <option value="trial">Trial (Limited time)</option>
        </select>
      </div>

      {/* Duration */}
      <div>
        <label htmlFor="duration" className="block text-sm text-[#9B9A97] mb-2">
          Duration
        </label>
        <select
          id="duration"
          value={durationDays}
          onChange={(e) => setDurationDays(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-[#2B2E32] border border-[#3D3D3D] text-white focus:outline-none focus:border-[#5C8DB8] transition-colors"
        >
          <option value="">Forever</option>
          <option value="30">30 days (1 month)</option>
          <option value="90">90 days (3 months)</option>
          <option value="180">180 days (6 months)</option>
          <option value="365">365 days (1 year)</option>
        </select>
      </div>

      {/* Max Uses */}
      <div>
        <label htmlFor="maxUses" className="block text-sm text-[#9B9A97] mb-2">
          Max Uses (optional)
        </label>
        <input
          id="maxUses"
          type="number"
          value={maxUses}
          onChange={(e) => setMaxUses(e.target.value)}
          min="1"
          className="w-full px-4 py-3 rounded-lg bg-[#2B2E32] border border-[#3D3D3D] text-white placeholder-[#787774] focus:outline-none focus:border-[#5C8DB8] transition-colors"
          placeholder="Unlimited"
        />
      </div>

      {/* Expiry Date */}
      <div>
        <label htmlFor="expiresAt" className="block text-sm text-[#9B9A97] mb-2">
          Code Expiry Date (optional)
        </label>
        <input
          id="expiresAt"
          type="date"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-[#2B2E32] border border-[#3D3D3D] text-white placeholder-[#787774] focus:outline-none focus:border-[#5C8DB8] transition-colors"
        />
      </div>

      {/* Note */}
      <div>
        <label htmlFor="note" className="block text-sm text-[#9B9A97] mb-2">
          Note (optional)
        </label>
        <input
          id="note"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-[#2B2E32] border border-[#3D3D3D] text-white placeholder-[#787774] focus:outline-none focus:border-[#5C8DB8] transition-colors"
          placeholder="e.g., For beta testers"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Creating..." : "Create Promo Code"}
      </button>
    </form>
  );
}
