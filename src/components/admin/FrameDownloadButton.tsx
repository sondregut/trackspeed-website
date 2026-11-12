"use client"

import { useState } from "react"
import { downloadDetectionFrame, type DetectionFrameDownload } from "@/lib/detection-frame-download"

interface FrameDownloadButtonProps extends DetectionFrameDownload {
  /** False for frames from other people's phones: they did not agree to be in videos. */
  allowed: boolean
  size?: "sm" | "md"
}

export function FrameDownloadButton({ allowed, size = "sm", ...frame }: FrameDownloadButtonProps) {
  const [state, setState] = useState<"idle" | "saving" | "failed">("idle")
  const [failure, setFailure] = useState("")
  const sizing = size === "md" ? "px-3 py-1.5 text-xs" : "px-2.5 py-1 text-[11px]"

  if (!allowed) {
    return (
      <span
        title="Another person's phone. They shared this frame for detection work, not for videos, so it has no download."
        className={`rounded-lg border border-[#3B4249] font-semibold text-[#6F767C] ${sizing}`}
      >
        Other user · no download
      </span>
    )
  }

  async function save() {
    setState("saving")
    setFailure("")
    try {
      await downloadDetectionFrame(frame)
      setState("idle")
    } catch (error) {
      setFailure(error instanceof Error ? error.message : "Download failed")
      setState("failed")
    }
  }

  return (
    <button
      type="button"
      onClick={save}
      disabled={state === "saving"}
      title={state === "failed" ? failure : `Save ${frame.filename}: the stored frame with the red line, no dot`}
      aria-label={`Download ${frame.filename}`}
      className={`rounded-lg border font-semibold transition active:translate-y-px disabled:cursor-wait ${sizing} ${
        state === "failed"
          ? "border-[#9A5755] text-[#F2B1AE] hover:border-[#C27A77]"
          : "border-[#4D6B80] text-[#CFE1EE] hover:border-[#7FA6C2] hover:text-white"
      }`}
    >
      {state === "saving" ? "Saving…" : state === "failed" ? "Retry download" : "Download"}
    </button>
  )
}
