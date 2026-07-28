import { createHash } from "node:crypto"
import { NextResponse } from "next/server"
import { verifyAdminSession } from "@/lib/admin-auth"
import { currentDetectionReviewSince, isUuid, normalizedCoordinate } from "@/lib/detection-review"
import {
  clusterConcurrentEvidenceSessions,
  clusterEvidenceEvents,
  evidenceSetupStatus,
  isDetectionEvidenceReviewLabel,
  type EvidencePreviewFrame,
  type EvidenceWindow,
  type ReadyTraceInterval,
} from "@/lib/detection-evidence"
import { getSupabaseAdmin } from "@/lib/supabase"

export const runtime = "nodejs"

interface EvidenceSessionRow {
  id: string
  user_id: string
  session_id: string
  device_id: string
  device_model: string
  app_version: string | null
  app_build: string | null
  detector_revision: string
  process_width: number
  process_height: number
  configured_gate_column: number
  started_unix_ms: number | string
  first_ready_unix_ms: number | string | null
  last_ready_unix_ms: number | string | null
  last_frame_unix_ms: number | string | null
  ready_trace_intervals: unknown
  ended_unix_ms: number | string
  trace_frame_count: number
  trace_truncated: boolean
  evidence_recorder_average_ms: number | string
  evidence_recorder_max_ms: number | string
  evidence_recorder_over_budget_fraction: number | string
  accepted_window_count: number
  missed_candidate_window_count: number
  windows_manifest: unknown
  created_at: string
}

interface EvidenceReviewRow {
  id: string
  evidence_session_id: string
  window_id: string
  physical_crossing_id: string | null
  review_round: number
  label: string
  selected_relative_frame: number | null
  actual_x: number | null
  actual_y: number | null
  note: string | null
  updated_at: string
}

const sessionSelect = [
  "id",
  "user_id",
  "session_id",
  "device_id",
  "device_model",
  "app_version",
  "app_build",
  "detector_revision",
  "process_width",
  "process_height",
  "configured_gate_column",
  "started_unix_ms",
  "first_ready_unix_ms",
  "last_ready_unix_ms",
  "last_frame_unix_ms",
  "ready_trace_intervals",
  "ended_unix_ms",
  "trace_frame_count",
  "trace_truncated",
  "evidence_recorder_average_ms",
  "evidence_recorder_max_ms",
  "evidence_recorder_over_budget_fraction",
  "accepted_window_count",
  "missed_candidate_window_count",
  "windows_manifest",
  "created_at",
].join(",")

const reviewSelect = [
  "id",
  "evidence_session_id",
  "window_id",
  "physical_crossing_id",
  "review_round",
  "label",
  "selected_relative_frame",
  "actual_x",
  "actual_y",
  "note",
  "updated_at",
].join(",")

function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin")
  const host = request.headers.get("host")
  if (!origin || !host) return true
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

function boundedInteger(value: string | null, fallback: number, min: number, max: number) {
  const parsed = Number.parseInt(value || "", 10)
  return Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : fallback
}

