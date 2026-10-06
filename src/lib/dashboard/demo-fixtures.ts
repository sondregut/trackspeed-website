// Development-only synthetic data for screenshots (?demo=1 under `next dev`).
// Every name, time and image here is generated; nothing comes from real users.
// Only imported behind a process.env.NODE_ENV === 'development' check, so
// production bundles never include it.
import type { RawAthlete, RawDataset, RawRun, RawSession } from './types'

export const DEMO_USER_ID = '00000000-0000-4000-8000-00000000c0ac'
export const DEMO_EMAIL = 'coach@example.com'

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function uuid(n: number, prefix: string): string {
  const hex = n.toString(16).padStart(12, '0')
  return `${prefix}-0000-4000-8000-${hex}`
}

interface DemoAthlete {
  id: string | null
  name: string
  color: string | null
  roster: boolean
  form: number
}

const ATHLETES: DemoAthlete[] = [
  { id: uuid(1, 'a0000001'), name: 'Mia Lund', color: 'blue', roster: true, form: 0 },
  { id: uuid(2, 'a0000001'), name: 'Jonas Berg', color: 'orange', roster: true, form: -0.04 },
  { id: uuid(3, 'a0000001'), name: 'Ella Strand', color: 'green', roster: true, form: 0.05 },
  { id: uuid(4, 'a0000001'), name: 'Theo Aas', color: 'purple', roster: false, form: 0.02 },
  { id: null, name: 'Sam Holt', color: 'pink', roster: false, form: 0.08 },
]

interface SessionTemplate {
  distance: number
  startType: string
  gates: number
  athletes: (number | null)[]
  base: number[]
  shape: number[]
  runsEach: number
  measured?: number[]
  reaction?: boolean
}

const TEMPLATES: Record<string, SessionTemplate> = {
  fly30: { distance: 30, startType: 'flying', gates: 4, athletes: [0, 1, 2], base: [3.18, 3.02, 3.36], shape: [0.345, 0.33, 0.325], runsEach: 3 },
  block40: { distance: 40, startType: 'countdown', gates: 3, athletes: [1, 3], base: [5.34, 5.58], shape: [0.585, 0.415], runsEach: 3, reaction: true },
  yd20: { distance: 18.288, startType: 'touchRelease', gates: 2, athletes: [0, 2, 4], base: [2.86, 3.01, 3.09], shape: [1], runsEach: 3 },
  voice60: { distance: 60, startType: 'voiceCommand', gates: 4, athletes: [1, 0], base: [7.42, 7.93], shape: [0.43, 0.29, 0.28], runsEach: 2, measured: [0, 20, 40, 60], reaction: true },
  solo30: { distance: 30, startType: 'flying', gates: 2, athletes: [null], base: [3.24], shape: [1], runsEach: 5 },
  laps: { distance: 0, startType: 'flying', gates: 0, athletes: [null], base: [62], shape: [], runsEach: 6 },
}

const SESSION_NAMES: Partial<Record<keyof typeof TEMPLATES, string>> = {
  fly30: 'Max velocity',
  block40: 'Block starts',
  voice60: 'Speed endurance',
}

const SCHEDULE: [number, keyof typeof TEMPLATES][] = [
  [1, 'fly30'], [4, 'yd20'], [8, 'block40'], [11, 'fly30'], [15, 'laps'], [19, 'voice60'],
  [26, 'fly30'], [33, 'yd20'], [40, 'solo30'], [47, 'block40'], [61, 'fly30'], [74, 'voice60'],
  [92, 'yd20'], [111, 'fly30'], [133, 'laps'], [152, 'fly30'], [176, 'block40'], [205, 'fly30'],
]

/** Runs whose start and lap photos exist in the demo image store. */
const fullMedia = new Set<string>()
const athleteColorByRun = new Map<string, string | null>()

