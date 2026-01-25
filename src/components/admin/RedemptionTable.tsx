"use client";

import type { PromoRedemption } from "@/lib/supabase";

interface RedemptionTableProps {
  redemptions: PromoRedemption[];
}

function formatDuration(days: number | null): string {
  if (days === null) return "Forever";
  if (days === 30) return "1 month";
  if (days === 90) return "3 months";
  if (days === 180) return "6 months";
  if (days === 365) return "1 year";
  return `${days} days`;
}

export default function RedemptionTable({ redemptions }: RedemptionTableProps) {
  return (
    <div className="card-gunmetal rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#3D3D3D]">
            <th className="px-4 py-3 text-left text-sm font-medium text-[#9B9A97]">Code</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[#9B9A97]">Device ID</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[#9B9A97]">Type</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[#9B9A97]">Pro Expires</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[#9B9A97]">Redeemed At</th>
          </tr>
        </thead>
        <tbody>
          {redemptions.map((redemption) => (
            <tr key={redemption.id} className="border-b border-[#3D3D3D] last:border-0 hover:bg-[#2B2E32]/50">
              <td className="px-4 py-4">
                <code className="px-2 py-1 rounded bg-[#2B2E32] text-[#68A1D6] font-mono text-sm">
                  {redemption.promo_codes?.code || "Unknown"}
                </code>
              </td>
              <td className="px-4 py-4">
                <span className="text-sm text-[#9B9A97] font-mono">
                  {redemption.device_id.substring(0, 8)}...
                </span>
              </td>
              <td className="px-4 py-4 text-sm capitalize">
                {redemption.promo_codes?.type || "Unknown"}
              </td>
              <td className="px-4 py-4 text-sm">
                {redemption.pro_expires_at
                  ? new Date(redemption.pro_expires_at).toLocaleDateString()
                  : "Never"}
              </td>
              <td className="px-4 py-4 text-sm text-[#9B9A97]">
                {new Date(redemption.redeemed_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
