import assert from "node:assert/strict"
import test from "node:test"
import {
  CURRENT_DETECTION_REVIEW_DATASET,
  currentDetectionReviewSince,
  DetectionReviewBlockingError,
  detectionReviewCrossingTiming,
  detectionReviewDirectionLabel,
  detectionReviewDraftValidationError,
  detectionReviewImageRequestUrl,
  detectionReviewBatchKey,
  detectionReviewIdentityKey,
  detectionReviewIssueForCrossingTiming,
  detectionReviewMode,
  detectionReviewSessionIdentifiers,
  falseTriggerReviewLabel,
  isIgnoredCrossingIssue,
  isCurrentDetectionReviewCapture,
  isPointForbiddenDetectionReviewIssue,
  isPointFreeDetectionReviewIssue,
  makeReviewPixelAudit,
  measureContainedImagePoint,
  orderDetectionReviewCaptures,
  parseDetectionReviewSet,
  detectionReviewSetMatches,
  detectionReviewSetSelectorMatches,
  resolveDetectionReviewDisplayDirection,
  resolveDetectorDisplayPosition,
  resolveDetectorYPosition,
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

test("cache-busts only explicit detection-image retry attempts", () => {
  const imageUrl = "/api/admin/detection-review/image?id=capture&frame=2"
  assert.equal(detectionReviewImageRequestUrl(imageUrl, 0), imageUrl)
  assert.equal(detectionReviewImageRequestUrl(imageUrl, -1), imageUrl)
  assert.equal(detectionReviewImageRequestUrl(imageUrl, 1), `${imageUrl}&loadAttempt=1`)
  assert.equal(
    detectionReviewImageRequestUrl("/api/admin/detection-review/image", 3),
    "/api/admin/detection-review/image?loadAttempt=3",
  )
})

test("identifies the exact crossing that blocks a review batch", () => {
  const capture = {
    id: "capture-aeb3e7af-run4",
    sessionId: "aeb3e7af-1234-5678-9abc-def012345678",
    runNumber: 4,
    target: "crossing",
  }
  const missingPoint = detectionReviewDraftValidationError({
    capture,
    hasPoint: false,
    issue: "unlabeled",
  })

  assert.ok(missingPoint instanceof DetectionReviewBlockingError)
  assert.equal(missingPoint.captureId, capture.id)
  assert.match(missingPoint.message, /Session aeb3e7af · Run 4 · crossing/)
  assert.equal(
    detectionReviewDraftValidationError({
      capture,
      hasPoint: false,
      issue: "ignore_crossing",
    }),
    null,
  )

  const pointOnIgnoredCrossing = detectionReviewDraftValidationError({
    capture,
    hasPoint: true,
    issue: "ignore_crossing",
  })
  assert.ok(pointOnIgnoredCrossing instanceof DetectionReviewBlockingError)
  assert.equal(pointOnIgnoredCrossing.captureId, capture.id)
  assert.match(pointOnIgnoredCrossing.message, /Clear its source-image point/)
})

test("parses durable focused-review links without requiring a deployment", () => {
  const captureId = "aeb3e7af-1234-5678-9abc-def012345678"
  const reviewSet = parseDetectionReviewSet(
    `${captureId}, 6be6016f:44:crossing | 2aca5926:run9@phone-a; bad token`,
  )

  assert.deepEqual(
    reviewSet.selectors.map((selector) => selector.key),
    [
      `capture:${captureId}`,
      "run:6be6016f:44:crossing:*",
      "run:2aca5926:9:*:phone-a",
    ],
  )
  assert.deepEqual(reviewSet.rejected, ["bad token"])
  assert.equal(
    detectionReviewSetMatches(reviewSet, {
      id: captureId,
      sessionId: "unrelated-session",
      deviceId: "phone-z",
      runNumber: 1,
      target: "finish",
    }),
    true,
  )
  assert.equal(
    detectionReviewSetMatches(reviewSet, {
      id: "bbbbbbbb-1234-5678-9abc-def012345678",
      sessionId: "6be6016f-9a22-4f96-852e-91e321ab4535",
      deviceId: "phone-z",
      runNumber: 44,
      target: "crossing",
    }),
    true,
  )
  assert.equal(
    detectionReviewSetMatches(reviewSet, {
      id: "cccccccc-1234-5678-9abc-def012345678",
      sessionId: "2aca5926-0000-4000-8000-000000000000",
      deviceId: "phone-b",
      runNumber: 9,
      target: "crossing",
    }),
    false,
  )
})

test("deduplicates focused-review selectors and exposes each unmatched selector", () => {
  const reviewSet = parseDetectionReviewSet(
    "SESSION:6be6016f:run44:finish, 6be6016f:44:finish, invalid",
  )
  assert.equal(reviewSet.selectors.length, 1)
  assert.deepEqual(reviewSet.rejected, ["invalid"])
  assert.equal(
    detectionReviewSetSelectorMatches(reviewSet.selectors[0], {
      id: "aeb3e7af-1234-5678-9abc-def012345678",
      sessionId: "6be6016f-9a22-4f96-852e-91e321ab4535",
      deviceId: "phone-a",
      runNumber: 44,
      target: "crossing",
    }),
    false,
  )
})

test("normalizes and deduplicates cross-source session identifiers", () => {
  assert.deepEqual(
    detectionReviewSessionIdentifiers([
      "E7DE3B1C-E79F-4D25-AB0C-F8FD9DC685F9",
      " e7de3b1c-e79f-4d25-ab0c-f8fd9dc685f9 ",
      null,
      "",
      "cloud-session",
    ]),
    ["e7de3b1c-e79f-4d25-ab0c-f8fd9dc685f9", "cloud-session"],
  )
})

test("groups each phone session and orders its runs from first to last", () => {
  const captures = [
    { id: "older-run-3", sessionId: "older", deviceId: "phone-a", runNumber: 3, target: "crossing", createdAt: "2026-08-08T10:03:00Z" },
    { id: "newer-finish", sessionId: "newer", deviceId: "phone-b", runNumber: 2, target: "finish", createdAt: "2026-08-08T11:02:01Z" },
    { id: "newer-start", sessionId: "newer", deviceId: "phone-b", runNumber: 2, target: "start", createdAt: "2026-08-08T11:02:00Z" },
    { id: "older-run-1", sessionId: "older", deviceId: "phone-a", runNumber: 1, target: "crossing", createdAt: "2026-08-08T10:01:00Z" },
    { id: "newer-run-1", sessionId: "newer", deviceId: "phone-b", runNumber: 1, target: "crossing", createdAt: "2026-08-08T11:01:00Z" },
  ]

  assert.deepEqual(
    orderDetectionReviewCaptures(captures).map((capture) => capture.id),
    ["newer-run-1", "newer-start", "newer-finish", "older-run-1", "older-run-3"],
  )
  assert.notEqual(
    detectionReviewBatchKey({ id: "one", sessionId: "shared", deviceId: "phone-a" }),
    detectionReviewBatchKey({ id: "two", sessionId: "shared", deviceId: "phone-b" }),
  )
  assert.notEqual(
    detectionReviewIdentityKey("shared", 1, "crossing", "phone-a"),
    detectionReviewIdentityKey("shared", 1, "crossing", "phone-b"),
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

test("uses the captured mobile detector Y for the desktop yellow dot", () => {
  assert.equal(resolveDetectorYPosition({
    capturedDetectorY: 0.3125,
    comparisonDetectorYPx: 96,
    workBufferHeightPx: 320,
  }), 0.3125)

  assert.equal(resolveDetectorYPosition({
    capturedDetectorY: null,
    comparisonDetectorYPx: 96,
    workBufferHeightPx: 320,
  }), 0.3)

  assert.equal(resolveDetectorYPosition({
    capturedDetectorY: null,
    comparisonDetectorYPx: 96,
    workBufferWidthPx: 180,
    renderedImageWidthPx: 720,
    renderedImageHeightPx: 1280,
  }), 0.3)

  assert.equal(resolveDetectorYPosition({
    capturedDetectorY: null,
    comparisonDetectorYPx: 400,
    workBufferHeightPx: 320,
  }), null)
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

test("allows earlier and later timing evidence with or without an image point", () => {
  assert.equal(isPointForbiddenDetectionReviewIssue("ignore_crossing"), true)
  assert.equal(isPointForbiddenDetectionReviewIssue("phone_shake"), true)
  assert.equal(isPointForbiddenDetectionReviewIssue("false_positive"), true)
  assert.equal(isPointForbiddenDetectionReviewIssue("real_crossing"), true)
  assert.equal(isPointForbiddenDetectionReviewIssue("outsideFrameBefore"), false)
  assert.equal(isPointForbiddenDetectionReviewIssue("outsideFrameAfter"), false)
  assert.equal(detectionReviewCrossingTiming("outsideFrameBefore"), "earlier")
  assert.equal(detectionReviewCrossingTiming("late"), "earlier")
  assert.equal(detectionReviewCrossingTiming("outsideFrameAfter"), "later")
  assert.equal(detectionReviewCrossingTiming("early"), "later")
  assert.equal(detectionReviewIssueForCrossingTiming("earlier", false), "outsideFrameBefore")
  assert.equal(detectionReviewIssueForCrossingTiming("earlier", true), "late")
  assert.equal(detectionReviewIssueForCrossingTiming("later", false), "outsideFrameAfter")
  assert.equal(detectionReviewIssueForCrossingTiming("later", true), "early")
})

test("keeps point-free false-trigger classifications semantically distinct", () => {
  assert.equal(isIgnoredCrossingIssue("ignore_crossing"), true)
  assert.equal(isIgnoredCrossingIssue("false_positive"), false)
  assert.equal(isIgnoredCrossingIssue("phone_shake"), false)
  assert.equal(falseTriggerReviewLabel("ignore_crossing"), "Ignore crossing")
  assert.equal(falseTriggerReviewLabel("false_positive"), "Scene motion")
  assert.equal(falseTriggerReviewLabel("phone_shake"), "Phone shake")
  assert.equal(falseTriggerReviewLabel("good"), null)
})

test("corrects a fallback direction when post-frame motion proves the opposite", () => {
  assert.deepEqual(
    resolveDetectionReviewDisplayDirection({
      storedDirection: "L->R",
      isFrontCamera: false,
      temporalEvidence: {
        frames: [
          {
            status: "accepted",
            relativeFrame: 0,
            direction: "L>R",
            directionSource: "center_vs_gate_fallback",
          },
          {
            status: "post_candidate",
            relativeFrame: 1,
            direction: "R>L",
            directionSource: "motion_center_history",
          },
        ],
      },
    }),
    { direction: "R->L", evidence: "post_corrected" },
  )
})

test("corrects a stored-only direction when post-frame motion proves the opposite", () => {
  assert.deepEqual(
    resolveDetectionReviewDisplayDirection({
      storedDirection: "R->L",
      isFrontCamera: false,
      temporalEvidence: {
        frames: [{
          status: "post_candidate",
          relativeFrame: 1,
          direction: "L>R",
          directionSource: "motion_center_history",
        }],
      },
    }),
    { direction: "L->R", evidence: "post_corrected" },
  )
})

test("prefers accepted frame motion over stale stored direction", () => {
  assert.deepEqual(
    resolveDetectionReviewDisplayDirection({
      storedDirection: "R->L",
      isFrontCamera: false,
      temporalEvidence: {
        frames: [{
          status: "accepted",
          relativeFrame: 0,
          direction: "L>R",
          directionSource: "motion_center_history",
        }],
      },
    }),
    { direction: "L->R", evidence: "motion" },
  )
})

test("does not present stored or fallback direction guesses as fact", () => {
  assert.equal(detectionReviewDirectionLabel("L->R", "stored"), "direction unverified")
  assert.equal(detectionReviewDirectionLabel("R->L", "fallback"), "direction unverified")
  assert.equal(detectionReviewDirectionLabel(null, "conflict"), "direction conflict")
  assert.equal(detectionReviewDirectionLabel("L->R", "motion"), "L→R · frame-verified")
  assert.equal(detectionReviewDirectionLabel("R->L", "post_corrected"), "R→L · frame-corrected")
})

test("mirrors detector-space direction for a front-camera review image", () => {
  assert.deepEqual(
    resolveDetectionReviewDisplayDirection({
      storedDirection: "L->R",
      isFrontCamera: true,
      temporalEvidence: {
        frames: [{
          status: "accepted",
          relativeFrame: 0,
          direction: "L>R",
          directionSource: "motion_center_history",
        }],
      },
    }),
    { direction: "R->L", evidence: "motion" },
  )
})

test("shows a conflict instead of guessing when motion evidence reverses", () => {
  assert.deepEqual(
    resolveDetectionReviewDisplayDirection({
      storedDirection: "R->L",
      isFrontCamera: false,
      temporalEvidence: {
        frames: [
          {
            status: "accepted",
            relativeFrame: 0,
            direction: "R>L",
            directionSource: "motion_center_history",
          },
          {
            status: "post_candidate",
            relativeFrame: 1,
            direction: "L>R",
            directionSource: "motion_center_history",
          },
        ],
      },
    }),
    { direction: null, evidence: "conflict" },
  )
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
