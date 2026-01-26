"use client";

import { useEffect, useState, useCallback } from "react";
import EmailCampaignTable from "@/components/admin/EmailCampaignTable";
import EmailSendLog, { type EmailLog } from "@/components/admin/EmailSendLog";
import TestEmailForm from "@/components/admin/TestEmailForm";

export default function EmailsPage() {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sendingTemplate, setSendingTemplate] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/emails");
      if (!res.ok) throw new Error("Failed to fetch email logs");
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

  async function handleSendTest(template: string, email?: string) {
    if (!email) {
      // If called from campaign table without email, prompt for email
      const recipientEmail = prompt("Enter recipient email:");
      if (!recipientEmail) return;
      email = recipientEmail;
    }

    setSendingTemplate(template);

    try {
      const res = await fetch("/api/admin/emails/send-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send test email");
      }

      // Refresh logs after sending
      await fetchLogs();
    } finally {
      setSendingTemplate(null);
    }
  }

  async function handleSendFromForm(template: string, email: string) {
    const res = await fetch("/api/admin/emails/send-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template, email }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to send test email");
    }

    // Refresh logs after sending
    await fetchLogs();
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Email Management</h1>
        <p className="text-[#9B9A97] mt-1">
          Manage email campaigns and view send history
        </p>
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
          <EmailCampaignTable
            onSendTest={(template) => handleSendTest(template)}
            sendingTemplate={sendingTemplate}
          />
        </div>

        {/* Test email form - 1 column */}
        <div>
          <TestEmailForm onSend={handleSendFromForm} />
        </div>
      </div>

      {/* Email send log */}
      <EmailSendLog logs={logs} loading={loading} />
    </div>
  );
}
