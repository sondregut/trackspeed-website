export const DETECTION_EVIDENCE_REVIEW_LABELS = [
  "true_crossing",
  "hard_negative",
  "not_ready",
  "ignore",
] as const

export type DetectionEvidenceReviewLabel =
  (typeof DETECTION_EVIDENCE_REVIEW_LABELS)[number]

export interface EvidencePreviewFrame {
  relativeFrame: number
  frameOrdinal: number
  framePtsNanos: string
  wallClockUnixMs: number
  isSystemReady: boolean
  storagePath: string
  url: string | null
}

export interface EvidenceWindow {
  id: string
  sequenceId: number
  outcome: "accepted" | "missed_candidate"
  reason: string
  eventWallClockUnixMs: number
  targetFrameOrdinal: number
  targetFramePtsNanos: string
  completionReason: string
  rawRunMax: number
  mergedRunMax: number
  gateBandMaxColumns: number
  gateBandMaxPixels: number
  candidateFrames: number
  lastRejectReason: string
  shadow: {
    wouldAccept: boolean
    reason: string
    sequenceFrames: number
    mergedRun: number
    gateBandColumns: number
    gateBandPixels: number
    localRun: number
    blobHeightFraction: number | null
    blobWidthFraction: number | null
  }
  previewFrames: EvidencePreviewFrame[]
}

export interface ReadyTraceInterval {
  startUnixMs: number
  endUnixMs: number
  frameCount: number
}

export function isDetectionEvidenceReviewLabel(
  value: unknown,
): value is DetectionEvidenceReviewLabel {
  return (
    typeof value === "string"
    && (DETECTION_EVIDENCE_REVIEW_LABELS as readonly string[]).includes(value)
  )
}

export function clusterEvidenceEvents<T extends {
  eventWallClockUnixMs: number
}>(
  events: T[],
  toleranceMs = 750,
): T[][] {
  const sorted = [...events].sort(
    (left, right) => left.eventWallClockUnixMs - right.eventWallClockUnixMs,
  )
  const clusters: T[][] = []
  for (const event of sorted) {
    const current = clusters.at(-1)
    if (!current) {
      clusters.push([event])
      continue
    }
    const timestamps = current
      .map((item) => item.eventWallClockUnixMs)
      .sort((a, b) => a - b)
    const center = timestamps[Math.floor(timestamps.length / 2)]
    if (Math.abs(event.eventWallClockUnixMs - center) <= toleranceMs) {
      current.push(event)
    } else {
      clusters.push([event])
    }
  }
  return clusters
}

export function clusterConcurrentEvidenceSessions<T extends {
  startedUnixMs: number
  endedUnixMs: number
}>(
  sessions: T[],
  overlapSlackMs = 1_000,
): T[][] {
  const sorted = [...sessions].sort(
    (left, right) => left.startedUnixMs - right.startedUnixMs,
  )
  const groups: Array<{ sessions: T[]; maximumEndUnixMs: number }> = []
  for (const session of sorted) {
    const current = groups.at(-1)
    if (
      current
      && session.startedUnixMs <= current.maximumEndUnixMs + overlapSlackMs
    ) {
      current.sessions.push(session)
      current.maximumEndUnixMs = Math.max(
        current.maximumEndUnixMs,
        session.endedUnixMs,
      )
    } else {
      groups.push({
        sessions: [session],
        maximumEndUnixMs: session.endedUnixMs,
      })
    }
  }
  return groups.map((group) => group.sessions)
}

export function evidenceSetupStatus(
  eventUnixMs: number,
  firstReadyUnixMs: number | null,
  lastFrameUnixMs: number | null,
  readyTraceIntervals: ReadyTraceInterval[] | null = null,
  toleranceMs = 150,
): "covered" | "before_ready" | "after_coverage" | "capture_gap" | "unmeasured" {
  if (firstReadyUnixMs === null || lastFrameUnixMs === null) return "unmeasured"
  if (eventUnixMs < firstReadyUnixMs) return "before_ready"
  if (eventUnixMs > lastFrameUnixMs + toleranceMs) return "after_coverage"
  if (readyTraceIntervals === null) return "covered"
  if (readyTraceIntervals.length === 0) return "unmeasured"
  return readyTraceIntervals.some(
    (interval) =>
      eventUnixMs >= interval.startUnixMs - toleranceMs
      && eventUnixMs <= interval.endUnixMs + toleranceMs,
  )
    ? "covered"
    : "capture_gap"
}
