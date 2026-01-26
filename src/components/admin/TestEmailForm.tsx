"use client";

import { useState } from "react";
import { campaigns } from "./EmailCampaignTable";

interface TestEmailFormProps {
  onSend: (template: string, email: string) => Promise<void>;
}

export default function TestEmailForm({ onSend }: TestEmailFormProps) {
  const [template, setTemplate] = useState(campaigns[0].templateKey);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !template) return;

    setSending(true);
    setMessage(null);

    try {
      await onSend(template, email);
      setMessage({ type: "success", text: "Test email sent successfully!" });
      setEmail("");
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to send email",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="bg-[#2B2E32] rounded-xl border border-[#3D3D3D] p-6">
      <h2 className="text-lg font-semibold text-white mb-1">Send Test Email</h2>
      <p className="text-sm text-[#9B9A97] mb-4">
        Send a test email to verify templates
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="template"
            className="block text-sm font-medium text-[#9B9A97] mb-1"
          >
            Template
          </label>
          <select
            id="template"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#3D3D3D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#5C8DB8]"
          >
            {campaigns.map((campaign) => (
              <option key={campaign.id} value={campaign.templateKey}>
                {campaign.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#9B9A97] mb-1"
          >
            Recipient Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="test@example.com"
            required
            className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#3D3D3D] rounded-lg text-white placeholder-[#787774] focus:outline-none focus:ring-2 focus:ring-[#5C8DB8]"
          />
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.type === "success"
                ? "bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20"
                : "bg-[#FC0726]/10 text-[#FC0726] border border-[#FC0726]/20"
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={sending || !email}
          className="w-full btn-primary px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? "Sending..." : "Send Test Email"}
        </button>
      </form>
    </div>
  );
}
