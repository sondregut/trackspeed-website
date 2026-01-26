"use client";

interface EmailLog {
  id: string;
  sent_at: string;
  email: string;
  template: string;
  status: "sent" | "failed";
  resend_id: string | null;
  error_message: string | null;
}

interface EmailSendLogProps {
  logs: EmailLog[];
  loading: boolean;
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatTemplateName(template: string): string {
  return template
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function EmailSendLog({ logs, loading }: EmailSendLogProps) {
  if (loading) {
    return (
      <div className="bg-[#2B2E32] rounded-xl border border-[#3D3D3D] p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 bg-[#3D3D3D] rounded" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-[#3D3D3D] rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#2B2E32] rounded-xl border border-[#3D3D3D] overflow-hidden">
      <div className="p-4 border-b border-[#3D3D3D]">
        <h2 className="text-lg font-semibold text-white">Recent Sends</h2>
        <p className="text-sm text-[#9B9A97] mt-1">Last 50 email sends</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#1A1A1A]">
              <th className="text-left px-4 py-3 text-sm font-medium text-[#9B9A97]">
                Time
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#9B9A97]">
                Recipient
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#9B9A97]">
                Template
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#9B9A97]">
                Status
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#9B9A97]">
                Resend ID
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                className="border-t border-[#3D3D3D] hover:bg-[#3D3D3D]/30"
              >
                <td className="px-4 py-3 text-sm text-white">
                  {formatTimeAgo(log.sent_at)}
                </td>
                <td className="px-4 py-3 text-sm text-[#9B9A97]">
                  {log.email}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="px-2 py-1 bg-[#3D3D3D] rounded text-[#9B9A97]">
                    {formatTemplateName(log.template)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      log.status === "sent"
                        ? "bg-[#22C55E]/10 text-[#22C55E]"
                        : "bg-[#FC0726]/10 text-[#FC0726]"
                    }`}
                    title={log.error_message || undefined}
                  >
                    {log.status === "sent" ? "Sent" : "Failed"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-[#787774] font-mono">
                  {log.resend_id ? log.resend_id.slice(0, 12) + "..." : "—"}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#9B9A97]">
                  No emails sent yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export type { EmailLog };
