/* eslint-disable @next/next/no-img-element */
"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { DetectionReviewGrid, type GridReviewItem } from "./DetectionReviewGrid"

type ReviewIssue =
  | "unlabeled"
  | "good"
  | "early"
  | "late"
  | "arm"
  | "leg"
  | "wrongFrame"
  | "blur"
  | "thumbnail"
  | "false_positive"
  | "real_crossing"
  | "other"

interface ReviewMark {
  id: string
  createdAt: string
  issue: ReviewIssue
  actualX: number | null
  actualY: number | null
  detectorX: number
  detectorY: number | null
  deltaX: number | null
  deltaY: number | null
  note: string
  hasReviewImage: boolean
  source: "app" | "admin"
}

interface DetectionCapture {
  id: string
  source: "debug_capture" | "app_mark"
  editable: boolean
  sessionId: string | null
  deviceId: string
  runId: string
  runNumber: number
  gateLabel: string
  target: string
  mode: string
  appVersion: string | null
  deviceModel: string | null
  createdAt: string
  direction: string | null
  detectorX: number
  configuredGateX: number
  blobHeightFraction: number | null
  blobWidthFraction: number | null
  fps: number | null
  imageUrl: string
  review: ReviewMark | null
}

type ShirtContrast = "" | "good" | "ok" | "poor"

interface SessionContext {
  id: string
  sessionId: string
  updatedAt: string
  shirtColor: string
  shirtContrast: ShirtContrast
  notes: string
}

interface SessionEvidence {
  id: string
  sessionId: string
  evidenceCorrelationId: string | null
  localRaceSessionId: string | null
  cloudSessionId: string | null
  deviceId: string
  timingMode: string | null
  expectedRunCount: number | null
  localRole: string | null
  gateIndex: number | null
  appVersion: string | null
  deviceModel: string | null
  createdAt: string
}

interface QueueResponse {
  generatedAt: string
  windowDays: number
  captures: DetectionCapture[]
  sessionContexts: SessionContext[]
  sessionEvidence: SessionEvidence[]
  counts: {
    total: number
    reviewed: number
    pending: number
  }
  pagination: {
    offset: number
    limit: number
    nextOffset: number
    total: number
    hasMore: boolean
  }
  error?: string
}

interface Point {
  x: number
  y: number
}

interface ReviewUploadPayload {
  captureId: string
  actualX: number | null
  actualY: number | null
  issue: ReviewIssue
  note: string
  reviewImageDataUrl: string
}

interface ReviewUpload {
  captureId: string
  payload: ReviewUploadPayload
  status: "queued" | "uploading" | "failed"
  attempts: number
  availableAt: number
  error: string | null
}

const MAX_CONCURRENT_UPLOADS = 2
const MAX_UPLOAD_ATTEMPTS = 3
const MAX_QUEUE_PAGE_ATTEMPTS = 3
const QUEUE_PAGE_SIZE = 300

const shirtColorPresets = [
  "Black",
  "White",
  "Gray",
  "Blue",
  "Green",
  "Red",
  "Yellow",
  "Mixed / multiple",
  "No shirt",
] as const

const issueOptions: Array<{ value: ReviewIssue; label: string; helper: string }> = [
  { value: "good", label: "Good", helper: "Detector line is accurate" },
  { value: "early", label: "Early", helper: "Detector fired before the torso" },
  { value: "late", label: "Late", helper: "Detector fired behind the torso" },
  { value: "arm", label: "Arm", helper: "Arm or hand drove the timing edge" },
  { value: "leg", label: "Leg", helper: "Leg drove the timing edge" },
  { value: "wrongFrame", label: "Wrong frame", helper: "Saved evidence frame is wrong" },
  { value: "blur", label: "Blur", helper: "Motion blur prevents a confident mark" },
  { value: "thumbnail", label: "Thumbnail", helper: "Image mapping or crop is wrong" },
  { value: "false_positive", label: "False positive", helper: "No real crossing occurred" },
  { value: "real_crossing", label: "Real crossing", helper: "Crossing exists but is unmeasured" },
  { value: "other", label: "Other", helper: "Describe the problem in a note" },
]

