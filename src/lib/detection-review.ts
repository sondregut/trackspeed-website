export const ADMIN_REVIEW_DEVICE_ID = "admin-dashboard"
export const ADMIN_REVIEW_SCHEMA = 4

export const SESSION_SHIRT_CONTRASTS = ["good", "ok", "poor"] as const

export type SessionShirtContrast = (typeof SESSION_SHIRT_CONTRASTS)[number]

export const DETECTION_REVIEW_ISSUES = [
  "unlabeled",
  "good",
  "early",
  "late",
  "arm",
  "leg",
  "wrongFrame",
  "blur",
  "thumbnail",
  "false_positive",
  "real_crossing",
  "other",
] as const

export type DetectionReviewIssue = (typeof DETECTION_REVIEW_ISSUES)[number]

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && uuidPattern.test(value)
}

export function adminReviewKey(captureId: string): string {
  return `admin:capture:${captureId.toLowerCase()}`
}

export function detectionReviewIdentityKey(
  sessionId: string | null | undefined,
  runNumber: number | null | undefined,
  target: string | null | undefined,
): string | null {
  if (!sessionId || !Number.isInteger(runNumber) || (runNumber ?? 0) < 0) return null
  return `${sessionId.toLowerCase()}:run${runNumber}:${normalizeReviewTarget(target || "crossing")}`
}

export function normalizeReviewTarget(gateLabel: string | null): string {
  const normalized = (gateLabel || "crossing").toLowerCase().replace(/[^a-z]/g, "")
  if (normalized.includes("start")) return "start"
  if (normalized.includes("finish")) return "finish"
  if (normalized.includes("lap")) return "lap"
  return "crossing"
}

export function isDetectionReviewIssue(value: unknown): value is DetectionReviewIssue {
  return (
    typeof value === "string" &&
    (DETECTION_REVIEW_ISSUES as readonly string[]).includes(value)
  )
}

export function isSessionShirtContrast(value: unknown): value is SessionShirtContrast {
  return (
    typeof value === "string" &&
    (SESSION_SHIRT_CONTRASTS as readonly string[]).includes(value)
  )
}

export function normalizedCoordinate(value: unknown): number | null | undefined {
  if (value === null || value === undefined || value === "") return null
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined
  if (value < 0 || value > 1) return undefined
  return value
}

export function detectorDisplayPosition(capture: {
  interpolated_display_position?: number | null
  projected_display_position?: number | null
  detector_position?: number | null
  configured_gate_position?: number | null
}): number {
  const candidates = [
    capture.interpolated_display_position,
    capture.projected_display_position,
    capture.detector_position,
    capture.configured_gate_position,
    0.5,
  ]
  const value = candidates.find(
    (candidate): candidate is number =>
      typeof candidate === "number" && Number.isFinite(candidate),
  )
  return Math.min(1, Math.max(0, value ?? 0.5))
}