export function demoRawDataset(now: number = Date.now()): RawDataset {
  const rand = mulberry32(20261005)
  const sessions: RawSession[] = []
  const runs: RawRun[] = []
  fullMedia.clear()
  athleteColorByRun.clear()
  let runCounter = 1

  SCHEDULE.forEach(([daysAgo, templateKey], sessionIndex) => {
    const template = TEMPLATES[templateKey]
    const sessionId = uuid(sessionIndex + 1, '5e550001')
    const day = new Date(now - daysAgo * 86400000)
    day.setHours(17, 20 + Math.floor(rand() * 30), 0, 0)
    const start = day.getTime()
    // Progress: athletes get a little faster over the season.
    const progress = 1 - (205 - daysAgo) / 205 * 0.035

    // Recent sessions follow the new upload format (name, device, local
    // session date); older ones mimic legacy rows (first-upload time, no name).
    const modern = daysAgo < 60
    sessions.push({
      id: sessionId,
      user_id: DEMO_USER_ID,
      name: modern ? SESSION_NAMES[templateKey] ?? null : null,
      location: null,
      notes: null,
      distance: template.distance,
      start_type: template.startType,
      device_model: modern ? 'iPhone 16 Pro' : null,
      created_at: new Date(modern ? start - 60000 : start + 3 * 3600000).toISOString(),
    })

    let runNumber = 1
    for (let rep = 0; rep < template.runsEach; rep += 1) {
      template.athletes.forEach((athleteIndex, slot) => {
        const athlete = athleteIndex === null ? null : ATHLETES[athleteIndex]
        const base = template.base[slot] * (1 + (athlete?.form ?? 0) * 0.1) * progress
        const fatigue = rep === 0 ? 0.012 : rep === template.runsEach - 1 ? 0.006 : 0
        const time = templateKey === 'laps'
          ? 54 + rand() * 20
          : base * (1 + fatigue + (rand() - 0.5) * 0.024)
        const id = uuid(runCounter, 'e0000001')
        runCounter += 1

        let splits: string | null = null
        if (template.gates > 2) {
          let cumulative = 0
          const parts = template.shape.map((share, i) => {
            const isLast = i === template.shape.length - 1
            const segment = isLast ? time - cumulative : time * share * (1 + (rand() - 0.5) * 0.02)
            cumulative += segment
            const row: Record<string, number> = {
              fromGateIndex: i,
              toGateIndex: i + 1,
              splitNanos: Math.round(segment * 1e9),
              cumulativeSplitNanos: Math.round(cumulative * 1e9),
            }
            if (template.measured) {
              row.fromDistanceMeters = template.measured[i]
              row.toDistanceMeters = template.measured[i + 1]
            }
            return row
          })
          splits = JSON.stringify(parts)
          if (sessionIndex % 2 === 0 || templateKey === 'voice60') fullMedia.add(id)
        } else if (template.gates === 2 && rand() > 0.5) {
          fullMedia.add(id)
        }

        athleteColorByRun.set(id, athlete?.color ?? null)
        runs.push({
          id,
          session_id: sessionId,
          user_id: DEMO_USER_ID,
          athlete_id: athlete?.id ?? null,
          athlete_name: athlete?.name ?? null,
          athlete_color: athlete?.color ?? null,
          run_number: runNumber,
          time_seconds: Math.round(time * 1000) / 1000,
          distance: template.distance,
          start_type: template.startType,
          reaction_time: template.reaction && athlete ? Math.round((0.14 + rand() * 0.09) * 1000) / 1000 : null,
          is_personal_best: false,
          is_season_best: false,
          // The app writes uppercase (Swift uuidString) ids into storage paths.
          thumbnail_url: `users/${DEMO_USER_ID.toUpperCase()}/runs/${id.toUpperCase()}.jpg`,
          splits_json: splits,
          created_at: new Date(start + runNumber * 95000).toISOString(),
        })
        runNumber += 1
      })
    }
  })

  // Historic duplicate (same session, run number and time; no photo) and a
  // zero-time row; both are cleaned out by normalization.
  const first = runs[0]
  runs.push({ ...first, id: uuid(9001, 'e0000001'), thumbnail_url: null })
  runs.push({ ...runs[3], id: uuid(9002, 'e0000001'), run_number: 99, time_seconds: 0 })

  // Two runs that never got a session.
  for (let i = 0; i < 2; i += 1) {
    const id = uuid(9100 + i, 'e0000001')
    runs.push({
      id,
      session_id: null,
      user_id: DEMO_USER_ID,
      athlete_id: null,
      athlete_name: null,
      athlete_color: null,
      run_number: i + 1,
      time_seconds: 3.31 + i * 0.04,
      distance: 30,
      start_type: 'flying',
      reaction_time: null,
      is_personal_best: false,
      is_season_best: false,
      thumbnail_url: `users/${DEMO_USER_ID.toUpperCase()}/runs/${id.toUpperCase()}.jpg`,
      splits_json: null,
      created_at: new Date(now - 230 * 86400000 + i * 60000).toISOString(),
    })
  }

  // A session that uploaded but has no runs (hidden in the dashboard).
  sessions.push({
    id: uuid(999, '5e550001'),
    user_id: DEMO_USER_ID,
    name: null,
    location: null,
    notes: null,
    distance: 30,
    start_type: 'flying',
    device_model: null,
    created_at: new Date(now - 3 * 86400000).toISOString(),
  })

  const athletes: RawAthlete[] = ATHLETES.filter(a => a.roster && a.id).map((a, i) => ({
    id: a.id as string,
    name: a.name,
    nickname: null,
    color: a.color,
    // Mia's photo exists; Jonas has a path whose upload is missing (falls back to initials).
    photo_url: i < 2 ? `users/${DEMO_USER_ID.toUpperCase()}/athletes/${(a.id as string).toUpperCase()}.jpg` : null,
    created_at: new Date(now - (300 - i) * 86400000).toISOString(),
    updated_at: new Date(now - 30 * 86400000).toISOString(),
  }))

  return { sessions, runs, athletes }
}