function finiteNumber(value: unknown, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function nullableNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function snakeValue(
  value: Record<string, unknown>,
  snake: string,
  camel: string,
) {
  return value[snake] ?? value[camel]
}

function parseWindows(value: unknown): EvidenceWindow[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((raw): EvidenceWindow[] => {
    if (!raw || typeof raw !== "object") return []
    const window = raw as Record<string, unknown>
    const id = String(window.id || "")
    const outcome = String(window.outcome || "")
    const eventWallClockUnixMs = finiteNumber(
      snakeValue(window, "event_wall_clock_unix_ms", "eventWallClockUnixMs"),
      Number.NaN,
    )
    if (
      !isUuid(id)
      || !["accepted", "missed_candidate"].includes(outcome)
      || !Number.isFinite(eventWallClockUnixMs)
    ) {
      return []
    }
    const rawShadow = (
      window.shadow && typeof window.shadow === "object"
        ? window.shadow
        : {}
    ) as Record<string, unknown>
    const previewFrames = Array.isArray(window.preview_frames)
      ? window.preview_frames
      : Array.isArray(window.previewFrames)
        ? window.previewFrames
        : []
    return [{
      id,
      sequenceId: finiteNumber(snakeValue(window, "sequence_id", "sequenceId")),
      outcome: outcome as EvidenceWindow["outcome"],
      reason: String(window.reason || ""),
      eventWallClockUnixMs,
      targetFrameOrdinal: finiteNumber(
        snakeValue(window, "target_frame_ordinal", "targetFrameOrdinal"),
      ),
      targetFramePtsNanos: String(
        snakeValue(window, "target_frame_pts_nanos", "targetFramePtsNanos") || "0",
      ),
      completionReason: String(
        snakeValue(window, "completion_reason", "completionReason") || "",
      ),
      rawRunMax: finiteNumber(snakeValue(window, "raw_run_max", "rawRunMax")),
      mergedRunMax: finiteNumber(snakeValue(window, "merged_run_max", "mergedRunMax")),
      gateBandMaxColumns: finiteNumber(
        snakeValue(window, "gate_band_max_columns", "gateBandMaxColumns"),
      ),
      gateBandMaxPixels: finiteNumber(
        snakeValue(window, "gate_band_max_pixels", "gateBandMaxPixels"),
      ),
      candidateFrames: finiteNumber(
        snakeValue(window, "candidate_frames", "candidateFrames"),
      ),
      lastRejectReason: String(
        snakeValue(window, "last_reject_reason", "lastRejectReason") || "",
      ),
      shadow: {
        wouldAccept: Boolean(
          snakeValue(rawShadow, "would_accept", "wouldAccept"),
        ),
        reason: String(rawShadow.reason || ""),
        sequenceFrames: finiteNumber(
          snakeValue(rawShadow, "sequence_frames", "sequenceFrames"),
        ),
        mergedRun: finiteNumber(
          snakeValue(rawShadow, "merged_run", "mergedRun"),
        ),
        gateBandColumns: finiteNumber(
          snakeValue(rawShadow, "gate_band_columns", "gateBandColumns"),
        ),
        gateBandPixels: finiteNumber(
          snakeValue(rawShadow, "gate_band_pixels", "gateBandPixels"),
        ),
        localRun: finiteNumber(
          snakeValue(rawShadow, "local_run", "localRun"),
        ),
        blobHeightFraction: nullableNumber(
          snakeValue(rawShadow, "blob_height_fraction", "blobHeightFraction"),
        ),
        blobWidthFraction: nullableNumber(
          snakeValue(rawShadow, "blob_width_fraction", "blobWidthFraction"),
        ),
      },
      previewFrames: previewFrames.flatMap((rawFrame): EvidencePreviewFrame[] => {
        if (!rawFrame || typeof rawFrame !== "object") return []
        const frame = rawFrame as Record<string, unknown>
        const storagePath = String(
          snakeValue(frame, "storage_path", "storagePath") || "",
        )
        if (!storagePath) return []
        return [{
          relativeFrame: finiteNumber(
            snakeValue(frame, "relative_frame", "relativeFrame"),
          ),
          frameOrdinal: finiteNumber(
            snakeValue(frame, "frame_ordinal", "frameOrdinal"),
          ),
          framePtsNanos: String(
            snakeValue(frame, "frame_pts_nanos", "framePtsNanos") || "0",
          ),
          wallClockUnixMs: finiteNumber(
            snakeValue(frame, "wall_clock_unix_ms", "wallClockUnixMs"),
          ),
          isSystemReady: Boolean(
            snakeValue(frame, "is_system_ready", "isSystemReady"),
          ),
          storagePath,
          url: null,
        }]
      }).sort((left, right) => left.relativeFrame - right.relativeFrame),
    }]
  })
}

function parseReadyTraceIntervals(value: unknown): ReadyTraceInterval[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((raw): ReadyTraceInterval[] => {
    if (!raw || typeof raw !== "object") return []
    const interval = raw as Record<string, unknown>
    const startUnixMs = finiteNumber(
      snakeValue(interval, "start_unix_ms", "startUnixMs"),
      Number.NaN,
    )
    const endUnixMs = finiteNumber(
      snakeValue(interval, "end_unix_ms", "endUnixMs"),
      Number.NaN,
    )
    const frameCount = finiteNumber(
      snakeValue(interval, "frame_count", "frameCount"),
    )
    if (
      !Number.isFinite(startUnixMs)
      || !Number.isFinite(endUnixMs)
      || endUnixMs < startUnixMs
      || frameCount < 1
    ) {
      return []
    }
    return [{ startUnixMs, endUnixMs, frameCount }]
  }).sort((left, right) => left.startUnixMs - right.startUnixMs)
}

function medianNumber(values: number[]) {
  const sorted = [...values].sort((left, right) => left - right)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2
}

function missingEvidenceSchema(error: { code?: string; message?: string } | null) {
  if (!error) return false
  return (
    error.code === "42P01"
    || error.code === "PGRST205"
    || /detection_evidence_(sessions|reviews)/i.test(error.message || "")
  )
}

function stableUuid(input: string) {
  const bytes = createHash("sha256").update(input).digest().subarray(0, 16)
  bytes[6] = (bytes[6] & 0x0f) | 0x50
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = bytes.toString("hex")
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

function consistencySample(windowId: string) {
  return createHash("sha256").update(`trackspeed:review-recheck:${windowId}`).digest()[0] < 26
}

export async function GET(request: Request) {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const url = new URL(request.url)
  const days = boundedInteger(url.searchParams.get("days"), 7, 1, 365)
  const since = currentDetectionReviewSince(days)
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("detection_evidence_sessions")
    .select(sessionSelect)
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(100)

  if (missingEvidenceSchema(error)) {
    return NextResponse.json({
      available: false,
      reason: "The additive detection-evidence migration has not been applied yet.",
      sessions: [],
      physicalCrossings: [],
      reviewItems: [],
    })
  }
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const sessions = ((data || []) as unknown as EvidenceSessionRow[]).map((row) => ({
    ...row,
    startedUnixMs: finiteNumber(row.started_unix_ms),
    firstReadyUnixMs: nullableNumber(row.first_ready_unix_ms),
    lastReadyUnixMs: nullableNumber(row.last_ready_unix_ms),
    lastFrameUnixMs: nullableNumber(row.last_frame_unix_ms),
    readyTraceIntervals: parseReadyTraceIntervals(row.ready_trace_intervals),
    endedUnixMs: finiteNumber(row.ended_unix_ms),
    windows: parseWindows(row.windows_manifest),
  }))
  const sessionIds = sessions.map((session) => session.id)
  const { data: reviewData, error: reviewError } = sessionIds.length
    ? await supabase
        .from("detection_evidence_reviews")
        .select(reviewSelect)
        .in("evidence_session_id", sessionIds)
        .order("review_round", { ascending: false })
    : { data: [], error: null }
  if (reviewError && !missingEvidenceSchema(reviewError)) {
    return NextResponse.json({ error: reviewError.message }, { status: 500 })
  }
  const reviews = (reviewData || []) as unknown as EvidenceReviewRow[]

  const storagePaths = [...new Set(
    sessions.flatMap((session) =>
      session.windows.flatMap((window) =>
        window.previewFrames.map((frame) => frame.storagePath))),
  )]
  const signedUrlByPath = new Map<string, string>()
  for (let offset = 0; offset < storagePaths.length; offset += 100) {
    const paths = storagePaths.slice(offset, offset + 100)
    const { data: signedData } = await supabase.storage
      .from("race-photos")
      .createSignedUrls(paths, 60 * 60)
    for (const item of signedData || []) {
      if (item.path && item.signedUrl) {
        signedUrlByPath.set(item.path, item.signedUrl)
      }
    }
  }
  sessions.forEach((session) => {
    session.windows.forEach((window) => {
      window.previewFrames.forEach((frame) => {
        frame.url = signedUrlByPath.get(frame.storagePath) || null
      })
    })
  })

  const concurrentGroupRecords = clusterConcurrentEvidenceSessions(sessions)
    .map((sessionGroup) => {
      const sourceIds = sessionGroup
        .map((session) => `${session.device_id}:${session.id}`)
        .sort()
      return {
        concurrentGroupId: stableUuid(
          `trackspeed:evidence-group:${sourceIds.join("|")}`,
        ),
        sessions: sessionGroup,
      }
    })
  const concurrentGroupIdBySessionId = new Map(
    concurrentGroupRecords.flatMap((group) =>
      group.sessions.map(
        (session) => [session.id, group.concurrentGroupId] as const,
      ),
    ),
  )
  const physicalCrossings = concurrentGroupRecords
    .flatMap(({ sessions: sessionGroup, concurrentGroupId }) => {
      const acceptedEvents = sessionGroup.flatMap((session) =>
        session.windows
          .filter((window) => window.outcome === "accepted")
          .map((window) => ({
            session,
            window,
            eventWallClockUnixMs: window.eventWallClockUnixMs,
          })),
      )
      return clusterEvidenceEvents(acceptedEvents).map((events) => {
        const eventUnixMs = Math.round(
          medianNumber(events.map((event) => event.eventWallClockUnixMs)),
        )
        const sourceIds = events
          .map(({ session, window }) => `${session.device_id}:${window.id}`)
          .sort()
        const physicalCrossingId = stableUuid(
          `trackspeed:physical-crossing:${eventUnixMs}:${sourceIds.join("|")}`,
        )
        const devices = sessionGroup.map((session) => {
          const local = session.windows
            .map((window) => ({
              window,
              deltaMs: window.eventWallClockUnixMs - eventUnixMs,
            }))
            .filter(({ deltaMs }) => Math.abs(deltaMs) <= 750)
            .sort(
              (left, right) => Math.abs(left.deltaMs) - Math.abs(right.deltaMs),
            )[0]
          const setup = evidenceSetupStatus(
            eventUnixMs,
            session.firstReadyUnixMs,
            session.lastFrameUnixMs,
            session.readyTraceIntervals,
          )
          return {
            evidenceSessionId: session.id,
            sessionId: session.session_id,
            deviceId: session.device_id,
            deviceModel: session.device_model,
            status: local?.window.outcome === "accepted"
              ? "accepted"
              : setup === "covered"
                ? local?.window.outcome === "missed_candidate"
                  ? "missed_candidate"
                  : "trace_only_miss"
                : setup,
            windowId:
              local?.window.outcome === "accepted" || setup === "covered"
                ? local?.window.id || null
                : null,
            deltaMs:
              local?.window.outcome === "accepted" || setup === "covered"
                ? local?.deltaMs || null
                : null,
          }
        })
        return {
          physicalCrossingId,
          concurrentGroupId,
          eventUnixMs,
          referenceCount: events.length,
          devices,
        }
      })
    })
    .sort((left, right) => right.eventUnixMs - left.eventUnixMs)

  const crossingByWindow = new Map<string, string>()
  physicalCrossings.forEach((crossing) => {
    crossing.devices.forEach((device) => {
      if (device.windowId) {
        crossingByWindow.set(device.windowId, crossing.physicalCrossingId)
      }
    })
  })
  const reviewByKey = new Map(
    reviews.map((review) => [
      `${review.evidence_session_id}:${review.window_id}:${review.review_round}`,
      review,
    ]),
  )
  const reviewItems = sessions.flatMap((session) =>
    session.windows
      .filter((window) => window.outcome === "missed_candidate")
      .map((window) => {
        const physicalCrossingId = crossingByWindow.get(window.id) || null
        return {
          evidenceSessionId: session.id,
          sourceSessionId: session.session_id,
          deviceId: session.device_id,
          deviceModel: session.device_model,
          appVersion: session.app_version,
          appBuild: session.app_build,
          detectorRevision: session.detector_revision,
          processWidth: session.process_width,
          processHeight: session.process_height,
          gateX: session.configured_gate_column / session.process_width,
          traceTruncated: session.trace_truncated,
          concurrentGroupId:
            concurrentGroupIdBySessionId.get(session.id) || null,
          physicalCrossingId,
          suggestedLabel: physicalCrossingId ? "true_crossing" : "hard_negative",
          consistencySample: consistencySample(window.id),
          window,
          reviews: {
            round1: reviewByKey.get(`${session.id}:${window.id}:1`) || null,
            round2: reviewByKey.get(`${session.id}:${window.id}:2`) || null,
          },
        }
      }),
  ).sort(
    (left, right) =>
      right.window.eventWallClockUnixMs - left.window.eventWallClockUnixMs,
  )

  return NextResponse.json({
    available: true,
    generatedAt: new Date().toISOString(),
    windowDays: days,
    sessions: sessions.map((session) => ({
      id: session.id,
      sessionId: session.session_id,
      deviceId: session.device_id,
      deviceModel: session.device_model,
      appVersion: session.app_version,
      appBuild: session.app_build,
      traceFrameCount: session.trace_frame_count,
      traceTruncated: session.trace_truncated,
      evidenceRecorderAverageMs: finiteNumber(
        session.evidence_recorder_average_ms,
      ),
      evidenceRecorderMaxMs: finiteNumber(session.evidence_recorder_max_ms),
      evidenceRecorderOverBudgetFraction: finiteNumber(
        session.evidence_recorder_over_budget_fraction,
      ),
      firstReadyUnixMs: session.firstReadyUnixMs,
      lastFrameUnixMs: session.lastFrameUnixMs,
      readyTraceIntervals: session.readyTraceIntervals,
      acceptedWindowCount: session.accepted_window_count,
      missedCandidateWindowCount: session.missed_candidate_window_count,
    })),
    physicalCrossings,
    reviewItems,
  })
}

export async function POST(request: Request) {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 })
  }

  const body = (await request.json()) as Record<string, unknown>
  if (!isUuid(body.evidenceSessionId) || !isUuid(body.windowId)) {
    return NextResponse.json({ error: "Invalid evidence window identity" }, { status: 400 })
  }
  if (!isDetectionEvidenceReviewLabel(body.label)) {
    return NextResponse.json({ error: "Invalid evidence label" }, { status: 400 })
  }
  const reviewRound = Number(body.reviewRound ?? 1)
  if (![1, 2].includes(reviewRound)) {
    return NextResponse.json({ error: "Invalid review round" }, { status: 400 })
  }
  const actualX = normalizedCoordinate(body.actualX)
  const actualY = normalizedCoordinate(body.actualY)
  if (
    actualX === undefined
    || actualY === undefined
    || (actualX === null) !== (actualY === null)
  ) {
    return NextResponse.json({ error: "Invalid review point" }, { status: 400 })
  }
  if (body.label === "true_crossing" && actualX === null) {
    return NextResponse.json(
      { error: "Mark the torso edge for a true crossing" },
      { status: 400 },
    )
  }
  if (body.label !== "true_crossing" && actualX !== null) {
    return NextResponse.json(
      { error: "Only a true crossing can include a torso point" },
      { status: 400 },
    )
  }
  const physicalCrossingId = body.physicalCrossingId === null
    || body.physicalCrossingId === undefined
    ? null
    : isUuid(body.physicalCrossingId)
      ? body.physicalCrossingId
      : undefined
  if (physicalCrossingId === undefined) {
    return NextResponse.json({ error: "Invalid physical crossing identity" }, { status: 400 })
  }

  const selectedRelativeFrame = Number(body.selectedRelativeFrame)
  if (!Number.isInteger(selectedRelativeFrame) || selectedRelativeFrame < -8 || selectedRelativeFrame > 2) {
    return NextResponse.json({ error: "Invalid selected evidence frame" }, { status: 400 })
  }
  const note = typeof body.note === "string" ? body.note.trim().slice(0, 500) : ""
  const supabase = getSupabaseAdmin()
  const { data: source, error: sourceError } = await supabase
    .from("detection_evidence_sessions")
    .select("id,user_id,windows_manifest")
    .eq("id", body.evidenceSessionId)
    .single()
  if (sourceError || !source) {
    return NextResponse.json({ error: "Evidence session was not found" }, { status: 404 })
  }
  const window = parseWindows(source.windows_manifest).find(
    (candidate) => candidate.id === body.windowId,
  )
  if (
    !window
    || !window.previewFrames.some(
      (frame) => frame.relativeFrame === selectedRelativeFrame,
    )
  ) {
    return NextResponse.json({ error: "Evidence frame was not found" }, { status: 404 })
  }
  if (reviewRound === 2) {
    if (!consistencySample(window.id)) {
      return NextResponse.json({ error: "This row is not in the consistency sample" }, { status: 409 })
    }
    const { count } = await supabase
      .from("detection_evidence_reviews")
      .select("id", { count: "exact", head: true })
      .eq("evidence_session_id", source.id)
      .eq("window_id", window.id)
      .eq("review_round", 1)
    if (!count) {
      return NextResponse.json({ error: "Complete round one first" }, { status: 409 })
    }
  }

  const savedAt = new Date().toISOString()
  const record = {
    user_id: source.user_id,
    evidence_session_id: source.id,
    window_id: window.id,
    physical_crossing_id: physicalCrossingId,
    review_round: reviewRound,
    label: body.label,
    selected_relative_frame: selectedRelativeFrame,
    actual_x: actualX,
    actual_y: actualY,
    note: note || null,
    updated_at: savedAt,
  }
  const { data: saved, error: saveError } = await supabase
    .from("detection_evidence_reviews")
    .upsert(record, {
      onConflict: "user_id,evidence_session_id,window_id,review_round",
    })
    .select(reviewSelect)
    .single()
  if (saveError || !saved) {
    return NextResponse.json(
      { error: saveError?.message || "Failed to save evidence review" },
      { status: 500 },
    )
  }
  return NextResponse.json({ review: saved })
}
