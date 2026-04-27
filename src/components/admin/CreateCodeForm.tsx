"use client";

import { useState } from "react";

interface CreateCodeFormProps {
  onSubmit: (data: {
    code: string;
    type: PromoCodeType;
    duration_days: number | null;
    max_uses: number | null;
    expires_at: string | null;
    note: string | null;
  }) => void;
  loading: boolean;
}

type PromoCodeType = 'free' | 'trial' | 'jumpers_world';

export default function CreateCodeForm({ onSubmit, loading }: CreateCodeFormProps) {
  const [code, setCode] = useState("");
  const [type, setType] = useState<PromoCodeType>('free');
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

  function applyJumpersWorldPreset() {
    setCode("JUMPERSWORLD");
    setType("jumpers_world");
    setDurationDays("");
    setMaxUses("");
    setExpiresAt("");
    setNote("Jumpers World partner pricing: annual and monthly package variant");
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
            className="flex-1 px-4 py-3 rounded-lg bg-[#2B2E32] border border-[#3D3D3D] text-white placeholder-[#787774] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C8DB8] focus-visible:ring-offset-1 transition-colors font-mono uppercase"
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
          onChange={(e) => setType(e.target.value as PromoCodeType)}
          className="w-full px-4 py-3 rounded-lg bg-[#2B2E32] border border-[#3D3D3D] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C8DB8] focus-visible:ring-offset-1 transition-colors"
        >
          <option value="free">Free (Full Pro access)</option>
          <option value="trial">Trial (Limited time)</option>
          <option value="jumpers_world">Jumpers World (Partner pricing)</option>
        </select>
        <p className="mt-2 text-xs text-[#787774]">
          Jumpers World codes do not grant free Pro. They unlock the Jumpers World annual and monthly package prices in the app.
        </p>
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
          className="w-full px-4 py-3 rounded-lg bg-[#2B2E32] border border-[#3D3D3D] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C8DB8] focus-visible:ring-offset-1 transition-colors"
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
          className="w-full px-4 py-3 rounded-lg bg-[#2B2E32] border border-[#3D3D3D] text-white placeholder-[#787774] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C8DB8] focus-visible:ring-offset-1 transition-colors"
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
          className="w-full px-4 py-3 rounded-lg bg-[#2B2E32] border border-[#3D3D3D] text-white placeholder-[#787774] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C8DB8] focus-visible:ring-offset-1 transition-colors"
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
          className="w-full px-4 py-3 rounded-lg bg-[#2B2E32] border border-[#3D3D3D] text-white placeholder-[#787774] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C8DB8] focus-visible:ring-offset-1 transition-colors"
          placeholder="e.g., For beta testers"
        />
      </div>

      <button
        type="button"
        onClick={applyJumpersWorldPreset}
        className="w-full px-4 py-3 rounded-lg bg-[#2B2E32] border border-[#5C8DB8]/40 text-[#68A1D6] hover:border-[#5C8DB8] hover:text-white transition-colors font-medium"
      >
        Use Jumpers World preset
      </button>

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
