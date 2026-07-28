/* eslint-disable @next/next/no-img-element */
"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import type {
  DetectionEvidenceReviewLabel,
  EvidencePreviewFrame,
  EvidenceWindow,
} from "@/lib/detection-evidence"

interface SavedReview {
  id: string
  physical_crossing_id: string | null
  review_round: number
  label: DetectionEvidenceReviewLabel
  selected_relative_frame: number | null
  actual_x: number | null
  actual_y: number | null
  note: string | null
}

interface ReviewItem {
  evidenceSessionId: string
  sourceSessionId: string
  deviceModel: string
  appBuild: string | null
  gateX: number
  physicalCrossingId: string | null
  suggestedLabel: DetectionEvidenceReviewLabel
  consistencySample: boolean
  window: EvidenceWindow
  reviews: { round1: SavedReview | null; round2: SavedReview | null }
}

interface EvidenceResponse {
  available: boolean
  reason?: string
  sessions: Array<{ id: string }>
  physicalCrossings: Array<{
    physicalCrossingId: string
    devices: Array<{
      evidenceSessionId: string
      deviceModel: string
      status: string
    }>
  }>
  reviewItems: ReviewItem[]
  error?: string
}

interface Point {
  x: number
  y: number
}

const labels: Array<{
  value: DetectionEvidenceReviewLabel
  title: string
  helper: string
}> = [
  { value: "true_crossing", title: "True crossing", helper: "Runner crossed; mark the torso edge." },
  { value: "hard_negative", title: "Hard negative", helper: "Plausible motion, but no runner crossed." },
  { value: "not_ready", title: "Not ready", helper: "Phone setup did not cover this crossing." },
  { value: "ignore", title: "Ignore", helper: "Evidence is outside the test protocol." },
]

function shortId(value: string) {
  return value.slice(0, 8)
}

function relationLabel(relativeFrame: number) {
  if (relativeFrame === 0) return "r0"
  return `r${relativeFrame > 0 ? "+" : ""}${relativeFrame}`
}

function statusLabel(status: string) {
  if (status === "accepted") return "Detected"
  if (status === "missed_candidate") return "Miss candidate"
  if (status === "trace_only_miss") return "Ready, no local window"
  if (status === "before_ready") return "Setup not ready"
  if (status === "after_coverage") return "Capture ended"
  if (status === "capture_gap") return "No ready frame nearby"
  return "Unmeasured"
}

function initialFrame(item: ReviewItem, review: SavedReview | null) {
  return item.window.previewFrames.find(
    (frame) => frame.relativeFrame === review?.selected_relative_frame,
  ) || item.window.previewFrames.find((frame) => frame.relativeFrame === 0)
    || item.window.previewFrames.at(-1)
    || null
}

