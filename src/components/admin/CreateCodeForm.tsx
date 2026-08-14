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

type PromoCodeType = 'free' | 'trial' | 'discount';

const creatorAccessDefaults = {
  type: 'free' as const,
  durationDays: '365',
  maxUses: '1',
  note: 'Creator access - 1 year free Pro, no card or auto-renew.',
};

function minimumExpiryDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().slice(0, 10);
}

export default function CreateCodeForm({ onSubmit, loading }: CreateCodeFormProps) {
  const [code, setCode] = useState("");
  const [type, setType] = useState<PromoCodeType>(creatorAccessDefaults.type);
  const [durationDays, setDurationDays] = useState<string>(creatorAccessDefaults.durationDays);
  const [maxUses, setMaxUses] = useState(creatorAccessDefaults.maxUses);
  const [expiresAt, setExpiresAt] = useState("");
  const [note, setNote] = useState(creatorAccessDefaults.note);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      code,
      type,
      duration_days: type === 'free' && durationDays ? parseInt(durationDays, 10) : null,
      max_uses: maxUses ? parseInt(maxUses, 10) : null,
      expires_at: expiresAt || null,
      note: note || null,
    });
  }

  function applyCreatorAccessPreset() {
    setType(creatorAccessDefaults.type);
    setDurationDays(creatorAccessDefaults.durationDays);
    setMaxUses(creatorAccessDefaults.maxUses);
    setExpiresAt("");
    setNote(creatorAccessDefaults.note);
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
      <div className="rounded-lg border border-[#5C8DB8]/40 bg-[#5C8DB8]/10 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-white">Creator access preset</p>
            <p className="mt-1 text-sm text-[#B8C7D4]">
              Instant Pro for one athlete, valid for 1 year. No card and no auto-renewal.
            </p>
          </div>
          <button
            type="button"
            onClick={applyCreatorAccessPreset}
            className="shrink-0 rounded-lg border border-[#5C8DB8] px-3 py-2 text-sm font-medium text-[#A9C9E5] transition-colors hover:bg-[#5C8DB8]/15 hover:text-white"
          >
            Use creator preset
          </button>
        </div>
      </div>

      {/* Code */}
      <div>
        <label htmlFor="code" className="block text-sm text-[#9B9A97] mb-2">
          Individual code
        </label>
        <div className="flex gap-2">
          <input
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="flex-1 px-4 py-3 rounded-lg bg-[#2B2E32] border border-[#3D3D3D] text-white placeholder-[#787774] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C8DB8] focus-visible:ring-offset-1 transition-colors font-mono uppercase"
            placeholder="e.g., MAYA2026"
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
        <p className="mt-2 text-xs text-[#787774]">
          Use only letters and numbers. A name plus year is easy to recognize and share.
        </p>
      </div>

      {/* Type */}
      <div>
        <label htmlFor="type" className="block text-sm text-[#9B9A97] mb-2">
          Type
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => {
            const nextType = e.target.value as PromoCodeType;
            setType(nextType);
            setDurationDays(
              nextType === 'free' ? creatorAccessDefaults.durationDays : ""
            );
            if (nextType === 'discount') {
              setMaxUses("1");
              setNote("Individual discount paywall unlock. One redemption.");
            }
          }}
          className="w-full px-4 py-3 rounded-lg bg-[#2B2E32] border border-[#3D3D3D] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C8DB8] focus-visible:ring-offset-1 transition-colors"
        >
          <option value="free">Free Pro access (instant, no card)</option>
          <option value="trial">App Store trial offer (does not bypass paywall)</option>
          <option value="discount">Discounted annual paywall (Apple purchase)</option>
        </select>
        <p className="mt-2 text-xs text-[#9B9A97]">
          {type === 'free'
            ? "Use this for a creator's own access. It activates Pro immediately."
            : type === 'discount'
              ? "Unlocks the existing lower-priced annual App Store product. Keep Max Redemptions at 1 so the code cannot be shared."
              : "Use this only for a separately configured App Store offer or audience-attribution flow."}
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
          disabled={type !== 'free'}
          className="w-full px-4 py-3 rounded-lg bg-[#2B2E32] border border-[#3D3D3D] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C8DB8] focus-visible:ring-offset-1 transition-colors"
        >
          <option value="">Forever (permanent grant)</option>
          <option value="30">30 days (1 month)</option>
          <option value="90">90 days (3 months)</option>
          <option value="180">180 days (6 months)</option>
          <option value="365">365 days (1 year)</option>
        </select>
        {type !== 'free' && (
          <p className="mt-2 text-xs text-[#9B9A97]">
            {type === 'trial'
              ? "Trial duration is controlled by the App Store offer, not this field."
              : "The discount price is controlled by the App Store product, not this field."}
          </p>
        )}
      </div>

      {/* Max Uses */}
      <div>
        <label htmlFor="maxUses" className="block text-sm text-[#9B9A97] mb-2">
          Max Redemptions (optional)
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
        <p className="mt-2 text-xs text-[#787774]">
          Keep this at 1 for an individual athlete code.
        </p>
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
          min={minimumExpiryDate()}
          className="w-full px-4 py-3 rounded-lg bg-[#2B2E32] border border-[#3D3D3D] text-white placeholder-[#787774] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C8DB8] focus-visible:ring-offset-1 transition-colors"
        />
        <p className="mt-2 text-xs text-[#787774]">
          Leave blank for no redemption deadline. Past dates are rejected.
        </p>
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
