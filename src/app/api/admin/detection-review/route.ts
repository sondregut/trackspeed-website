import { createHash } from "node:crypto"
import { NextResponse } from "next/server"
import { verifyAdminSession } from "@/lib/admin-auth"
import {
  ADMIN_REVIEW_DEVICE_ID,
  ADMIN_REVIEW_SCHEMA,
  adminReviewKey,
  detectionReviewIdentityKey,
  detectorDisplayPosition,
  isDetectionReviewIssue,
  isSessionShirtContrast,
  isUuid,
  normalizedCoordinate,
  normalizeReviewTarget,
} from "@/lib/detection-review"
import { getSupabaseAdmin } from "@/lib/supabase"

export const runtime = "nodejs"

interface CaptureRow {
  id: string
  session_id: string | null
  run_id: string
  run_number: number
  gate_label: string
  device_id: string
  app_version: string | null
  device_model: string | null
  detector_trigger_frame_pts_nanos: number | string | null
  detector_chosen_frame_pts_nanos: number | string | null
  saved_thumbnail_frame_pts_nanos: number | string | null
  configured_gate_position: number
  detector_position: number
  interpolated_display_position: number | null
  projected_display_position: number | null
  algo_interpolation_alpha: number
  algo_velocity_px_per_sec: number
  algo_blob_height_fraction: number
  algo_blob_width_fraction: number | null
  algo_gate_position: number
  algo_fps: number
  algo_crossing_direction: string | null
  algo_work_width: number | null
  algo_s0: number | null
  algo_s1: number | null
  thumbnail_storage_path: string | null
  created_at: string
  updated_at: string
}

interface ReviewMarkRow {
  id: string
  created_at: string
  review_key: string
  session_id: string | null
  device_id: string
  device_model: string | null
  app_version: string | null
  run_number: number
  gate_label: string | null
  target: string | null
  mode: string | null
  crossing_direction: string | null
  issue: string | null
  actual_x: number | null
  actual_y: number | null
  detector_x: number
  detector_y: number | null
  delta_x: number | null
  delta_y: number | null
  note: string | null
  thumbnail_storage_path: string | null
}

interface SessionContextRow {
  id: string
  session_id: string
  evidence_correlation_id: string | null
  local_race_session_id: string | null
  cloud_session_id: string | null
  device_id: string
  timing_mode: string | null
  run_count: number | null
  local_role: string | null
  gate_index: number | null
  app_version: string | null
  device_model: string | null
  created_at: string
  updated_at: string
  shirt_color: string | null
  shirt_contrast: string | null
  notes: string | null
}

const captureSelect = [
  "id",
  "session_id",
  "run_id",
  "run_number",
  "gate_label",
  "device_id",
  "app_version",
  "device_model",
  "detector_trigger_frame_pts_nanos",
  "detector_chosen_frame_pts_nanos",
  "saved_thumbnail_frame_pts_nanos",
  "configured_gate_position",
  "detector_position",
  "interpolated_display_position",
  "projected_display_position",
  "algo_interpolation_alpha",
  "algo_velocity_px_per_sec",
  "algo_blob_height_fraction",
  "algo_blob_width_fraction",
  "algo_gate_position",
  "algo_fps",
  "algo_crossing_direction",
  "algo_work_width",
  "algo_s0",
  "algo_s1",
  "thumbnail_storage_path",
  "created_at",
  "updated_at",
].join(",")

const markSelect = [
  "id",
  "created_at",
  "review_key",
  "session_id",
  "device_id",
  "device_model",
  "app_version",
  "run_number",
  "gate_label",
  "target",
  "mode",
  "crossing_direction",
  "issue",
  "actual_x",
  "actual_y",
  "detector_x",
  "detector_y",
  "delta_x",
  "delta_y",
  "note",
  "thumbnail_storage_path",
].join(",")

const sessionContextSelect = [
  "id",
  "session_id",
  "evidence_correlation_id",
  "local_race_session_id",
  "cloud_session_id",
  "device_id",
  "timing_mode",
  "run_count",
  "local_role",
  "gate_index",
  "app_version",
  "device_model",
  "created_at",
  "updated_at",
  "shirt_color",
  "shirt_contrast",
  "notes",
].join(",")

function boundedInteger(value: string | null, fallback: number, min: number, max: number) {
  const parsed = Number.parseInt(value || "", 10)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(max, Math.max(min, parsed))
}

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

