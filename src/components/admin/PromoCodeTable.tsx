"use client";

import type { PromoCode } from "@/lib/supabase";

interface PromoCodeTableProps {
  codes: PromoCode[];
  onToggle: (id: string, isActive: boolean) => void;
  onDelete: (id: string) => void;
}

function formatDuration(days: number | null): string {
  if (days === null) return "Forever";
  if (days === 30) return "1 month";
  if (days === 90) return "3 months";
  if (days === 180) return "6 months";
  if (days === 365) return "1 year";
  return `${days} days`;
}

export default function PromoCodeTable({ codes, onToggle, onDelete }: PromoCodeTableProps) {
  return (
    <div className="card-gunmetal rounded-xl overflow-hidden">
      <table className="w-full">
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
                {code.current_uses}
                {code.max_uses && (
                  <span className="text-[#787774]"> / {code.max_uses}</span>
                )}
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
