export type DirectionReviewAgentFlag = "likely_reversed" | "unsure"

export interface DirectionReviewCohortItem {
  captureId: string
  agentFlag: DirectionReviewAgentFlag
}

export interface DirectionReviewCohort {
  id: string
  label: string
  items: readonly DirectionReviewCohortItem[]
}

const recordedDirectionAudit20260902 = {
  id: "recorded-direction-audit-2026-09-02",
  label: "Recorded-direction audit · 2 Sep 2026",
  items: [
    { captureId: "c8ab8868-b254-43e4-8176-2ee38a7d538f", agentFlag: "likely_reversed" },
    { captureId: "5b21c48c-e8fb-4eb3-8fe6-146d090f0576", agentFlag: "likely_reversed" },
    { captureId: "f7c5263b-c4da-4d73-adbd-6df034204380", agentFlag: "unsure" },
    { captureId: "18c4d39f-c7fc-4df0-b4e4-33a349a8bd8c", agentFlag: "unsure" },
    { captureId: "cf7ef2d7-45ea-49cd-9c8e-7e35c8d2fff2", agentFlag: "likely_reversed" },
    { captureId: "3b0a5f8d-5a6c-4b1d-a954-125094988e70", agentFlag: "likely_reversed" },
    { captureId: "3df84d2c-5882-4c05-a4d6-ff5973394273", agentFlag: "likely_reversed" },
    { captureId: "e62e09ae-2ce2-47a2-8077-d405449af0b7", agentFlag: "likely_reversed" },
    { captureId: "f2a8f60e-119c-4e09-b832-294779883605", agentFlag: "likely_reversed" },
    { captureId: "22981bba-494d-4842-88ab-baf5c9337b53", agentFlag: "likely_reversed" },
    { captureId: "edc14629-8aa0-42d3-b2b6-9f1e296fa5b1", agentFlag: "likely_reversed" },
    { captureId: "9111a36b-0f24-4bf5-b240-a82eaa12c4ec", agentFlag: "likely_reversed" },
    { captureId: "d5b43f1c-29fd-4dc1-97e5-f6994f266b18", agentFlag: "likely_reversed" },
    { captureId: "1e86b225-0fe0-4ac3-a56b-8c17dff3a1eb", agentFlag: "likely_reversed" },
    { captureId: "533bb9b9-0318-40a5-a2d8-d0a14568126b", agentFlag: "likely_reversed" },
    { captureId: "1b673611-2a5e-4ec6-a5f8-d6b17c775029", agentFlag: "likely_reversed" },
    { captureId: "957fb614-0e1f-490f-b0ea-57a261db42ab", agentFlag: "likely_reversed" },
    { captureId: "bf602877-daca-47d4-8947-38376c93ad2b", agentFlag: "likely_reversed" },
    { captureId: "88ec0ccf-097a-4f7d-86ed-91d64c5bf7f4", agentFlag: "likely_reversed" },
    { captureId: "572d1d3f-c322-4797-9165-f5a7f4fc2bab", agentFlag: "likely_reversed" },
    { captureId: "3b5dde93-2421-40a8-8c7a-b874d058944e", agentFlag: "likely_reversed" },
    { captureId: "06aa8333-3c70-4d88-8515-95264c08ff40", agentFlag: "likely_reversed" },
    { captureId: "8eeebf67-771b-49db-8194-3e5bb50d6600", agentFlag: "likely_reversed" },
    { captureId: "db99d60c-4887-4048-ae15-5941564e0797", agentFlag: "likely_reversed" },
    { captureId: "6c39b0a2-31cf-4a6e-9adc-634cb157a3a2", agentFlag: "likely_reversed" },
    { captureId: "e3d408ed-3ee4-45f1-97df-5088c21816bf", agentFlag: "likely_reversed" },
    { captureId: "f29ca05a-daa0-4f9c-9523-243c3358bab7", agentFlag: "likely_reversed" },
    { captureId: "94e86884-10ac-4f8e-8756-211447ec4438", agentFlag: "likely_reversed" },
    { captureId: "97317135-7cba-466f-ab27-399f8351d974", agentFlag: "likely_reversed" },
    { captureId: "a9d74fe7-19b5-468a-93b3-15cc3aec5e84", agentFlag: "likely_reversed" },
    { captureId: "a7053540-8e9e-4cff-b885-3b8ffe152712", agentFlag: "likely_reversed" },
    { captureId: "fde3053d-6bc8-4abc-a538-2681c0a2f995", agentFlag: "likely_reversed" },
    { captureId: "2813ffe1-dcc8-4ebc-af68-e9b06b911fe7", agentFlag: "likely_reversed" },
    { captureId: "9399d4a4-38a3-49f5-90fc-1ed10f426aa6", agentFlag: "likely_reversed" },
    { captureId: "5bc5dadf-a94b-4d7e-bc2a-64db9c8e53cb", agentFlag: "unsure" },
    { captureId: "3156294d-9aaa-4f87-b09a-96b29f8e134f", agentFlag: "likely_reversed" },
    { captureId: "074361ee-f78c-4fc6-bd19-a64917d54824", agentFlag: "likely_reversed" },
    { captureId: "08c88eae-21b5-423b-a82d-161733f0f4c0", agentFlag: "likely_reversed" },
    { captureId: "dd7a9fac-d736-4bed-b7e5-6e3d044864a4", agentFlag: "likely_reversed" },
    { captureId: "58ee93a8-b110-4190-9d85-ce8706bd36d0", agentFlag: "likely_reversed" },
    { captureId: "9013eafa-ee57-42d9-81bf-be6b9fc56de8", agentFlag: "likely_reversed" },
    { captureId: "ec6657bd-b10a-430c-8a26-add389169fcd", agentFlag: "likely_reversed" },
    { captureId: "5a84e20d-8a50-42a4-b457-b11c3d222811", agentFlag: "likely_reversed" },
    { captureId: "3efea4b9-781a-4dcd-b99f-197d28428ee3", agentFlag: "likely_reversed" },
    { captureId: "44780db2-caa4-4d80-98e3-e5661a5d565d", agentFlag: "likely_reversed" },
    { captureId: "11c98675-d58f-4dee-950f-cffac0432377", agentFlag: "likely_reversed" },
    { captureId: "cbb51938-bb35-4911-b8db-bb4138c83407", agentFlag: "likely_reversed" },
    { captureId: "24227a30-7401-4138-80b5-bfe526ae504f", agentFlag: "likely_reversed" },
    { captureId: "302d87cc-9ce5-494c-aa7a-5a03e111043d", agentFlag: "likely_reversed" },
    { captureId: "66c6347c-b31a-4cec-8565-9977946b85f5", agentFlag: "likely_reversed" },
    { captureId: "a54586c0-952d-4a2d-86b0-a1ec14efe969", agentFlag: "likely_reversed" },
    { captureId: "f0c8fe0f-adda-474d-8874-c1f7298e3c05", agentFlag: "likely_reversed" },
    { captureId: "992f5ecc-c4c4-4f09-96c8-71fcf15b6f7b", agentFlag: "likely_reversed" },
    { captureId: "fb0aebfd-0320-4ef4-94e1-862ec5c0d0b6", agentFlag: "likely_reversed" },
    { captureId: "f2b83da0-5ac9-4b2c-9a0b-390ed09197ce", agentFlag: "likely_reversed" },
    { captureId: "9b25ce2d-7a85-452a-b4be-21b962db05c1", agentFlag: "likely_reversed" },
    { captureId: "35ba10df-99ec-4e8e-8bfc-bae30d18c79d", agentFlag: "likely_reversed" },
    { captureId: "b547f500-0b45-4d64-9bfb-21bc7b79c373", agentFlag: "likely_reversed" },
    { captureId: "eb9e6b4f-e45d-4743-b84d-3fcc4e7aca8b", agentFlag: "likely_reversed" },
    { captureId: "d82e06a0-b779-4548-bdbb-5326f87c7ea5", agentFlag: "likely_reversed" },
    { captureId: "80137f87-8b1c-4722-b5d0-6d05dc7e56f3", agentFlag: "unsure" },
    { captureId: "21c52c11-5715-4eaa-935b-3296b5c2d275", agentFlag: "likely_reversed" },
    { captureId: "ccb67dbe-22f6-4371-aabc-e070367268af", agentFlag: "likely_reversed" },
    { captureId: "26513490-a162-4634-b903-1972350d7fc8", agentFlag: "likely_reversed" },
    { captureId: "4f5655c0-5c55-4d68-b718-43ed4d5ed886", agentFlag: "likely_reversed" },
    { captureId: "cb81f66e-4006-411a-850d-d2284eeef102", agentFlag: "likely_reversed" },
    { captureId: "629f0459-919d-4c52-85a9-d369f54ff9c6", agentFlag: "likely_reversed" },
    { captureId: "4a8e1343-d8fb-450b-8294-8b69e110dea4", agentFlag: "likely_reversed" },
  ],
} as const satisfies DirectionReviewCohort

const cohorts = new Map<string, DirectionReviewCohort>([
  [recordedDirectionAudit20260902.id, recordedDirectionAudit20260902],
])

export function directionReviewCohort(id: string | null | undefined): DirectionReviewCohort | null {
  return id ? cohorts.get(id) || null : null
}
