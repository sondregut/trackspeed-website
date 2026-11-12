"use client"

import { detectionFrameGateLineRect } from "@/lib/detection-review"

export interface DetectionFrameDownload {
  /** Same-origin admin image URL of the stored frame (no overlays in the file). */
  url: string
  /** Normalized X of the red line the review page draws. */
  detectorX: number
  filename: string
}

const GATE_LINE_COLOR = "#FF3B30"

/**
 * Save the stored frame at its full stored size with only the red gate line
 * drawn on it: no yellow dot, no review point, no page chrome. One file in
 * Downloads; no new tab.
 */
export async function downloadDetectionFrame({ url, detectorX, filename }: DetectionFrameDownload): Promise<void> {
  const response = await fetch(url, { credentials: "same-origin" })
  if (!response.ok) throw new Error(`The frame could not be loaded (${response.status})`)
  const bitmap = await createImageBitmap(await response.blob())

  const canvas = document.createElement("canvas")
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  const context = canvas.getContext("2d")
  if (!context) {
    bitmap.close()
    throw new Error("This browser could not prepare the image")
  }
  context.drawImage(bitmap, 0, 0)
  bitmap.close()

  const line = detectionFrameGateLineRect(canvas.width, detectorX)
  context.fillStyle = GATE_LINE_COLOR
  context.fillRect(line.left, 0, line.width, canvas.height)

  const jpeg = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("The image could not be encoded"))),
      "image/jpeg",
      0.92,
    )
  })

  const objectUrl = URL.createObjectURL(jpeg)
  const link = document.createElement("a")
  link.href = objectUrl
  link.download = filename
  link.rel = "noopener"
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 30_000)
}
