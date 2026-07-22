/* eslint-disable @next/next/no-img-element */
"use client"

import { useEffect, useMemo, useRef, useState } from "react"

interface Point {
  x: number
  y: number
}

interface GridReview {
  actualX: number | null
  actualY: number | null
  issue: GridReviewIssue
  note: string
  source: "app" | "admin"
}

type GridReviewIssue =
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

export interface DetectionGridCapture {
  id: string
  source: "debug_capture" | "app_mark"
  editable: boolean
  sessionId: string | null
  runNumber: number
  target: string
  createdAt: string
  direction: string | null
  detectorX: number
  imageUrl: string
  review: GridReview | null
}

export interface GridReviewItem {
  captureId: string
  point: Point | null
  issue: GridReviewIssue
  note: string
  image: HTMLImageElement
}

interface GridDraft {
  point: Point | null
  issue: GridReviewIssue
  note: string
}

interface GridUploadState {
  status: "queued" | "uploading" | "failed"
}

interface DetectionReviewGridProps {
  allCaptures: DetectionGridCapture[]
  filteredCaptures: DetectionGridCapture[]
  sessionContextIds: Set<string>
  uploadsByCapture: Map<string, GridUploadState>
  onDraftCountChange: (count: number) => void
  onOpenDetail: (captureId: string) => void
  onOpenSessionNotes: (sessionId: string) => void
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

export function DetectionReviewGrid({
  allCaptures,
  filteredCaptures,
  sessionContextIds,
  uploadsByCapture,
  onDraftCountChange,
  onOpenDetail,
  onOpenSessionNotes,
  onQueue,
}: DetectionReviewGridProps) {
  const [drafts, setDrafts] = useState<Record<string, GridDraft>>({})
  const [preparing, setPreparing] = useState(false)
  const [batchError, setBatchError] = useState("")
  const imageRefs = useRef(new Map<string, HTMLImageElement>())

  const draftCount = Object.keys(drafts).length
  const reviewedInGrid = filteredCaptures.filter((capture) => capture.review && !drafts[capture.id]).length
  const visibleSessionCount = useMemo(
    () => new Set(filteredCaptures.map((capture) => capture.sessionId || `unlinked:${capture.id}`)).size,
    [filteredCaptures],
  )

  useEffect(() => {
    onDraftCountChange(draftCount)
  }, [draftCount, onDraftCountChange])

  useEffect(() => () => onDraftCountChange(0), [onDraftCountChange])

  function placeGridMark(capture: DetectionGridCapture, event: React.PointerEvent<HTMLButtonElement>) {
    if (!capture.editable) return
    const upload = uploadsByCapture.get(capture.id)
    if (upload && upload.status !== "failed") return
    const image = imageRefs.current.get(capture.id)
    if (!image || image.dataset.captureId !== capture.id) return
    const rect = image.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    const point = {
      x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)),
    }
    setDrafts((current) => {
      const existing = current[capture.id]
      const savedIssue = capture.review?.issue === "false_positive"
        ? "unlabeled"
        : capture.review?.issue || "unlabeled"
      return {
        ...current,
        [capture.id]: {
          point,
          issue: existing?.issue === "false_positive" ? "unlabeled" : existing?.issue || savedIssue,
          note: existing?.note ?? capture.review?.note ?? "",
        },
      }
    })
    setBatchError("")
  }

  function toggleFalsePositive(capture: DetectionGridCapture) {
    if (!capture.editable) return
    const upload = uploadsByCapture.get(capture.id)
    if (upload && upload.status !== "failed") return
    setDrafts((current) => {
      const existing = current[capture.id]
      if (existing?.issue === "false_positive") {
        const next = { ...current }
        if (existing.note.trim() || existing.point) {
          next[capture.id] = { ...existing, issue: "unlabeled" }
        } else {
          delete next[capture.id]
        }
        return next
      }
      return {
        ...current,
        [capture.id]: {
          point: null,
          issue: "false_positive",
          note: existing?.note ?? capture.review?.note ?? "",
        },
      }
    })
    setBatchError("")
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
      }
      const matchesSavedReview = Boolean(
        capture.review &&
        nextDraft.issue === capture.review.issue &&
        nextDraft.note === capture.review.note &&
        (nextDraft.point?.x ?? null) === capture.review.actualX &&
        (nextDraft.point?.y ?? null) === capture.review.actualY,
      )
      const isEmptyNewReview = Boolean(
        !capture.review &&
        !nextDraft.point &&
        nextDraft.issue === "unlabeled" &&
        !nextDraft.note,
      )
      const next = { ...current }
      if (matchesSavedReview || isEmptyNewReview) delete next[capture.id]
      else next[capture.id] = nextDraft
      return next
    })
    setBatchError("")
  }

  function clearDraft(captureId: string) {
    setDrafts((current) => {
      const next = { ...current }
      delete next[captureId]
      return next
    })
  }

  async function queueDrafts() {
    const items = filteredCaptures.flatMap((capture) => {
      const draft = drafts[capture.id]
      const image = imageRefs.current.get(capture.id)
      return draft && image?.dataset.captureId === capture.id
        ? [{ captureId: capture.id, point: draft.point, issue: draft.issue, note: draft.note.trim(), image }]
        : []
    })
    if (!items.length) return
    if (items.length !== draftCount) {
      setBatchError("Wait for every marked thumbnail to finish loading, then queue the batch again.")
      return
    }

    setPreparing(true)
    setBatchError("")
    try {
      await onQueue(items)
      const queuedIds = new Set(items.map((item) => item.captureId))
      setDrafts({})
      const completedSessionId = Array.from(
        new Set(
          items
            .map((item) => allCaptures.find((capture) => capture.id === item.captureId)?.sessionId)
            .filter((sessionId): sessionId is string => Boolean(sessionId)),
        ),
      ).find(
        (sessionId) =>
          !sessionContextIds.has(sessionId) &&
          !allCaptures.some(
            (capture) =>
              capture.sessionId === sessionId &&
              !capture.review &&
              !queuedIds.has(capture.id),
          ),
      )
      if (completedSessionId) onOpenSessionNotes(completedSessionId)
    } catch (queueError) {
      setBatchError(queueError instanceof Error ? queueError.message : "Could not prepare this review batch")
    } finally {
      setPreparing(false)
    }
  }

  if (!filteredCaptures.length) {
    return (
      <section className="border-y border-[#34373B] py-20 text-center">
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
      <header className="grid gap-4 border-y border-[#34373B] py-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[#5C8DB8]">
            All sessions · {visibleSessionCount} sessions · {filteredCaptures.length} captures
          </p>
          <h2 id="grid-review-heading" className="mt-1 font-[var(--font-bricolage)] text-xl font-semibold text-white">
            Click each true torso crossing edge
          </h2>
          <p className="mt-1 text-xs leading-5 text-[#8B8F94]">
            Scroll through every session in one grid. New marks are editable; marks saved in the app stay read-only.
          </p>
        </div>
        <div className="font-mono text-right text-[10px] uppercase tracking-[0.12em] text-[#777B80]">
          Images load as you scroll
        </div>
      </header>

      {batchError && (
        <div role="alert" className="border-l-2 border-[#F06C68] bg-[#2B2223] px-4 py-3 text-sm text-[#F2B1AE]">
          {batchError}
        </div>
      )}

      <div className="grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCaptures.map((capture, index) => {
          const draft = drafts[capture.id]
          const upload = uploadsByCapture.get(capture.id)
          const displayPoint = draft?.point || (
            capture.review?.actualX != null && capture.review?.actualY != null
              ? { x: capture.review.actualX, y: capture.review.actualY }
              : null
          )
          const deltaX = displayPoint ? displayPoint.x - capture.detectorX : null
          const band = qualityBand(deltaX)
          const isFalsePositive = draft?.issue === "false_positive" || (!draft && capture.review?.issue === "false_positive")
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
                    : "Unmarked"
          return (
            <article
              key={capture.id}
              className={`overflow-hidden rounded-2xl border bg-[#1E2022] transition duration-200 ${
                draft
                  ? "border-[#5C8DB8] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                  : upload?.status === "failed"
                    ? "border-[#9A5755]"
                    : "border-[#34373B]"
              }`}
            >
              <div className="flex items-start justify-between gap-3 border-b border-[#34373B] px-3.5 py-3">
                <div>
                  <div className="text-sm font-semibold text-white">Run {capture.runNumber} · {capture.target}</div>
                  <div className="mt-0.5 font-mono text-[10px] text-[#777B80]">
                    Session {shortId(capture.sessionId)} · {capture.direction || "direction n/a"}
                  </div>
                </div>
                <div className="grid justify-items-end gap-1">
                  <span className={`font-mono text-[10px] ${upload?.status === "failed" ? "text-[#F2B1AE]" : draft ? "text-[#8FB5D4]" : "text-[#777B80]"}`}>
                    {stateLabel}
                  </span>
                  {capture.review?.source === "app" && (
                    <span className="rounded-full border border-[#527E62] bg-[#213027] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#8FC8A3]">
                      {capture.review.issue === "unlabeled" ? "App review" : capture.review.issue}
                    </span>
                  )}
                  {capture.sessionId && (
                    <button
                      type="button"
                      onClick={() => onOpenSessionNotes(capture.sessionId as string)}
                      className="text-[10px] font-semibold text-[#8B8F94] underline decoration-[#4A4D51] underline-offset-2 transition hover:text-white active:translate-y-px"
                    >
                      {sessionContextIds.has(capture.sessionId) ? "Notes added" : "Session notes"}
                    </button>
                  )}
                </div>
              </div>

              <button
                type="button"
                aria-label={`Mark true crossing for session ${shortId(capture.sessionId)}, run ${capture.runNumber}`}
                onPointerDown={(event) => placeGridMark(capture, event)}
                disabled={!capture.editable || Boolean(upload && upload.status !== "failed")}
                className="relative block w-full overflow-hidden bg-[#0C0D0E] text-left active:scale-[0.995] disabled:cursor-default"
              >
                <img
                  ref={(image) => {
                    if (image) imageRefs.current.set(capture.id, image)
                    else imageRefs.current.delete(capture.id)
                  }}
                  src={capture.imageUrl}
                  data-capture-id={capture.id}
                  alt={`Detection thumbnail for session ${shortId(capture.sessionId)}, run ${capture.runNumber}`}
                  loading={index < 4 ? "eager" : "lazy"}
                  decoding="async"
                  draggable={false}
                  className={`block w-full select-none ${isFalsePositive ? "opacity-45" : "opacity-100"}`}
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 w-[3px] -translate-x-1/2 bg-[#FF3B30] shadow-[0_0_0_1px_rgba(50,10,8,0.22)]"
                  style={{ left: `${capture.detectorX * 100}%` }}
                />
                {displayPoint && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-[#35B96F] shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
                    style={{ left: `${displayPoint.x * 100}%`, top: `${displayPoint.y * 100}%` }}
                  />
                )}
                {isFalsePositive && (
                  <span className="pointer-events-none absolute inset-0 grid place-items-center bg-[#111315]/45">
                    <span className="rounded-lg border border-[#9A5755] bg-[#2B2223]/95 px-3 py-2 text-xs font-semibold text-[#F2B1AE]">
                      No crossing
                    </span>
                  </span>
                )}
              </button>

              <div className="border-b border-[#34373B] px-3.5 py-3">
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
                  className="w-full rounded-lg border border-[#3D4145] bg-[#17191B] px-3 py-2 text-xs text-white outline-none transition placeholder:text-[#5F6368] focus:border-[#5C8DB8] focus:ring-2 focus:ring-[#5C8DB8]/20 disabled:cursor-default disabled:opacity-70"
                />
              </div>

              <div className="grid grid-cols-[1fr_auto] items-center gap-2 px-3.5 py-3">
                <div>
                  <div className={`font-mono text-[10px] font-semibold uppercase tracking-[0.1em] ${isFalsePositive ? "text-[#F2B1AE]" : band.tone}`}>
                    {isFalsePositive ? "False positive" : band.label}
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-[#63676C]">
                    {displayPoint && deltaX !== null
                      ? `x ${(displayPoint.x * 100).toFixed(2)}% · Δ ${(deltaX * 100).toFixed(2)}%`
                      : "Click image to mark"}
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {draft && (
                    <button
                      type="button"
                      onClick={() => clearDraft(capture.id)}
                      className="rounded-lg border border-[#3D3D3D] px-2.5 py-2 text-[10px] font-semibold text-[#9B9A97] transition hover:text-white active:translate-y-px"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="button"
                    aria-pressed={isFalsePositive}
                    onClick={() => toggleFalsePositive(capture)}
                    disabled={!capture.editable || Boolean(upload && upload.status !== "failed")}
                    className={`rounded-lg border px-2.5 py-2 text-[10px] font-semibold transition active:translate-y-px disabled:cursor-wait disabled:opacity-50 ${
                      isFalsePositive
                        ? "border-[#9A5755] bg-[#342526] text-[#F2B1AE]"
                        : "border-[#3D3D3D] text-[#9B9A97] hover:border-[#9A5755] hover:text-[#F2B1AE]"
                    }`}
                  >
                    No crossing
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenDetail(capture.id)}
                    disabled={draftCount > 0 || preparing}
                    title={draftCount > 0 ? "Queue or clear the grid marks before opening detail view" : undefined}
                    className="rounded-lg border border-[#3D3D3D] px-2.5 py-2 text-[10px] font-semibold text-[#9B9A97] transition hover:border-[#5C8DB8] hover:text-white active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Frame &amp; point
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <footer className="sticky bottom-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-xl border border-[#3A3D41] bg-[#202225]/95 p-2 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.9)] backdrop-blur-md sm:bottom-3 sm:gap-3 sm:rounded-2xl sm:p-3">
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
