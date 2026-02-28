"use client";

import { useState } from "react";

interface SMSCampaign {
  id: string;
  name: string;
  trigger: string;
  timing: string;
  templateKey: string;
  message: string;
  charCount: number;
}

const smsCampaigns: SMSCampaign[] = [
  {
    id: "welcome",
    name: "Welcome",
    trigger: "Phone verified + SMS opt-in",
    timing: "Immediately",
    templateKey: "welcome",
    message:
      "Welcome to TrackSpeed! 🏃 Start your first timing session today. Need help? Reply HELP. Reply STOP to opt out.",
    charCount: 116,
  },
  {
    id: "tips_day3",
    name: "Tips Day 3",
    trigger: "After welcome",
    timing: "3 days",
    templateKey: "tips_day3",
    message:
      "TrackSpeed tip: Use 2 phones for split times! Place one at start, one at finish. 📱⏱️",
    charCount: 91,
  },
  {
    id: "convert_day7",
    name: "Convert Day 7",
    trigger: "After tips (free users only)",
    timing: "7 days",
    templateKey: "convert_day7",
    message:
      "Special offer: 20% off TrackSpeed Pro! Unlimited timing & multi-device mode. Tap to claim: https://mytrackspeed.com/pro",
    charCount: 121,
  },
  {
    id: "winback",
    name: "Winback",
    trigger: "Access expired",
    timing: "30 days after",
    templateKey: "winback",
    message:
      "We miss you at TrackSpeed! Come back & get 20% off Pro. Tap to claim: https://mytrackspeed.com/pro",
    charCount: 100,
  },
];

interface SMSCampaignTableProps {
  onSendTest: (templateKey: string) => void;
  sendingTemplate: string | null;
  onEditTemplate?: (templateKey: string, message: string) => void;
}

function PreviewModal({
  campaign,
  onClose,
  onSave,
}: {
  campaign: SMSCampaign;
  onClose: () => void;
  onSave?: (message: string) => void;
}) {
  const [editedMessage, setEditedMessage] = useState(campaign.message);
  const [isSaving, setIsSaving] = useState(false);
  const charCount = editedMessage.length;
  const isOverLimit = charCount > 160;

  async function handleSave() {
    if (!onSave || isOverLimit) return;
    setIsSaving(true);
    try {
      await onSave(editedMessage);
      onClose();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2B2E32] rounded-xl border border-[#3D3D3D] w-full max-w-lg">
        <div className="flex items-center justify-between p-4 border-b border-[#3D3D3D]">
          <h3 className="text-lg font-semibold text-white">
            Edit: {campaign.name}
          </h3>
          <button
            onClick={onClose}
            className="text-[#9B9A97] hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-4 space-y-4">
          {/* Phone Preview */}
          <div className="flex justify-center">
            <div className="bg-[#1A1A1A] rounded-2xl p-4 w-72 border border-[#3D3D3D]">
              <div className="bg-[#22C55E] text-white rounded-xl p-3 text-sm">
                {editedMessage}
              </div>
              <div className="text-xs text-[#787774] mt-2 text-center">
                Preview (phone)
              </div>
            </div>
          </div>

          {/* Edit textarea */}
          <div>
            <label className="block text-sm font-medium text-[#9B9A97] mb-1">
              Message
            </label>
            <textarea
              value={editedMessage}
              onChange={(e) => setEditedMessage(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#3D3D3D] rounded-lg text-white placeholder-[#787774] focus:outline-none focus:ring-2 focus:ring-[#5C8DB8] resize-none"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-[#787774]">
                Variables: {"{name}"}, {"{sessionCount}"}
              </span>
              <span
                className={`text-xs ${
                  isOverLimit ? "text-[#FC0726]" : "text-[#9B9A97]"
                }`}
              >
                {charCount}/160 characters
              </span>
            </div>
          </div>

          {/* Info box */}
          <div className="bg-[#1A1A1A] rounded-lg p-3 text-sm text-[#9B9A97]">
            <p className="font-medium text-white mb-1">SMS Best Practices:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Keep under 160 chars for single SMS</li>
              <li>First message should include STOP opt-out</li>
              <li>Avoid URLs longer than necessary</li>
            </ul>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-4 border-t border-[#3D3D3D]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm bg-[#3D3D3D] hover:bg-[#4D4D4D] transition-colors"
          >
            Cancel
          </button>
          {onSave && (
            <button
              onClick={handleSave}
              disabled={isSaving || isOverLimit}
              className="px-4 py-2 rounded-lg text-sm bg-[#5C8DB8] hover:bg-[#5C8DB8]/80 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SMSCampaignTable({
  onSendTest,
  sendingTemplate,
  onEditTemplate,
}: SMSCampaignTableProps) {
  const [previewCampaign, setPreviewCampaign] = useState<SMSCampaign | null>(
    null
  );

  return (
    <>
      <div className="bg-[#2B2E32] rounded-xl border border-[#3D3D3D] overflow-hidden">
        <div className="p-4 border-b border-[#3D3D3D]">
          <h2 className="text-lg font-semibold text-white">SMS Campaigns</h2>
          <p className="text-sm text-[#9B9A97] mt-1">
            Automated SMS drip campaigns via Twilio
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#1A1A1A]">
                <th className="text-left px-4 py-3 text-sm font-medium text-[#9B9A97]">
                  SMS
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#9B9A97]">
                  Trigger
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#9B9A97]">
                  Timing
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#9B9A97]">
                  Length
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-[#9B9A97]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {smsCampaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  className="border-t border-[#3D3D3D] hover:bg-[#3D3D3D]/30"
                >
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setPreviewCampaign(campaign)}
                      className="text-white font-medium hover:text-[#5C8DB8] transition-colors text-left"
                    >
                      {campaign.name}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#9B9A97]">
                    {campaign.trigger}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#9B9A97]">
                    {campaign.timing}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        campaign.charCount > 160
                          ? "bg-[#FC0726]/10 text-[#FC0726]"
                          : campaign.charCount > 140
                          ? "bg-[#FACC15]/10 text-[#FACC15]"
                          : "bg-[#22C55E]/10 text-[#22C55E]"
                      }`}
                    >
                      {campaign.charCount}/160
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setPreviewCampaign(campaign)}
                        className="px-3 py-1 rounded text-sm bg-[#3D3D3D] hover:bg-[#4D4D4D] transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onSendTest(campaign.templateKey)}
                        disabled={sendingTemplate === campaign.templateKey}
                        className="px-3 py-1 rounded text-sm bg-[#5C8DB8] hover:bg-[#5C8DB8]/80 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {sendingTemplate === campaign.templateKey
                          ? "Sending..."
                          : "Send Test"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {previewCampaign && (
        <PreviewModal
          campaign={previewCampaign}
          onClose={() => setPreviewCampaign(null)}
          onSave={
            onEditTemplate
              ? (message) => onEditTemplate(previewCampaign.templateKey, message)
              : undefined
          }
        />
      )}
    </>
  );
}

export { smsCampaigns };
export type { SMSCampaign };
