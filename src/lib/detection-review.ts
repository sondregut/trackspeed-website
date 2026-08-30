export const ADMIN_REVIEW_DEVICE_ID = "admin-dashboard"

export type DetectionReviewEvidenceProvenance =
  | "admin_capture_only"
  | "admin_device_context"
  | "admin_session_context"

export function detectionReviewEvidenceProvenance(
  contextDeviceId: string | null | undefined,
): DetectionReviewEvidenceProvenance {
  if (!contextDeviceId) return "admin_capture_only"
  return contextDeviceId === ADMIN_REVIEW_DEVICE_ID
    ? "admin_session_context"
    : "admin_device_context"
}
export const ADMIN_REVIEW_SCHEMA = 8

/**
 * Review rows before this boundary remain in Supabase for audit/history, but
 * are intentionally excluded from the active dashboard and optimizer dataset.
 * This starts the clean post-reliability-fix collection requested on July 24.
 */
export const CURRENT_DETECTION_REVIEW_DATASET = {
  id: "post-reliability-fixes-2026-07-24",
  label: "Post-reliability-fix tests",
  startedAt: "2026-07-24T14:30:00.000Z",
} as const

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
  "outsideFrameBefore",
  "outsideFrameAfter",
  "blur",
  "thumbnail",
  "ignore_crossing",
  "phone_shake",
  "false_positive",
  "real_crossing",
  "other",
] as const

export type DetectionReviewIssue = (typeof DETECTION_REVIEW_ISSUES)[number]

const SCENE_MOTION_CAUSE_VALUES = [
  "wind_trees",
  "shadow",
  "light_glare",
  "other_scene",
] as const

export type SceneMotionCause = (typeof SCENE_MOTION_CAUSE_VALUES)[number]

export const SCENE_MOTION_CAUSE_OPTIONS = [
  { value: "wind_trees", label: "Wind / trees" },
  { value: "light_glare", label: "Light / glare" },
  { value: "other_scene", label: "Other scene" },
] as const satisfies readonly { value: SceneMotionCause; label: string }[]

const sceneMotionCauseValues: readonly SceneMotionCause[] = SCENE_MOTION_CAUSE_VALUES

export function isSceneMotionCause(value: unknown): value is SceneMotionCause {
  return (
    typeof value === "string"
    && (sceneMotionCauseValues as readonly string[]).includes(value)
  )
}

export function normalizeSceneMotionCauses(values: readonly unknown[]): SceneMotionCause[] {
  const requested = new Set(values.filter(isSceneMotionCause))
  return sceneMotionCauseValues.filter((value) => requested.has(value))
}

export function serializeSceneMotionCauses(causes: readonly unknown[]): string {
  const normalized = normalizeSceneMotionCauses(causes)
  return normalized.length ? normalized.join(",") : "none"
}

export function sceneMotionCausesFromRawMessage(rawMessage: unknown): SceneMotionCause[] {
  if (typeof rawMessage !== "string") return []
  const match = rawMessage.match(/(?:^|\s)sceneMotionCauses=([a-z_,]+)(?=\s|$)/)
  return match ? normalizeSceneMotionCauses(match[1].split(",")) : []
}

export function sceneMotionCausesEqual(
  left: readonly unknown[],
  right: readonly unknown[],
): boolean {
  const normalizedLeft = normalizeSceneMotionCauses(left)
  const normalizedRight = normalizeSceneMotionCauses(right)
  return (
    normalizedLeft.length === normalizedRight.length
    && normalizedLeft.every((value, index) => value === normalizedRight[index])
  )
}

export const POINT_FREE_DETECTION_REVIEW_ISSUES = [
  "ignore_crossing",
  "phone_shake",
  "false_positive",
  "real_crossing",
  "outsideFrameBefore",
  "outsideFrameAfter",
] as const satisfies readonly DetectionReviewIssue[]

/**
 * These classifications describe captures where a source-image torso point
 * would be misleading. Outside-frame timing labels are intentionally absent:
 * they may be saved alone, or combined with a reference point in the nearest
 * available frame.
 */
