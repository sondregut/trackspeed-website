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
  if ((!isUuid(captureId) && !isUuid(markId)) || (captureId && markId)) {
    return NextResponse.json({ error: "A valid capture or mark id is required" }, { status: 400 })
  }

  try {
    const supabase = getSupabaseAdmin()
    const table = markId ? "crossing_review_marks" : "crossing_debug_captures"
    const id = markId || captureId
    const { data: evidence, error: evidenceError } = await supabase
      .from(table)
      .select("thumbnail_storage_path")
      .eq("id", id as string)
      .single()

    if (evidenceError || !evidence?.thumbnail_storage_path) {
      return NextResponse.json({ error: "Thumbnail not found" }, { status: 404 })
    }

    const reviewPath = evidence.thumbnail_storage_path
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
