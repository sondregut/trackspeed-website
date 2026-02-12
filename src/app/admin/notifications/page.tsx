"use client";

import { useEffect, useState, useCallback } from "react";

interface NotificationLog {
  id: string;
  title: string;
  body: string;
  data: Record<string, string> | null;
  target_type: string;
  target_ids: string[] | null;
  total_sent: number;
  total_failed: number;
  sent_at: string;
}

export default function NotificationsPage() {
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [dataKey, setDataKey] = useState("");
  const [dataValue, setDataValue] = useState("");
  const [customData, setCustomData] = useState<Record<string, string>>({});
  const [target, setTarget] = useState<"all" | "user_ids" | "device_ids">("all");
  const [targetIds, setTargetIds] = useState("");

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      if (!res.ok) throw new Error("Failed to fetch notification logs");
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load logs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSending(true);

    try {
      const payload: Record<string, unknown> = { title, body: body };

      if (Object.keys(customData).length > 0) {
        payload.data = customData;
      }

      if (target !== "all") {
        payload.target = target;
        payload.target_ids = targetIds
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean);
      }

      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to send notification");
      }

      setSuccess(
        `Sent to ${result.sent} device${result.sent !== 1 ? "s" : ""}${
          result.failed > 0 ? `, ${result.failed} failed` : ""
        }`
      );

      // Reset form
      setTitle("");
      setBody("");
      setCustomData({});
      setDataKey("");
      setDataValue("");

      // Refresh logs
      await fetchLogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send");
    } finally {
      setSending(false);
    }
  }

  function addDataField() {
    if (dataKey && dataValue) {
      setCustomData((prev) => ({ ...prev, [dataKey]: dataValue }));
      setDataKey("");
      setDataValue("");
    }
  }

  function removeDataField(key: string) {
    setCustomData((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Push Notifications</h1>
        <p className="text-[#9B9A97] text-sm mt-1">
          Send push notifications to app users via APNs
        </p>
      </div>

      {/* Send Form */}
      <div className="bg-[#1A1A1A] border border-[#3D3D3D] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Send Notification
        </h2>

        <form onSubmit={handleSend} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[#9B9A97] mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Notification title"
              className="w-full px-3 py-2 bg-[#2B2E32] border border-[#3D3D3D] rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#5C8DB8]"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium text-[#9B9A97] mb-1">
              Body
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={3}
              placeholder="Notification message..."
              className="w-full px-3 py-2 bg-[#2B2E32] border border-[#3D3D3D] rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#5C8DB8] resize-none"
            />
          </div>

          {/* Target */}
          <div>
            <label className="block text-sm font-medium text-[#9B9A97] mb-1">
              Target
            </label>
            <select
              value={target}
              onChange={(e) =>
                setTarget(e.target.value as "all" | "user_ids" | "device_ids")
              }
              className="w-full px-3 py-2 bg-[#2B2E32] border border-[#3D3D3D] rounded-lg text-white focus:outline-none focus:border-[#5C8DB8]"
            >
              <option value="all">All users</option>
              <option value="user_ids">Specific user IDs</option>
              <option value="device_ids">Specific device IDs</option>
            </select>
          </div>

          {/* Target IDs (conditional) */}
          {target !== "all" && (
            <div>
              <label className="block text-sm font-medium text-[#9B9A97] mb-1">
                {target === "user_ids" ? "User" : "Device"} IDs (comma-separated)
              </label>
              <input
                type="text"
                value={targetIds}
                onChange={(e) => setTargetIds(e.target.value)}
                placeholder="id1, id2, id3..."
                className="w-full px-3 py-2 bg-[#2B2E32] border border-[#3D3D3D] rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#5C8DB8]"
              />
            </div>
          )}

          {/* Custom Data */}
          <div>
            <label className="block text-sm font-medium text-[#9B9A97] mb-1">
              Custom Data (optional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={dataKey}
                onChange={(e) => setDataKey(e.target.value)}
                placeholder="Key"
                className="flex-1 px-3 py-2 bg-[#2B2E32] border border-[#3D3D3D] rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#5C8DB8]"
              />
              <input
                type="text"
                value={dataValue}
                onChange={(e) => setDataValue(e.target.value)}
                placeholder="Value"
                className="flex-1 px-3 py-2 bg-[#2B2E32] border border-[#3D3D3D] rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#5C8DB8]"
              />
              <button
                type="button"
                onClick={addDataField}
                className="px-3 py-2 bg-[#2B2E32] border border-[#3D3D3D] rounded-lg text-white hover:bg-[#3D3D3D] transition-colors"
              >
                Add
              </button>
            </div>
            {Object.keys(customData).length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.entries(customData).map(([k, v]) => (
                  <span
                    key={k}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-[#2B2E32] rounded text-sm text-white"
                  >
                    {k}: {v}
                    <button
                      type="button"
                      onClick={() => removeDataField(k)}
                      className="text-[#9B9A97] hover:text-red-400 ml-1"
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Error/Success */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
              {success}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={sending || !title || !body}
            className="px-6 py-2.5 bg-[#5C8DB8] text-white rounded-lg font-medium hover:bg-[#4a7da8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? "Sending..." : "Send Notification"}
          </button>
        </form>
      </div>

      {/* History */}
      <div className="bg-[#1A1A1A] border border-[#3D3D3D] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Notification History
        </h2>

        {loading ? (
          <p className="text-[#9B9A97]">Loading...</p>
        ) : logs.length === 0 ? (
          <p className="text-[#9B9A97]">No notifications sent yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#9B9A97] border-b border-[#3D3D3D]">
                  <th className="pb-3 pr-4">Sent At</th>
                  <th className="pb-3 pr-4">Title</th>
                  <th className="pb-3 pr-4">Body</th>
                  <th className="pb-3 pr-4">Target</th>
                  <th className="pb-3 pr-4 text-right">Sent</th>
                  <th className="pb-3 text-right">Failed</th>
                </tr>
              </thead>
              <tbody className="text-white">
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-[#2B2E32]">
                    <td className="py-3 pr-4 text-[#9B9A97] whitespace-nowrap">
                      {new Date(log.sent_at).toLocaleString()}
                    </td>
                    <td className="py-3 pr-4 font-medium">{log.title}</td>
                    <td className="py-3 pr-4 text-[#9B9A97] max-w-xs truncate">
                      {log.body}
                    </td>
                    <td className="py-3 pr-4">
                      <span className="px-2 py-0.5 bg-[#2B2E32] rounded text-xs">
                        {log.target_type}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right text-green-400">
                      {log.total_sent}
                    </td>
                    <td className="py-3 text-right text-red-400">
                      {log.total_failed}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
