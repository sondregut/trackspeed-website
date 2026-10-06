// Which photos belong to a run, in gate order. Pure; type imports only.
import type { DashboardRun, RawCrossing } from './types'

export const PHOTO_BUCKET = 'race-photos'

export type ImageSource = { kind: 'path'; path: string } | { kind: 'url'; url: string }

const STORAGE_URL_PATTERN = new RegExp(`/storage/v1/object/(?:public|sign|authenticated)/${PHOTO_BUCKET}/([^?#]+)`)

/**
 * Normalises a stored image reference. Most rows hold a bucket path; a few
 * legacy rows hold a full Supabase URL, which is converted back to a path so
 * it can be signed (the bucket is private).
 */
export function imageSource(value: string | null | undefined): ImageSource | null {
  const trimmed = value?.trim()
  if (!trimmed) return null
  if (/^https?:\/\//i.test(trimmed)) {
    const match = STORAGE_URL_PATTERN.exec(trimmed)
    if (match) {
      try {
        return { kind: 'path', path: decodeURIComponent(match[1]) }
      } catch {
        return { kind: 'path', path: match[1] }
      }
    }
    return { kind: 'url', url: trimmed }
  }
  if (trimmed.startsWith('data:')) return { kind: 'url', url: trimmed }
  const path = trimmed.replace(/^\/+/, '').replace(new RegExp(`^${PHOTO_BUCKET}/`), '')
  return path ? { kind: 'path', path } : null
}

export type RunPhotoSuffix = '' | '_start' | `_lap${number}`

/**
 * Storage paths are case-sensitive and the app writes Swift uuidString
 * (UPPERCASE) ids, while Postgres returns them lowercase.
 */
export function runImagePath(userId: string, runId: string, suffix: RunPhotoSuffix): string {
  return `users/${userId.toUpperCase()}/runs/${runId.toUpperCase()}${suffix}.jpg`
}

/**
 * Path of one of a run's photos. The folder and file stem come from the
 * run's own finish path when it follows the {runId}.jpg convention (keeping
 * its exact casing); otherwise they are built from the ids in uppercase.
 */
export function runPhotoPath(run: Pick<DashboardRun, 'id' | 'userId' | 'finishImage'>, suffix: RunPhotoSuffix): string | null {
  const finish = imageSource(run.finishImage)
  if (finish?.kind === 'path') {
    const match = /^(.*\/)([^/]+)\.jpg$/i.exec(finish.path)
    if (match && match[2].toLowerCase() === run.id.toLowerCase()) return `${match[1]}${match[2]}${suffix}.jpg`
  }
  return run.userId ? runImagePath(run.userId, run.id, suffix) : null
}

export interface RunFrame {
  key: string
  role: 'start' | 'split' | 'finish'
  gate: number
  /** Seconds since the start, or null when unknown. */
  time: number | null
  distance: number | null
  approximate: boolean
  /** Ordered fallbacks; the first one that exists is shown. */
  sources: ImageSource[]
}

function crossingRole(role: string | null): { role: 'start' | 'finish' | 'split'; gate: number | null } | null {
  if (!role) return null
  if (role === 'start') return { role: 'start', gate: 0 }
  if (role === 'finish') return { role: 'finish', gate: null }
  const match = /^split_(\d+)$/.exec(role)
  return match ? { role: 'split', gate: Number(match[1]) } : null
}

/**
 * Start, intermediate gates and finish, each with its candidate images:
 * the per-run upload paths first (users/{uid}/runs/{runId}_start.jpg,
 * _lap{N}.jpg, {runId}.jpg), then any crossings rows for the run.
 */
export function runFrames(run: DashboardRun, crossings: RawCrossing[] = []): RunFrame[] {
  const own = crossings.filter(row => row.run_id === run.id)
  const crossingSources = (role: 'start' | 'finish' | 'split', gate: number | null) =>
    own
      .filter(row => {
        const parsed = crossingRole(row.gate_role)
        return parsed && parsed.role === role && (role !== 'split' || parsed.gate === gate)
      })
      .map(row => imageSource(row.thumbnail_url))
      .filter((source): source is ImageSource => source !== null)

  const userPath = (suffix: RunPhotoSuffix): ImageSource[] => {
    const path = runPhotoPath(run, suffix)
    return path ? [{ kind: 'path', path }] : []
  }

  const lastGate = run.gateCount > 1 ? run.gateCount - 1 : 1
  const frames: RunFrame[] = [
    {
      key: 'start',
      role: 'start',
      gate: 0,
      time: 0,
      distance: run.isLaps ? null : 0,
      approximate: false,
      sources: [...userPath('_start'), ...crossingSources('start', 0)],
    },
  ]

  const intermediateGates = new Set<number>()
  for (const split of run.splits) if (split.toGate > 0 && split.toGate < lastGate) intermediateGates.add(split.toGate)
  for (const row of own) {
    const parsed = crossingRole(row.gate_role)
    if (parsed?.role === 'split' && parsed.gate !== null && parsed.gate > 0 && parsed.gate < lastGate) intermediateGates.add(parsed.gate)
  }
  for (const gate of [...intermediateGates].sort((a, b) => a - b)) {
    const split = run.splits.find(item => item.toGate === gate)
    frames.push({
      key: `lap${gate}`,
      role: 'split',
      gate,
      time: split?.cumulativeSeconds ?? null,
      distance: split?.toDistance ?? null,
      approximate: split?.approximate ?? false,
      sources: [...userPath(`_lap${gate}`), ...crossingSources('split', gate)],
    })
  }

  // The run time is the official finish time; a finish split can differ
  // slightly after gate-line adjustments.
  const finishSource = imageSource(run.finishImage)
  frames.push({
    key: 'finish',
    role: 'finish',
    gate: lastGate,
    time: run.time,
    distance: run.isLaps ? null : run.distance,
    approximate: false,
    sources: dedupeSources([
      ...(finishSource ? [finishSource] : []),
      ...userPath(''),
      ...crossingSources('finish', null),
    ]),
  })
  return frames
}

function dedupeSources(sources: ImageSource[]): ImageSource[] {
  const seen = new Set<string>()
  return sources.filter(source => {
    const id = source.kind === 'path' ? `p:${source.path}` : `u:${source.url}`
    if (seen.has(id)) return false
    seen.add(id)
    return true
  })
}