export const POINT_FORBIDDEN_DETECTION_REVIEW_ISSUES = [
  "ignore_crossing",
  "phone_shake",
  "false_positive",
  "real_crossing",
] as const satisfies readonly DetectionReviewIssue[]

export type DetectionReviewCrossingTiming = "earlier" | "later"

export interface NormalizedImagePoint {
  x: number
  y: number
}

export interface ImagePointMeasurement {
  normalized: NormalizedImagePoint
  pixel: NormalizedImagePoint
  imageWidthPx: number
  imageHeightPx: number
}

export interface ReviewPixelAudit {
  imageWidthPx: number
  imageHeightPx: number
  actualPixelX: number | null
  actualPixelY: number | null
}

export interface DetectorDisplayResolution {
  x: number
  verified: boolean
  source:
    | "captured_display_coordinate"
    | "interpolated_coordinate"
    | "shifted_crossing_coordinate"
    | "projected_coordinate"
    | "detector_coordinate"
    | "configured_gate_fallback"
}

export type DetectionReviewDirection = "L->R" | "R->L"

export type DetectionReviewDirectionEvidence =
  | "motion"
  | "post_verified"
  | "post_corrected"
  | "fallback"
  | "stored"
  | "conflict"
  | "unknown"

export interface DetectionReviewDirectionResolution {
  direction: DetectionReviewDirection | null
  evidence: DetectionReviewDirectionEvidence
}

export function detectionReviewDirectionLabel(
  direction: string | null,
  evidence: DetectionReviewDirectionEvidence,
): string {
  if (evidence === "conflict") return "direction conflict"
  if (evidence === "stored" || evidence === "fallback") {
    return "direction unverified"
  }
  if (!direction || evidence === "unknown") return "direction unavailable"
  const arrow = direction.replace("->", "→")
  if (evidence === "post_corrected") return `${arrow} · frame-corrected`
  if (evidence === "post_verified") return `${arrow} · frame-verified`
  if (evidence === "motion") return `${arrow} · frame-verified`
  return "direction unavailable"
}

export type ReviewPixelAuditValidation =
  | { ok: true; audit: ReviewPixelAudit }
  | { ok: false; error: string }

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function currentDetectionReviewSince(
  windowDays: number,
  nowMs: number = Date.now(),
): string {
  const boundedWindowDays = Number.isFinite(windowDays)
    ? Math.min(365, Math.max(1, windowDays))
    : 30
  const windowStartedAtMs = nowMs - boundedWindowDays * 24 * 60 * 60 * 1000
  const datasetStartedAtMs = Date.parse(CURRENT_DETECTION_REVIEW_DATASET.startedAt)
  return new Date(Math.max(windowStartedAtMs, datasetStartedAtMs)).toISOString()
}

export function isCurrentDetectionReviewCapture(createdAt: unknown): boolean {
  if (typeof createdAt !== "string") return false
  const createdAtMs = Date.parse(createdAt)
  return (
    Number.isFinite(createdAtMs)
    && createdAtMs >= Date.parse(CURRENT_DETECTION_REVIEW_DATASET.startedAt)
  )
}

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
  deviceId?: string | null,
): string | null {
  if (!sessionId || !Number.isInteger(runNumber) || (runNumber ?? 0) < 0) return null
  const device = deviceId?.trim().toLowerCase()
  const deviceSegment = device ? `:device:${device}` : ""
  return `${sessionId.toLowerCase()}${deviceSegment}:run${runNumber}:${normalizeReviewTarget(target || "crossing")}`
}

export function detectionReviewSessionIdentifiers(
  values: readonly (string | null | undefined)[],
): string[] {
  return [...new Set(
    values
      .map((value) => value?.trim().toLowerCase() || "")
      .filter(Boolean),
  )]
}

export interface DetectionReviewOrderableCapture {
  id: string
  sessionId: string | null
  deviceId: string
  runNumber: number
  target: string
  createdAt: string
}

