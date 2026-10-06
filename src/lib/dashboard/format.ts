// Pure formatting helpers: times, speeds, unit conversion, labels and CSV.
// Type-only imports keep this loadable by the node strip-types test runner.
import type { DashboardRun, DashboardSession } from './types'

export type SpeedUnit = 'ms' | 'kmh' | 'mph'

export const SPEED_UNITS: readonly SpeedUnit[] = ['ms', 'kmh', 'mph']

export const SPEED_UNIT_LABEL: Record<SpeedUnit, string> = {
  ms: 'm/s',
  kmh: 'km/h',
  mph: 'mph',
}

const MS_TO_KMH = 3.6
const MS_TO_MPH = 3600 / 1609.344
const YARD = 0.9144

export function isSpeedUnit(value: unknown): value is SpeedUnit {
  return value === 'ms' || value === 'kmh' || value === 'mph'
}

/** Average speed in metres per second, or null when it can't be computed. */
export function speedMs(distanceMeters: number | null, seconds: number): number | null {
  if (distanceMeters === null || !(distanceMeters > 0) || !(seconds > 0)) return null
  return distanceMeters / seconds
}

export function convertSpeed(metresPerSecond: number, unit: SpeedUnit): number {
  if (unit === 'kmh') return metresPerSecond * MS_TO_KMH
  if (unit === 'mph') return metresPerSecond * MS_TO_MPH
  return metresPerSecond
}

export function formatSpeedValue(metresPerSecond: number | null, unit: SpeedUnit): string {
  if (metresPerSecond === null || !Number.isFinite(metresPerSecond)) return '–'
  const value = convertSpeed(metresPerSecond, unit)
  return value.toFixed(unit === 'ms' ? 2 : 1)
}

export function formatSpeed(metresPerSecond: number | null, unit: SpeedUnit): string {
  if (metresPerSecond === null || !Number.isFinite(metresPerSecond)) return '–'
  return `${formatSpeedValue(metresPerSecond, unit)} ${SPEED_UNIT_LABEL[unit]}`
}

/** Seconds as "10.84" or, from a minute up, "1:05.32". */
export function formatTime(seconds: number | null | undefined, decimals = 2): string {
  if (seconds === null || seconds === undefined || !Number.isFinite(seconds) || seconds < 0) return '–'
  const factor = 10 ** decimals
  const rounded = Math.round(seconds * factor) / factor
  if (rounded < 60) return rounded.toFixed(decimals)
  const minutes = Math.floor(rounded / 60)
  const rest = rounded - minutes * 60
  const restText = rest.toFixed(decimals)
  return `${minutes}:${rest < 10 ? `0${restText}` : restText}`
}

export function formatReaction(seconds: number | null): string {
  if (seconds === null || !Number.isFinite(seconds)) return '–'
  return seconds.toFixed(3)
}

/** Metres to a readable label. Yard presets (stored as 18.288 m etc.) stay in yards. */
export function formatDistance(distanceMeters: number, options: { approximate?: boolean } = {}): string {
  if (!(distanceMeters > 0)) return '0 m'
  const prefix = options.approximate ? '≈' : ''
  const yards = distanceMeters / YARD
  const roundYards = Math.round(yards)
  const isWholeMetres = Math.abs(distanceMeters - Math.round(distanceMeters)) < 0.001
  if (!isWholeMetres && roundYards > 0 && Math.abs(yards - roundYards) < 0.002) {
    return `${prefix}${roundYards} yd`
  }
  if (isWholeMetres) return `${prefix}${Math.round(distanceMeters)} m`
  return `${prefix}${distanceMeters.toFixed(1).replace(/\.0$/, '')} m`
}

const START_TYPE_LABELS: Record<string, string> = {
  flying: 'Flying start',
  touchRelease: 'Touch release',
  countdown: 'Countdown',
  voiceCommand: 'Voice command',
  inFrame: 'In-frame start',
}

export function startTypeLabel(startType: string | null | undefined): string {
  if (!startType) return 'Start not recorded'
  return START_TYPE_LABELS[startType] ?? startType.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, c => c.toUpperCase())
}

export function eventTitle(event: { distance: number; isLaps: boolean }): string {
  return event.isLaps ? 'Solo laps' : formatDistance(event.distance)
}

export function eventSubtitle(event: { startType: string | null; isLaps: boolean }): string {
  return event.isLaps ? 'Any distance' : startTypeLabel(event.startType)
}

/** One-line event name, e.g. "30 m flying start". */
export function eventName(event: { distance: number; startType: string | null; isLaps: boolean }): string {
  if (event.isLaps) return 'Solo laps'
  return `${formatDistance(event.distance)} ${startTypeLabel(event.startType).toLowerCase()}`
}

