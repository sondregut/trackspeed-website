import assert from "node:assert/strict"
import test from "node:test"
import {
  CURRENT_DETECTION_REVIEW_DATASET,
  currentDetectionReviewSince,
  detectionReviewMode,
  falseTriggerReviewLabel,
  isIgnoredCrossingIssue,
  isCurrentDetectionReviewCapture,
  isPointFreeDetectionReviewIssue,
  makeReviewPixelAudit,
  measureContainedImagePoint,
  resolveDetectorDisplayPosition,
  validateReviewPixelAudit,
} from "../src/lib/detection-review.ts"
import { jpegDimensions } from "../src/lib/jpeg-dimensions.ts"

test("archives all captures before the clean post-fix dataset boundary", () => {
  assert.equal(
    CURRENT_DETECTION_REVIEW_DATASET.startedAt,
    "2026-07-24T14:30:00.000Z",
  )
  assert.equal(isCurrentDetectionReviewCapture("2026-07-24T14:29:59.999Z"), false)
  assert.equal(isCurrentDetectionReviewCapture("2026-07-24T14:30:00.000Z"), true)
  assert.equal(isCurrentDetectionReviewCapture("not-a-date"), false)

  assert.equal(
    currentDetectionReviewSince(7, Date.parse("2026-07-24T15:00:00.000Z")),
    CURRENT_DETECTION_REVIEW_DATASET.startedAt,
  )
  assert.equal(
    currentDetectionReviewSince(7, Date.parse("2026-08-10T15:00:00.000Z")),
    "2026-08-03T15:00:00.000Z",
  )
})

test("maps a desktop click into the same normalized and pixel space as iOS", () => {
  const measurement = measureContainedImagePoint(
    190,
    340,
    { left: 10, top: 20, width: 360, height: 640 },
    720,
    1280,
  )

  assert.ok(measurement)
  assert.deepEqual(measurement.normalized, { x: 0.5, y: 0.5 })
  assert.deepEqual(measurement.pixel, { x: 360, y: 640 })
  assert.equal(measurement.imageWidthPx, 720)
  assert.equal(measurement.imageHeightPx, 1280)
})

test("ignores clicks in object-contain letterboxing", () => {
  const rect = { left: 0, top: 0, width: 400, height: 400 }
  assert.equal(measureContainedImagePoint(40, 200, rect, 720, 1280), null)

  const center = measureContainedImagePoint(200, 200, rect, 720, 1280)
  assert.ok(center)
  assert.ok(Math.abs(center.normalized.x - 0.5) < 1e-12)
  assert.ok(Math.abs(center.normalized.y - 0.5) < 1e-12)
})

test("produces and verifies a source-pixel audit for a normalized mark", () => {
  const audit = makeReviewPixelAudit({ x: 0.25, y: 0.75 }, 720, 1280)
  assert.deepEqual(audit, {
    imageWidthPx: 720,
    imageHeightPx: 1280,
    actualPixelX: 180,
    actualPixelY: 960,
  })

  const validation = validateReviewPixelAudit({
    actualX: 0.25,
    actualY: 0.75,
    ...audit,
    renderedImageWidthPx: 720,
    renderedImageHeightPx: 1280,
  })
  assert.equal(validation.ok, true)
})

test("rejects stale dimensions and normalized/pixel mismatches", () => {
  const staleFrame = validateReviewPixelAudit({
    actualX: 0.25,
    actualY: 0.75,
    imageWidthPx: 720,
    imageHeightPx: 1280,
    actualPixelX: 180,
    actualPixelY: 960,
    renderedImageWidthPx: 1280,
    renderedImageHeightPx: 720,
  })
  assert.deepEqual(staleFrame, {
    ok: false,
    error: "Review image dimensions do not match the selected source frame",
  })

  const wrongPoint = validateReviewPixelAudit({
    actualX: 0.25,
    actualY: 0.75,
    imageWidthPx: 720,
    imageHeightPx: 1280,
    actualPixelX: 200,
    actualPixelY: 960,
    renderedImageWidthPx: 720,
    renderedImageHeightPx: 1280,
  })
  assert.deepEqual(wrongPoint, {
    ok: false,
    error: "Pixel coordinates do not match the normalized review point",
  })
})

test("keeps solo start anchors solo when source session context is available", () => {
  assert.equal(detectionReviewMode("solo", 1, "start"), "solo")
  assert.equal(detectionReviewMode(null, 1, "start"), "solo")
  assert.equal(detectionReviewMode("multi", 2, "finish"), "multi")
})

