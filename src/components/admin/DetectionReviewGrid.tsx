/* eslint-disable @next/next/no-img-element */
"use client"

import { Fragment, useEffect, useMemo, useRef, useState } from "react"
import {
  DetectionReviewBlockingError,
  detectionReviewCrossingTiming,
  detectionReviewBatchKey,
  detectionReviewCaptureReference,
  detectionReviewDirectionLabel,
  detectionReviewDraftValidationError,
  detectionReviewImageRequestUrl,
  detectionReviewIssueForCrossingTiming,
  falseTriggerReviewLabel,
  isIgnoredCrossingIssue,
  isPointForbiddenDetectionReviewIssue,
  measureContainedImagePoint,
  normalizeSceneMotionCauses,
  SCENE_MOTION_CAUSE_OPTIONS,
  sceneMotionCausesEqual,
  type DetectionReviewDirectionEvidence,
  type DetectionReviewIssue,
  type SceneMotionCause,
} from "@/lib/detection-review"

interface Point {
  x: number
  y: number
}

interface GridReview {
  actualX: number | null
  actualY: number | null
  issue: GridReviewIssue
  note: string
  sceneMotionCauses: SceneMotionCause[]
  source: "app" | "admin"
  selectedFrameRelation: string | null
  selectedFramePtsNanos: string | null
}

type GridReviewIssue = DetectionReviewIssue

export interface DetectionGridCapture {
  id: string
  source: "debug_capture" | "app_mark"
  editable: boolean
  editBlockReason: string | null
  sessionId: string | null
  runNumber: number
  target: string
  mode: string
  createdAt: string
  deviceId: string
  deviceModel: string | null
  appVersion: string | null
  appBuild: string | null
  evidenceConsentVersion: number
  evidenceProvenance: string
  isFrontCamera: boolean | null
  direction: string | null
  directionEvidence: DetectionReviewDirectionEvidence
  detectorX: number
  detectorY: number | null
  detectorCoordinateVerified: boolean
  detectorCoordinateSource: string
  imageUrl: string
  temporalFrames: GridTemporalFrame[]
  review: GridReview | null
}

export interface GridTemporalFrame {
  index: number
  url: string
  relation: string
  relativeFrame: number
  ptsNanos: string | null
}

export interface GridReviewItem {
  captureId: string
  point: Point | null
  issue: GridReviewIssue
  note: string
  sceneMotionCauses: SceneMotionCause[]
  image: HTMLImageElement
  selectedFrame: GridTemporalFrame | null
}

interface GridDraft {
  point: Point | null
  issue: GridReviewIssue
  note: string
  sceneMotionCauses: SceneMotionCause[]
  selectedFrameIndex: number | null
}

interface GridUploadState {
  status: "queued" | "uploading" | "failed"
}

interface DetectionReviewGridProps {
  allCaptures: DetectionGridCapture[]
  filteredCaptures: DetectionGridCapture[]
  uploadsByCapture: Map<string, GridUploadState>
  onDraftCountChange: (count: number) => void
  onOpenDetail: (captureId: string) => void
  onQueue: (items: GridReviewItem[]) => Promise<void>
}

function shortId(value: string | null) {
  return value ? value.slice(0, 8) : "unlinked"
}

function qualityBand(deltaX: number | null) {
  if (deltaX === null) return { label: "No mark", tone: "text-[#777B80]" }
  const absolute = Math.abs(deltaX)
  if (absolute <= 0.03) return { label: "Accepted", tone: "text-[#6FB58A]" }
  if (absolute < 0.06) return { label: "Watch", tone: "text-[#D6B36A]" }
  if (absolute < 0.1) return { label: "Fail", tone: "text-[#DC8B72]" }
  return { label: "Severe", tone: "text-[#F06C68]" }
}

function initialFrame(capture: DetectionGridCapture): GridTemporalFrame | null {
  if (!capture.temporalFrames.length) return null
  const review = capture.review
  return capture.temporalFrames.find((frame) =>
    Boolean(
      (review?.selectedFramePtsNanos && frame.ptsNanos === review.selectedFramePtsNanos)
      || (review?.selectedFrameRelation && frame.relation === review.selectedFrameRelation),
    ),
  ) || capture.temporalFrames.find((frame) => frame.relativeFrame === 0) || capture.temporalFrames[0]
}

function selectedFrame(capture: DetectionGridCapture, draft?: GridDraft): GridTemporalFrame | null {
  return capture.temporalFrames.find((frame) => frame.index === draft?.selectedFrameIndex)
    || initialFrame(capture)
}

function framePositionLabel(frame: GridTemporalFrame) {
  if (frame.relativeFrame === 0) return "Detected frame"
  return frame.relativeFrame < 0 ? "Earlier frame" : "Later frame"
}

function outsideFrameLabel(issue: GridReviewIssue | undefined) {
  if (issue === "real_crossing") return "None of the saved frames"
  if (issue === "outsideFrameBefore") return "Crossing before frames"
  if (issue === "outsideFrameAfter") return "Crossing after frames"
  if (issue === "late") return "Crossing was earlier"
  if (issue === "early") return "Crossing was later"
  return null
}

function reviewCardId(captureId: string) {
  return `detection-review-card-${captureId}`
}

interface DetectionReviewBatch {
  key: string
  captures: DetectionGridCapture[]
}

function cameraSetupLabel(captures: readonly DetectionGridCapture[]): string {
  const facings = new Set(
    captures
      .map((capture) => capture.isFrontCamera)
      .filter((value): value is boolean => typeof value === "boolean"),
  )
  if (facings.size > 1) return "Mixed front/back cameras"
  if (facings.has(true)) return "Front camera"
  if (facings.has(false)) return "Back camera"
  return "Camera not recorded"
}

function formatSetupDate(value: string): string {
  const timestamp = Date.parse(value)
  if (!Number.isFinite(timestamp)) return "Time not recorded"
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp))
}

const IMAGE_LOAD_RETRY_DELAYS_MS = [400, 1_200, 2_500] as const

interface StableCaptureMediaProps {
  capture: DetectionGridCapture
  displayPoint: Point | null
  frame: GridTemporalFrame | null
  imageIndex: number
  falseTriggerLabel: string | null
  isUnavailable: boolean
  onImageRef: (image: HTMLImageElement | null) => void
  onMark: (event: React.PointerEvent<HTMLButtonElement>) => void
}

