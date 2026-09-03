/* eslint-disable @next/next/no-img-element */
"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

type Direction = "L->R" | "R->L"
type DirectionReviewStatus = "confirmed" | "unsure" | "ignore"

interface DirectionReview {
  id: string
  createdAt: string
  status: DirectionReviewStatus
  direction: Direction | null
  ownerConfirmed: boolean
}

interface TemporalFrame {
  index: number
  url: string
  relation: string
  relativeFrame: number
  ptsNanos: string | null
}

interface DirectionCapture {
  id: string
  sessionId: string | null
  runNumber: number
  target: string
  createdAt: string
  direction: Direction | null
  directionEvidence: string
  deviceModel: string | null
  appVersion: string | null
  appBuild: string | null
  imageUrl: string
  temporalFrames: TemporalFrame[]
  directionReview: DirectionReview | null
}

interface QueueResponse {
  captures?: DirectionCapture[]
  error?: string
}

interface DirectionReviewDashboardProps {
  reviewQuery: string
  unsureQuery?: string
  cohortId?: string
}

function captureIds(value: string): string[] {
  return value
    .split(/[\n,;|]+/)
    .map((item) => item.trim().replace(/^capture:/i, "").toLowerCase())
    .filter(Boolean)
}

function shortId(value: string | null): string {
  return value ? value.slice(0, 8) : "unlinked"
}

function frameLabel(frame: TemporalFrame): string {
  if (frame.relativeFrame === 0) return "Detected"
  return frame.relativeFrame < 0 ? `Earlier ${frame.relativeFrame}` : `Later +${frame.relativeFrame}`
}

function savedLabel(review: DirectionReview | null): string {
  if (!review) return "Not reviewed"
  if (review.status === "ignore") return "Excluded"
  if (review.status === "unsure") return "Unsure"
  return review.direction === "L->R" ? "Left → Right" : "Right → Left"
}