function shortId(value: string | null) {
  return value ? value.slice(0, 8) : "unlinked"
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

function percent(value: number | null, digits = 2) {
  return value === null ? "n/a" : `${(value * 100).toFixed(digits)}%`
}

function errorBand(deltaX: number | null) {
  if (deltaX === null) return { label: "Unmeasured", tone: "text-[#9B9A97]" }
  const absolute = Math.abs(deltaX)
  if (absolute <= 0.03) return { label: "Accepted", tone: "text-[#6FB58A]" }
  if (absolute < 0.06) return { label: "Watch", tone: "text-[#D6B36A]" }
  if (absolute < 0.1) return { label: "Fail", tone: "text-[#DC8B72]" }
  return { label: "Severe", tone: "text-[#F06C68]" }
}

function reviewStateChanged(
  capture: DetectionCapture | null,
  point: Point | null,
  issue: ReviewIssue,
  note: string,
) {
  if (!capture || !capture.editable) return false
  const review = capture.review
  return (
    (point?.x ?? null) !== (review?.actualX ?? null) ||
    (point?.y ?? null) !== (review?.actualY ?? null) ||
    issue !== (review?.issue ?? "unlabeled") ||
    note !== (review?.note ?? "")
  )
}

export default function DetectionReviewDashboard() {
  const [captures, setCaptures] = useState<DetectionCapture[]>([])
  const [sessionContexts, setSessionContexts] = useState<SessionContext[]>([])
  const [sessionEvidence, setSessionEvidence] = useState<SessionEvidence[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<"pending" | "reviewed" | "all">("all")
  const [days, setDays] = useState(7)
  const [search, setSearch] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "focus">("grid")
  const [gridDraftCount, setGridDraftCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [imageLoading, setImageLoading] = useState(true)
  const [preparing, setPreparing] = useState(false)
  const [uploads, setUploads] = useState<ReviewUpload[]>([])
  const [uploadClock, setUploadClock] = useState(0)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [point, setPoint] = useState<Point | null>(null)
  const [issue, setIssue] = useState<ReviewIssue>("unlabeled")
  const [note, setNote] = useState("")
  const [contextSessionId, setContextSessionId] = useState<string | null>(null)
  const [shirtColor, setShirtColor] = useState("")
  const [shirtContrast, setShirtContrast] = useState<ShirtContrast>("")
  const [contextNotes, setContextNotes] = useState("")
  const [contextSaving, setContextSaving] = useState(false)
  const [contextError, setContextError] = useState("")
  const imageRef = useRef<HTMLImageElement | null>(null)
  const uploadsRef = useRef<ReviewUpload[]>([])
  const activeUploadsRef = useRef(new Set<string>())
  const uploadAbortControllersRef = useRef(new Map<string, AbortController>())
  const preparingCaptureRef = useRef<string | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    uploadsRef.current = uploads
  }, [uploads])

  useEffect(() => {
    mountedRef.current = true
    const controllers = uploadAbortControllersRef.current
    return () => {
      mountedRef.current = false
      controllers.forEach((controller) => controller.abort())
      controllers.clear()
    }
  }, [])

  const loadQueue = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const loadedCaptures: DetectionCapture[] = []
      const loadedContexts = new Map<string, SessionContext>()
      const loadedEvidence = new Map<string, SessionEvidence>()
      let offset = 0
      let hasMore = true

      while (hasMore) {
        let page: QueueResponse | null = null
        let pageError: unknown = null
        for (let attempt = 0; attempt < MAX_QUEUE_PAGE_ATTEMPTS; attempt += 1) {
          try {
            const response = await fetch(
              `/api/admin/detection-review?days=${days}&limit=${QUEUE_PAGE_SIZE}&offset=${offset}`,
              { cache: "no-store" },
            )
            if (response.status === 401) {
              window.location.href = `/admin/login?redirect=${encodeURIComponent("/admin/detection-review")}`
              return
            }
            const responsePage = (await response.json()) as QueueResponse
            if (response.ok) {
              page = responsePage
              break
            }
            pageError = new Error(responsePage.error || "Could not load review queue")
            if (response.status < 500) throw pageError
          } catch (attemptError) {
            pageError = attemptError
          }

          if (attempt + 1 < MAX_QUEUE_PAGE_ATTEMPTS) {
            await new Promise((resolve) => window.setTimeout(resolve, 250 * (attempt + 1)))
          }
        }
        if (!page) throw pageError || new Error("Could not load review queue")

        loadedCaptures.push(...page.captures)
        page.sessionContexts.forEach((context) => {
          if (!loadedContexts.has(context.sessionId)) loadedContexts.set(context.sessionId, context)
        })
        page.sessionEvidence.forEach((evidence) => {
          const key = `${evidence.evidenceCorrelationId || evidence.localRaceSessionId || evidence.sessionId}:${evidence.deviceId}`
          if (!loadedEvidence.has(key)) loadedEvidence.set(key, evidence)
        })
        hasMore = page.pagination.hasMore
        offset = page.pagination.nextOffset
        if (hasMore && page.captures.length === 0) {
          throw new Error("The review queue stopped before every thumbnail was loaded")
        }
      }

      const capturesByIdentity = new Map<string, DetectionCapture>()
      loadedCaptures.forEach((capture) => {
        const identity = capture.sessionId
          ? `${capture.sessionId.toLowerCase()}:run${capture.runNumber}:${capture.target}`
          : `unlinked:${capture.id}`
        const existing = capturesByIdentity.get(identity)
        if (!existing || (existing.source === "app_mark" && capture.source === "debug_capture")) {
          capturesByIdentity.set(identity, capture)
        }
      })
      const dedupedCaptures = [...capturesByIdentity.values()].sort(
        (left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt),
      )
      const capturesById = new Map(dedupedCaptures.map((capture) => [capture.id, capture]))
      const optimisticReviews = new Map(
        uploadsRef.current.map((upload) => [
          upload.captureId,
          {
            id: `queued:${upload.captureId}`,
            createdAt: new Date().toISOString(),
            issue: upload.payload.issue,
            actualX: upload.payload.actualX,
            actualY: upload.payload.actualY,
            detectorX: capturesById.get(upload.captureId)?.detectorX ?? 0.5,
            detectorY: null,
            deltaX:
              upload.payload.actualX === null
                ? null
                : upload.payload.actualX - (capturesById.get(upload.captureId)?.detectorX ?? 0.5),
            deltaY: null,
            note: upload.payload.note,
            hasReviewImage: false,
            source: "admin" as const,
          } satisfies ReviewMark,
        ]),
      )
      setCaptures(
        dedupedCaptures.map((capture) =>
          optimisticReviews.has(capture.id)
            ? { ...capture, review: optimisticReviews.get(capture.id) || null }
            : capture,
        ),
      )
      setSessionContexts([...loadedContexts.values()])
      setSessionEvidence([...loadedEvidence.values()])
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load review queue")
    } finally {
      setLoading(false)
    }
  }, [days])

  useEffect(() => {
    void loadQueue()
  }, [loadQueue])

  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      setViewMode("focus")
    }
  }, [])

  const filteredCaptures = useMemo(() => {
    const query = search.trim().toLowerCase()
    return captures.filter((capture) => {
      if (statusFilter === "pending" && capture.review) return false
      if (statusFilter === "reviewed" && !capture.review) return false
      if (!query) return true
      return [
        capture.sessionId,
        capture.runId,
        capture.deviceModel,
        capture.appVersion,
        capture.direction,
        String(capture.runNumber),
      ].some((value) => value?.toLowerCase().includes(query))
    })
  }, [captures, search, statusFilter])

  const selected = useMemo(
    () => captures.find((capture) => capture.id === selectedId) || null,
    [captures, selectedId],
  )

  const sessionContextsById = useMemo(
    () => new Map(sessionContexts.map((context) => [context.sessionId, context])),
    [sessionContexts],
  )
  const sessionContextIds = useMemo(
    () => new Set(sessionContexts.map((context) => context.sessionId)),
    [sessionContexts],
  )

  const selectedContext = selected?.sessionId
    ? sessionContextsById.get(selected.sessionId) || null
    : null

  function openSessionContext(sessionId: string) {
    const context = sessionContextsById.get(sessionId)
    setContextSessionId(sessionId)
    setShirtColor(context?.shirtColor || "")
    setShirtContrast(context?.shirtContrast || "")
    setContextNotes(context?.notes || "")
    setContextError("")
  }

  function closeSessionContext() {
    if (contextSaving) return
    setContextSessionId(null)
    setContextError("")
  }

  async function saveSessionContext() {
    if (!contextSessionId) return
    if (!shirtColor.trim() && !shirtContrast && !contextNotes.trim()) {
      setContextError("Add a shirt color, contrast rating, or note before saving.")
      return
    }

    setContextSaving(true)
    setContextError("")
    try {
      const response = await fetch("/api/admin/detection-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save-session-context",
          sessionId: contextSessionId,
          shirtColor,
          shirtContrast,
          notes: contextNotes,
        }),
      })
      const result = (await response.json().catch(() => ({}))) as {
        sessionContext?: SessionContext
        error?: string
      }
      if (response.status === 401) {
        window.location.href = `/admin/login?redirect=${encodeURIComponent("/admin/detection-review")}`
        return
      }
      if (!response.ok || !result.sessionContext) {
        throw new Error(result.error || "Could not save session notes")
      }

      setSessionContexts((current) => [
        ...current.filter((context) => context.sessionId !== result.sessionContext?.sessionId),
        result.sessionContext as SessionContext,
      ])
      setContextSessionId(null)
      setSuccess(`Session ${shortId(result.sessionContext.sessionId)} notes saved for the daily analysis.`)
    } catch (saveError) {
      setContextError(saveError instanceof Error ? saveError.message : "Could not save session notes")
    } finally {
      setContextSaving(false)
    }
  }

  useEffect(() => {
    if (!filteredCaptures.length) {
      setSelectedId(null)
      return
    }
    if (!selectedId || !filteredCaptures.some((capture) => capture.id === selectedId)) {
      setSelectedId(filteredCaptures[0].id)
    }
  }, [filteredCaptures, selectedId])

  useEffect(() => {
    const review = selected?.review
    setPoint(
      review?.actualX !== null && review?.actualX !== undefined && review.actualY !== null
        ? { x: review.actualX, y: review.actualY }
        : null,
    )
    setIssue(review?.issue || "unlabeled")
    setNote(review?.note || "")
    setImageLoading(true)
    setError("")
    setSuccess("")
  }, [selected])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (viewMode !== "focus") return
      const target = event.target as HTMLElement | null
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.tagName === "SELECT") {
        return
      }
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
      if (!selectedId) return
      if (reviewStateChanged(selected, point, issue, note)) {
        setError("Save and continue before leaving this thumbnail, or clear your changes first.")
        return
      }
      const index = filteredCaptures.findIndex((capture) => capture.id === selectedId)
      if (index < 0) return
      const offset = event.key === "ArrowRight" ? 1 : -1
      const next = filteredCaptures[index + offset]
      if (next) {
        event.preventDefault()
        setSelectedId(next.id)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [filteredCaptures, issue, note, point, selected, selectedId, viewMode])

  useEffect(() => {
    if (viewMode !== "focus") return
    if (!selectedId) return
    const selectedIndex = filteredCaptures.findIndex((capture) => capture.id === selectedId)
    if (selectedIndex < 0) return
    const images = filteredCaptures
      .slice(selectedIndex + 1, selectedIndex + 3)
      .map((capture) => {
        const image = new Image()
        image.src = capture.imageUrl
        return image
      })
    return () => images.forEach((image) => {
      image.src = ""
    })
  }, [filteredCaptures, selectedId, viewMode])

  useEffect(() => {
    if (uploads.length === 0) return
    function warnBeforeLeaving(event: BeforeUnloadEvent) {
      event.preventDefault()
      event.returnValue = ""
    }
    window.addEventListener("beforeunload", warnBeforeLeaving)
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving)
  }, [uploads.length])

  useEffect(() => {
    if (!contextSessionId) return
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !contextSaving) {
        setContextSessionId(null)
        setContextError("")
      }
    }
    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [contextSaving, contextSessionId])

  const uploadReview = useCallback(async (upload: ReviewUpload) => {
    if (activeUploadsRef.current.has(upload.captureId)) return
    activeUploadsRef.current.add(upload.captureId)
    const attempt = upload.attempts + 1
    const controller = new AbortController()
    uploadAbortControllersRef.current.set(upload.captureId, controller)
    setUploads((current) =>
      current.map((item) =>
        item.captureId === upload.captureId
          ? { ...item, status: "uploading", attempts: attempt, error: null }
          : item,
      ),
    )

    try {
      const response = await fetch("/api/admin/detection-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(upload.payload),
        signal: controller.signal,
      })
      const result = (await response.json().catch(() => ({}))) as { review?: ReviewMark; error?: string }
      if (response.status === 401) {
        window.location.href = `/admin/login?redirect=${encodeURIComponent("/admin/detection-review")}`
        return
      }
      if (!response.ok || !result.review) {
        throw new Error(result.error || "Could not upload review")
      }
      if (!mountedRef.current) return

      setCaptures((current) =>
        current.map((capture) =>
          capture.id === upload.captureId ? { ...capture, review: result.review || null } : capture,
        ),
      )
      setUploads((current) => current.filter((item) => item.captureId !== upload.captureId))
    } catch (uploadError) {
      if (!mountedRef.current || controller.signal.aborted) return
      const message = uploadError instanceof Error ? uploadError.message : "Could not upload review"
      const failed = attempt >= MAX_UPLOAD_ATTEMPTS
      setUploads((current) =>
        current.map((item) =>
          item.captureId === upload.captureId
            ? {
                ...item,
                status: failed ? "failed" : "queued",
                attempts: attempt,
                availableAt: failed ? Number.POSITIVE_INFINITY : Date.now() + 1000 * 2 ** (attempt - 1),
                error: message,
              }
            : item,
        ),
      )
    } finally {
      activeUploadsRef.current.delete(upload.captureId)
      uploadAbortControllersRef.current.delete(upload.captureId)
    }
  }, [])

  useEffect(() => {
    const availableSlots = MAX_CONCURRENT_UPLOADS - activeUploadsRef.current.size
    if (availableSlots <= 0) return

    const now = Date.now()
    const ready = uploads
      .filter(
        (upload) =>
          upload.status === "queued" &&
          upload.availableAt <= now &&
          !activeUploadsRef.current.has(upload.captureId),
      )
      .slice(0, availableSlots)

    ready.forEach((upload) => void uploadReview(upload))
    if (ready.length > 0) return

    const nextAvailableAt = Math.min(
      ...uploads
        .filter((upload) => upload.status === "queued")
        .map((upload) => upload.availableAt),
    )
    if (!Number.isFinite(nextAvailableAt)) return
    const timer = window.setTimeout(
      () => setUploadClock((current) => current + 1),
      Math.max(0, nextAvailableAt - now),
    )
    return () => window.clearTimeout(timer)
  }, [uploadClock, uploadReview, uploads])

  const uploadsByCapture = useMemo(
    () => new Map(uploads.map((upload) => [upload.captureId, upload])),
    [uploads],
  )

  const uploadCounts = useMemo(
    () => ({
      pending: uploads.filter((upload) => upload.status !== "failed").length,
      failed: uploads.filter((upload) => upload.status === "failed").length,
    }),
    [uploads],
  )

  function retryUploads(captureId?: string) {
    setUploads((current) =>
      current.map((upload) =>
        upload.status === "failed" && (!captureId || upload.captureId === captureId)
          ? { ...upload, status: "queued", attempts: 0, availableAt: Date.now(), error: null }
          : upload,
      ),
    )
  }

  useEffect(() => {
    function retryWhenOnline() {
      retryUploads()
    }
    window.addEventListener("online", retryWhenOnline)
    return () => window.removeEventListener("online", retryWhenOnline)
  }, [])

  const counts = useMemo(
    () => ({
      total: captures.length,
      reviewed: captures.filter((capture) => capture.review).length,
      pending: captures.filter((capture) => !capture.review).length,
    }),
    [captures],
  )

  const sessionEvidenceHealth = useMemo(() => {
    const reviewableCaptureCount = new Map<string, number>()
    captures.forEach((capture) => {
      if (!capture.sessionId) return
      const key = `${capture.sessionId}:${capture.deviceId}`
      reviewableCaptureCount.set(key, (reviewableCaptureCount.get(key) || 0) + 1)
    })

    return sessionEvidence
      .filter((evidence) => (evidence.expectedRunCount || 0) > 0)
      .map((evidence) => {
        const expected = evidence.expectedRunCount || 0
        const uploaded = reviewableCaptureCount.get(`${evidence.sessionId}:${evidence.deviceId}`) || 0
        return {
          ...evidence,
          expected,
          uploaded,
          complete: uploaded >= expected,
        }
      })
      .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
  }, [captures, sessionEvidence])

  const incompleteSessionEvidence = sessionEvidenceHealth.filter((evidence) => !evidence.complete)

  function placeMark(event: React.PointerEvent<HTMLImageElement>) {
    if (!selected?.editable) return
    const rect = event.currentTarget.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
    const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height))
    setPoint({ x, y })
    if (issue === "false_positive") setIssue("unlabeled")
    setError("")
    setSuccess("")
  }

  function chooseIssue(value: ReviewIssue) {
    if (!selected?.editable) return
    setIssue((current) => (current === value ? "unlabeled" : value))
    if (value === "false_positive") setPoint(null)
    setError("")
    setSuccess("")
  }

  async function renderReviewImageFromElement(
    capture: DetectionCapture,
    reviewPoint: Point | null,
    image: HTMLImageElement,
  ) {
    if (!image.complete || !image.naturalWidth) await image.decode()

    const canvas = document.createElement("canvas")
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    const context = canvas.getContext("2d")
    if (!context) throw new Error("Could not prepare the review image")

    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    const detectorX = capture.detectorX * canvas.width
    context.beginPath()
    context.moveTo(detectorX, 0)
    context.lineTo(detectorX, canvas.height)
    context.strokeStyle = "rgba(255, 59, 48, 0.92)"
    context.lineWidth = Math.max(3, Math.min(canvas.width, canvas.height) * 0.004)
    context.stroke()

    if (reviewPoint) {
      const radius = Math.max(4, Math.min(canvas.width, canvas.height) * 0.008)
      context.beginPath()
      context.arc(reviewPoint.x * canvas.width, reviewPoint.y * canvas.height, radius, 0, Math.PI * 2)
      context.fillStyle = "#35B96F"
      context.fill()
      context.strokeStyle = "rgba(255,255,255,0.96)"
      context.lineWidth = Math.max(1.5, radius * 0.22)
      context.stroke()
    }

    return canvas.toDataURL("image/jpeg", 0.88)
  }

  async function renderReviewImage(capture: DetectionCapture, reviewPoint: Point | null) {
    const image = imageRef.current
    if (!image) throw new Error("Review image is not ready")
    return renderReviewImageFromElement(capture, reviewPoint, image)
  }

  async function queueGridReviews(items: GridReviewItem[]) {
    if (!items.length) return
    if (items.some((item) => uploadsByCapture.has(item.captureId))) {
      throw new Error("One of these marks is already uploading. Clear the batch and try again.")
    }

    setError("")
    setSuccess("")
    const capturesById = new Map(captures.map((capture) => [capture.id, capture]))
    const queuedAt = new Date().toISOString()
    const prepared = await Promise.all(
      items.map(async (item) => {
        const capture = capturesById.get(item.captureId)
        if (!capture) throw new Error("A thumbnail left the queue before its mark could be prepared.")
        if (!capture.editable) throw new Error("In-app-only review images are read-only on the website.")
        const actualX = item.point?.x ?? null
        const actualY = item.point?.y ?? null
        const reviewImageDataUrl = await renderReviewImageFromElement(capture, item.point, item.image)
        const optimisticReview: ReviewMark = {
          id: `queued:${capture.id}`,
          createdAt: queuedAt,
          issue: item.issue,
          actualX,
          actualY,
          detectorX: capture.detectorX,
          detectorY: null,
          deltaX: actualX === null ? null : actualX - capture.detectorX,
          deltaY: null,
          note: item.note,
          hasReviewImage: false,
          source: "admin",
        }
        const upload: ReviewUpload = {
          captureId: capture.id,
          payload: {
            captureId: capture.id,
            actualX,
            actualY,
            issue: item.issue,
            note: item.note,
            reviewImageDataUrl,
          },
          status: "queued",
          attempts: 0,
          availableAt: Date.now(),
          error: null,
        }
        return { capture, optimisticReview, upload }
      }),
    )

    const preparedById = new Map(prepared.map((item) => [item.capture.id, item]))
    setUploads((current) => [...current, ...prepared.map((item) => item.upload)])
    setCaptures((current) =>
      current.map((capture) => {
        const item = preparedById.get(capture.id)
        return item ? { ...capture, review: item.optimisticReview } : capture
      }),
    )
    setSuccess(
      `${prepared.length} ${prepared.length === 1 ? "review" : "reviews"} queued. Keep marking while they upload in the background.`,
    )
  }

  async function submitReview() {
    if (!selected) return
    if (!selected.editable) {
      setError("This mark was saved in the app and is shown here as read-only evidence.")
      return
    }
    if (!point && issue === "unlabeled" && !note.trim()) {
      setError("Place a mark, choose an issue, or add a note before saving.")
      return
    }

    if (uploadsByCapture.has(selected.id) || preparingCaptureRef.current === selected.id) return
    const capture = selected
    const reviewPoint = point
    preparingCaptureRef.current = capture.id
    setPreparing(true)
    setError("")
    setSuccess("")
    try {
      const reviewImageDataUrl = await renderReviewImage(capture, reviewPoint)
      const currentIndex = filteredCaptures.findIndex((item) => item.id === capture.id)
      const pendingAfterCurrent = filteredCaptures
        .slice(currentIndex + 1)
        .concat(filteredCaptures.slice(0, currentIndex))
        .filter((item) => item.id !== capture.id && !item.review)
      const nextPending =
        pendingAfterCurrent.find((item) => item.sessionId === capture.sessionId) ||
        pendingAfterCurrent[0]
      const finishedSession = Boolean(
        !capture.review &&
        capture.sessionId &&
        !captures.some(
          (item) => item.id !== capture.id && item.sessionId === capture.sessionId && !item.review,
        ),
      )
      const actualX = reviewPoint?.x ?? null
      const actualY = reviewPoint?.y ?? null
      const optimisticReview: ReviewMark = {
        id: `queued:${capture.id}`,
        createdAt: new Date().toISOString(),
        issue,
        actualX,
        actualY,
        detectorX: capture.detectorX,
        detectorY: null,
        deltaX: actualX === null ? null : actualX - capture.detectorX,
        deltaY: null,
        note,
        hasReviewImage: false,
        source: "admin",
      }
      const upload: ReviewUpload = {
        captureId: capture.id,
        payload: {
          captureId: capture.id,
          actualX,
          actualY,
          issue,
          note,
          reviewImageDataUrl,
        },
        status: "queued",
        attempts: 0,
        availableAt: Date.now(),
        error: null,
      }

      setUploads((current) => [...current, upload])
      setCaptures((current) =>
        current.map((item) =>
          item.id === capture.id ? { ...item, review: optimisticReview } : item,
        ),
      )
      setSuccess("Review queued. You can keep marking while it uploads in the background.")
      if (statusFilter === "pending" && nextPending) setSelectedId(nextPending.id)
      if (finishedSession && capture.sessionId) openSessionContext(capture.sessionId)
    } catch (prepareError) {
      setError(prepareError instanceof Error ? prepareError.message : "Could not prepare review")
    } finally {
      if (preparingCaptureRef.current === capture.id) preparingCaptureRef.current = null
      setPreparing(false)
    }
  }

  const deltaX = point && selected ? point.x - selected.detectorX : null
  const band = errorBand(deltaX)
  const selectedUpload = selected ? uploadsByCapture.get(selected.id) || null : null
  const selectedIndex = selected
    ? filteredCaptures.findIndex((capture) => capture.id === selected.id)
    : -1
  const hasUnsavedReviewChanges = reviewStateChanged(selected, point, issue, note)
  const gridFilterKey = `${days}:${statusFilter}:${search.trim().toLowerCase()}`

  function navigateFocus(offset: -1 | 1) {
    if (hasUnsavedReviewChanges) {
      setError("Save and continue before leaving this thumbnail, or clear your changes first.")
      return
    }
    const nextCapture = filteredCaptures[selectedIndex + offset]
    if (!nextCapture) return
    setSelectedId(nextCapture.id)
    setError("")
  }

  function selectFocusCapture(captureId: string) {
    if (captureId === selectedId) return
    if (hasUnsavedReviewChanges) {
      setError("Save and continue before leaving this thumbnail, or clear your changes first.")
      return
    }
    setSelectedId(captureId)
    setError("")
  }

  function openCaptureDetail(captureId: string) {
    if (gridDraftCount > 0) {
      setError("Queue or clear the current grid marks before opening detail view.")
      return
    }
    setSelectedId(captureId)
    setViewMode("focus")
    setError("")
  }

  function chooseViewMode(nextMode: "grid" | "focus") {
    if (nextMode === viewMode) return
    if (gridDraftCount > 0) {
      setError("Queue or clear the current grid marks before changing views.")
      return
    }
    if (viewMode === "focus" && hasUnsavedReviewChanges) {
      setError("Save and continue before changing views, or clear your changes first.")
      return
    }
    setViewMode(nextMode)
    setError("")
  }

  return (
    <main className="min-h-[100dvh] bg-[#191919] px-4 py-6 text-[#E8E8E6] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <header className="grid gap-5 border-b border-[#34373B] pb-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5C8DB8]">
              Replica evidence review
            </p>
            <h1 className="font-[var(--font-bricolage)] text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">
              Mark the true crossing edge
            </h1>
            <p className="mt-2 max-w-[68ch] text-sm leading-6 text-[#9B9A97]">
              {viewMode === "grid"
                ? "Review every filtered thumbnail in one continuous grid. The red line is Replica’s detector position; click each true torso edge, then queue your marks for background upload."
                : "The red line is Replica’s saved detector position. Click the athlete’s true torso timing edge, classify the result, and save it as ground truth for the daily analysis."}
            </p>
          </div>

          <div className="grid grid-cols-3 divide-x divide-[#34373B] border-y border-[#34373B] py-3 font-mono lg:min-w-[360px]">
            <div className="px-4">
              <div className="text-xl font-semibold text-white">{counts.pending}</div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-[#777B80]">Pending</div>
            </div>
            <div className="px-4">
              <div className="text-xl font-semibold text-white">{counts.reviewed}</div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-[#777B80]">Reviewed</div>
            </div>
            <div className="px-4">
              <div className="text-xl font-semibold text-white">{counts.total}</div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-[#777B80]">Loaded</div>
            </div>
          </div>
        </header>

        <section className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto]">
          <label className="grid gap-2">
            <span className="text-xs font-medium text-[#9B9A97]">Find a session, run, device, or build</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              disabled={gridDraftCount > 0}
              placeholder="Search the review queue"
              className="h-11 rounded-xl border border-[#3D3D3D] bg-[#232528] px-4 text-sm text-white outline-none transition focus:border-[#5C8DB8] focus:ring-2 focus:ring-[#5C8DB8]/25 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-medium text-[#9B9A97]">Status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
              disabled={gridDraftCount > 0}
              className="h-11 min-w-36 rounded-xl border border-[#3D3D3D] bg-[#232528] px-3 text-sm text-white outline-none transition focus:border-[#5C8DB8] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="all">All thumbnails</option>
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-medium text-[#9B9A97]">Window</span>
            <select
              value={days}
              onChange={(event) => setDays(Number(event.target.value))}
              disabled={gridDraftCount > 0}
              className="h-11 min-w-32 rounded-xl border border-[#3D3D3D] bg-[#232528] px-3 text-sm text-white outline-none transition focus:border-[#5C8DB8] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value={7}>7 days</option>
              <option value={30}>30 days</option>
              <option value={90}>90 days</option>
              <option value={365}>1 year</option>
            </select>
          </label>
          <div className="grid gap-2 md:hidden">
            <span className="text-xs font-medium text-[#9B9A97]">Review mode</span>
            <div className="grid h-11 place-items-center rounded-xl border border-[#3D3D3D] bg-[#232528] px-4 text-xs font-semibold text-white">
              One at a time
            </div>
          </div>
          <div className="hidden gap-2 md:grid">
            <span className="text-xs font-medium text-[#9B9A97]">Layout</span>
            <div className="grid h-11 grid-cols-2 rounded-xl border border-[#3D3D3D] bg-[#232528] p-1">
              <button
                type="button"
                aria-pressed={viewMode === "grid"}
                onClick={() => chooseViewMode("grid")}
                className={`rounded-lg px-3 text-xs font-semibold transition active:translate-y-px ${
                  viewMode === "grid" ? "bg-[#5C8DB8] text-white" : "text-[#9B9A97] hover:text-white"
                }`}
              >
                Grid
              </button>
              <button
                type="button"
                aria-pressed={viewMode === "focus"}
                onClick={() => chooseViewMode("focus")}
                className={`rounded-lg px-3 text-xs font-semibold transition active:translate-y-px ${
                  viewMode === "focus" ? "bg-[#5C8DB8] text-white" : "text-[#9B9A97] hover:text-white"
                }`}
              >
                Focus
              </button>
            </div>
          </div>
        </section>

        {error && (
          <div role="alert" className="border-l-2 border-[#F06C68] bg-[#2B2223] px-4 py-3 text-sm text-[#F2B1AE]">
            {error}
          </div>
        )}
        {success && (
          <div role="status" className="border-l-2 border-[#6FB58A] bg-[#202B25] px-4 py-3 text-sm text-[#A8D8B9]">
            {success}
          </div>
        )}
        {sessionEvidenceHealth.length > 0 && (
          <section
            aria-labelledby="evidence-upload-health-heading"
            className={`border-l-2 px-4 py-4 ${
              incompleteSessionEvidence.length > 0
                ? "border-[#D6B36A] bg-[#2A2821]"
                : "border-[#6FB58A] bg-[#202B25]"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 id="evidence-upload-health-heading" className="text-sm font-semibold text-white">
                  Thumbnail upload completeness
                </h2>
                <p className="mt-1 text-xs leading-5 text-[#9B9A97]">
                  {incompleteSessionEvidence.length > 0
                    ? `${incompleteSessionEvidence.length} session ${incompleteSessionEvidence.length === 1 ? "upload is" : "uploads are"} incomplete. Keep each source app open on a stable connection until its evidence banner says fully synced.`
                    : `All ${sessionEvidenceHealth.length} reported sessions have every expected review thumbnail.`}
                </p>
              </div>
              <span className={`font-mono text-xs font-semibold ${incompleteSessionEvidence.length > 0 ? "text-[#E4C985]" : "text-[#A8D8B9]"}`}>
                {sessionEvidenceHealth.length - incompleteSessionEvidence.length}/{sessionEvidenceHealth.length} complete
              </span>
            </div>

            {incompleteSessionEvidence.length > 0 && (
              <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {incompleteSessionEvidence.map((evidence) => (
                  <div key={`${evidence.id}:${evidence.deviceId}`} className="border border-[#4B4637] bg-[#211F1A] px-3 py-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-white">
                        {evidence.deviceModel || "Unknown device"}
                      </span>
                      <span className="font-mono text-xs text-[#E4C985]">
                        {evidence.uploaded}/{evidence.expected}
                      </span>
                    </div>
                    <div className="mt-1 font-mono text-[10px] text-[#777B80]">
                      Session {shortId(evidence.sessionId)} · {evidence.localRole || evidence.timingMode || "detection"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
        {uploadCounts.pending > 0 && (
          <div
            role="status"
            aria-live="polite"
            className="flex flex-wrap items-center justify-between gap-3 border-l-2 border-[#5C8DB8] bg-[#20272E] px-4 py-3 text-sm text-[#B7D0E5]"
          >
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#5C8DB8]" aria-hidden="true" />
              Uploading {uploadCounts.pending} {uploadCounts.pending === 1 ? "review" : "reviews"} in the background. Keep this tab open; you can continue marking.
            </span>
          </div>
        )}
        {uploadCounts.failed > 0 && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 border-l-2 border-[#F06C68] bg-[#2B2223] px-4 py-3 text-sm text-[#F2B1AE]"
          >
            <span>
              {uploadCounts.failed} {uploadCounts.failed === 1 ? "review could not" : "reviews could not"} upload after automatic retries. Your marks are still held in this tab.
            </span>
            <button
              type="button"
              onClick={() => retryUploads()}
              className="rounded-lg border border-[#9A5755] px-3 py-1.5 text-xs font-semibold text-[#FFD0CD] transition hover:border-[#C27672] hover:text-white active:translate-y-px"
            >
              Retry failed
            </button>
          </div>
        )}

        {loading ? (
          viewMode === "grid" ? (
            <div className="grid animate-pulse gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }, (_, index) => (
                <div key={index} className="h-64 rounded-2xl bg-[#242629]" />
              ))}
            </div>
          ) : (
            <div className="grid animate-pulse gap-4 xl:grid-cols-[250px_minmax(0,1fr)_340px]">
              <div className="h-[620px] rounded-2xl bg-[#242629]" />
              <div className="h-[720px] rounded-2xl bg-[#242629]" />
              <div className="h-[620px] rounded-2xl bg-[#242629]" />
            </div>
          )
        ) : filteredCaptures.length === 0 ? (
          <div className="border-y border-[#34373B] py-20 text-center">
            <h2 className="font-[var(--font-bricolage)] text-2xl font-semibold text-white">
              {captures.length ? "No captures match this view" : "No review captures in this window"}
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#9B9A97]">
              Change the status, search, or date window. New debug captures and saved in-app review thumbnails appear here after users complete sessions.
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <DetectionReviewGrid
            key={gridFilterKey}
            allCaptures={captures}
            filteredCaptures={filteredCaptures}
            sessionContextIds={sessionContextIds}
            uploadsByCapture={uploadsByCapture}
            onDraftCountChange={setGridDraftCount}
            onOpenDetail={openCaptureDetail}
            onOpenSessionNotes={openSessionContext}
            onQueue={queueGridReviews}
          />
        ) : selected ? (
          <div className="grid items-start gap-4 xl:grid-cols-[250px_minmax(0,1fr)_340px]">
            <aside className="order-2 hidden overflow-hidden rounded-2xl border border-[#34373B] bg-[#1E2022] xl:order-1 xl:sticky xl:top-20 xl:block">
              <div className="flex items-center justify-between border-b border-[#34373B] px-4 py-3">
                <span className="text-xs font-semibold uppercase tracking-[0.13em] text-[#9B9A97]">Queue</span>
                <span className="font-mono text-xs text-[#777B80]">{filteredCaptures.length}</span>
              </div>
              <div className="max-h-[66dvh] divide-y divide-[#303236] overflow-y-auto">
                {filteredCaptures.map((capture, index) => {
                  const captureUpload = uploadsByCapture.get(capture.id)
                  const uploadLabel =
                    captureUpload?.status === "failed"
                      ? "Upload failed"
                      : captureUpload?.status === "uploading"
                        ? "Uploading"
                        : captureUpload?.status === "queued"
                          ? "Queued"
                          : capture.review
                            ? capture.review.source === "app"
                              ? "Marked in app"
                              : "Reviewed"
                            : formatDate(capture.createdAt)
                  const markerTone =
                    captureUpload?.status === "failed"
                      ? "bg-[#F06C68]"
                      : captureUpload
                        ? "bg-[#D6B36A]"
                        : capture.review
                          ? "bg-[#6FB58A]"
                          : "bg-[#5C8DB8]"
                  return (
                    <button
                      key={capture.id}
                      type="button"
                      onClick={() => selectFocusCapture(capture.id)}
                      className={`grid w-full grid-cols-[5px_1fr] text-left transition duration-200 active:translate-y-px ${
                        capture.id === selected.id ? "bg-[#2A2D31]" : "hover:bg-[#24272A]"
                      }`}
                      style={{ animationDelay: `${Math.min(index, 12) * 35}ms` }}
                    >
                      <span className={markerTone} />
                      <span className="block px-3 py-3">
                        <span className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-white">
                            Run {capture.runNumber} <span className="font-normal text-[#777B80]">/ {capture.target}</span>
                          </span>
                          <span className="font-mono text-[10px] text-[#777B80]">{shortId(capture.sessionId)}</span>
                        </span>
                        <span className="mt-1 flex items-center justify-between gap-2 text-[11px] text-[#8B8F94]">
                          <span>{capture.direction || "direction n/a"}</span>
                          <span className={captureUpload?.status === "failed" ? "text-[#F2B1AE]" : undefined}>{uploadLabel}</span>
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </aside>

            <section className="order-1 min-w-0 overflow-hidden rounded-2xl border border-[#34373B] bg-[#111315] xl:order-2">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#34373B] px-4 py-3 sm:px-5">
                <div>
                  <div className="font-[var(--font-bricolage)] text-lg font-semibold text-white">
                    Session {shortId(selected.sessionId)} · Run {selected.runNumber}
                  </div>
                  <div className="mt-0.5 font-mono text-[11px] text-[#777B80]">
                    {formatDate(selected.createdAt)} · {selected.appVersion ? `v${selected.appVersion}` : "version n/a"} · {selected.deviceModel || "device n/a"}
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-3 font-mono text-[11px]">
                  {selected.review?.source === "app" && (
                    <span className="rounded-full border border-[#527E62] bg-[#213027] px-2.5 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8FC8A3]">
                      Marked in app
                    </span>
                  )}
                  <span className="text-[#F06C68]">Red: detector</span>
                  <span className="text-[#6FB58A]">Green: your mark</span>
                </div>
              </div>

              <nav
                aria-label="Thumbnail navigation"
                className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-[#34373B] bg-[#191B1D] px-3 py-3 xl:hidden"
              >
                <button
                  type="button"
                  onClick={() => navigateFocus(-1)}
                  disabled={selectedIndex <= 0 || preparing}
                  className="min-h-11 justify-self-start rounded-xl border border-[#3D4145] px-4 text-sm font-semibold text-[#D6D8DA] transition hover:border-[#5C8DB8] hover:text-white active:translate-y-px disabled:cursor-not-allowed disabled:border-[#303236] disabled:text-[#5F6368]"
                >
                  Previous
                </button>
                <div className="text-center font-mono text-[11px] text-[#8B8F94]">
                  <span className="block font-semibold text-white">{selectedIndex + 1} / {filteredCaptures.length}</span>
                  thumbnail
                </div>
                <button
                  type="button"
                  onClick={() => navigateFocus(1)}
                  disabled={selectedIndex < 0 || selectedIndex >= filteredCaptures.length - 1 || preparing}
                  className="min-h-11 justify-self-end rounded-xl bg-[#5C8DB8] px-5 text-sm font-semibold text-white transition hover:bg-[#6C9AC2] active:translate-y-px disabled:cursor-not-allowed disabled:bg-[#303A43] disabled:text-[#697783]"
                >
                  Next
                </button>
              </nav>

              <div className="flex min-h-[360px] items-center justify-center overflow-auto p-2 sm:min-h-[480px] sm:p-5 xl:min-h-[560px]">
                <div className="relative inline-block max-w-full overflow-hidden rounded-xl bg-[#0C0D0E] shadow-[0_24px_70px_-32px_rgba(0,0,0,0.9)]">
                  <img
                    ref={imageRef}
                    key={selected.id}
                    src={selected.imageUrl}
                    alt={`Detection capture for session ${shortId(selected.sessionId)}, run ${selected.runNumber}`}
                    onLoad={() => setImageLoading(false)}
                    onError={() => {
                      setImageLoading(false)
                      setError("This thumbnail could not be loaded.")
                    }}
                    onPointerDown={placeMark}
                    draggable={false}
                    className={`block max-h-[70dvh] max-w-full select-none object-contain ${selected.editable ? "cursor-crosshair" : "cursor-default"}`}
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 w-[3px] -translate-x-1/2 bg-[#FF3B30] shadow-[0_0_0_1px_rgba(50,10,8,0.22)]"
                    style={{ left: `${selected.detectorX * 100}%` }}
                  />
                  {point && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-[#35B96F] shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
                      style={{ left: `${point.x * 100}%`, top: `${point.y * 100}%` }}
                    />
                  )}
                  {imageLoading && (
                    <div className="absolute inset-0 animate-pulse bg-[#242629]" aria-label="Loading thumbnail" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-px border-t border-[#34373B] bg-[#34373B] sm:grid-cols-4">
                <div className="bg-[#111315] px-4 py-3">
                  <div className="text-[10px] uppercase tracking-[0.13em] text-[#777B80]">Detector X</div>
                  <div className="mt-1 font-mono text-sm text-white">{percent(selected.detectorX)}</div>
                </div>
                <div className="bg-[#111315] px-4 py-3">
                  <div className="text-[10px] uppercase tracking-[0.13em] text-[#777B80]">Your X</div>
                  <div className="mt-1 font-mono text-sm text-white">{percent(point?.x ?? null)}</div>
                </div>
                <div className="bg-[#111315] px-4 py-3">
                  <div className="text-[10px] uppercase tracking-[0.13em] text-[#777B80]">Horizontal error</div>
                  <div className="mt-1 font-mono text-sm text-white">{percent(deltaX)}</div>
                </div>
                <div className="bg-[#111315] px-4 py-3">
                  <div className="text-[10px] uppercase tracking-[0.13em] text-[#777B80]">Quality band</div>
                  <div className={`mt-1 font-mono text-sm font-semibold ${band.tone}`}>{band.label}</div>
                </div>
              </div>
            </section>

            <aside className="order-2 rounded-2xl border border-[#34373B] bg-[#1E2022] p-4 sm:p-5 xl:order-3 xl:sticky xl:top-20">
              <div className="flex items-start justify-between gap-4 border-b border-[#34373B] pb-4">
                <div>
                  <h2 className="font-[var(--font-bricolage)] text-xl font-semibold text-white">Your review</h2>
                  <p className="mt-1 text-xs leading-5 text-[#8B8F94]">
                    {selected.editable
                      ? "Click the image first, then classify what happened."
                      : "This saved in-app mark is shown as read-only evidence."}
                  </p>
                </div>
                {selected.review && (
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${
                      selectedUpload?.status === "failed"
                        ? "border-[#9A5755] bg-[#342526] text-[#F2B1AE]"
                        : selectedUpload
                          ? "border-[#8B7444] bg-[#302B20] text-[#E3C881]"
                          : "border-[#527E62] bg-[#213027] text-[#8FC8A3]"
                    }`}
                  >
                    {selectedUpload?.status === "failed"
                      ? "Upload failed"
                      : selectedUpload?.status === "uploading"
                        ? "Uploading"
                        : selectedUpload?.status === "queued"
                          ? "Queued"
                          : selected.review.source === "app"
                            ? "Marked in app"
                            : "Saved"}
                  </span>
                )}
              </div>

              <div className="mt-5 space-y-5">
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9B9A97]">Ground-truth mark</span>
                    {point && selected.editable && (
                      <button
                        type="button"
                        onClick={() => setPoint(null)}
                        className="text-xs font-medium text-[#B7BAC0] underline decoration-[#555A60] underline-offset-4 hover:text-white"
                      >
                        Clear mark
                      </button>
                    )}
                  </div>
                  <div className="rounded-xl border border-[#34373B] bg-[#25272A] px-3 py-3 font-mono text-xs text-[#B7BAC0]">
                    {point ? `x ${point.x.toFixed(4)} · y ${point.y.toFixed(4)}` : "No mark placed"}
                  </div>
                  <p className="text-[11px] leading-4 text-[#777B80]">Mark the torso/chest timing edge, not an arm or leg.</p>
                </div>

                <fieldset className="grid gap-2">
                  <legend className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#9B9A97]">Classification</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {issueOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={issue === option.value}
                        title={option.helper}
                        onClick={() => chooseIssue(option.value)}
                        disabled={!selected.editable}
                        className={`min-h-10 rounded-lg border px-2.5 py-2 text-left text-xs font-semibold transition duration-200 active:translate-y-px ${
                          issue === option.value
                            ? "border-[#5C8DB8] bg-[#294157] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                            : "border-[#3B3E42] bg-[#25272A] text-[#B7BAC0] hover:border-[#555A60] hover:text-white"
                        } disabled:cursor-default disabled:opacity-70`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  {issue !== "unlabeled" && selected.editable && (
                    <button
                      type="button"
                      onClick={() => setIssue("unlabeled")}
                      className="justify-self-start text-xs text-[#8B8F94] underline decoration-[#555A60] underline-offset-4 hover:text-white"
                    >
                      Clear classification
                    </button>
                  )}
                </fieldset>

                <label className="grid gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9B9A97]">Review note</span>
                  <textarea
                    value={note}
                    onChange={(event) => {
                      setNote(event.target.value.slice(0, 500))
                      setError("")
                    }}
                    disabled={!selected.editable}
                    rows={4}
                    placeholder="What makes this crossing good, early, late, or unusable?"
                    className="resize-none rounded-xl border border-[#3D3D3D] bg-[#25272A] px-3 py-2.5 text-sm leading-5 text-white outline-none transition placeholder:text-[#63676C] focus:border-[#5C8DB8] focus:ring-2 focus:ring-[#5C8DB8]/25"
                  />
                  <span className="justify-self-end font-mono text-[10px] text-[#63676C]">{note.length}/500</span>
                </label>

                <button
                  type="button"
                  disabled={
                    !selected.editable ||
                    preparing ||
                    selectedUpload?.status === "queued" ||
                    selectedUpload?.status === "uploading" ||
                    (!selectedUpload && !point && issue === "unlabeled" && !note.trim())
                  }
                  onClick={() =>
                    selectedUpload?.status === "failed"
                      ? retryUploads(selected.id)
                      : void submitReview()
                  }
                  className="w-full rounded-xl bg-[#5C8DB8] px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-[#6C9AC2] active:translate-y-px disabled:cursor-not-allowed disabled:bg-[#3A4650] disabled:text-[#7C858D]"
                >
                  {!selected.editable
                    ? "Marked in app"
                    : preparing
                      ? "Preparing review…"
                      : selectedUpload?.status === "failed"
                        ? "Retry upload"
                        : selectedUpload
                          ? "Uploading in background…"
                          : selected.review
                            ? "Update review"
                            : "Save and continue"}
                </button>

                {selected.sessionId && (
                  <div className="border-t border-[#34373B] pt-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9B9A97]">
                          Session notes
                        </div>
                        <p className="mt-1 text-[11px] leading-5 text-[#777B80]">
                          Applies to every crossing in session {shortId(selected.sessionId)}.
                        </p>
                      </div>
                      <span
                        className={`rounded-full border px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] ${
                          selectedContext
                            ? "border-[#527E62] bg-[#213027] text-[#8FC8A3]"
                            : "border-[#555A60] bg-[#25272A] text-[#9B9A97]"
                        }`}
                      >
                        {selectedContext ? "Added" : "Missing"}
                      </span>
                    </div>
                    {selectedContext && (
                      <div className="mt-3 space-y-1 text-xs leading-5 text-[#B7BAC0]">
                        <p>
                          {selectedContext.shirtColor || "Shirt color not set"}
                          {selectedContext.shirtContrast
                            ? ` · ${selectedContext.shirtContrast} contrast`
                            : ""}
                        </p>
                        {selectedContext.notes && (
                          <p className="line-clamp-2 text-[#8B8F94]">{selectedContext.notes}</p>
                        )}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => openSessionContext(selected.sessionId as string)}
                      className="mt-3 w-full rounded-xl border border-[#3D3D3D] bg-[#25272A] px-4 py-2.5 text-xs font-semibold text-[#D6D8DA] transition duration-200 hover:border-[#5C8DB8] hover:text-white active:translate-y-px"
                    >
                      {selectedContext ? "Edit shirt color and notes" : "Add shirt color and notes"}
                    </button>
                  </div>
                )}

                <div className="border-t border-[#34373B] pt-4 text-[11px] leading-5 text-[#777B80]">
                  <div className="flex justify-between gap-3"><span>Direction</span><span className="font-mono text-[#B7BAC0]">{selected.direction || "n/a"}</span></div>
                  <div className="flex justify-between gap-3"><span>Blob height</span><span className="font-mono text-[#B7BAC0]">{percent(selected.blobHeightFraction)}</span></div>
                  <div className="flex justify-between gap-3"><span>FPS</span><span className="font-mono text-[#B7BAC0]">{selected.fps === null ? "n/a" : selected.fps.toFixed(1)}</span></div>
                  <div className="mt-2 text-[#63676C]">Use Previous and Next on mobile, or the left and right arrow keys on desktop.</div>
                </div>
              </div>
            </aside>
          </div>
        ) : null}

        {!loading && filteredCaptures.length > 0 && (
          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#34373B] pt-4 font-mono text-[11px] text-[#777B80]">
            <span>
              {viewMode === "grid"
                ? `${filteredCaptures.length} captures in filtered queue`
                : selectedIndex >= 0
                  ? `${selectedIndex + 1} of ${filteredCaptures.length}`
                  : `${filteredCaptures.length} captures`}
            </span>
            <button
              type="button"
              disabled={uploads.length > 0}
              onClick={() => void loadQueue()}
              className="rounded-lg border border-[#3D3D3D] px-3 py-2 text-[#B7BAC0] transition hover:border-[#5C8DB8] hover:text-white active:translate-y-px disabled:cursor-not-allowed disabled:border-[#34373B] disabled:text-[#63676C]"
            >
              {uploads.length ? "Uploads in progress" : "Refresh queue"}
            </button>
          </footer>
        )}
      </div>

      {contextSessionId && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#090A0B]/80 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          role="presentation"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) closeSessionContext()
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="session-context-title"
            className="flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-[#3A3D41] bg-[#1E2022] shadow-[0_30px_90px_-30px_rgba(0,0,0,0.85)] sm:rounded-3xl"
          >
            <header className="flex shrink-0 items-start justify-between gap-5 border-b border-[#34373B] px-5 py-5 sm:px-7">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#5C8DB8]">
                  End of session {shortId(contextSessionId)}
                </p>
                <h2
                  id="session-context-title"
                  className="mt-1 font-[var(--font-bricolage)] text-2xl font-semibold tracking-[-0.025em] text-white"
                >
                  Add session context
                </h2>
                <p className="mt-2 max-w-[58ch] text-sm leading-6 text-[#9B9A97]">
                  These details are saved once for the whole session and paired with every crossing in the daily detector analysis.
                </p>
              </div>
              <button
                type="button"
                onClick={closeSessionContext}
                disabled={contextSaving}
                className="rounded-lg border border-[#3D3D3D] px-3 py-2 text-xs font-semibold text-[#B7BAC0] transition hover:border-[#5C8DB8] hover:text-white active:translate-y-px disabled:opacity-50"
              >
                Close
              </button>
            </header>

            <div className="min-h-0 space-y-6 overflow-y-auto px-5 py-6 sm:px-7">
              {contextError && (
                <div role="alert" className="border-l-2 border-[#F06C68] bg-[#2B2223] px-4 py-3 text-sm text-[#F2B1AE]">
                  {contextError}
                </div>
              )}

              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#B7BAC0]">
                  Shirt color
                </span>
                <input
                  autoFocus
                  value={shirtColor}
                  onChange={(event) => setShirtColor(event.target.value.slice(0, 80))}
                  placeholder="For example: blue, dark gray, mixed athletes, no shirt"
                  className="h-12 rounded-xl border border-[#3D3D3D] bg-[#25272A] px-4 text-sm text-white outline-none transition placeholder:text-[#63676C] focus:border-[#5C8DB8] focus:ring-2 focus:ring-[#5C8DB8]/25"
                />
                <span className="text-[11px] leading-4 text-[#777B80]">
                  If shirts changed during the session, choose Mixed and describe the run split below.
                </span>
              </label>

              <div className="flex flex-wrap gap-2" aria-label="Shirt color presets">
                {shirtColorPresets.map((color) => (
                  <button
                    key={color}
                    type="button"
                    aria-pressed={shirtColor === color}
                    onClick={() => setShirtColor(color)}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition duration-200 active:translate-y-px ${
                      shirtColor === color
                        ? "border-[#5C8DB8] bg-[#294157] text-white"
                        : "border-[#3D3D3D] bg-[#25272A] text-[#B7BAC0] hover:border-[#555A60] hover:text-white"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>

              <fieldset className="grid gap-2">
                <legend className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#B7BAC0]">
                  Shirt / background contrast
                </legend>
                <div className="grid grid-cols-3 gap-2">
                  {(["good", "ok", "poor"] as const).map((contrast) => (
                    <button
                      key={contrast}
                      type="button"
                      aria-pressed={shirtContrast === contrast}
                      onClick={() => setShirtContrast((current) => current === contrast ? "" : contrast)}
                      className={`rounded-xl border px-3 py-3 text-sm font-semibold capitalize transition duration-200 active:translate-y-px ${
                        shirtContrast === contrast
                          ? "border-[#5C8DB8] bg-[#294157] text-white"
                          : "border-[#3D3D3D] bg-[#25272A] text-[#B7BAC0] hover:border-[#555A60] hover:text-white"
                      }`}
                    >
                      {contrast}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#B7BAC0]">
                  Other relevant notes
                </span>
                <textarea
                  value={contextNotes}
                  onChange={(event) => setContextNotes(event.target.value.slice(0, 1500))}
                  rows={5}
                  placeholder="Lighting, background, athlete count, camera distance or height, clothing changes, occlusion, unusual movement, connection problems…"
                  className="resize-none rounded-xl border border-[#3D3D3D] bg-[#25272A] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-[#63676C] focus:border-[#5C8DB8] focus:ring-2 focus:ring-[#5C8DB8]/25"
                />
                <span className="justify-self-end font-mono text-[10px] text-[#63676C]">
                  {contextNotes.length}/1500
                </span>
              </label>
            </div>

            <footer className="grid shrink-0 gap-3 border-t border-[#34373B] bg-[#1E2022] px-5 py-5 sm:grid-cols-[auto_1fr] sm:px-7">
              <button
                type="button"
                onClick={closeSessionContext}
                disabled={contextSaving}
                className="rounded-xl border border-[#3D3D3D] px-4 py-3 text-sm font-semibold text-[#B7BAC0] transition hover:border-[#555A60] hover:text-white active:translate-y-px disabled:opacity-50"
              >
                Skip for now
              </button>
              <button
                type="button"
                onClick={() => void saveSessionContext()}
                disabled={contextSaving || (!shirtColor.trim() && !shirtContrast && !contextNotes.trim())}
                className="rounded-xl bg-[#5C8DB8] px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-[#6C9AC2] active:translate-y-px disabled:cursor-not-allowed disabled:bg-[#3A4650] disabled:text-[#7C858D]"
              >
                {contextSaving ? "Saving session notes…" : "Save notes and continue"}
              </button>
            </footer>
          </section>
        </div>
      )}
    </main>
  )
}
