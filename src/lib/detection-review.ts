export const ADMIN_REVIEW_DEVICE_ID = "admin-dashboard"
export const ADMIN_REVIEW_SCHEMA = 7

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

export const POINT_FREE_DETECTION_REVIEW_ISSUES = [
  "ignore_crossing",
  "phone_shake",
  "false_positive",
  "real_crossing",
  "outsideFrameBefore",
  "outsideFrameAfter",
] as const satisfies readonly DetectionReviewIssue[]

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

export type ReviewPixelAuditValidation =
  | { ok: true; audit: ReviewPixelAudit }
  | { ok: false; error: string }

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

export function isPointFreeDetectionReviewIssue(
  value: unknown,
): value is (typeof POINT_FREE_DETECTION_REVIEW_ISSUES)[number] {
  return (
    typeof value === "string"
    && (POINT_FREE_DETECTION_REVIEW_ISSUES as readonly string[]).includes(value)
  )
}

export function isIgnoredCrossingIssue(value: unknown): boolean {
  return value === "ignore_crossing" || value === "false_positive"
}

export function falseTriggerReviewLabel(value: unknown): string | null {
  if (isIgnoredCrossingIssue(value)) return "Ignore crossing"
  if (value === "phone_shake") return "Phone shake"
  return null
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
