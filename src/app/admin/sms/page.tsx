"use client";

import { useEffect, useState, useCallback } from "react";
import SMSCampaignTable from "@/components/admin/SMSCampaignTable";
import SMSSendLog, { type SMSLog } from "@/components/admin/SMSSendLog";
import TestSMSForm from "@/components/admin/TestSMSForm";

export default function SMSPage() {
  const [logs, setLogs] = useState<SMSLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sendingTemplate, setSendingTemplate] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/sms");
      if (!res.ok) throw new Error("Failed to fetch SMS logs");
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

  async function handleSendTest(template: string, phone?: string) {
    if (!phone) {
      // If called from campaign table without phone, prompt for phone
      const recipientPhone = prompt("Enter recipient phone (with country code):");
      if (!recipientPhone) return;
      phone = recipientPhone;
    }

    setSendingTemplate(template);

    try {
      const res = await fetch("/api/admin/sms/send-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template, phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send test SMS");
      }

      // Refresh logs after sending
      await fetchLogs();
    } finally {
      setSendingTemplate(null);
    }
  }

  async function handleSendFromForm(template: string, phone: string) {
    const res = await fetch("/api/admin/sms/send-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template, phone }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to send SMS");
    }

    // Refresh logs after sending
    await fetchLogs();
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">SMS Management</h1>
        <p className="text-[#9B9A97] mt-1">
          Manage SMS campaigns and view send history (via Twilio)
        </p>
      </div>

      {/* TCPA Compliance Notice */}
      <div className="p-4 rounded-lg bg-[#FACC15]/10 border border-[#FACC15]/20 text-[#FACC15]">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 mt-0.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <p className="font-medium">TCPA Compliance</p>
            <p className="text-sm mt-1 text-[#FACC15]/80">
              SMS campaigns only send to users who have explicitly opted in.
              First message includes STOP opt-out instructions. All sends are
              logged for audit purposes.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-[#FC0726]/10 border border-[#FC0726]/20 text-[#FC0726]">
          {error}
        </div>
      )}

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign table - spans 2 columns */}
        <div className="lg:col-span-2">
          <SMSCampaignTable
            onSendTest={(template) => handleSendTest(template)}
            sendingTemplate={sendingTemplate}
          />
        </div>

        {/* Test SMS form - 1 column */}
        <div>
          <TestSMSForm onSend={handleSendFromForm} />
        </div>
      </div>

      {/* SMS send log */}
      <SMSSendLog logs={logs} loading={loading} />
    </div>
  );
}