// ---------------------------------------------------------------------------
// Generated photo-finish style placeholders

const SHIRT: Record<string, string> = {
  red: '#d9534f',
  orange: '#e8892b',
  yellow: '#e3b21c',
  green: '#2e9e6a',
  blue: '#3d7fd1',
  purple: '#8e6bd8',
  pink: '#d9649a',
  gray: '#8a8c94',
}

function hash(text: string): number {
  let h = 2166136261
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function placeholder(seed: number, role: 'start' | 'lap' | 'finish', color: string | null): string {
  const rand = mulberry32(seed)
  const shirt = SHIRT[color ?? ''] ?? '#9aa3ad'
  const runnerX = role === 'start' ? 70 + rand() * 18 : 82 + rand() * 20
  const lean = 8 + rand() * 6
  const stride = 16 + rand() * 10
  const sky = role === 'finish' ? '#2b333c' : '#27303a'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 320" width="360" height="640">
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky}"/><stop offset=".55" stop-color="#3a3f45"/><stop offset="1" stop-color="#6b4a3f"/></linearGradient>
<filter id="b"><feGaussianBlur stdDeviation="${(1.2 + rand()).toFixed(2)} 0.3"/></filter></defs>
<rect width="180" height="320" fill="url(#g)"/>
<g stroke="#e9e3da" stroke-opacity=".28" stroke-width="1.4"><path d="M-20 250 L200 232"/><path d="M-20 286 L200 262"/><path d="M-20 322 L200 294"/></g>
<rect x="0" y="0" width="180" height="150" fill="#000" fill-opacity=".12"/>
<g filter="url(#b)" transform="translate(${runnerX.toFixed(1)} 0) skewX(${(-lean).toFixed(1)})">
<circle cx="0" cy="118" r="9" fill="#2a211d"/>
<rect x="-10" y="128" width="20" height="44" rx="8" fill="${shirt}"/>
<path d="M-6 136 L-22 160 M6 136 L20 152" stroke="#3b2c25" stroke-width="6" stroke-linecap="round" fill="none"/>
<path d="M-4 170 L${(-stride).toFixed(1)} 214 L${(-stride - 6).toFixed(1)} 246 M4 170 L${(stride * 0.7).toFixed(1)} 206 L${(stride * 0.4).toFixed(1)} 240" stroke="#1d2226" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</g>
<rect x="89" y="0" width="2" height="320" fill="#ff453a" fill-opacity=".85"/>
</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

function avatarPlaceholder(seed: number, color: string): string {
  const rand = mulberry32(seed)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="192" height="192">
<rect width="96" height="96" fill="#2b323a"/>
<circle cx="${(46 + rand() * 4).toFixed(1)}" cy="40" r="17" fill="#3a2e28"/>
<path d="M14 96c4-22 18-32 34-32s30 10 34 32z" fill="${color}"/>
</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export function demoImageResolver(path: string): string | null {
  const athlete = /athletes\/([0-9a-f-]+)\.jpg$/i.exec(path)
  if (athlete) {
    const index = ATHLETES.findIndex(a => a.id === athlete[1].toLowerCase())
    return index === 0 ? avatarPlaceholder(hash(path), SHIRT[ATHLETES[0].color ?? 'gray']) : null
  }
  const match = /runs\/([0-9a-f-]+?)(_start|_lap\d+)?\.jpg$/i.exec(path)
  if (!match) return null
  const runId = match[1].toLowerCase()
  const suffix = match[2]
  if (suffix && !fullMedia.has(runId)) return null
  const role = !suffix ? 'finish' : suffix === '_start' ? 'start' : 'lap'
  return placeholder(hash(path), role, athleteColorByRun.get(runId) ?? null)
}