function EvidenceReviewRow({
  item,
  onSaved,
}: {
  item: ReviewItem
  onSaved: () => Promise<void>
}) {
  const canStartRoundTwo =
    item.consistencySample && Boolean(item.reviews.round1) && !item.reviews.round2
  const [round, setRound] = useState(1)
  const activeSaved = round === 2 ? item.reviews.round2 : item.reviews.round1
  const [frame, setFrame] = useState<EvidencePreviewFrame | null>(
    initialFrame(item, activeSaved),
  )
  const [label, setLabel] = useState<DetectionEvidenceReviewLabel>(
    activeSaved?.label || item.suggestedLabel,
  )
  const [point, setPoint] = useState<Point | null>(
    activeSaved?.actual_x !== null
      && activeSaved?.actual_x !== undefined
      && activeSaved.actual_y !== null
      && activeSaved.actual_y !== undefined
      ? { x: activeSaved.actual_x, y: activeSaved.actual_y }
      : null,
  )
  const [note, setNote] = useState(activeSaved?.note || "")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  const chooseLabel = (next: DetectionEvidenceReviewLabel) => {
    setLabel(next)
    setMessage("")
    if (next !== "true_crossing") setPoint(null)
  }

  const mark = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (label !== "true_crossing" || !frame?.url) return
    const bounds = event.currentTarget.getBoundingClientRect()
    setPoint({
      x: Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width)),
      y: Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height)),
    })
    setMessage("")
  }

  const startRoundTwo = () => {
    setRound(2)
    setFrame(initialFrame(item, item.reviews.round2))
    setLabel(item.reviews.round2?.label || item.suggestedLabel)
    setPoint(null)
    setNote(item.reviews.round2?.note || "")
    setMessage("")
  }

  const save = async () => {
    if (!frame) {
      setMessage("Choose an uploaded evidence frame.")
      return
    }
    if (label === "true_crossing" && !point) {
      setMessage("Click the true torso edge before saving.")
      return
    }
    setSaving(true)
    setMessage("")
    try {
      const response = await fetch("/api/admin/detection-evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          evidenceSessionId: item.evidenceSessionId,
          windowId: item.window.id,
          physicalCrossingId: item.physicalCrossingId,
          reviewRound: round,
          label,
          selectedRelativeFrame: frame.relativeFrame,
          actualX: point?.x ?? null,
          actualY: point?.y ?? null,
          note,
        }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || "Could not save review")
      setMessage(`Round ${round} saved`)
      await onSaved()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save review")
    } finally {
      setSaving(false)
    }
  }

  return (
    <article className="grid gap-5 border-t border-[#34444E] py-6 lg:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.1fr)]">
      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#7FA4BE]">
              {item.deviceModel} · build {item.appBuild || "unknown"}
            </div>
            <div className="mt-1 text-sm text-[#AAB7C0]">
              Session {shortId(item.sourceSessionId)} · sequence {item.window.sequenceId}
            </div>
          </div>
          <span className={`border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] ${
            item.window.outcome === "accepted"
              ? "border-[#416451] bg-[#1B2921] text-[#9BC8A8]"
              : "border-[#6B5A35] bg-[#2B271D] text-[#D7BA75]"
          }`}>
            {item.window.outcome === "accepted" ? "Detected" : "Miss candidate"}
          </span>
        </div>

        <button
          type="button"
          onPointerDown={mark}
          disabled={!frame?.url || label !== "true_crossing"}
          aria-label="Mark the true torso crossing edge"
          className="relative block w-full overflow-hidden border border-[#3A4C57] bg-[#0F1519] text-left disabled:cursor-default"
        >
          {frame?.url ? (
            <img
              src={frame.url}
              alt={`Replica evidence ${relationLabel(frame.relativeFrame)}`}
              draggable={false}
              className="block h-auto w-full select-none"
            />
          ) : (
            <div className="grid aspect-[9/16] place-items-center px-6 text-center text-sm text-[#7B858B]">
              This window has no uploaded preview frame.
            </div>
          )}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 w-[3px] -translate-x-1/2 bg-[#E46D62]"
            style={{ left: `${item.gateX * 100}%` }}
          />
          {point && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-[#63B881]"
              style={{ left: `${point.x * 100}%`, top: `${point.y * 100}%` }}
            />
          )}
        </button>

        <div className="mt-2 flex gap-1 overflow-x-auto pb-1">
          {item.window.previewFrames.map((candidate) => (
            <button
              key={candidate.frameOrdinal}
              type="button"
              onClick={() => {
                setFrame(candidate)
                setPoint(null)
                setMessage("")
              }}
              className={`min-w-11 border px-2 py-1.5 font-mono text-[10px] transition active:translate-y-px ${
                candidate.frameOrdinal === frame?.frameOrdinal
                  ? "border-[#6C9CBD] bg-[#253844] text-white"
                  : "border-[#34444E] bg-[#182127] text-[#8F9CA4] hover:border-[#526A78]"
              }`}
            >
              {relationLabel(candidate.relativeFrame)}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs leading-5 text-[#7F8B92]">
          Grayscale evidence spans r-8 through r+2. The red line is the configured gate.
        </p>
      </div>

      <div className="flex flex-col">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="border-l-2 border-[#526E80] bg-[#1A242A] px-3 py-2.5">
            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#788D99]">
              Runtime outcome
            </div>
            <div className="mt-1 text-sm font-medium text-white">
              {item.window.lastRejectReason || item.window.reason}
            </div>
          </div>
          <div className={`border-l-2 px-3 py-2.5 ${
            item.window.shadow.wouldAccept
              ? "border-[#C4A354] bg-[#29251B]"
              : "border-[#4B5A63] bg-[#1A2227]"
          }`}>
            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#8D8A7E]">
              Shadow rule, no runtime change
            </div>
            <div className="mt-1 text-sm font-medium text-white">
              {item.window.shadow.wouldAccept
                ? "Would rescue"
                : `Rejected: ${item.window.shadow.reason}`}
            </div>
          </div>
        </div>

        <fieldset className="mt-5">
          <legend className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8F9CA4]">
            Classification
          </legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {labels.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => chooseLabel(option.value)}
                className={`border px-3 py-3 text-left transition active:translate-y-px ${
                  label === option.value
                    ? "border-[#6995B1] bg-[#21323D]"
                    : "border-[#34444E] bg-[#182127] hover:border-[#526A78]"
                }`}
              >
                <span className="block text-sm font-semibold text-white">{option.title}</span>
                <span className="mt-1 block text-xs leading-4 text-[#859199]">{option.helper}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <label className="mt-4 grid gap-2">
          <span className="text-xs font-medium text-[#9AA7AE]">Review note</span>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
            placeholder="Optional: setup motion, visibility, or why this is not a crossing."
            className="resize-none border border-[#3A4C57] bg-[#182127] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#6995B1]"
          />
        </label>

        {item.consistencySample && item.reviews.round1 && (
          <div className="mt-4 border-l-2 border-[#748C9C] bg-[#1B252B] px-3 py-3">
            <div className="text-xs font-semibold text-white">10% consistency sample</div>
            <p className="mt-1 text-xs leading-5 text-[#8F9CA4]">
              Repeat this mark in round two so reviewer variation stays separate from detector error.
            </p>
            <button
              type="button"
              disabled={!canStartRoundTwo && !item.reviews.round2}
              onClick={startRoundTwo}
              className="mt-2 border border-[#536C7C] px-3 py-1.5 text-xs font-semibold text-[#C1D0D9] transition hover:border-[#7391A4] active:translate-y-px disabled:opacity-50"
            >
              {item.reviews.round2 ? "View round two" : "Start blind recheck"}
            </button>
          </div>
        )}

        {message && (
          <p role="status" className="mt-3 text-sm text-[#C6B67F]">{message}</p>
        )}
        <button
          type="button"
          onClick={save}
          disabled={saving || !frame || (label === "true_crossing" && !point)}
          className="mt-4 h-11 border border-[#6A98B5] bg-[#31546A] px-4 text-sm font-semibold text-white transition hover:bg-[#3A6178] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45"
        >
          {saving ? "Saving review…" : `Save round ${round}`}
        </button>
      </div>
    </article>
  )
}

export default function DetectionEvidenceReviewDashboard() {
  const [data, setData] = useState<EvidenceResponse | null>(null)
  const [days, setDays] = useState(7)
  const [status, setStatus] = useState<"pending" | "reviewed" | "all">("pending")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch(`/api/admin/detection-evidence?days=${days}`, {
        cache: "no-store",
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || "Could not load evidence")
      setData(payload)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load evidence")
    } finally {
      setLoading(false)
    }
  }, [days])

  useEffect(() => {
    void load()
  }, [load])

  const visibleItems = useMemo(() => {
    const items = data?.reviewItems || []
    if (status === "all") return items
    return items.filter((item) =>
      status === "reviewed" ? Boolean(item.reviews.round1) : !item.reviews.round1)
  }, [data?.reviewItems, status])
  const setupGapCount = useMemo(
    () => (data?.physicalCrossings || []).reduce(
      (count, crossing) => count + crossing.devices.filter(
        (device) =>
          device.status === "before_ready"
          || device.status === "after_coverage"
          || device.status === "capture_gap"
          || device.status === "unmeasured",
      ).length,
      0,
    ),
    [data?.physicalCrossings],
  )
  const readyMissCount = useMemo(
    () => (data?.physicalCrossings || []).reduce(
      (count, crossing) => count + crossing.devices.filter(
        (device) =>
          device.status === "trace_only_miss"
          || device.status === "missed_candidate",
      ).length,
      0,
    ),
    [data?.physicalCrossings],
  )

  return (
    <main className="min-h-[100dvh] bg-[#141A1F] px-4 py-6 text-[#E8EDF0] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <header className="grid gap-5 border-b border-[#3A4B55] pb-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6C9CBD]">
              Cross-phone evidence
            </p>
            <h1 className="mt-2 font-[var(--font-bricolage)] text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">
              Review misses and hard negatives
            </h1>
            <p className="mt-2 max-w-[72ch] text-sm leading-6 text-[#9AA7AE]">
              A phone is only called a miss when a reference crossing falls inside its ready capture coverage. Setup mismatch stays separate. Virtual gates remain correlated under one physical crossing.
            </p>
            <p className="mt-2 max-w-[72ch] text-xs leading-5 text-[#7F8B92]">
              If every phone missed but the runner is visible here, choose True crossing. Timestamp-near reviewed rows are grouped as one physical pass by the optimizer.
            </p>
            <Link
              href="/admin/detection-review"
              className="mt-3 inline-block text-sm font-semibold text-[#9CC1D9] underline decoration-[#587A90] underline-offset-4"
            >
              Return to accepted crossing review
            </Link>
          </div>
          <div className="grid grid-cols-3 border border-[#3A4B55] bg-[#182127] font-mono">
            <div className="px-4 py-3">
              <div className="text-xl font-semibold text-white">{data?.physicalCrossings.length || 0}</div>
              <div className="text-[10px] uppercase tracking-[0.12em] text-[#78868E]">Crossings</div>
            </div>
            <div className="border-x border-[#3A4B55] px-4 py-3">
              <div className="text-xl font-semibold text-[#D7BA75]">{readyMissCount}</div>
              <div className="text-[10px] uppercase tracking-[0.12em] text-[#8E856D]">Ready misses</div>
            </div>
            <div className="px-4 py-3">
              <div className="text-xl font-semibold text-[#91B5CC]">{setupGapCount}</div>
              <div className="text-[10px] uppercase tracking-[0.12em] text-[#728B9A]">Setup gaps</div>
            </div>
          </div>
        </header>

        <section className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-xs font-medium text-[#9AA7AE]">Review status</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as typeof status)}
              className="h-11 border border-[#3A4C57] bg-[#182127] px-3 text-sm text-white outline-none focus:border-[#6995B1]"
            >
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="all">All windows</option>
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-medium text-[#9AA7AE]">Recent window</span>
            <select
              value={days}
              onChange={(event) => setDays(Number(event.target.value))}
              className="h-11 border border-[#3A4C57] bg-[#182127] px-3 text-sm text-white outline-none focus:border-[#6995B1]"
            >
              <option value={7}>7 days</option>
              <option value={30}>30 days</option>
              <option value={90}>90 days</option>
            </select>
          </label>
        </section>

        {error && (
          <div role="alert" className="mt-5 border-l-2 border-[#D76E68] bg-[#2B2223] px-4 py-3 text-sm text-[#EDAAA5]">
            {error}
          </div>
        )}
        {!loading && data && !data.available && (
          <div className="mt-5 border-l-2 border-[#C4A354] bg-[#29251B] px-4 py-4">
            <h2 className="text-sm font-semibold text-white">Evidence schema pending</h2>
            <p className="mt-1 text-sm leading-6 text-[#C7B98F]">{data.reason}</p>
          </div>
        )}

        {loading ? (
          <div className="mt-6 divide-y divide-[#34444E] border-y border-[#34444E]">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="grid animate-pulse gap-5 py-6 lg:grid-cols-2">
                <div className="aspect-[9/12] bg-[#202A30]" />
                <div className="space-y-3">
                  <div className="h-14 bg-[#202A30]" />
                  <div className="h-28 bg-[#202A30]" />
                  <div className="h-20 bg-[#202A30]" />
                </div>
              </div>
            ))}
          </div>
        ) : data?.available && visibleItems.length === 0 ? (
          <div className="mt-6 border-y border-[#34444E] py-16">
            <h2 className="text-xl font-semibold text-white">No evidence windows in this view</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#8F9CA4]">
              Run the next flash test with the new build, keep every phone open until fully synced, then return here.
            </p>
          </div>
        ) : (
          <section className="mt-6 border-b border-[#34444E]">
            {visibleItems.map((item) => (
              <EvidenceReviewRow
                key={`${item.evidenceSessionId}:${item.window.id}`}
                item={item}
                onSaved={load}
              />
            ))}
          </section>
        )}

        {data?.available && data.physicalCrossings.length > 0 && (
          <section className="mt-8 border-t border-[#34444E] pt-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9AA7AE]">
              Reference coverage audit
            </h2>
            <div className="mt-3 divide-y divide-[#2F3E47]">
              {data.physicalCrossings.slice(0, 20).map((crossing, index) => (
                <div
                  key={crossing.physicalCrossingId}
                  className="grid gap-2 py-3 lg:grid-cols-[150px_1fr]"
                >
                  <div className="font-mono text-xs text-[#7FA4BE]">Crossing {index + 1}</div>
                  <div className="flex flex-wrap gap-2">
                    {crossing.devices.map((device) => (
                      <span
                        key={device.evidenceSessionId}
                        className="border border-[#34444E] bg-[#182127] px-2.5 py-1 text-xs text-[#AAB7C0]"
                      >
                        {device.deviceModel}: {statusLabel(device.status)}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
