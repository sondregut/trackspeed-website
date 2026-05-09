export interface SMSTemplateData {
  name?: string;
  sessionCount?: number;
}

export interface SMSCampaign {
  id: string;
  name: string;
  trigger: string;
  timing: string;
  templateKey: string;
  message: string;
  charCount: number;
  isFirstMessage?: boolean;
}

const smsTemplateDefinitions = [
  {
    id: "welcome",
    name: "Welcome",
    trigger: "Phone verified + SMS opt-in",
    timing: "Immediately",
    message:
      "Hey! Thanks for trying TrackSpeed. Let me know if you need help getting started - just reply here. STOP to opt out",
    isFirstMessage: true,
  },
  {
    id: "tips_day3",
    name: "Tips Day 3",
    trigger: "After welcome",
    timing: "3 days",
    message:
      "Quick tip - you can use 2 phones to time splits! One at start, one at finish. Have you tried it?",
  },
  {
    id: "convert_day7",
    name: "Convert Day 7",
    trigger: "After tips (free users only)",
    timing: "7 days",
    message:
      "How's TrackSpeed working for you? If you want unlimited sessions or multi-phone timing, check out Pro: mytrackspeed.com/pro",
  },
  {
    id: "winback",
    name: "Winback",
    trigger: "Access expired",
    timing: "30 days after",
    message:
      "Hey, noticed you haven't timed in a while. Everything okay? Let me know if you hit any issues.",
  },
] as const;

export const smsCampaigns: SMSCampaign[] = smsTemplateDefinitions.map(
  (template) => ({
    ...template,
    templateKey: template.id,
    charCount: template.message.length,
  })
);

export function getSMSTemplateById(templateId: string): SMSCampaign | undefined {
  return smsCampaigns.find((template) => template.id === templateId);
}

export function renderSMSTemplate(
  templateId: string,
  data: SMSTemplateData = {}
): string {
  const template = getSMSTemplateById(templateId);
  if (!template) {
    throw new Error(`Unknown SMS template: ${templateId}`);
  }

  return template.message
    .replace("{name}", data.name ?? "")
    .replace("{sessionCount}", String(data.sessionCount ?? ""));
}
