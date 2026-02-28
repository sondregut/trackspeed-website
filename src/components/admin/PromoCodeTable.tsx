"use client";

import { useState } from "react";
import type { PromoCode } from "@/lib/supabase";

interface PromoCodeTableProps {
  codes: PromoCode[];
  onToggle: (id: string, isActive: boolean) => void;
  onDelete: (id: string) => void;
  onUpdateMaxUses?: (id: string, maxUses: number | null) => void;
}

function formatDuration(days: number | null): string {
  if (days === null) return "Forever";
  if (days === 30) return "1 month";
  if (days === 90) return "3 months";
  if (days === 180) return "6 months";
  if (days === 365) return "1 year";
  return `${days} days`;
}

function MaxUsesCell({
  code,
  onUpdateMaxUses,
}: {
  code: PromoCode;
  onUpdateMaxUses?: (id: string, maxUses: number | null) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(
    code.max_uses !== null ? String(code.max_uses) : ""
  );

  if (!onUpdateMaxUses) {
    return (
      <span>
        {code.current_uses}
        {code.max_uses !== null && (
          <span className="text-[#787774]"> / {code.max_uses}</span>
        )}
      </span>
    );
  }

  if (!editing) {
    return (
      <span>
        {code.current_uses}
        <button
          onClick={() => {
            setInputValue(code.max_uses !== null ? String(code.max_uses) : "");
            setEditing(true);
          }}
          className="ml-1 text-[#5C8DB8] hover:text-[#4A7A9E] transition-colors"
          title="Edit max uses"
        >
          {code.max_uses !== null ? (
            <span className="text-[#787774] hover:text-[#5C8DB8]"> / {code.max_uses}</span>
          ) : (
            <span className="text-[#787774] hover:text-[#5C8DB8] text-xs"> / ∞</span>
          )}
        </button>
      </span>
    );
  }

  function handleSave() {
    const trimmed = inputValue.trim();
    if (trimmed === "" || trimmed.toLowerCase() === "unlimited") {
      onUpdateMaxUses!(code.id, null);
    } else {
      const num = parseInt(trimmed, 10);
      if (!isNaN(num) && num > 0) {
        onUpdateMaxUses!(code.id, num);
      } else {
        // Invalid input — reset
        setInputValue(code.max_uses !== null ? String(code.max_uses) : "");
      }
    }
    setEditing(false);
  }

  return (
    <span className="inline-flex items-center gap-1">
      {code.current_uses} /
      <input
        autoFocus
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
          if (e.key === "Escape") setEditing(false);
        }}
        placeholder="∞"
        className="w-16 px-1 py-0.5 text-sm rounded bg-[#2B2E32] border border-[#5C8DB8] text-white focus:outline-none"
      />
    </span>
  );
}

export default function PromoCodeTable({ codes, onToggle, onDelete, onUpdateMaxUses }: PromoCodeTableProps) {
  return (
    <div className="card-gunmetal rounded-xl overflow-x-auto">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="border-b border-[#3D3D3D]">
            <th className="px-4 py-3 text-left text-sm font-medium text-[#9B9A97]">Code</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[#9B9A97]">Type</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[#9B9A97]">Duration</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[#9B9A97]">Uses</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[#9B9A97]">Status</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[#9B9A97]">Expires</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-[#9B9A97]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {codes.map((code) => (
            <tr key={code.id} className="border-b border-[#3D3D3D] last:border-0 hover:bg-[#2B2E32]/50">
              <td className="px-4 py-4">
                <div>
                  <code className="px-2 py-1 rounded bg-[#2B2E32] text-[#68A1D6] font-mono text-sm">
                    {code.code}
                  </code>
                  {code.note && (
                    <p className="text-xs text-[#787774] mt-1">{code.note}</p>
                  )}
                </div>
              </td>
              <td className="px-4 py-4 text-sm text-[#9B9A97] capitalize">
                {code.type}
              </td>
              <td className="px-4 py-4 text-sm text-[#9B9A97]">
                {formatDuration(code.duration_days)}
              </td>
              <td className="px-4 py-4 text-sm text-white">
                <MaxUsesCell code={code} onUpdateMaxUses={onUpdateMaxUses} />
              </td>
              <td className="px-4 py-4">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    code.is_active
                      ? "bg-[#22C55E]/10 text-[#22C55E]"
                      : "bg-[#FC0726]/10 text-[#FC0726]"
                  }`}
                >
                  {code.is_active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-4 py-4 text-sm text-[#9B9A97]">
                {code.expires_at
                  ? new Date(code.expires_at).toLocaleDateString()
                  : "Never"}
              </td>
              <td className="px-4 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onToggle(code.id, code.is_active)}
                    className="px-3 py-1 rounded text-sm text-white bg-[#2B2E32] hover:bg-[#3D3D3D] transition-colors"
                  >
                    {code.is_active ? "Disable" : "Enable"}
                  </button>
                  <button
                    onClick={() => onDelete(code.id)}
                    className="px-3 py-1 rounded text-sm bg-[#FC0726]/10 text-[#FC0726] hover:bg-[#FC0726]/20 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
