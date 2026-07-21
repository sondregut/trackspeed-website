import { NextResponse } from "next/server"
import { verifyAdminSession } from "@/lib/admin-auth"
import { isUuid } from "@/lib/detection-review"
import { getSupabaseAdmin } from "@/lib/supabase"

export const runtime = "nodejs"

export async function GET(request: Request) {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const url = new URL(request.url)
  const captureId = url.searchParams.get("id")
  const markId = url.searchParams.get("markId")
  const frameValue = url.searchParams.get("frame")
  const frameIndex = frameValue === null ? null : Number(frameValue)
  if ((!isUuid(captureId) && !isUuid(markId)) || (captureId && markId)) {
    return NextResponse.json({ error: "A valid capture or mark id is required" }, { status: 400 })
  }
  if (
    frameIndex !== null &&
    (markId || !Number.isInteger(frameIndex) || frameIndex < 0 || frameIndex > 47)
  ) {
    return NextResponse.json({ error: "A valid capture frame is required" }, { status: 400 })
  }

  try {
    const supabase = getSupabaseAdmin()
    const id = markId || captureId
    const evidenceResult = markId
      ? await supabase
          .from("crossing_review_marks")
          .select("thumbnail_storage_path")
          .eq("id", id as string)
          .single()
      : await supabase
          .from("crossing_debug_captures")
          .select("thumbnail_storage_path,frames_metadata")
          .eq("id", id as string)
          .single()
    const evidenceError = evidenceResult.error
    const evidence = evidenceResult.data as {
      thumbnail_storage_path: string | null
      frames_metadata?: unknown
    } | null

    if (evidenceError || !evidence?.thumbnail_storage_path) {
      return NextResponse.json({ error: "Thumbnail not found" }, { status: 404 })
    }

    const frames = "frames_metadata" in evidence && Array.isArray(evidence.frames_metadata)
      ? evidence.frames_metadata as Array<Record<string, unknown>>
      : []
    const frame = frameIndex === null ? null : frames[frameIndex]
    const framePath = frame && (frame.storagePath ?? frame.storage_path)
    if (frameIndex !== null && typeof framePath !== "string") {
      return NextResponse.json({ error: "Capture frame not found" }, { status: 404 })
    }
    const reviewPath = typeof framePath === "string" ? framePath : evidence.thumbnail_storage_path
    const rawPath = markId && reviewPath.endsWith("/review.jpg")
      ? reviewPath.replace(/\/review\.jpg$/, "/raw.jpg")
      : null
    const rawResult = rawPath
      ? await supabase.storage.from("race-photos").download(rawPath)
      : null
    const { data: image, error: imageError } = rawResult?.data
      ? rawResult
      : await supabase.storage.from("race-photos").download(reviewPath)

    if (imageError || !image) {
      return NextResponse.json({ error: "Thumbnail download failed" }, { status: 502 })
    }

    return new NextResponse(await image.arrayBuffer(), {
      headers: {
        "Content-Type": image.type || "image/jpeg",
        "Cache-Control": "private, max-age=300",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Thumbnail download failed" },
      { status: 500 },
    )
  }
}