function publicReview(mark: ReviewMarkRow | null) {
  if (!mark) return null
  return {
    id: mark.id,
    createdAt: mark.created_at,
    issue: mark.issue || "unlabeled",
    actualX: mark.actual_x,
    actualY: mark.actual_y,
    detectorX: mark.detector_x,
    detectorY: mark.detector_y,
    deltaX: mark.delta_x,
    deltaY: mark.delta_y,
    note: mark.note || "",
    hasReviewImage: Boolean(mark.thumbnail_storage_path),
    source: mark.device_id === ADMIN_REVIEW_DEVICE_ID ? "admin" : "app",
  }
}

function publicSessionContext(context: SessionContextRow) {
  return {
    id: context.id,
    sessionId: context.session_id,
    updatedAt: context.updated_at || context.created_at,
    shirtColor: context.shirt_color || "",
    shirtContrast: context.shirt_contrast || "",
    notes: context.notes || "",
  }
}

function publicSessionEvidence(context: SessionContextRow) {
  return {
    id: context.id,
    sessionId: context.session_id,
    evidenceCorrelationId: context.evidence_correlation_id,
    localRaceSessionId: context.local_race_session_id,
    cloudSessionId: context.cloud_session_id,
    deviceId: context.device_id,
    timingMode: context.timing_mode,
    expectedRunCount: context.run_count,
    localRole: context.local_role,
    gateIndex: context.gate_index,
    appVersion: context.app_version,
    deviceModel: context.device_model,
    createdAt: context.created_at,
  }
}

