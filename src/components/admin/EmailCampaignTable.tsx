"use client";

import { useState } from "react";

interface EmailCampaign {
  id: string;
  name: string;
  trigger: string;
  timing: string;
  templateKey: string;
}

const campaigns: EmailCampaign[] = [
  {
    id: "welcome",
    name: "Welcome",
    trigger: "Signup",
    timing: "Immediately",
    templateKey: "welcome",
  },
  {
    id: "tips_day3",
    name: "Tips Day 3",
    trigger: "After welcome",
    timing: "3 days",
    templateKey: "tips_day3",
  },
  {
    id: "convert_day7",
    name: "Convert Day 7",
    trigger: "After tips (free users only)",
    timing: "7 days",
    templateKey: "convert_day7",
  },
  {
    id: "trial_cancelled",
    name: "Trial Cancelled",
    trigger: "User cancelled trial",
    timing: "7 days before access ends",
    templateKey: "trial_cancelled",
  },
  {
    id: "winback",
    name: "Winback",
    trigger: "Access expired",
    timing: "30 days after",
    templateKey: "winback",
  },
  {
    id: "feature_update",
    name: "Feature Update",
    trigger: "Manual",
    timing: "On-demand",
    templateKey: "feature_update",
  },
];

interface EmailCampaignTableProps {
  onSendTest: (templateKey: string) => void;
  sendingTemplate: string | null;
}

function PreviewModal({
  templateKey,
  onClose,
}: {
  templateKey: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2B2E32] rounded-xl border border-[#3D3D3D] w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-[#3D3D3D]">
          <h3 className="text-lg font-semibold text-white">
            Preview: {templateKey.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </h3>
          <button
            onClick={onClose}
            className="text-[#9B9A97] hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-auto bg-[#f6f9fc]">
          <iframe
            src={`/api/admin/emails/preview?template=${templateKey}`}
            className="w-full h-full min-h-[600px]"
            title="Email Preview"
          />
        </div>
      </div>
    </div>
  );
}

export default function EmailCampaignTable({
  onSendTest,
  sendingTemplate,
}: EmailCampaignTableProps) {
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  return (
    <>
      <div className="bg-[#2B2E32] rounded-xl border border-[#3D3D3D] overflow-hidden">
        <div className="p-4 border-b border-[#3D3D3D]">
          <h2 className="text-lg font-semibold text-white">Email Campaigns</h2>
          <p className="text-sm text-[#9B9A97] mt-1">
            Automated drip campaign templates
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#1A1A1A]">
                <th className="text-left px-4 py-3 text-sm font-medium text-[#9B9A97]">
                  Email
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#9B9A97]">
                  Trigger
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#9B9A97]">
                  Timing
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-[#9B9A97]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  className="border-t border-[#3D3D3D] hover:bg-[#3D3D3D]/30"
                >
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setPreviewTemplate(campaign.templateKey)}
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
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setPreviewTemplate(campaign.templateKey)}
                        className="px-3 py-1 rounded text-sm bg-[#3D3D3D] hover:bg-[#4D4D4D] transition-colors"
                      >
                        Preview
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

      {previewTemplate && (
        <PreviewModal
          templateKey={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
        />
      )}
    </>
  );
}

export { campaigns };
export type { EmailCampaign };