export default function DirectionReviewDashboard({
  reviewQuery,
  unsureQuery = "",
  cohortId = "",
}: DirectionReviewDashboardProps) {
  const router = useRouter()
  const requestedIds = useMemo(() => captureIds(reviewQuery), [reviewQuery])
  const unsureIds = useMemo(() => new Set(captureIds(unsureQuery)), [unsureQuery])
  const [captures, setCaptures] = useState<DirectionCapture[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [activeFrameIndex, setActiveFrameIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError("")
      try {
        const focusedQuery = cohortId
          ? `cohort=${encodeURIComponent(cohortId)}`
          : `review=${encodeURIComponent(reviewQuery)}`
        const response = await fetch(
          `/api/admin/detection-review?days=365&limit=100&offset=0&${focusedQuery}`,
          { cache: "no-store" },
        )
        if (response.status === 401) {
          router.replace(`/admin/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`)
          return
        }
        const result = (await response.json()) as QueueResponse
        if (!response.ok) throw new Error(result.error || "Could not load direction review")
        const captureById = new Map((result.captures || []).map((capture) => [capture.id.toLowerCase(), capture]))
        const ordered = requestedIds
          .map((id) => captureById.get(id))
          .filter((capture): capture is DirectionCapture => Boolean(capture))
        if (!cancelled) {
          setCaptures(ordered)
          setSelectedIndex(0)
        }
      } catch (loadError) {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : "Could not load direction review")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [cohortId, requestedIds, reviewQuery, router])

  const selected = captures[selectedIndex] || null
  const frames = useMemo(() => {
    if (!selected) return []
    return [...selected.temporalFrames].sort((left, right) => left.relativeFrame - right.relativeFrame)
  }, [selected])
  const detectedFrame = frames.find((frame) => frame.relativeFrame === 0) || frames[0] || null
  const activeFrame = frames.find((frame) => frame.index === activeFrameIndex) || detectedFrame
  const activeImageUrl = activeFrame?.url || selected?.imageUrl || ""
  const sequenceFrames = [frames[0], detectedFrame, frames[frames.length - 1]]
    .filter((frame, index, list): frame is TemporalFrame => (
      Boolean(frame) && list.findIndex((item) => item?.index === frame.index) === index
    ))
  const reviewedCount = captures.filter((capture) => capture.directionReview).length

  useEffect(() => {
    setActiveFrameIndex(null)
    setError("")
  }, [selected?.id])

  async function save(status: DirectionReviewStatus, direction: Direction | null) {
    if (!selected || saving) return
    setSaving(true)
    setError("")
    try {
      const response = await fetch("/api/admin/detection-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save-direction-review",
          captureId: selected.id,
          status,
          direction,
        }),
      })
      if (response.status === 401) {
        router.replace(`/admin/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`)
        return
      }
      const result = (await response.json()) as { directionReview?: DirectionReview; error?: string }
      if (!response.ok || !result.directionReview) {
        throw new Error(result.error || "Could not save direction review")
      }
      setCaptures((current) => current.map((capture) =>
        capture.id === selected.id
          ? { ...capture, directionReview: result.directionReview || null }
          : capture,
      ))
      if (selectedIndex < captures.length - 1) setSelectedIndex((index) => index + 1)
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save direction review")
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-[100dvh] bg-[#141A1F] px-4 py-6 text-[#E8EDF0] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-5">
        <header className="rounded-2xl border border-[#314452] bg-[#1A232A] p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5C8DB8]">
                Owner direction review
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-white">
                Which way is the person moving?
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#A7B0B7]">
                Review the frames from earlier to later, then choose the direction visible in the image. Exclude means only “do not use this capture for direction evaluation.”
              </p>
            </div>
            <div className="grid min-w-44 grid-cols-2 overflow-hidden rounded-xl border border-[#38505F] bg-[#131B21] text-center font-mono">
              <div className="px-4 py-3">
                <div className="text-xl font-semibold text-[#A8D8B9]">{reviewedCount}</div>
                <div className="text-[10px] uppercase tracking-[0.12em] text-[#718D7A]">Reviewed</div>
              </div>
              <div className="border-l border-[#38505F] px-4 py-3">
                <div className="text-xl font-semibold text-[#B7D0E5]">{captures.length}</div>
                <div className="text-[10px] uppercase tracking-[0.12em] text-[#758A9C]">Total</div>
              </div>
            </div>
          </div>
        </header>

        {error && (
          <div role="alert" className="border-l-2 border-[#F06C68] bg-[#2B2223] px-4 py-3 text-sm text-[#F2B1AE]">
            {error}
          </div>
        )}

        {loading ? (
          <div className="h-[70dvh] animate-pulse rounded-2xl bg-[#202A31]" />
        ) : !selected ? (
          <section className="rounded-2xl border border-[#4E393B] bg-[#251D1E] px-6 py-16 text-center">
            <h2 className="text-xl font-semibold text-white">No requested captures were found</h2>
            <p className="mt-2 text-sm text-[#C59D9B]">The capture list may be missing or invalid.</p>
          </section>
        ) : (
          <section className="overflow-hidden rounded-2xl border border-[#314452] bg-[#11181D]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#314452] px-4 py-3 sm:px-5">
              <div>
                <div className="text-lg font-semibold text-white">
                  {selectedIndex + 1} of {captures.length} · Session {shortId(selected.sessionId)} · Run {selected.runNumber}
                </div>
                <div className="mt-1 font-mono text-[11px] text-[#84929B]">
                  {selected.target} · {selected.deviceModel || "device unknown"} · {selected.appVersion || "version unknown"}{selected.appBuild ? ` (${selected.appBuild})` : ""}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className={`rounded-full border px-3 py-1.5 ${
                  unsureIds.has(selected.id.toLowerCase())
                    ? "border-[#8B7444] bg-[#302B20] text-[#E3C881]"
                    : "border-[#6E4C4D] bg-[#2B2223] text-[#F2B1AE]"
                }`}>
                  Agent flag: {unsureIds.has(selected.id.toLowerCase()) ? "unsure" : "likely reversed"}
                </span>
                <span className="rounded-full border border-[#476170] bg-[#17232B] px-3 py-1.5 text-[#B7D0E5]">
                  Saved: {savedLabel(selected.directionReview)}
                </span>
              </div>
            </div>

            <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_270px] sm:p-5">
              <div className="space-y-3">
                {sequenceFrames.length > 1 && (
                  <div className="space-y-3 rounded-xl border border-[#496171] bg-[#17232B] p-3">
                    <div>
                      <h2 className="text-sm font-semibold text-white">Movement sequence: earlier → detected → later</h2>
                      <p className="mt-1 text-xs leading-5 text-[#B7D0E5]">
                        Follow the person from the left panel to the right panel. If their position moves toward the screen’s right edge, choose Left → Right.
                      </p>
                    </div>
                    <div className="overflow-x-auto pb-1">
                      <div className="grid min-w-[720px] grid-cols-3 gap-2">
                        {sequenceFrames.map((frame, index) => (
                          <button
                            key={frame.index}
                            type="button"
                            onClick={() => setActiveFrameIndex(frame.index)}
                            className={`overflow-hidden rounded-lg border text-left transition ${
                              activeFrame?.index === frame.index
                                ? "border-[#6FB58A] ring-2 ring-[#6FB58A]/30"
                                : "border-[#3B4D59] hover:border-[#5C8DB8]"
                            }`}
                          >
                            <div className="flex items-center justify-between bg-[#11181D] px-3 py-2 text-xs font-semibold text-white">
                              <span>{index === 0 ? "1 · Earlier" : index === sequenceFrames.length - 1 ? `${sequenceFrames.length} · Later` : "2 · Detected"}</span>
                              {index < sequenceFrames.length - 1 && <span className="text-[#9CC1D9]">→</span>}
                            </div>
                            <img
                              src={frame.url}
                              alt={`${frameLabel(frame)} direction frame`}
                              className="h-64 w-full bg-black object-contain"
                              draggable={false}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex min-h-[420px] items-center justify-center overflow-hidden rounded-xl bg-black">
                  <img
                    key={`${selected.id}:${activeFrame?.index ?? "thumbnail"}`}
                    src={activeImageUrl}
                    alt={`Direction review frame for session ${shortId(selected.sessionId)}, run ${selected.runNumber}`}
                    className="max-h-[68dvh] w-full object-contain"
                    draggable={false}
                  />
                </div>

                {frames.length > 1 && (
                  <div className="space-y-2 rounded-xl border border-[#314452] bg-[#172027] p-3">
                    <div className="flex items-center justify-between text-xs text-[#9FB0BB]">
                      <span>Earlier</span>
                      <span className="font-mono text-white">{activeFrame ? frameLabel(activeFrame) : "Frame"}</span>
                      <span>Later</span>
                    </div>
                    <input
                      aria-label="Scrub through saved frames"
                      type="range"
                      min={0}
                      max={frames.length - 1}
                      step={1}
                      value={Math.max(0, frames.findIndex((frame) => frame.index === activeFrame?.index))}
                      onChange={(event) => setActiveFrameIndex(frames[Number(event.target.value)]?.index ?? null)}
                      className="w-full accent-[#6FB58A]"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      {[frames[0], detectedFrame, frames[frames.length - 1]]
                        .filter((frame, index, list): frame is TemporalFrame => Boolean(frame) && list.findIndex((item) => item?.index === frame.index) === index)
                        .map((frame) => (
                          <button
                            key={frame.index}
                            type="button"
                            onClick={() => setActiveFrameIndex(frame.index)}
                            className={`rounded-lg border px-2 py-2 text-xs font-semibold transition ${
                              activeFrame?.index === frame.index
                                ? "border-[#6FB58A] bg-[#203229] text-[#B9E2C8]"
                                : "border-[#3B4D59] bg-[#11181D] text-[#A7B0B7] hover:border-[#5C8DB8]"
                            }`}
                          >
                            {frameLabel(frame)}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <aside className="space-y-4 rounded-xl border border-[#314452] bg-[#182129] p-4">
                <div>
                  <h2 className="text-base font-semibold text-white">Your direction</h2>
                  <p className="mt-1 text-xs leading-5 text-[#9FB0BB]">
                    Judge the person’s movement across the image—not which way their body faces.
                  </p>
                </div>
                <div className="grid gap-2">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => void save("confirmed", "L->R")}
                    className="min-h-14 rounded-xl bg-[#5C8DB8] px-4 text-base font-semibold text-white transition hover:bg-[#6C9AC2] active:translate-y-px disabled:opacity-50"
                  >
                    Left → Right
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => void save("confirmed", "R->L")}
                    className="min-h-14 rounded-xl bg-[#5C8DB8] px-4 text-base font-semibold text-white transition hover:bg-[#6C9AC2] active:translate-y-px disabled:opacity-50"
                  >
                    Right → Left
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => void save("unsure", null)}
                    className="min-h-12 rounded-xl border border-[#8B7444] bg-[#302B20] px-4 text-sm font-semibold text-[#E3C881] transition hover:border-[#B09657] active:translate-y-px disabled:opacity-50"
                  >
                    Unsure
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => void save("ignore", null)}
                    className="min-h-12 rounded-xl border border-[#6E4C4D] bg-[#2B2223] px-4 text-sm font-semibold text-[#F2B1AE] transition hover:border-[#9B6668] active:translate-y-px disabled:opacity-50"
                  >
                    Exclude from direction dataset
                  </button>
                </div>
                <p className="text-[11px] leading-5 text-[#778892]">
                  {saving ? "Saving your choice…" : "Each choice saves immediately and moves to the next capture."}
                </p>
              </aside>
            </div>

            <nav className="flex items-center justify-between gap-3 border-t border-[#314452] px-4 py-3 sm:px-5">
              <button
                type="button"
                onClick={() => setSelectedIndex((index) => Math.max(0, index - 1))}
                disabled={selectedIndex === 0 || saving}
                className="rounded-lg border border-[#3B4D59] px-4 py-2 text-sm font-semibold text-[#D6E2E9] disabled:opacity-35"
              >
                Previous
              </button>
              <div className="h-2 min-w-28 flex-1 overflow-hidden rounded-full bg-[#27333B]">
                <div
                  className="h-full bg-[#6FB58A] transition-all"
                  style={{ width: `${captures.length ? (reviewedCount / captures.length) * 100 : 0}%` }}
                />
              </div>
              <button
                type="button"
                onClick={() => setSelectedIndex((index) => Math.min(captures.length - 1, index + 1))}
                disabled={selectedIndex >= captures.length - 1 || saving}
                className="rounded-lg border border-[#3B4D59] px-4 py-2 text-sm font-semibold text-[#D6E2E9] disabled:opacity-35"
              >
                Next
              </button>
            </nav>
          </section>
        )}

        <div className="text-center">
          <Link href="/admin/detection-review" className="text-sm font-semibold text-[#9CC1D9] underline underline-offset-4">
            Return to the full evidence review
          </Link>
        </div>
      </div>
    </main>
  )
}