async function loadSessionContexts(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  since: string,
): Promise<SessionContextRow[]> {
  const pageSize = 500
  const rows: SessionContextRow[] = []
  let offset = 0

  while (true) {
    const { data, error } = await supabase
      .from("session_test_context")
      .select(sessionContextSelect)
      .gte("created_at", since)
      .order("updated_at", { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (error) throw new Error(error.message)
    const page = (data || []) as unknown as SessionContextRow[]
    rows.push(...page)
    if (page.length < pageSize) return rows
    offset += page.length
  }
}

async function loadAppReviewMarks(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  since: string,
): Promise<ReviewMarkRow[]> {
  const pageSize = 500
  const rows: ReviewMarkRow[] = []
  let offset = 0

  while (true) {
    const { data, error } = await supabase
      .from("crossing_review_marks")
      .select(markSelect)
      .neq("device_id", ADMIN_REVIEW_DEVICE_ID)
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (error) throw new Error(error.message)
    const page = (data || []) as unknown as ReviewMarkRow[]
    rows.push(...page)
    if (page.length < pageSize) return rows
    offset += page.length
  }
}

function adminSessionContextId(sessionId: string): string {
  const bytes = createHash("sha256")
    .update(`trackspeed:admin-session-context:${sessionId.toLowerCase()}`)
    .digest()
    .subarray(0, 16)
  bytes[6] = (bytes[6] & 0x0f) | 0x50
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = bytes.toString("hex")
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

export async function GET(request: Request) {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const url = new URL(request.url)
    const days = boundedInteger(url.searchParams.get("days"), 30, 1, 365)
    const limit = boundedInteger(url.searchParams.get("limit"), 160, 1, 300)
    const offset = boundedInteger(url.searchParams.get("offset"), 0, 0, 100_000)
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
    const supabase = getSupabaseAdmin()

    const { data: captureData, error: captureError, count: captureCount } = await supabase
      .from("crossing_debug_captures")
      .select(captureSelect, { count: "exact" })
      .not("thumbnail_storage_path", "is", null)
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (captureError) {
      return NextResponse.json({ error: captureError.message }, { status: 500 })
    }

    const captures = (captureData || []) as unknown as CaptureRow[]
    const reviewKeys = captures.map((capture) => adminReviewKey(capture.id))
    const [markResult, appMarks, sessionContexts] = await Promise.all([
      reviewKeys.length > 0
        ? supabase
            .from("crossing_review_marks")
            .select(markSelect)
            .eq("device_id", ADMIN_REVIEW_DEVICE_ID)
            .in("review_key", reviewKeys)
        : Promise.resolve({ data: [], error: null }),
      loadAppReviewMarks(supabase, since),
      offset === 0 ? loadSessionContexts(supabase, since) : Promise.resolve([]),
    ])

    if (markResult.error) {
      return NextResponse.json({ error: markResult.error.message }, { status: 500 })
    }
    const adminMarks = (markResult.data || []) as unknown as ReviewMarkRow[]
    const latestAdminContextBySession = new Map<string, SessionContextRow>()
    const latestDeviceContextBySession = new Map<string, SessionContextRow>()
    const latestEvidenceByDeviceSession = new Map<string, SessionContextRow>()
    sessionContexts.forEach((context) => {
      if (context.device_id === ADMIN_REVIEW_DEVICE_ID) {
        if (!latestAdminContextBySession.has(context.session_id)) {
          latestAdminContextBySession.set(context.session_id, context)
        }
        return
      }

      if (!latestDeviceContextBySession.has(context.session_id)) {
        latestDeviceContextBySession.set(context.session_id, context)
      }
      const evidenceKey = [
        context.evidence_correlation_id || context.local_race_session_id || context.session_id,
        context.device_id,
      ].join(":")
      if (!latestEvidenceByDeviceSession.has(evidenceKey)) {
        latestEvidenceByDeviceSession.set(evidenceKey, context)
      }
    })

    const mergedSessionContexts = new Map<string, SessionContextRow>()
    latestDeviceContextBySession.forEach((context, sessionId) => {
      mergedSessionContexts.set(sessionId, context)
    })
    latestAdminContextBySession.forEach((context, sessionId) => {
      const deviceContext = mergedSessionContexts.get(sessionId)
      mergedSessionContexts.set(sessionId, {
        ...deviceContext,
        ...context,
        shirt_color: context.shirt_color || deviceContext?.shirt_color || null,
        shirt_contrast: context.shirt_contrast || deviceContext?.shirt_contrast || null,
        notes: context.notes || deviceContext?.notes || null,
      })
    })

    const adminMarksByKey = new Map(adminMarks.map((mark) => [mark.review_key, mark]))
    const latestAppMarksByIdentity = new Map<string, ReviewMarkRow>()
    for (const mark of appMarks) {
      const identity = detectionReviewIdentityKey(
        mark.session_id,
        mark.run_number,
        mark.target || mark.gate_label,
      )
      if (identity && !latestAppMarksByIdentity.has(identity)) {
        latestAppMarksByIdentity.set(identity, mark)
      }
    }

    const captureIdentityKeys = new Set<string>()
    const captureRows = captures.map((capture) => {
      const target = normalizeReviewTarget(capture.gate_label)
      const identity = detectionReviewIdentityKey(capture.session_id, capture.run_number, target)
      if (identity) captureIdentityKeys.add(identity)
      const review =
        adminMarksByKey.get(adminReviewKey(capture.id)) ||
        (identity ? latestAppMarksByIdentity.get(identity) : null) ||
        null
      return {
        id: capture.id,
        source: "debug_capture" as const,
        editable: true,
        sessionId: capture.session_id,
        deviceId: capture.device_id,
        runId: capture.run_id,
        runNumber: capture.run_number,
        gateLabel: capture.gate_label,
        target,
        mode: target === "crossing" || target === "lap" ? "solo" : "multi",
        appVersion: capture.app_version,
        deviceModel: capture.device_model,
        createdAt: capture.created_at,
        direction: capture.algo_crossing_direction,
        detectorX: detectorDisplayPosition(capture),
        configuredGateX: capture.configured_gate_position,
        blobHeightFraction: capture.algo_blob_height_fraction,
        blobWidthFraction: capture.algo_blob_width_fraction,
        fps: capture.algo_fps,
        imageUrl: `/api/admin/detection-review/image?id=${encodeURIComponent(capture.id)}`,
        review: publicReview(review),
      }
    })

    const appOnlyRows = offset === 0
      ? [...latestAppMarksByIdentity.entries()]
          .filter(([, mark]) => Boolean(mark.thumbnail_storage_path))
          .filter(([identity]) => !captureIdentityKeys.has(identity))
          .map(([, mark]) => {
            const target = normalizeReviewTarget(mark.target || mark.gate_label)
            return {
              id: mark.id,
              source: "app_mark" as const,
              editable: false,
              sessionId: mark.session_id,
              deviceId: mark.device_id,
              runId: mark.id,
              runNumber: mark.run_number,
              gateLabel: mark.gate_label || "Crossing",
              target,
              mode: mark.mode || (target === "crossing" || target === "lap" ? "solo" : "multi"),
              appVersion: mark.app_version,
              deviceModel: mark.device_model,
              createdAt: mark.created_at,
              direction: mark.crossing_direction,
              detectorX: Math.min(1, Math.max(0, mark.detector_x)),
              configuredGateX: Math.min(1, Math.max(0, mark.detector_x)),
              blobHeightFraction: null,
              blobWidthFraction: null,
              fps: null,
              imageUrl: `/api/admin/detection-review/image?markId=${encodeURIComponent(mark.id)}`,
              review: publicReview(mark),
            }
          })
      : []

    const rows = [...appOnlyRows, ...captureRows].sort(
      (left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt),
    )
    const baseTotal = captureCount ?? offset + captures.length

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      windowDays: days,
      captures: rows,
      sessionContexts: [...mergedSessionContexts.values()].map(publicSessionContext),
      sessionEvidence: [...latestEvidenceByDeviceSession.values()].map(publicSessionEvidence),
      pagination: {
        offset,
        limit,
        nextOffset: offset + captures.length,
        total: baseTotal + (offset === 0 ? appOnlyRows.length : 0),
        hasMore: offset + captures.length < baseTotal,
      },
      counts: {
        total: rows.length,
        reviewed: rows.filter((row) => row.review).length,
        pending: rows.filter((row) => !row.review).length,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load detection review queue" },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 })
  }

  try {
    const body = (await request.json()) as Record<string, unknown>
    if (body.action === "save-session-context") {
      if (!isUuid(body.sessionId)) {
        return NextResponse.json({ error: "A valid sessionId is required" }, { status: 400 })
      }

      const shirtColor = typeof body.shirtColor === "string" ? body.shirtColor.trim().slice(0, 80) : ""
      const shirtContrast = body.shirtContrast === "" || body.shirtContrast === null
        ? null
        : isSessionShirtContrast(body.shirtContrast)
          ? body.shirtContrast
          : undefined
      const notes = typeof body.notes === "string" ? body.notes.trim().slice(0, 1500) : ""
      if (shirtContrast === undefined) {
        return NextResponse.json({ error: "Invalid shirt contrast" }, { status: 400 })
      }
      if (!shirtColor && !shirtContrast && !notes) {
        return NextResponse.json(
          { error: "Add a shirt color, contrast rating, or session note before saving" },
          { status: 400 },
        )
      }

      const supabase = getSupabaseAdmin()
      const { data: linkedCapture, error: linkedCaptureError } = await supabase
        .from("crossing_debug_captures")
        .select("session_id,app_version,device_model")
        .eq("session_id", body.sessionId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (linkedCaptureError) {
        return NextResponse.json({ error: linkedCaptureError.message }, { status: 500 })
      }
      let linkedEvidence: { app_version: string | null; device_model: string | null } | null = linkedCapture
      if (!linkedEvidence) {
        const { data: linkedMark, error: linkedMarkError } = await supabase
          .from("crossing_review_marks")
          .select("app_version,device_model")
          .eq("session_id", body.sessionId)
          .neq("device_id", ADMIN_REVIEW_DEVICE_ID)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle()

        if (linkedMarkError) {
          return NextResponse.json({ error: linkedMarkError.message }, { status: 500 })
        }
        linkedEvidence = linkedMark
      }
      if (!linkedEvidence) {
        return NextResponse.json({ error: "Detection session was not found" }, { status: 404 })
      }

      const savedAt = new Date().toISOString()
      const context = {
        id: adminSessionContextId(body.sessionId),
        session_id: body.sessionId,
        cloud_session_id: body.sessionId,
        evidence_correlation_id: body.sessionId,
        device_id: ADMIN_REVIEW_DEVICE_ID,
        app_version: linkedEvidence.app_version,
        device_model: linkedEvidence.device_model,
        shirt_color: shirtColor || null,
        shirt_contrast: shirtContrast,
        notes: notes || null,
        created_at: savedAt,
        updated_at: savedAt,
      }
      const { data: contextData, error: contextError } = await supabase
        .from("session_test_context")
        .upsert(context, { onConflict: "id" })
        .select(sessionContextSelect)
        .single()

      if (contextError || !contextData) {
        return NextResponse.json(
          { error: contextError?.message || "Failed to save session notes" },
          { status: 500 },
        )
      }

      return NextResponse.json({
        sessionContext: publicSessionContext(contextData as unknown as SessionContextRow),
      })
    }

    if (!isUuid(body.captureId)) {
      return NextResponse.json({ error: "A valid captureId is required" }, { status: 400 })
    }
    if (!isDetectionReviewIssue(body.issue)) {
      return NextResponse.json({ error: "Invalid review issue" }, { status: 400 })
    }

    const actualX = normalizedCoordinate(body.actualX)
    const actualY = normalizedCoordinate(body.actualY)
    if (actualX === undefined || actualY === undefined || (actualX === null) !== (actualY === null)) {
      return NextResponse.json(
        { error: "Review coordinates must both be null or normalized between 0 and 1" },
        { status: 400 },
      )
    }

    const note = typeof body.note === "string" ? body.note.trim().slice(0, 500) : ""
    if (actualX === null && body.issue === "unlabeled" && !note) {
      return NextResponse.json(
        { error: "Place a mark, choose an issue, or add a note before saving" },
        { status: 400 },
      )
    }

    if (typeof body.reviewImageDataUrl !== "string") {
      return NextResponse.json({ error: "The rendered review image is required" }, { status: 400 })
    }
    const imageMatch = body.reviewImageDataUrl.match(/^data:image\/jpeg;base64,([A-Za-z0-9+/=]+)$/)
    if (!imageMatch) {
      return NextResponse.json({ error: "Review image must be a JPEG data URL" }, { status: 400 })
    }
    const reviewImage = Buffer.from(imageMatch[1], "base64")
    if (
      reviewImage.byteLength < 128 ||
      reviewImage.byteLength > 8 * 1024 * 1024 ||
      reviewImage[0] !== 0xff ||
      reviewImage[1] !== 0xd8 ||
      reviewImage[2] !== 0xff
    ) {
      return NextResponse.json({ error: "Review image is invalid or too large" }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const { data: captureData, error: captureError } = await supabase
      .from("crossing_debug_captures")
      .select(captureSelect)
      .eq("id", body.captureId)
      .single()

    if (captureError || !captureData) {
      return NextResponse.json({ error: "Detection capture was not found" }, { status: 404 })
    }

    const capture = captureData as unknown as CaptureRow
    if (!capture.thumbnail_storage_path) {
      return NextResponse.json({ error: "Detection capture has no thumbnail" }, { status: 409 })
    }

    const detectorX = detectorDisplayPosition(capture)
    const target = normalizeReviewTarget(capture.gate_label)
    const reviewKey = adminReviewKey(capture.id)
    const reviewStoragePath = `admin/crossing_review_marks/${capture.id}/review.jpg`
    const { error: uploadError } = await supabase.storage
      .from("race-photos")
      .upload(reviewStoragePath, reviewImage, {
        contentType: "image/jpeg",
        cacheControl: "3600",
        upsert: true,
      })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const createdAt = new Date().toISOString()
    const deltaX = actualX === null ? null : actualX - detectorX
    const rawMessage = [
      "[DETECTION-MARK]",
      "source=admin-dashboard",
      `capture=${capture.id}`,
      `session=${capture.session_id || "nil"}`,
      `run=${capture.run_number}`,
      `target=${target}`,
      `actualX=${actualX === null ? "nil" : actualX.toFixed(4)}`,
      `actualY=${actualY === null ? "nil" : actualY.toFixed(4)}`,
      `detectorX=${detectorX.toFixed(4)}`,
      `deltaX=${deltaX === null ? "nil" : deltaX.toFixed(4)}`,
      `issue=${body.issue}`,
      `reviewSchema=${ADMIN_REVIEW_SCHEMA}`,
    ].join(" ")

    const mark = {
      created_at: createdAt,
      device_id: ADMIN_REVIEW_DEVICE_ID,
      device_model: capture.device_model,
      app_version: capture.app_version,
      session_id: capture.session_id,
      evidence_correlation_id: capture.session_id,
      cloud_session_id: capture.session_id,
      review_key: reviewKey,
      run_number: capture.run_number,
      gate_label: capture.gate_label,
      target,
      mode: target === "crossing" || target === "lap" ? "solo" : "multi",
      crossing_direction: capture.algo_crossing_direction,
      issue: body.issue,
      actual_x: actualX,
      actual_y: actualY,
      detector_x: detectorX,
      detector_y: null,
      delta_x: deltaX,
      delta_y: null,
      interpolation_alpha: capture.algo_interpolation_alpha,
      frame_pick: "admin_dashboard",
      s0: capture.algo_s0,
      s1: capture.algo_s1,
      work_width: capture.algo_work_width,
      detector_trigger_frame_pts: capture.detector_trigger_frame_pts_nanos,
      chosen_thumbnail_frame_pts: capture.detector_chosen_frame_pts_nanos,
      saved_thumbnail_frame_pts: capture.saved_thumbnail_frame_pts_nanos,
      thumbnail_storage_path: reviewStoragePath,
      note: note || null,
      raw_message: rawMessage,
      review_schema: ADMIN_REVIEW_SCHEMA,
    }

    const { data: markData, error: markError } = await supabase
      .from("crossing_review_marks")
      .upsert(mark, { onConflict: "device_id,review_key" })
      .select(markSelect)
      .single()

    if (markError || !markData) {
      return NextResponse.json(
        { error: markError?.message || "Failed to save the review mark" },
        { status: 500 },
      )
    }

    return NextResponse.json({ review: publicReview(markData as unknown as ReviewMarkRow) })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save detection review" },
      { status: 500 },
    )
  }
}