// ---------------------------------------------------------------------------
// Dates

const DAY = 24 * 60 * 60 * 1000

export function formatDate(ms: number | null, options: { withYear?: boolean } = {}): string {
  if (!ms) return '–'
  const date = new Date(ms)
  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    ...(options.withYear === false ? {} : { year: 'numeric' }),
  })
}

export function formatDateTime(ms: number | null): string {
  if (!ms) return '–'
  return new Date(ms).toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatClock(ms: number | null): string {
  if (!ms) return '–'
  return new Date(ms).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

/** "Today", "Yesterday", "3 days ago" or a date. `inSentence` lowercases only the words. */
export function formatRelativeDay(
  ms: number | null,
  options: { now?: number; inSentence?: boolean } = {},
): string {
  const now = options.now ?? Date.now()
  const word = (text: string) => (options.inSentence ? text.toLowerCase() : text)
  if (!ms) return word('Never')
  const startOfToday = new Date(now)
  startOfToday.setHours(0, 0, 0, 0)
  const diffDays = Math.floor((startOfToday.getTime() - new Date(ms).setHours(0, 0, 0, 0)) / DAY)
  if (diffDays <= 0) return word('Today')
  if (diffDays === 1) return word('Yesterday')
  if (diffDays < 7) return `${diffDays} days ago`
  const date = formatDate(ms, { withYear: new Date(ms).getFullYear() !== new Date(now).getFullYear() })
  return options.inSentence ? `on ${date}` : date
}

export function formatCount(value: number, singular: string, plural = `${singular}s`): string {
  return `${value.toLocaleString('en-US')} ${value === 1 ? singular : plural}`
}

// ---------------------------------------------------------------------------
// CSV

export function csvEscape(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return ''
  let text = String(value)
  // Neutralise spreadsheet formulas in free text such as athlete names.
  if (/^[=+\-@\t\r]/.test(text) && !/^-?\d+(\.\d+)?$/.test(text)) text = `'${text}`
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

function isoDate(ms: number): string {
  return ms ? new Date(ms).toISOString() : ''
}

/**
 * One row per run. Splits expand into numbered column groups so the file
 * opens cleanly in a spreadsheet.
 */
export function buildRunsCsv(
  runs: DashboardRun[],
  sessionsByKey: Map<string, DashboardSession>,
  unit: SpeedUnit,
): string {
  const maxSplits = runs.reduce((max, run) => Math.max(max, run.splits.length), 0)
  const speedHeader = `speed_${SPEED_UNIT_LABEL[unit].replace('/', '_per_')}`
  const header = [
    'session_date',
    'session_name',
    'session_id',
    'run_number',
    'run_time_utc',
    'athlete',
    'event',
    'distance_m',
    'start_type',
    'time_s',
    speedHeader,
    'reaction_time_s',
    'pb',
    'sb',
  ]
  for (let i = 1; i <= maxSplits; i += 1) {
    header.push(`split_${i}_to_m`, `split_${i}_segment_s`, `split_${i}_cumulative_s`, `split_${i}_distance_estimated`)
  }

  const lines = [header.map(csvEscape).join(',')]
  for (const run of runs) {
    const session = sessionsByKey.get(run.sessionKey)
    const speed = speedMs(run.isLaps ? null : run.distance, run.time)
    const cells: (string | number | boolean | null)[] = [
      session ? isoDate(session.date).slice(0, 10) : '',
      session?.key === 'unfiled' ? '' : session?.name ?? '',
      run.sessionId ?? '',
      run.runNumber,
      isoDate(run.createdAt),
      run.athleteName ?? '',
      eventName(run),
      run.isLaps ? '' : Number(run.distance.toFixed(3)),
      run.startType ?? '',
      run.time.toFixed(3),
      speed === null ? '' : convertSpeed(speed, unit).toFixed(3),
      run.reactionTime === null ? '' : run.reactionTime.toFixed(3),
      run.isPB ? 'yes' : '',
      run.isSB ? 'yes' : '',
    ]
    for (let i = 0; i < maxSplits; i += 1) {
      const split = run.splits[i]
      if (!split) {
        cells.push('', '', '', '')
        continue
      }
      cells.push(
        split.toDistance === null ? '' : Number(split.toDistance.toFixed(3)),
        split.segmentSeconds.toFixed(3),
        split.cumulativeSeconds.toFixed(3),
        split.approximate ? 'yes' : '',
      )
    }
    lines.push(cells.map(csvEscape).join(','))
  }
  return `${lines.join('\r\n')}\r\n`
}

export function csvFilename(parts: string[]): string {
  const slug = parts
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `trackspeed-${slug || 'export'}.csv`
}