function StableCaptureMedia({
  capture,
  displayPoint,
  frame,
  imageIndex,
  falseTriggerLabel,
  isUnavailable,
  onImageRef,
  onMark,
}: StableCaptureMediaProps) {
  const desiredSrc = frame?.url || capture.imageUrl
  const desiredFrameIndex = frame?.index ?? null
  const [displayedMedia, setDisplayedMedia] = useState({
    src: desiredSrc,
    frameIndex: desiredFrameIndex,
  })
  const [retryState, setRetryState] = useState({
    src: desiredSrc,
    attempt: 0,
  })
  const [readyMediaSrc, setReadyMediaSrc] = useState<string | null>(null)
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  const showingDesiredFrame = displayedMedia.src === desiredSrc
    && displayedMedia.frameIndex === desiredFrameIndex
  const retryAttempt = retryState.src === desiredSrc ? retryState.attempt : 0
  const displayedImageReady = readyMediaSrc === displayedMedia.src
  const loadError = failedSrc === desiredSrc
    && retryAttempt >= IMAGE_LOAD_RETRY_DELAYS_MS.length
  const isLoadingFrame = (!showingDesiredFrame || !displayedImageReady) && !loadError
  const displayedRequestSrc = showingDesiredFrame
    ? detectionReviewImageRequestUrl(displayedMedia.src, retryAttempt)
    : displayedMedia.src

  useEffect(() => {
    if (
      failedSrc !== desiredSrc
      || retryAttempt >= IMAGE_LOAD_RETRY_DELAYS_MS.length
    ) {
      return
    }

    const timeout = window.setTimeout(() => {
      setFailedSrc(null)
      setRetryState((current) => {
        if (current.src === desiredSrc && current.attempt > retryAttempt) {
          return current
        }
        return { src: desiredSrc, attempt: retryAttempt + 1 }
      })
    }, IMAGE_LOAD_RETRY_DELAYS_MS[retryAttempt])

    return () => window.clearTimeout(timeout)
  }, [desiredSrc, failedSrc, retryAttempt])

  useEffect(() => {
    if (showingDesiredFrame) return

    let cancelled = false
    const loader = new Image()

    const revealFrame = () => {
      if (cancelled) return
      setDisplayedMedia({ src: desiredSrc, frameIndex: desiredFrameIndex })
      setFailedSrc(null)
    }
    const failFrame = () => {
      if (cancelled) return
      setFailedSrc(desiredSrc)
    }

    loader.decoding = "async"
    loader.onload = revealFrame
    loader.onerror = failFrame
    loader.src = detectionReviewImageRequestUrl(desiredSrc, retryAttempt)
    void loader.decode().then(revealFrame).catch(() => {
      if (!loader.complete) return
      if (loader.naturalWidth > 0) revealFrame()
      else failFrame()
    })

    return () => {
      cancelled = true
      loader.onload = null
      loader.onerror = null
    }
  }, [desiredFrameIndex, desiredSrc, retryAttempt, showingDesiredFrame])

  useEffect(() => {
    if (imageIndex >= 4 || capture.temporalFrames.length === 0) return
    const timeout = window.setTimeout(() => {
      const displayedPosition = capture.temporalFrames.findIndex(
        (temporalFrame) => temporalFrame.url === displayedMedia.src,
      )
      const adjacentFrames = [
        capture.temporalFrames[displayedPosition - 1],
        capture.temporalFrames[displayedPosition + 1],
      ].filter((temporalFrame): temporalFrame is GridTemporalFrame => Boolean(temporalFrame))
      adjacentFrames.forEach((temporalFrame) => {
        const preloader = new Image()
        preloader.decoding = "async"
        preloader.src = temporalFrame.url
      })
    }, 150)
    return () => window.clearTimeout(timeout)
  }, [capture.temporalFrames, displayedMedia.src, imageIndex])

  const canMark = capture.editable
    && !isUnavailable
    && showingDesiredFrame
    && displayedImageReady
    && !isLoadingFrame
    && !loadError
  const visiblePoint = showingDesiredFrame ? displayPoint : null

  return (
    <button
      type="button"
      aria-label={`Mark true crossing for session ${shortId(capture.sessionId)}, run ${capture.runNumber}`}
      aria-busy={isLoadingFrame}
      onPointerDown={onMark}
      disabled={!canMark}
      className="relative block w-full overflow-hidden bg-[#0C0D0E] text-left active:scale-[0.995] disabled:cursor-default"
    >
      <img
        ref={onImageRef}
        src={displayedRequestSrc}
        data-capture-id={capture.id}
        data-frame-index={displayedMedia.frameIndex ?? "thumbnail"}
        alt={`Detection thumbnail for session ${shortId(capture.sessionId)}, run ${capture.runNumber}`}
        loading={imageIndex < 4 ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
        onLoad={() => {
          setReadyMediaSrc(displayedMedia.src)
          setFailedSrc(null)
        }}
        onError={() => {
          setReadyMediaSrc(null)
          setFailedSrc(displayedMedia.src)
        }}
        className={`relative block h-auto min-h-72 w-full select-none object-contain ${falseTriggerLabel ? "opacity-45" : "opacity-100"}`}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 w-[3px] -translate-x-1/2 bg-[#FF3B30] shadow-[0_0_0_1px_rgba(50,10,8,0.22)]"
        style={{ left: `${capture.detectorX * 100}%` }}
      />
      {capture.detectorY !== null && showingDesiredFrame && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-[#FFD60A] shadow-[0_2px_6px_rgba(0,0,0,0.55)]"
          style={{ left: `${capture.detectorX * 100}%`, top: `${capture.detectorY * 100}%` }}
        />
      )}
      {visiblePoint && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-[#35B96F] shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
          style={{ left: `${visiblePoint.x * 100}%`, top: `${visiblePoint.y * 100}%` }}
        />
      )}
      {falseTriggerLabel && (
        <span className="pointer-events-none absolute inset-0 grid place-items-center bg-[#111315]/45">
          <span className="rounded-lg border border-[#9A5755] bg-[#2B2223]/95 px-3 py-2 text-xs font-semibold text-[#F2B1AE]">
            {falseTriggerLabel}
          </span>
        </span>
      )}
      {(isLoadingFrame || loadError) && (
        <span
          role="status"
          className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-center rounded-lg border border-white/10 bg-[#111315]/90 px-3 py-2 font-mono text-[10px] font-semibold text-[#D4D7DA] shadow-lg backdrop-blur-sm"
        >
          {loadError
            ? "Frame still unavailable — reload this page"
            : `Loading ${frame ? framePositionLabel(frame).toLowerCase() : "frame"}…`}
        </span>
      )}
    </button>
  )
}

export function DetectionReviewGrid({
  allCaptures,
  filteredCaptures,
  uploadsByCapture,
  onDraftCountChange,
  onOpenDetail,
  onQueue,
}: DetectionReviewGridProps) {
  const [drafts, setDrafts] = useState<Record<string, GridDraft>>({})
  const [preparing, setPreparing] = useState(false)
  const [batchError, setBatchError] = useState("")
  const [blockingCaptureId, setBlockingCaptureId] = useState<string | null>(null)
  const imageRefs = useRef(new Map<string, HTMLImageElement>())

  const draftCount = Object.keys(drafts).length
  const reviewedInGrid = filteredCaptures.filter((capture) => capture.review && !drafts[capture.id]).length
  const reviewBatches = useMemo(() => {
    const batches: DetectionReviewBatch[] = []
    for (const capture of filteredCaptures) {
      const key = detectionReviewBatchKey(capture)
      const current = batches[batches.length - 1]
      if (current?.key === key) current.captures.push(capture)
      else batches.push({ key, captures: [capture] })
    }
    return batches
  }, [filteredCaptures])
  const reviewBatchByKey = useMemo(
    () => new Map(reviewBatches.map((batch, index) => [batch.key, { ...batch, index }])),
    [reviewBatches],
  )

  useEffect(() => {
    onDraftCountChange(draftCount)
  }, [draftCount, onDraftCountChange])

  useEffect(() => () => onDraftCountChange(0), [onDraftCountChange])

  function clearBatchError() {
    setBatchError("")
    setBlockingCaptureId(null)
  }

  function showBlockingCapture(capture: DetectionGridCapture, message: string) {
    setBatchError(message)
    setBlockingCaptureId(capture.id)
    window.requestAnimationFrame(() => {
      const card = document.getElementById(reviewCardId(capture.id))
      card?.scrollIntoView({ behavior: "smooth", block: "center" })
      card?.focus({ preventScroll: true })
    })
  }

  function placeGridMark(
    capture: DetectionGridCapture,
    frame: GridTemporalFrame | null,
    event: React.PointerEvent<HTMLButtonElement>,
  ) {
    if (!capture.editable) return
    const upload = uploadsByCapture.get(capture.id)
    if (upload && upload.status !== "failed") return
    const image = imageRefs.current.get(capture.id)
    if (!image || image.dataset.captureId !== capture.id) return
    const displayedFrameIndex = image.dataset.frameIndex === "thumbnail"
      ? null
      : Number(image.dataset.frameIndex)
    if (displayedFrameIndex !== (frame?.index ?? null)) {
      setBatchError("That frame is still loading. Try the mark again when the loading label disappears.")
      return
    }
    const measurement = measureContainedImagePoint(
      event.clientX,
      event.clientY,
      image.getBoundingClientRect(),
      image.naturalWidth,
      image.naturalHeight,
    )
    if (!measurement) {
      setBatchError("Click inside the visible image, not the surrounding empty area.")
      return
    }
    const point = measurement.normalized
    setDrafts((current) => {
      const existing = current[capture.id]
      const frame = selectedFrame(capture, existing)
      const savedIssue = capture.review?.issue || "unlabeled"
      const currentIssue = existing?.issue ?? savedIssue
      const crossingTiming = detectionReviewCrossingTiming(currentIssue)
      const nextIssue = crossingTiming
        ? detectionReviewIssueForCrossingTiming(crossingTiming, true)
        : isPointForbiddenDetectionReviewIssue(currentIssue)
          ? "unlabeled"
          : currentIssue
      return {
        ...current,
        [capture.id]: {
          point,
          issue: nextIssue,
          note: existing?.note ?? capture.review?.note ?? "",
          sceneMotionCauses: [],
          selectedFrameIndex: frame?.index ?? null,
        },
      }
    })
    clearBatchError()
  }

  function chooseGridFrame(capture: DetectionGridCapture, frame: GridTemporalFrame) {
    if (!capture.editable) return
    const upload = uploadsByCapture.get(capture.id)
    if (upload && upload.status !== "failed") return
    setDrafts((current) => {
      const existing = current[capture.id]
      const previousFrame = selectedFrame(capture, existing)
      const review = capture.review
      const savedOnFrame = Boolean(
        review && (
          (review.selectedFramePtsNanos && review.selectedFramePtsNanos === frame.ptsNanos)
          || (review.selectedFrameRelation && review.selectedFrameRelation === frame.relation)
          || (!review.selectedFrameRelation && frame.relativeFrame === 0)
        ),
      )
      const savedPoint = savedOnFrame && review?.actualX != null && review.actualY != null
        ? { x: review.actualX, y: review.actualY }
        : null
      const nextPoint = previousFrame?.index === frame.index ? existing?.point ?? savedPoint : savedPoint
      let nextIssue = existing?.issue ?? review?.issue ?? "unlabeled"
      const crossingTiming = detectionReviewCrossingTiming(nextIssue)
      if (crossingTiming) {
        nextIssue = detectionReviewIssueForCrossingTiming(crossingTiming, Boolean(nextPoint))
      } else if (isPointForbiddenDetectionReviewIssue(nextIssue)) {
        nextIssue = "unlabeled"
      }
      if (frame.relativeFrame !== 0 && nextIssue === "unlabeled") nextIssue = "wrongFrame"
      if (frame.relativeFrame === 0 && nextIssue === "wrongFrame") nextIssue = "unlabeled"
      const nextDraft: GridDraft = {
        point: nextPoint,
        issue: nextIssue,
        note: existing?.note ?? review?.note ?? "",
        sceneMotionCauses: nextIssue === "false_positive"
          ? normalizeSceneMotionCauses(existing?.sceneMotionCauses ?? review?.sceneMotionCauses ?? [])
          : [],
        selectedFrameIndex: frame.index,
      }
      const matchesSavedReview = Boolean(
        review &&
        savedOnFrame &&
        nextDraft.issue === review.issue &&
        nextDraft.note === review.note &&
        sceneMotionCausesEqual(nextDraft.sceneMotionCauses, review.sceneMotionCauses) &&
        (nextDraft.point?.x ?? null) === review.actualX &&
        (nextDraft.point?.y ?? null) === review.actualY,
      )
      const defaultFrame = initialFrame(capture)
      const isEmptyNewReview = Boolean(
        !review &&
        frame.index === defaultFrame?.index &&
        !nextDraft.point &&
        nextDraft.issue === "unlabeled" &&
        nextDraft.sceneMotionCauses.length === 0 &&
        !nextDraft.note,
      )
      const next = { ...current }
      if (matchesSavedReview || isEmptyNewReview) delete next[capture.id]
      else next[capture.id] = nextDraft
      return next
    })
    clearBatchError()
  }

  function toggleFalseTrigger(
    capture: DetectionGridCapture,
    nextIssue: "false_positive" | "ignore_crossing" | "phone_shake",
  ) {
    if (!capture.editable) return
    const upload = uploadsByCapture.get(capture.id)
    if (upload && upload.status !== "failed") return
    setDrafts((current) => {
      const existing = current[capture.id]
      const currentIssue = existing?.issue ?? capture.review?.issue ?? "unlabeled"
      const isSelected = nextIssue === "ignore_crossing"
        ? isIgnoredCrossingIssue(currentIssue)
        : currentIssue === nextIssue
      if (isSelected && existing) {
        const next = { ...current }
        delete next[capture.id]
        return next
      }
      const nextDraft: GridDraft = {
        point: null,
        issue: isSelected ? "unlabeled" : nextIssue,
        note: existing?.note ?? capture.review?.note ?? "",
        sceneMotionCauses: !isSelected && nextIssue === "false_positive"
          ? normalizeSceneMotionCauses(existing?.sceneMotionCauses ?? capture.review?.sceneMotionCauses ?? [])
          : [],
        selectedFrameIndex: selectedFrame(capture, existing)?.index ?? null,
      }
      const next = { ...current }
      next[capture.id] = nextDraft
      return next
    })
    clearBatchError()
  }

  function toggleSceneMotionCause(capture: DetectionGridCapture, cause: SceneMotionCause) {
    if (!capture.editable) return
    const upload = uploadsByCapture.get(capture.id)
    if (upload && upload.status !== "failed") return
    setDrafts((current) => {
      const existing = current[capture.id]
      const review = capture.review
      const currentCauses = normalizeSceneMotionCauses(
        existing?.sceneMotionCauses ?? review?.sceneMotionCauses ?? [],
      )
      const nextCauses = currentCauses.includes(cause)
        ? currentCauses.filter((value) => value !== cause)
        : normalizeSceneMotionCauses([...currentCauses, cause])
      const nextDraft: GridDraft = {
        point: null,
        issue: "false_positive",
        note: existing?.note ?? review?.note ?? "",
        sceneMotionCauses: nextCauses,
        selectedFrameIndex: selectedFrame(capture, existing)?.index ?? null,
      }
      const matchesSavedReview = Boolean(
        review
        && review.issue === "false_positive"
        && nextDraft.note === review.note
        && sceneMotionCausesEqual(nextDraft.sceneMotionCauses, review.sceneMotionCauses),
      )
      const next = { ...current }
      if (matchesSavedReview) delete next[capture.id]
      else next[capture.id] = nextDraft
      return next
    })
    clearBatchError()
  }

  function toggleOutsideFrame(
    capture: DetectionGridCapture,
    issue: "real_crossing" | "outsideFrameBefore" | "outsideFrameAfter",
  ) {
    if (!capture.editable) return
    const upload = uploadsByCapture.get(capture.id)
    if (upload && upload.status !== "failed") return
    setDrafts((current) => {
      const existing = current[capture.id]
      const frame = selectedFrame(capture, existing)
      const review = capture.review
      const savedPointBelongsToFrame = Boolean(
        review && frame && (
          (review.selectedFramePtsNanos && review.selectedFramePtsNanos === frame.ptsNanos)
          || (review.selectedFrameRelation && review.selectedFrameRelation === frame.relation)
          || (!review.selectedFrameRelation && frame.relativeFrame === 0)
        ),
      )
      const savedPoint = savedPointBelongsToFrame && review?.actualX != null && review.actualY != null
        ? { x: review.actualX, y: review.actualY }
        : null
      const point = existing?.point ?? savedPoint
      const currentIssue = existing?.issue ?? review?.issue ?? "unlabeled"

      if (issue === "real_crossing") {
        if (currentIssue === issue) {
          const next = { ...current }
          if (existing?.note.trim()) next[capture.id] = { ...existing, issue: "unlabeled" }
          else delete next[capture.id]
          return next
        }
        const detectedFrame = capture.temporalFrames.find((candidate) => candidate.relativeFrame === 0) || initialFrame(capture)
        return {
          ...current,
          [capture.id]: {
            point: null,
            issue,
            note: existing?.note ?? review?.note ?? "",
            sceneMotionCauses: [],
            selectedFrameIndex: detectedFrame?.index ?? null,
          },
        }
      }

      const timing = issue === "outsideFrameBefore" ? "earlier" : "later"
      const isSelected = detectionReviewCrossingTiming(currentIssue) === timing
      if (isSelected) {
        const next = { ...current }
        const clearedIssue = point && frame?.relativeFrame !== 0 ? "wrongFrame" : "unlabeled"
        const nextDraft: GridDraft = {
          point,
          issue: clearedIssue,
          note: existing?.note ?? review?.note ?? "",
          sceneMotionCauses: [],
          selectedFrameIndex: frame?.index ?? null,
        }
        if (!review && !point && !nextDraft.note.trim() && clearedIssue === "unlabeled") delete next[capture.id]
        else next[capture.id] = nextDraft
        return next
      }
      const boundaryFrame = timing === "earlier"
        ? capture.temporalFrames[0]
        : capture.temporalFrames[capture.temporalFrames.length - 1]
      return {
        ...current,
        [capture.id]: {
          point,
          issue: detectionReviewIssueForCrossingTiming(timing, Boolean(point)),
          note: existing?.note ?? capture.review?.note ?? "",
          sceneMotionCauses: [],
          selectedFrameIndex: point ? frame?.index ?? null : boundaryFrame?.index ?? frame?.index ?? null,
        },
      }
    })
    clearBatchError()
  }

  function updateGridNote(capture: DetectionGridCapture, note: string) {
    if (!capture.editable) return
    const upload = uploadsByCapture.get(capture.id)
    if (upload && upload.status !== "failed") return
    setDrafts((current) => {
      const existing = current[capture.id]
      const savedPoint = capture.review?.actualX != null && capture.review?.actualY != null
        ? { x: capture.review.actualX, y: capture.review.actualY }
        : null
      const nextDraft: GridDraft = {
        point: existing?.point ?? savedPoint,
        issue: existing?.issue ?? capture.review?.issue ?? "unlabeled",
        note,
        sceneMotionCauses: normalizeSceneMotionCauses(
          existing?.sceneMotionCauses ?? capture.review?.sceneMotionCauses ?? [],
        ),
        selectedFrameIndex: selectedFrame(capture, existing)?.index ?? null,
      }
      const matchesSavedReview = Boolean(
        capture.review &&
        selectedFrame(capture, nextDraft)?.relation === (
          capture.review.selectedFrameRelation || initialFrame(capture)?.relation
        ) &&
        nextDraft.issue === capture.review.issue &&
        nextDraft.note === capture.review.note &&
        sceneMotionCausesEqual(nextDraft.sceneMotionCauses, capture.review.sceneMotionCauses) &&
        (nextDraft.point?.x ?? null) === capture.review.actualX &&
        (nextDraft.point?.y ?? null) === capture.review.actualY,
      )
      const isEmptyNewReview = Boolean(
        !capture.review &&
        !nextDraft.point &&
        nextDraft.issue === "unlabeled" &&
        nextDraft.sceneMotionCauses.length === 0 &&
        !nextDraft.note,
      )
      const next = { ...current }
      if (matchesSavedReview || isEmptyNewReview) delete next[capture.id]
      else next[capture.id] = nextDraft
      return next
    })
    clearBatchError()
  }

  function clearDraft(captureId: string) {
    setDrafts((current) => {
      const next = { ...current }
      delete next[captureId]
      return next
    })
    clearBatchError()
  }

  async function queueDrafts() {
    const draftedCaptures = filteredCaptures.filter((capture) => drafts[capture.id])
    const validationFailures = draftedCaptures.flatMap((capture) => {
      const draft = drafts[capture.id]
      const error = detectionReviewDraftValidationError({
        capture,
        hasPoint: Boolean(draft.point),
        issue: draft.issue,
      })
      return error ? [{ capture, error }] : []
    })
    if (validationFailures.length) {
      const first = validationFailures[0]
      const remaining = validationFailures.length - 1
      showBlockingCapture(
        first.capture,
        `${first.error.message}${remaining ? ` ${remaining} additional blocking ${remaining === 1 ? "draft remains" : "drafts remain"}.` : ""}`,
      )
      return
    }

    const items = filteredCaptures.flatMap((capture) => {
      const draft = drafts[capture.id]
      const image = imageRefs.current.get(capture.id)
      const frame = selectedFrame(capture, draft)
      const expectedFrameIndex = frame?.index ?? "thumbnail"
      return draft
        && image?.dataset.captureId === capture.id
        && image.dataset.frameIndex === String(expectedFrameIndex)
        ? [{
            captureId: capture.id,
            point: draft.point,
            issue: draft.issue,
            note: draft.note.trim(),
            sceneMotionCauses: draft.issue === "false_positive" ? draft.sceneMotionCauses : [],
            image,
            selectedFrame: frame,
          }]
        : []
    })
    if (!items.length) return
    if (items.length !== draftCount) {
      const firstUnready = draftedCaptures.find((capture) => {
        const image = imageRefs.current.get(capture.id)
        const frame = selectedFrame(capture, drafts[capture.id])
        const expectedFrameIndex = frame?.index ?? "thumbnail"
        return image?.dataset.captureId !== capture.id
          || image.dataset.frameIndex !== String(expectedFrameIndex)
      })
      if (firstUnready) {
        showBlockingCapture(
          firstUnready,
          `Blocking crossing: ${detectionReviewCaptureReference(firstUnready)}. Its selected frame is still loading; wait for that card, then queue the batch again.`,
        )
      } else {
        setBatchError("Wait for every marked thumbnail to finish loading, then queue the batch again.")
      }
      return
    }

    setPreparing(true)
    clearBatchError()
    try {
      await onQueue(items)
      setDrafts({})
    } catch (queueError) {
      if (queueError instanceof DetectionReviewBlockingError) {
        const capture = filteredCaptures.find((item) => item.id === queueError.captureId)
        if (capture) showBlockingCapture(capture, queueError.message)
        else setBatchError(queueError.message)
      } else {
        setBatchError(queueError instanceof Error ? queueError.message : "Could not prepare this review batch")
      }
    } finally {
      setPreparing(false)
    }
  }

  if (!filteredCaptures.length) {
    return (
      <section className="rounded-2xl border border-[#31404A] bg-[#1B2228] py-20 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <h2 className="font-[var(--font-bricolage)] text-2xl font-semibold text-white">
          {allCaptures.length ? "No captures match this grid" : "No review captures in this window"}
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#9B9A97]">
          Change the status, search, or date window. New thumbnails appear here after users complete sessions.
        </p>
      </section>
    )
  }

  return (
    <section className="space-y-4" aria-labelledby="grid-review-heading">
      <header className="grid gap-4 rounded-2xl border border-[#31404A] bg-[#1A2229] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[#5C8DB8]">
            {reviewBatches.length} camera/setup {reviewBatches.length === 1 ? "batch" : "batches"} · {filteredCaptures.length} captures
          </p>
          <h2 id="grid-review-heading" className="mt-1 font-[var(--font-bricolage)] text-xl font-semibold text-white">
            Click each true torso crossing edge
          </h2>
          <p className="mt-1 text-xs leading-5 text-[#8B8F94]">
            Each phone session stays together. Batches are newest first; runs inside each batch are ordered from first to last.
          </p>
        </div>
        <div className="grid justify-items-end gap-1 font-mono text-right text-[10px] uppercase tracking-[0.12em]">
          <span className="text-[#FFD60A]">Yellow dot · detector point</span>
          <span className="text-[#777B80]">Images load as you scroll</span>
        </div>
      </header>

      {batchError && (
        <div role="alert" className="border-l-2 border-[#F06C68] bg-[#2B2223] px-4 py-3 text-sm text-[#F2B1AE]">
          {batchError}
        </div>
      )}

      <div className="grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCaptures.map((capture, index) => {
          const batchKey = detectionReviewBatchKey(capture)
          const batch = reviewBatchByKey.get(batchKey)
          const beginsBatch = index === 0
            || detectionReviewBatchKey(filteredCaptures[index - 1]) !== batchKey
          const draft = drafts[capture.id]
          const upload = uploadsByCapture.get(capture.id)
          const frame = selectedFrame(capture, draft)
          const framePosition = capture.temporalFrames.findIndex((temporalFrame) => temporalFrame.index === frame?.index)
          const previousFrame = framePosition > 0 ? capture.temporalFrames[framePosition - 1] : null
          const nextFrame = framePosition >= 0 && framePosition < capture.temporalFrames.length - 1
            ? capture.temporalFrames[framePosition + 1]
            : null
          const reviewPointBelongsToFrame = Boolean(
            capture.review && (
              (capture.review.selectedFramePtsNanos && capture.review.selectedFramePtsNanos === frame?.ptsNanos)
              || (capture.review.selectedFrameRelation && capture.review.selectedFrameRelation === frame?.relation)
              || (!capture.review.selectedFrameRelation && frame?.relativeFrame === 0)
            ),
          )
          const displayPoint = draft?.point || (
            reviewPointBelongsToFrame && capture.review?.actualX != null && capture.review?.actualY != null
              ? { x: capture.review.actualX, y: capture.review.actualY }
              : null
          )
          const deltaX = displayPoint ? displayPoint.x - capture.detectorX : null
          const band = qualityBand(deltaX)
          const activeIssue = draft?.issue ?? capture.review?.issue
          const selectedFalseTriggerLabel = falseTriggerReviewLabel(activeIssue)
          const isSceneMotion = activeIssue === "false_positive"
          const activeSceneMotionCauses = isSceneMotion
            ? normalizeSceneMotionCauses(draft?.sceneMotionCauses ?? capture.review?.sceneMotionCauses ?? [])
            : []
          const isIgnoredCrossing = isIgnoredCrossingIssue(activeIssue)
          const isPhoneShake = activeIssue === "phone_shake"
          const isNoCorrectFrame = draft?.issue === "real_crossing" || (!draft && capture.review?.issue === "real_crossing")
          const crossingTiming = detectionReviewCrossingTiming(activeIssue)
          const isOutsideFrameBefore = crossingTiming === "earlier"
          const isOutsideFrameAfter = crossingTiming === "later"
          const selectedOutsideFrameLabel = outsideFrameLabel(activeIssue)
          const stateLabel = upload?.status === "failed"
            ? "Upload failed"
            : upload?.status === "uploading"
              ? "Uploading"
              : upload?.status === "queued"
                ? "Queued"
                  : draft
                  ? "Draft"
                  : capture.review
                    ? capture.review.source === "app"
                      ? "Marked in app"
                      : "Saved"
                    : !capture.detectorCoordinateVerified
                      ? "Needs camera metadata"
                      : "Unmarked"
          return (
            <Fragment key={capture.id}>
            {beginsBatch && batch && (
              <header className="col-span-full scroll-mt-24 border-l-2 border-[#5C8DB8] bg-[#19252D] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:px-5">
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                  <div>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8FB5D4]">
                      Setup batch {batch.index + 1} of {reviewBatches.length}
                    </p>
                    <h3 className="mt-1 text-sm font-semibold text-white sm:text-base">
                      {capture.deviceModel || "Unknown iPhone"} · {cameraSetupLabel(batch.captures)}
                    </h3>
                    <p className="mt-1 font-mono text-[10px] leading-4 text-[#7F929F]">
                      Session {shortId(capture.sessionId)} · {capture.mode} · {capture.appVersion || "version not recorded"}{capture.appBuild ? ` (${capture.appBuild})` : ""} · {capture.evidenceConsentVersion > 0 ? `production consent v${capture.evidenceConsentVersion}` : capture.evidenceProvenance.replaceAll("_", " ")} · {formatSetupDate(capture.createdAt)}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-x-5 gap-y-1 font-mono text-right text-[10px]">
                    <span className="text-[#8B8F94]">Runs</span>
                    <span className="font-semibold text-white">
                      {batch.captures[0].runNumber}–{batch.captures[batch.captures.length - 1].runNumber}
                    </span>
                    <span className="text-[#8B8F94]">Saved / visible</span>
                    <span className="font-semibold text-[#A8D8B9]">
                      {batch.captures.filter((item) => item.review).length} / {batch.captures.length}
                    </span>
                  </div>
                </div>
              </header>
            )}
            <article
              id={reviewCardId(capture.id)}
              tabIndex={-1}
              className={`overflow-hidden rounded-2xl border bg-[#1B2228] shadow-[0_18px_48px_-38px_rgba(3,12,18,0.95),inset_0_1px_0_rgba(255,255,255,0.04)] transition duration-200 ${
                blockingCaptureId === capture.id
                  ? "border-[#F06C68] ring-2 ring-[#F06C68]/60 ring-offset-2 ring-offset-[#11181D]"
                  : draft && selectedFalseTriggerLabel
                  ? "border-[#7B4B4D]"
                  : draft && selectedOutsideFrameLabel
                  ? "border-[#9A814A]"
                  : draft
                    ? "border-[#5C8DB8]"
                  : upload?.status === "failed"
                    ? "border-[#9A5755]"
                    : "border-[#31404A] hover:border-[#456175]"
              }`}
            >
              <div className="flex items-start justify-between gap-3 border-b border-[#31404A] bg-[#202A32] px-3.5 py-3">
                <div>
                  <div className="text-sm font-semibold text-white">Run {capture.runNumber} · {capture.target}</div>
                  <div className="mt-0.5 font-mono text-[10px] text-[#777B80]">
                    {capture.isFrontCamera === null ? "camera n/a" : capture.isFrontCamera ? "front camera" : "back camera"} · {detectionReviewDirectionLabel(capture.direction, capture.directionEvidence)}
                  </div>
                </div>
                <div className="grid justify-items-end gap-1">
                  <span className={`font-mono text-[10px] ${upload?.status === "failed" ? "text-[#F2B1AE]" : draft ? "text-[#8FB5D4]" : "text-[#777B80]"}`}>
                    {stateLabel}
                  </span>
                  {capture.review?.source === "app" && (
                    <span className="rounded-full border border-[#527E62] bg-[#213027] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#8FC8A3]">
                      {capture.review.issue === "unlabeled"
                        ? "App review"
                        : falseTriggerReviewLabel(capture.review.issue) || capture.review.issue}
                    </span>
                  )}
                </div>
              </div>

              {blockingCaptureId === capture.id && (
                <p role="alert" className="border-b border-[#6B4140] bg-[#2B2223] px-3.5 py-2.5 text-[11px] font-semibold leading-4 text-[#F2B1AE]">
                  Blocking crossing: {detectionReviewCaptureReference(capture)}. Mark the true source-image point, or choose an explicit point-free classification.
                </p>
              )}

              <StableCaptureMedia
                capture={capture}
                displayPoint={displayPoint}
                frame={frame}
                imageIndex={index}
                falseTriggerLabel={selectedFalseTriggerLabel}
                isUnavailable={Boolean(upload && upload.status !== "failed")}
                onImageRef={(image) => {
                  if (image) imageRefs.current.set(capture.id, image)
                  else imageRefs.current.delete(capture.id)
                }}
                onMark={(event) => placeGridMark(capture, frame, event)}
              />

              {!capture.detectorCoordinateVerified && capture.editBlockReason && (
                <p className="border-b border-[#6B4140] bg-[#2B2223] px-3.5 py-2.5 text-[11px] leading-4 text-[#F2B1AE]">
                  {capture.editBlockReason}
                </p>
              )}

              {capture.temporalFrames.length > 0 && (
                <div className="border-b border-[#31404A] bg-[#151D23] px-3.5 py-3">
                  <div className="mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9B9A97]">
                      Frame
                    </span>
                  </div>
                  <div
                    role="group"
                    aria-label={`Frame scrubber for session ${shortId(capture.sessionId)}, run ${capture.runNumber}`}
                    className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] overflow-hidden rounded-xl border border-[#3B5362] bg-[#11181D] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                  >
                    <button
                      type="button"
                      aria-label="Show previous frame"
                      onClick={() => previousFrame && chooseGridFrame(capture, previousFrame)}
                      disabled={!previousFrame || !capture.editable || Boolean(upload && upload.status !== "failed")}
                      className="min-h-12 border-r border-[#3B5362] px-3 text-xs font-semibold text-[#D6E2E9] transition hover:bg-[#22303A] hover:text-white active:-translate-y-px disabled:cursor-default disabled:text-[#55636D] disabled:hover:bg-transparent"
                    >
                      Back
                    </button>
                    <div aria-live="polite" className="grid min-w-[98px] place-content-center bg-[#203229] px-3 text-center shadow-[inset_0_0_0_1px_rgba(111,181,138,0.12)]">
                      <span className="text-[10px] font-semibold text-[#B9E2C8]">
                        {frame ? framePositionLabel(frame) : "Detected frame"}
                      </span>
                      <span className="mt-0.5 font-mono text-[9px] text-[#686D72]">
                        {framePosition >= 0 ? framePosition + 1 : 1} of {capture.temporalFrames.length}
                      </span>
                    </div>
                    <button
                      type="button"
                      aria-label="Show next frame"
                      onClick={() => nextFrame && chooseGridFrame(capture, nextFrame)}
                      disabled={!nextFrame || !capture.editable || Boolean(upload && upload.status !== "failed")}
                      className="min-h-12 border-l border-[#3B5362] px-3 text-xs font-semibold text-[#D6E2E9] transition hover:bg-[#22303A] hover:text-white active:-translate-y-px disabled:cursor-default disabled:text-[#55636D] disabled:hover:bg-transparent"
                    >
                      Forward
                    </button>
                  </div>
                  <p className="mt-2 text-[10px] leading-4 text-[#777B80]">
                    Choose a frame, then tap the true torso edge in the image.
                  </p>

                  {capture.editable && (
                    <div className="mt-3 rounded-xl border border-[#5E5134] bg-[#28251D] p-2.5">
                      <button
                        type="button"
                        aria-pressed={isNoCorrectFrame}
                        onClick={() => toggleOutsideFrame(capture, "real_crossing")}
                        disabled={Boolean(upload && upload.status !== "failed")}
                        className={`min-h-12 w-full rounded-lg border px-3 py-2 text-xs font-semibold transition active:-translate-y-px disabled:cursor-wait disabled:opacity-50 ${
                          isNoCorrectFrame
                            ? "border-[#D6B36A] bg-[#6C592F] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                            : "border-[#8B7444] bg-[#352F20] text-[#F0D89B] hover:border-[#D6B36A] hover:bg-[#403722] hover:text-white"
                        }`}
                      >
                        {isNoCorrectFrame ? "None of these frames selected" : "None of these frames"}
                      </button>
                      <p className="mt-2 text-[9px] leading-3.5 text-[#A99B78]">
                        Earlier/later can also be saved with a green point on the image.
                      </p>
                      <div className="mt-2 grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          aria-pressed={isOutsideFrameBefore}
                          onClick={() => toggleOutsideFrame(capture, "outsideFrameBefore")}
                          disabled={Boolean(upload && upload.status !== "failed")}
                          className={`min-h-11 rounded-lg border px-2.5 py-2 text-[10px] font-semibold transition active:-translate-y-px disabled:cursor-wait disabled:opacity-50 ${
                            isOutsideFrameBefore
                              ? "border-[#D6B36A] bg-[#4A4028] text-white"
                              : "border-[#5E5134] text-[#CBB985] hover:border-[#8B7444] hover:text-white"
                          }`}
                        >
                          Crossing was earlier
                        </button>
                        <button
                          type="button"
                          aria-pressed={isOutsideFrameAfter}
                          onClick={() => toggleOutsideFrame(capture, "outsideFrameAfter")}
                          disabled={Boolean(upload && upload.status !== "failed")}
                          className={`min-h-11 rounded-lg border px-2.5 py-2 text-[10px] font-semibold transition active:-translate-y-px disabled:cursor-wait disabled:opacity-50 ${
                            isOutsideFrameAfter
                              ? "border-[#D6B36A] bg-[#4A4028] text-white"
                              : "border-[#5E5134] text-[#CBB985] hover:border-[#8B7444] hover:text-white"
                          }`}
                        >
                          Crossing was later
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="border-b border-[#31404A] bg-[#192127] px-3.5 py-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor={`thumbnail-note-${capture.id}`}
                    className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9B9A97]"
                  >
                    Thumbnail note
                  </label>
                  <span className="font-mono text-[9px] text-[#63676C]">
                    {(draft?.note ?? capture.review?.note ?? "").length}/500
                  </span>
                </div>
                <input
                  id={`thumbnail-note-${capture.id}`}
                  type="text"
                  value={draft?.note ?? capture.review?.note ?? ""}
                  onChange={(event) => updateGridNote(capture, event.target.value)}
                  disabled={!capture.editable || Boolean(upload && upload.status !== "failed")}
                  maxLength={500}
                  placeholder={capture.editable ? "Short note about this frame" : "Saved in the app"}
                  className="w-full rounded-lg border border-[#3B4B56] bg-[#131A1F] px-3 py-2 text-xs text-white outline-none transition placeholder:text-[#64717A] focus:border-[#5C8DB8] focus:ring-2 focus:ring-[#5C8DB8]/20 disabled:cursor-default disabled:opacity-70"
                />
              </div>

              <div className="grid gap-2 px-3.5 py-3">
                <div>
                  <div className={`font-mono text-[10px] font-semibold uppercase tracking-[0.1em] ${selectedFalseTriggerLabel ? "text-[#F2B1AE]" : selectedOutsideFrameLabel ? "text-[#E3C881]" : band.tone}`}>
                    {selectedFalseTriggerLabel || selectedOutsideFrameLabel || band.label}
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-[#63676C]">
                    {displayPoint && deltaX !== null
                      ? `x ${(displayPoint.x * 100).toFixed(2)}% · Δ ${(deltaX * 100).toFixed(2)}%`
                      : selectedOutsideFrameLabel || selectedFalseTriggerLabel ? "No point needed" : "Click image to mark"}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {draft && (
                    <button
                      type="button"
                      onClick={() => clearDraft(capture.id)}
                      className="col-span-2 min-h-11 rounded-lg border border-[#3D3D3D] px-2.5 py-2 text-[10px] font-semibold text-[#9B9A97] transition hover:text-white active:translate-y-px"
                    >
                      Clear draft
                    </button>
                  )}
                  <button
                    type="button"
                    aria-pressed={isSceneMotion}
                    onClick={() => toggleFalseTrigger(capture, "false_positive")}
                    disabled={!capture.editable || Boolean(upload && upload.status !== "failed")}
                    className={`col-span-2 min-h-14 rounded-lg border px-2.5 py-2 text-left transition active:translate-y-px disabled:cursor-wait disabled:opacity-50 ${
                      isSceneMotion
                        ? "border-[#9A5755] bg-[#342526] text-[#F2B1AE]"
                        : "border-[#68484A] bg-[#251D20] text-[#C9908D] hover:border-[#9A5755] hover:text-[#F2B1AE]"
                    }`}
                  >
                    <span className="block text-[10px] font-semibold">Scene motion</span>
                    <span className="mt-0.5 block text-[8px] font-medium leading-3 opacity-70">
                      No runner · wind · trees · glare
                    </span>
                  </button>
                  <fieldset
                    className={`col-span-2 rounded-lg border p-2.5 transition-colors ${
                      isSceneMotion
                        ? "border-[#5F4547] bg-[#211A1C]"
                        : "border-[#39444C] bg-[#171E23]"
                    }`}
                  >
                    <legend
                      className={`px-1 text-[9px] font-semibold uppercase tracking-[0.1em] ${
                        isSceneMotion ? "text-[#C9908D]" : "text-[#8F9AA2]"
                      }`}
                    >
                      Scene causes · choose all
                    </legend>
                    <div className="grid grid-cols-2 gap-1.5">
                      {SCENE_MOTION_CAUSE_OPTIONS.map((option) => {
                        const selectedCause = activeSceneMotionCauses.includes(option.value)
                        return (
                          <button
                            key={option.value}
                            type="button"
                            aria-pressed={selectedCause}
                            onClick={() => toggleSceneMotionCause(capture, option.value)}
                            disabled={!capture.editable || Boolean(upload && upload.status !== "failed")}
                            className={`min-h-10 rounded-md border px-2 py-1.5 text-left text-[9px] font-semibold transition active:translate-y-px disabled:cursor-wait disabled:opacity-50 ${
                              selectedCause
                                ? "border-[#D6B36A] bg-[#4A4028] text-[#FFF1C8]"
                                : isSceneMotion
                                  ? "border-[#5F4547] bg-[#2A2022] text-[#C9908D] hover:border-[#9A5755] hover:text-white"
                                  : "border-[#46515A] bg-[#1B242B] text-[#AEB8C0] hover:border-[#9A5755] hover:text-white"
                            }`}
                          >
                            {option.label}
                          </button>
                        )
                      })}
                    </div>
                    <p className={`mt-2 text-[8px] leading-3 ${isSceneMotion ? "text-[#9D7776]" : "text-[#77838B]"}`}>
                      Choose all that apply. Use Ignore crossing for shadows.
                    </p>
                  </fieldset>
                  <button
                    type="button"
                    aria-pressed={isIgnoredCrossing}
                    onClick={() => toggleFalseTrigger(capture, "ignore_crossing")}
                    disabled={!capture.editable || Boolean(upload && upload.status !== "failed")}
                    className={`min-h-14 rounded-lg border px-2.5 py-2 text-left transition active:translate-y-px disabled:cursor-wait disabled:opacity-50 ${
                      isIgnoredCrossing
                        ? "border-[#9A5755] bg-[#342526] text-[#F2B1AE]"
                        : "border-[#68484A] bg-[#251D20] text-[#C9908D] hover:border-[#9A5755] hover:text-[#F2B1AE]"
                    }`}
                  >
                    <span className="block text-[10px] font-semibold">Ignore crossing</span>
                    <span className="mt-0.5 block text-[8px] font-medium leading-3 opacity-70">
                      Shadow · hand · pick up · set down
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-pressed={isPhoneShake}
                    onClick={() => toggleFalseTrigger(capture, "phone_shake")}
                    disabled={!capture.editable || Boolean(upload && upload.status !== "failed")}
                    className={`min-h-14 rounded-lg border px-2.5 py-2 text-left transition active:translate-y-px disabled:cursor-wait disabled:opacity-50 ${
                      isPhoneShake
                        ? "border-[#9A5755] bg-[#342526] text-[#F2B1AE]"
                        : "border-[#68484A] bg-[#251D20] text-[#C9908D] hover:border-[#9A5755] hover:text-[#F2B1AE]"
                    }`}
                  >
                    <span className="block text-[10px] font-semibold">Phone shake</span>
                    <span className="mt-0.5 block text-[8px] font-medium leading-3 opacity-70">
                      Camera moved
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenDetail(capture.id)}
                    disabled={draftCount > 0 || preparing}
                    title={draftCount > 0 ? "Queue or clear the grid marks before opening detail view" : undefined}
                    className="col-span-2 min-h-11 rounded-lg border border-[#41647B] bg-[#1B2A35] px-2.5 py-2 text-[10px] font-semibold text-[#AFC9DB] transition hover:border-[#5C8DB8] hover:bg-[#223746] hover:text-white active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Open large
                  </button>
                </div>
              </div>
            </article>
            </Fragment>
          )
        })}
      </div>

      <footer className="sticky bottom-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-xl border border-[#45657A] bg-[#19242C]/95 p-2 shadow-[0_20px_50px_-28px_rgba(2,11,17,0.95),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md sm:bottom-3 sm:gap-3 sm:rounded-2xl sm:p-3">
        <div className="min-w-0 px-1">
          <div className="truncate text-xs font-semibold text-white sm:text-sm">
            {draftCount} drafted <span className="hidden sm:inline">· {reviewedInGrid} already reviewed </span>· {filteredCaptures.length} visible
          </div>
          <div className="mt-0.5 hidden text-[11px] text-[#777B80] sm:block">
            Marks and thumbnail notes upload together in the background.
          </div>
        </div>
        <button
          type="button"
          onClick={() => void queueDrafts()}
          disabled={preparing || draftCount === 0}
          className="min-w-0 rounded-lg bg-[#5C8DB8] px-3 py-2.5 text-xs font-semibold text-white transition duration-200 hover:bg-[#6C9AC2] active:translate-y-px disabled:cursor-not-allowed disabled:bg-[#3A4650] disabled:text-[#7C858D] sm:min-w-48 sm:rounded-xl sm:px-5 sm:py-3 sm:text-sm"
        >
          {preparing ? "Preparing batch…" : `Queue ${draftCount} ${draftCount === 1 ? "review" : "reviews"}`}
        </button>
      </footer>
    </section>
  )
}