test("requires points except for explicit no-coordinate classifications", () => {
  assert.equal(isPointFreeDetectionReviewIssue("ignore_crossing"), true)
  assert.equal(isPointFreeDetectionReviewIssue("phone_shake"), true)
  assert.equal(isPointFreeDetectionReviewIssue("false_positive"), true)
  assert.equal(isPointFreeDetectionReviewIssue("real_crossing"), true)
  assert.equal(isPointFreeDetectionReviewIssue("outsideFrameBefore"), true)
  assert.equal(isPointFreeDetectionReviewIssue("outsideFrameAfter"), true)
  assert.equal(isPointFreeDetectionReviewIssue("good"), false)
  assert.equal(isPointFreeDetectionReviewIssue("early"), false)
  assert.equal(isPointFreeDetectionReviewIssue("blur"), false)
})

test("keeps legacy false-positive marks under the new ignore label", () => {
  assert.equal(isIgnoredCrossingIssue("ignore_crossing"), true)
  assert.equal(isIgnoredCrossingIssue("false_positive"), true)
  assert.equal(isIgnoredCrossingIssue("phone_shake"), false)
  assert.equal(falseTriggerReviewLabel("ignore_crossing"), "Ignore crossing")
  assert.equal(falseTriggerReviewLabel("false_positive"), "Ignore crossing")
  assert.equal(falseTriggerReviewLabel("phone_shake"), "Phone shake")
  assert.equal(falseTriggerReviewLabel("good"), null)
})

test("matches the iOS front-camera display line for current captured rows", () => {
  const shared = {
    configured_gate_position: 0.5,
    algo_gate_position: 0.5,
    algo_work_width: 180,
    has_x_anchor_comparison: true,
  }
  const cases = [
    {
      expected: 0.488889,
      capture: {
        ...shared,
        interpolated_display_position: null,
        algo_interpolation_alpha: 0.75,
        algo_s0: 3,
        algo_s1: 1,
        algo_crossing_direction: "L->R",
      },
    },
    {
      expected: 0.511111,
      capture: {
        ...shared,
        interpolated_display_position: 0.488889,
        algo_interpolation_alpha: 0.666667,
        algo_s0: 4,
        algo_s1: 2,
        algo_crossing_direction: "R->L",
      },
    },
    {
      expected: 0.527778,
      capture: {
        ...shared,
        interpolated_display_position: null,
        algo_interpolation_alpha: 0.571429,
        algo_s0: 8,
        algo_s1: 6,
        algo_crossing_direction: "R->L",
      },
    },
    {
      expected: 0.45,
      capture: {
        ...shared,
        interpolated_display_position: 0.55,
        algo_interpolation_alpha: 0.470588,
        algo_s0: 8,
        algo_s1: 10,
        algo_crossing_direction: "L->R",
      },
    },
  ]

  for (const entry of cases) {
    const result = resolveDetectorDisplayPosition(entry.capture, true)
    assert.equal(result.verified, true)
    assert.ok(Math.abs(result.x - entry.expected) < 0.000_001)
  }
})

test("fails closed without a captured display coordinate or known camera transform", () => {
  const unresolved = resolveDetectorDisplayPosition({
    configured_gate_position: 0.42,
    detector_position: 0.55,
  }, null)
  assert.deepEqual(unresolved, {
    x: 0.42,
    verified: false,
    source: "configured_gate_fallback",
  })

  const captured = resolveDetectorDisplayPosition({
    captured_display_position: 0.37,
    configured_gate_position: 0.5,
  }, null)
  assert.deepEqual(captured, {
    x: 0.37,
    verified: true,
    source: "captured_display_coordinate",
  })

  const corruptCaptured = resolveDetectorDisplayPosition({
    captured_display_position: 1.2,
    configured_gate_position: 0.42,
  }, null)
  assert.deepEqual(corruptCaptured, {
    x: 0.42,
    verified: false,
    source: "configured_gate_fallback",
  })
})

test("reads source dimensions from the rendered JPEG", () => {
  const jpeg = Uint8Array.from([
    0xff, 0xd8,
    0xff, 0xe0, 0x00, 0x04, 0x00, 0x00,
    0xff, 0xc0, 0x00, 0x11, 0x08, 0x05, 0x00, 0x02, 0xd0,
    0x03, 0x01, 0x11, 0x00, 0x02, 0x11, 0x00, 0x03, 0x11, 0x00,
    0xff, 0xd9,
  ])
  assert.deepEqual(jpegDimensions(jpeg), { width: 720, height: 1280 })
  assert.equal(jpegDimensions(Uint8Array.from([0xff, 0xd8, 0xff])), null)
})