export function detectionReviewBatchKey(
  capture: Pick<DetectionReviewOrderableCapture, "id" | "sessionId" | "deviceId">,
): string {
  if (!capture.sessionId) return `unlinked:${capture.id.toLowerCase()}`
  return `session:${capture.sessionId.toLowerCase()}:device:${capture.deviceId.toLowerCase()}`
}

function reviewTargetOrder(target: string): number {
  const normalized = normalizeReviewTarget(target)
  if (normalized === "start") return 0
  if (normalized === "crossing") return 1
  if (normalized === "lap") return 2
  if (normalized === "finish") return 3
  return 4
}

/**
 * Keep one phone/setup contiguous while reviewing. Newer setup batches appear
 * first, but every batch itself runs forward from Run 1 to Run N.
 */
export function orderDetectionReviewCaptures<T extends DetectionReviewOrderableCapture>(
  captures: readonly T[],
): T[] {
  const batchStartedAt = new Map<string, number>()
  for (const capture of captures) {
    const key = detectionReviewBatchKey(capture)
    const parsed = Date.parse(capture.createdAt)
    const timestamp = Number.isFinite(parsed) ? parsed : 0
    const existing = batchStartedAt.get(key)
    if (existing === undefined || timestamp < existing) batchStartedAt.set(key, timestamp)
  }

  return [...captures].sort((left, right) => {
    const leftKey = detectionReviewBatchKey(left)
    const rightKey = detectionReviewBatchKey(right)
    if (leftKey !== rightKey) {
      const startedAtDifference = (batchStartedAt.get(rightKey) || 0) - (batchStartedAt.get(leftKey) || 0)
      if (startedAtDifference !== 0) return startedAtDifference
      return leftKey.localeCompare(rightKey)
    }

    if (left.runNumber !== right.runNumber) return left.runNumber - right.runNumber
    const targetDifference = reviewTargetOrder(left.target) - reviewTargetOrder(right.target)
    if (targetDifference !== 0) return targetDifference
    const createdAtDifference = Date.parse(left.createdAt) - Date.parse(right.createdAt)
    if (Number.isFinite(createdAtDifference) && createdAtDifference !== 0) return createdAtDifference
    return left.id.localeCompare(right.id)
  })
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

export function isPointFreeDetectionReviewIssue(
  value: unknown,
): value is (typeof POINT_FREE_DETECTION_REVIEW_ISSUES)[number] {
  return (
    typeof value === "string"
    && (POINT_FREE_DETECTION_REVIEW_ISSUES as readonly string[]).includes(value)
  )
}

export function isPointForbiddenDetectionReviewIssue(
  value: unknown,
): value is (typeof POINT_FORBIDDEN_DETECTION_REVIEW_ISSUES)[number] {
  return (
    typeof value === "string"
    && (POINT_FORBIDDEN_DETECTION_REVIEW_ISSUES as readonly string[]).includes(value)
  )
}

export interface DetectionReviewCaptureReference {
  id: string
  sessionId: string | null
  runNumber: number
  target: string
}

export type DetectionReviewSetSelector =
  | {
      kind: "capture"
      key: string
      captureId: string
      label: string
    }
  | {
      kind: "run"
      key: string
      sessionPrefix: string
      runNumber: number
      target: string | null
      devicePrefix: string | null
      label: string
    }

export interface DetectionReviewSet {
  raw: string
  selectors: DetectionReviewSetSelector[]
  rejected: string[]
}

export interface DetectionReviewSetCapture {
  id: string
  sessionId: string | null
  deviceId: string
  runNumber: number
  target: string
}

/**
 * Parse a durable, URL-safe list of captures to review. Full capture UUIDs are
 * exact. Human-readable run references use
 * `session-prefix:run[:target][@device-prefix]`, for example
 * `6be6016f:44:crossing`.
 */
export function parseDetectionReviewSet(value: unknown): DetectionReviewSet {
  const raw = typeof value === "string" ? value.trim() : ""
  const selectors: DetectionReviewSetSelector[] = []
  const rejected: string[] = []
  const seen = new Set<string>()

  for (const candidate of raw.split(/[\n,;|]+/)) {
    const token = candidate.trim()
    if (!token) continue

    const captureId = token.replace(/^capture:/i, "").trim().toLowerCase()
    if (isUuid(captureId)) {
      const key = `capture:${captureId}`
      if (!seen.has(key)) {
        seen.add(key)
        selectors.push({
          kind: "capture",
          key,
          captureId,
          label: `Capture ${captureId.slice(0, 8)}`,
        })
      }
      continue
    }

    const runMatch = token.match(
      /^(?:session:)?([a-z0-9-]{4,}):(?:run)?(\d+)(?::(start|crossing|lap|finish))?(?:@([a-z0-9._-]{2,}))?$/i,
    )
    if (!runMatch) {
      rejected.push(token)
      continue
    }

    const sessionPrefix = runMatch[1].toLowerCase()
    const runNumber = Number(runMatch[2])
    if (!Number.isSafeInteger(runNumber) || runNumber < 0) {
      rejected.push(token)
      continue
    }
    const target = runMatch[3] ? normalizeReviewTarget(runMatch[3]) : null
    const devicePrefix = runMatch[4]?.toLowerCase() || null
    const key = `run:${sessionPrefix}:${runNumber}:${target || "*"}:${devicePrefix || "*"}`
    if (seen.has(key)) continue
    seen.add(key)
    selectors.push({
      kind: "run",
      key,
      sessionPrefix,
      runNumber,
      target,
      devicePrefix,
      label: `Session ${sessionPrefix.slice(0, 8)} · Run ${runNumber}${target ? ` · ${target}` : ""}${devicePrefix ? ` · device ${devicePrefix}` : ""}`,
    })
  }

  return { raw, selectors, rejected }
}

export function detectionReviewSetSelectorMatches(
  selector: DetectionReviewSetSelector,
  capture: DetectionReviewSetCapture,
): boolean {
  if (selector.kind === "capture") {
    return capture.id.toLowerCase() === selector.captureId
  }

  return Boolean(
    capture.sessionId?.toLowerCase().startsWith(selector.sessionPrefix)
    && capture.runNumber === selector.runNumber
    && (!selector.target || normalizeReviewTarget(capture.target) === selector.target)
    && (!selector.devicePrefix || capture.deviceId.toLowerCase().startsWith(selector.devicePrefix)),
  )
}

export function detectionReviewSetMatches(
  reviewSet: DetectionReviewSet,
  capture: DetectionReviewSetCapture,
): boolean {
  return reviewSet.selectors.some((selector) =>
    detectionReviewSetSelectorMatches(selector, capture),
  )
}

export class DetectionReviewBlockingError extends Error {
  readonly captureId: string

  constructor(captureId: string, message: string) {
    super(message)
    this.name = "DetectionReviewBlockingError"
    this.captureId = captureId
  }
}

export function detectionReviewCaptureReference(
  capture: Pick<DetectionReviewCaptureReference, "sessionId" | "runNumber" | "target">,
): string {
  const session = capture.sessionId ? capture.sessionId.slice(0, 8) : "unlinked"
  return `Session ${session} · Run ${capture.runNumber} · ${capture.target}`
}

export function detectionReviewDraftValidationError(input: {
  capture: DetectionReviewCaptureReference
  hasPoint: boolean
  issue: DetectionReviewIssue
}): DetectionReviewBlockingError | null {
  const reference = detectionReviewCaptureReference(input.capture)
  if (!input.hasPoint && !isPointFreeDetectionReviewIssue(input.issue)) {
    return new DetectionReviewBlockingError(
      input.capture.id,
      `Blocking crossing: ${reference}. Add a source-image point or choose Scene motion, Ignore crossing, Phone shake, or an outside-frame classification.`,
    )
  }
  if (input.hasPoint && isPointForbiddenDetectionReviewIssue(input.issue)) {
    return new DetectionReviewBlockingError(
      input.capture.id,
      `Blocking crossing: ${reference}. Clear its source-image point before saving the non-crossing classification. Earlier/later timing can be combined with a point.`,
    )
  }
  return null
}

/**
 * The UI speaks from the crossing's perspective, while the stored early/late
 * issue speaks from the detector's perspective. A crossing that happened
 * earlier means the detector was late, and vice versa. Without a point, the
 * same relation is stored as an outside-frame classification.
 */
export function detectionReviewCrossingTiming(
  value: unknown,
): DetectionReviewCrossingTiming | null {
  if (value === "late" || value === "outsideFrameBefore") return "earlier"
  if (value === "early" || value === "outsideFrameAfter") return "later"
  return null
}

export function detectionReviewIssueForCrossingTiming(
  timing: DetectionReviewCrossingTiming,
  hasPoint: boolean,
): DetectionReviewIssue {
  if (timing === "earlier") return hasPoint ? "late" : "outsideFrameBefore"
  return hasPoint ? "early" : "outsideFrameAfter"
}

export function isIgnoredCrossingIssue(value: unknown): boolean {
  return value === "ignore_crossing"
}

export function falseTriggerReviewLabel(value: unknown): string | null {
  if (value === "ignore_crossing") return "Ignore crossing"
  if (value === "false_positive") return "Scene motion"
  if (value === "phone_shake") return "Phone shake"
  return null
}

export function detectionReviewImageRequestUrl(
  sourceUrl: string,
  retryAttempt: number,
): string {
  if (!Number.isInteger(retryAttempt) || retryAttempt <= 0) return sourceUrl
  const separator = sourceUrl.includes("?") ? "&" : "?"
  return `${sourceUrl}${separator}loadAttempt=${retryAttempt}`
}

function normalizedDetectionReviewDirection(
  value: unknown,
): DetectionReviewDirection | null {
  if (typeof value !== "string") return null
  const normalized = value
    .trim()
    .toUpperCase()
    .replaceAll("→", ">")
    .replaceAll("-", "")
    .replaceAll(" ", "")
  if (normalized === "L>R") return "L->R"
  if (normalized === "R>L") return "R->L"
  return null
}

function mirroredDetectionReviewDirection(
  direction: DetectionReviewDirection,
  mirrorX: boolean,
): DetectionReviewDirection {
  if (!mirrorX) return direction
  return direction === "L->R" ? "R->L" : "L->R"
}

/**
 * Resolve the direction shown beside the rendered review image. Replica stores
 * detector-space direction, while selfie thumbnails are mirrored. A fallback
 * accepted at the crossing can also be superseded by consistent post-frame
 * motion evidence collected milliseconds later. Genuine motion conflicts stay
 * explicit instead of presenting one side as fact.
 */
export function resolveDetectionReviewDisplayDirection(input: {
  storedDirection: unknown
  isFrontCamera: boolean | null | undefined
  temporalEvidence?: { frames?: unknown[] } | null
}): DetectionReviewDirectionResolution {
  const storedDirection = normalizedDetectionReviewDirection(input.storedDirection)
  const frames = Array.isArray(input.temporalEvidence?.frames)
    ? input.temporalEvidence.frames.filter(
      (value): value is Record<string, unknown> => Boolean(value) && typeof value === "object",
    )
    : []
  const acceptedFrame = frames.find((frame) => frame.status === "accepted")
  const acceptedDirection = normalizedDetectionReviewDirection(acceptedFrame?.direction)
  const acceptedSource = typeof acceptedFrame?.directionSource === "string"
    ? acceptedFrame.directionSource
    : null
  const baseDirection = acceptedDirection || storedDirection

  if (
    storedDirection
    && acceptedDirection
    && storedDirection !== acceptedDirection
    && acceptedSource !== "motion_center_history"
  ) {
    return { direction: null, evidence: "conflict" }
  }

  const postDirections = [...new Set(
    frames
      .filter((frame) => (
        typeof frame.relativeFrame === "number"
        && frame.relativeFrame > 0
        && frame.directionSource === "motion_center_history"
      ))
      .map((frame) => normalizedDetectionReviewDirection(frame.direction))
      .filter((direction): direction is DetectionReviewDirection => Boolean(direction)),
  )]

  if (postDirections.length > 1) {
    return { direction: null, evidence: "conflict" }
  }

  const postDirection = postDirections[0] || null
  let resolvedDirection = baseDirection
  let evidence: DetectionReviewDirectionEvidence = acceptedSource === "motion_center_history"
    ? "motion"
    : acceptedSource === "center_vs_gate_fallback"
      ? "fallback"
      : storedDirection
        ? "stored"
        : "unknown"

  if (postDirection) {
    if (acceptedSource !== "motion_center_history") {
      evidence = postDirection === baseDirection ? "post_verified" : "post_corrected"
      resolvedDirection = postDirection
    } else if (baseDirection !== postDirection) {
      return { direction: null, evidence: "conflict" }
    }
  }

  if (!resolvedDirection) return { direction: null, evidence: "unknown" }
  return {
    direction: mirroredDetectionReviewDirection(
      resolvedDirection,
      input.isFrontCamera === true,
    ),
    evidence,
  }
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

export function resolveDetectorYPosition(input: {
  capturedDetectorY: unknown
  comparisonDetectorYPx?: unknown
  workBufferHeightPx?: unknown
  workBufferWidthPx?: unknown
  renderedImageWidthPx?: unknown
  renderedImageHeightPx?: unknown
}): number | null {
  const captured = normalizedCoordinate(input.capturedDetectorY)
  if (typeof captured === "number") return captured

  const detectorYPx = finitePixelCoordinate(input.comparisonDetectorYPx)
  if (detectorYPx === null || detectorYPx < 0) return null

  const capturedWorkHeight = finitePixelCoordinate(input.workBufferHeightPx)
  let workHeight = capturedWorkHeight && capturedWorkHeight > 0
    ? capturedWorkHeight
    : null
  if (workHeight === null) {
    const workWidth = finitePixelCoordinate(input.workBufferWidthPx)
    const renderedWidth = finitePixelCoordinate(input.renderedImageWidthPx)
    const renderedHeight = finitePixelCoordinate(input.renderedImageHeightPx)
    if (
      workWidth === null || workWidth <= 0
      || renderedWidth === null || renderedWidth <= 0
      || renderedHeight === null || renderedHeight <= 0
    ) {
      return null
    }
    workHeight = workWidth * renderedHeight / renderedWidth
  }

  const normalized = detectorYPx / workHeight
  return normalized >= 0 && normalized <= 1 ? normalized : null
}

function positiveDimension(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isInteger(value)) return null
  if (value < 1 || value > 16_384) return null
  return value
}

function finitePixelCoordinate(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

/**
 * Convert a browser pointer into the same normalized image space used by the
 * iOS review marker. `elementRect` may contain letterboxing from
 * `object-fit: contain`; clicks in those bars are rejected.
 */
export function measureContainedImagePoint(
  clientX: number,
  clientY: number,
  elementRect: { left: number; top: number; width: number; height: number },
  naturalWidth: number,
  naturalHeight: number,
): ImagePointMeasurement | null {
  if (
    !Number.isFinite(clientX)
    || !Number.isFinite(clientY)
    || !Number.isFinite(elementRect.left)
    || !Number.isFinite(elementRect.top)
    || !(elementRect.width > 0)
    || !(elementRect.height > 0)
    || !(naturalWidth > 0)
    || !(naturalHeight > 0)
  ) {
    return null
  }

  const scale = Math.min(
    elementRect.width / naturalWidth,
    elementRect.height / naturalHeight,
  )
  const contentWidth = naturalWidth * scale
  const contentHeight = naturalHeight * scale
  const contentLeft = elementRect.left + (elementRect.width - contentWidth) / 2
  const contentTop = elementRect.top + (elementRect.height - contentHeight) / 2
  const localX = clientX - contentLeft
  const localY = clientY - contentTop
  const epsilon = 0.000_001

  if (
    localX < -epsilon
    || localY < -epsilon
    || localX > contentWidth + epsilon
    || localY > contentHeight + epsilon
  ) {
    return null
  }

  const normalized = {
    x: Math.min(1, Math.max(0, localX / contentWidth)),
    y: Math.min(1, Math.max(0, localY / contentHeight)),
  }
  return {
    normalized,
    pixel: {
      x: normalized.x * naturalWidth,
      y: normalized.y * naturalHeight,
    },
    imageWidthPx: naturalWidth,
    imageHeightPx: naturalHeight,
  }
}

export function makeReviewPixelAudit(
  point: NormalizedImagePoint | null,
  naturalWidth: number,
  naturalHeight: number,
): ReviewPixelAudit {
  return {
    imageWidthPx: naturalWidth,
    imageHeightPx: naturalHeight,
    actualPixelX: point ? point.x * naturalWidth : null,
    actualPixelY: point ? point.y * naturalHeight : null,
  }
}

/**
 * Fail closed when the normalized point, natural-image pixel point, and
 * server-decoded review JPEG do not all describe the same image coordinate.
 */
export function validateReviewPixelAudit(input: {
  actualX: number | null
  actualY: number | null
  imageWidthPx: unknown
  imageHeightPx: unknown
  actualPixelX: unknown
  actualPixelY: unknown
  renderedImageWidthPx: number
  renderedImageHeightPx: number
}): ReviewPixelAuditValidation {
  const imageWidthPx = positiveDimension(input.imageWidthPx)
  const imageHeightPx = positiveDimension(input.imageHeightPx)
  if (!imageWidthPx || !imageHeightPx) {
    return { ok: false, error: "Source image dimensions are missing or invalid" }
  }
  if (
    imageWidthPx !== input.renderedImageWidthPx
    || imageHeightPx !== input.renderedImageHeightPx
  ) {
    return { ok: false, error: "Review image dimensions do not match the selected source frame" }
  }

  const hasPoint = input.actualX !== null && input.actualY !== null
  if (!hasPoint) {
    if (
      (input.actualPixelX !== null && input.actualPixelX !== undefined)
      || (input.actualPixelY !== null && input.actualPixelY !== undefined)
    ) {
      return { ok: false, error: "Pixel coordinates must be empty when no review point is saved" }
    }
    return {
      ok: true,
      audit: {
        imageWidthPx,
        imageHeightPx,
        actualPixelX: null,
        actualPixelY: null,
      },
    }
  }

  const actualPixelX = finitePixelCoordinate(input.actualPixelX)
  const actualPixelY = finitePixelCoordinate(input.actualPixelY)
  if (actualPixelX === null || actualPixelY === null) {
    return { ok: false, error: "Source-image pixel coordinates are required for a review point" }
  }
  if (
    actualPixelX < 0
    || actualPixelX > imageWidthPx
    || actualPixelY < 0
    || actualPixelY > imageHeightPx
  ) {
    return { ok: false, error: "Source-image pixel coordinates are outside the selected frame" }
  }

  const pixelTolerance = 0.51
  if (
    Math.abs(actualPixelX - (input.actualX as number) * imageWidthPx) > pixelTolerance
    || Math.abs(actualPixelY - (input.actualY as number) * imageHeightPx) > pixelTolerance
  ) {
    return { ok: false, error: "Pixel coordinates do not match the normalized review point" }
  }

  return {
    ok: true,
    audit: {
      imageWidthPx,
      imageHeightPx,
      actualPixelX,
      actualPixelY,
    },
  }
}

export function detectionReviewMode(
  timingMode: string | null | undefined,
  numberOfPhones: number | null | undefined,
  target: string,
): "solo" | "multi" {
  const normalizedMode = timingMode?.trim().toLowerCase()
  if (normalizedMode === "solo" || normalizedMode === "multi") return normalizedMode
  if (numberOfPhones === 1) return "solo"
  if (typeof numberOfPhones === "number" && numberOfPhones >= 2) return "multi"
  return target === "crossing" || target === "lap" ? "solo" : "multi"
}

function finiteCoordinate(value: unknown): number | null {
  return (
    typeof value === "number"
    && Number.isFinite(value)
    && value >= 0
    && value <= 1
  )
    ? value
    : null
}

function transformedDisplayCoordinate(value: number, flipX: boolean) {
  return Math.min(1, Math.max(0, flipX ? 1 - value : value))
}

/**
 * Mirror the iOS `InterpolatedCrossingEdgeResolver` so the desktop red line
 * occupies the same rendered-image pixel as the phone review. A direct
 * display coordinate captured by newer app builds is preferred. Legacy rows
 * are only verified when their front/back-camera transform is known.
 */
export function resolveDetectorDisplayPosition(capture: {
  captured_display_position?: number | null
  interpolated_display_position?: number | null
  projected_display_position?: number | null
  detector_position?: number | null
  configured_gate_position?: number | null
  algo_interpolation_alpha?: number | null
  algo_s0?: number | null
  algo_s1?: number | null
  algo_work_width?: number | null
  algo_gate_position?: number | null
  algo_crossing_direction?: string | null
  has_x_anchor_comparison?: boolean
}, flipX: boolean | null | undefined): DetectorDisplayResolution {
  const capturedDisplayPosition = finiteCoordinate(capture.captured_display_position)
  if (capturedDisplayPosition !== null) {
    return {
      x: capturedDisplayPosition,
      verified: true,
      source: "captured_display_coordinate",
    }
  }

  const mirrorKnown = typeof flipX === "boolean"
  const interpolated = finiteCoordinate(capture.interpolated_display_position)
  if (mirrorKnown && interpolated !== null && capture.has_x_anchor_comparison) {
    return {
      x: transformedDisplayCoordinate(interpolated, flipX),
      verified: true,
      source: "interpolated_coordinate",
    }
  }

  const alpha = capture.algo_interpolation_alpha
  const s0 = capture.algo_s0
  const s1 = capture.algo_s1
  const workWidth = capture.algo_work_width
  const gatePosition = capture.algo_gate_position ?? capture.configured_gate_position
  if (
    mirrorKnown
    && typeof alpha === "number"
    && Number.isFinite(alpha)
    && typeof s0 === "number"
    && Number.isFinite(s0)
    && typeof s1 === "number"
    && Number.isFinite(s1)
    && typeof workWidth === "number"
    && Number.isFinite(workWidth)
    && workWidth > 0
    && typeof gatePosition === "number"
    && Number.isFinite(gatePosition)
  ) {
    const gateColumn = gatePosition * workWidth
    const usedPreviousFrame = alpha < 0.5
    const leftToRight = capture.algo_crossing_direction === "L->R"
    const shiftedX = leftToRight
      ? usedPreviousFrame ? gateColumn - s0 : gateColumn + s1
      : usedPreviousFrame ? gateColumn + s0 : gateColumn - s1
    const displayedX = flipX ? workWidth - 1 - shiftedX : shiftedX
    return {
      x: Math.min(1, Math.max(0, displayedX / workWidth)),
      verified: true,
      source: "shifted_crossing_coordinate",
    }
  }

  if (mirrorKnown && interpolated !== null) {
    return {
      x: transformedDisplayCoordinate(interpolated, flipX),
      verified: true,
      source: "interpolated_coordinate",
    }
  }

  const projected = finiteCoordinate(capture.projected_display_position)
  if (mirrorKnown && projected !== null) {
    return {
      x: transformedDisplayCoordinate(projected, flipX),
      verified: true,
      source: "projected_coordinate",
    }
  }

  const detector = finiteCoordinate(capture.detector_position)
  if (mirrorKnown && detector !== null) {
    return {
      x: transformedDisplayCoordinate(detector, flipX),
      verified: true,
      source: "detector_coordinate",
    }
  }

  const configured = finiteCoordinate(capture.configured_gate_position) ?? 0.5
  return {
    x: configured,
    verified: false,
    source: "configured_gate_fallback",
  }
}

export function detectorDisplayPosition(capture: {
  interpolated_display_position?: number | null
  projected_display_position?: number | null
  detector_position?: number | null
  configured_gate_position?: number | null
}): number {
  return resolveDetectorDisplayPosition(capture, null).x
}
