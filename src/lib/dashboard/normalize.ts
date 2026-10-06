// Pure normalization of the raw Supabase rows into the dashboard model.
// Keep this module free of runtime imports (type imports only) so the
// node --experimental-strip-types tests can load it directly.
import type {
  AthleteColorName,
  Dataset,
  DashboardAthlete,
  DashboardEvent,
  DashboardRun,
  DashboardSession,
  EventBest,
  RawAthlete,
  RawDataset,
  RawRun,
  RawSession,
  Split,
} from './types'

export const UNASSIGNED_KEY = 'unassigned'
export const UNFILED_KEY = 'unfiled'
export const LAPS_EVENT_KEY = 'laps'

const ATHLETE_COLORS: readonly AthleteColorName[] = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink',
  'gray',
]

export const START_TYPE_ORDER: readonly string[] = [
  'flying',
  'touchRelease',
  'countdown',
  'voiceCommand',
  'inFrame',
]

export function isValidTime(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

export function parseTimestamp(value: string | null | undefined): number {
  if (!value) return 0
  const ms = Date.parse(value)
  return Number.isFinite(ms) ? ms : 0
}

export function toAthleteColor(value: string | null | undefined): AthleteColorName | null {
  if (!value) return null
  const lower = value.trim().toLowerCase()
  return (ATHLETE_COLORS as readonly string[]).includes(lower) ? (lower as AthleteColorName) : null
}

// ---------------------------------------------------------------------------
// Events (distance + start type; laps are their own event)

export function distanceKey(distance: number): number {
  return Math.round(distance * 1000) / 1000
}

export function eventKeyFor(distance: number, startType: string | null): string {
  if (!(distance > 0)) return LAPS_EVENT_KEY
  return `${startType || 'unknown'}@${distanceKey(distance)}`
}

export function parseEventKey(key: string): { distance: number; startType: string | null; isLaps: boolean } {
  if (key === LAPS_EVENT_KEY) return { distance: 0, startType: null, isLaps: true }
  const at = key.lastIndexOf('@')
  const startType = at > 0 ? key.slice(0, at) : null
  const distance = Number(key.slice(at + 1))
  return {
    distance: Number.isFinite(distance) ? distance : 0,
    startType: startType && startType !== 'unknown' ? startType : null,
    isLaps: false,
  }
}

function startTypeRank(startType: string | null): number {
  const index = startType ? START_TYPE_ORDER.indexOf(startType) : -1
  return index === -1 ? START_TYPE_ORDER.length : index
}

export function compareEventKeys(a: string, b: string): number {
  const ea = parseEventKey(a)
  const eb = parseEventKey(b)
  if (ea.isLaps !== eb.isLaps) return ea.isLaps ? 1 : -1
  if (ea.distance !== eb.distance) return ea.distance - eb.distance
  return startTypeRank(ea.startType) - startTypeRank(eb.startType)
}

// ---------------------------------------------------------------------------
// Splits

interface RawSplit {
  fromGateIndex?: unknown
  toGateIndex?: unknown
  splitNanos?: unknown
  cumulativeSplitNanos?: unknown
  fromDistanceMeters?: unknown
  toDistanceMeters?: unknown
}

/**
 * Parses runs.splits_json. Gate distances come from the optional
 * from/toDistanceMeters fields; without them the gates are assumed to be
 * equally spaced over the run distance and the split is marked approximate.
 */
export function parseSplits(json: string | null | undefined, runDistance: number): { splits: Split[]; gateCount: number } {
  if (!json) return { splits: [], gateCount: 0 }
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    return { splits: [], gateCount: 0 }
  }
  if (!Array.isArray(parsed)) return { splits: [], gateCount: 0 }

  const rows = parsed
    .filter((item): item is RawSplit => typeof item === 'object' && item !== null)
    .map(item => ({
      from: toNumber(item.fromGateIndex),
      to: toNumber(item.toGateIndex),
      split: toNumber(item.splitNanos),
      cumulative: toNumber(item.cumulativeSplitNanos),
      fromDistance: toNumber(item.fromDistanceMeters),
      toDistance: toNumber(item.toDistanceMeters),
    }))
    .filter(row => row.to !== null && row.to >= 0 && row.split !== null && row.split > 0)
    .sort((a, b) => (a.to as number) - (b.to as number))

  if (rows.length === 0) return { splits: [], gateCount: 0 }

  const lastGate = Math.max(...rows.map(row => row.to as number))
  const gateCount = Math.max(2, lastGate + 1)
  const spacing = runDistance > 0 ? runDistance / (gateCount - 1) : null

  let running = 0
  const splits: Split[] = rows.map(row => {
    const toGate = row.to as number
    const fromGate = row.from !== null && row.from >= 0 && row.from < toGate ? row.from : toGate - 1
    const segmentSeconds = (row.split as number) / 1e9
    running += segmentSeconds
    const cumulativeSeconds = row.cumulative !== null && row.cumulative > 0 ? row.cumulative / 1e9 : running
    running = cumulativeSeconds

    const hasMeasured = row.fromDistance !== null && row.toDistance !== null && row.toDistance > row.fromDistance
    let fromDistance: number | null = null
    let toDistance: number | null = null
    if (hasMeasured) {
      fromDistance = row.fromDistance
      toDistance = row.toDistance
    } else if (spacing !== null) {
      fromDistance = fromGate * spacing
      toDistance = toGate * spacing
    }

    return {
      fromGate,
      toGate,
      segmentSeconds,
      cumulativeSeconds,
      fromDistance,
      toDistance,
      approximate: !hasMeasured && spacing !== null,
    }
  })

  return { splits, gateCount }
}

// ---------------------------------------------------------------------------
// Cleaning

function hasThumbnail(run: RawRun): boolean {
  return typeof run.thumbnail_url === 'string' && run.thumbnail_url.trim() !== ''
}

export function dedupeKey(run: RawRun): string {
  const time = typeof run.time_seconds === 'number' ? Math.round(run.time_seconds * 1000) : 'x'
  return `${run.session_id ?? 'null'}|${run.run_number ?? 'null'}|${time}`
}

/**
 * Historic multi-phone uploads produced exact duplicates. Collapse rows that
 * share (session_id, run_number, round(time_seconds, 3)), preferring the row
 * that carries a finish photo, then the first one seen.
 */
export function dedupeRuns(runs: RawRun[]): { runs: RawRun[]; duplicates: number } {
  const kept = new Map<string, RawRun>()
  const order: string[] = []
  for (const run of runs) {
    const key = dedupeKey(run)
    const existing = kept.get(key)
    if (!existing) {
      kept.set(key, run)
      order.push(key)
    } else if (!hasThumbnail(existing) && hasThumbnail(run)) {
      kept.set(key, run)
    }
  }
  return { runs: order.map(key => kept.get(key) as RawRun), duplicates: runs.length - order.length }
}

// ---------------------------------------------------------------------------
// Athletes

export function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, ' ').toLowerCase()
}

export function athleteKeyForName(name: string): string {
  return `name-${encodeURIComponent(name.trim().replace(/\s+/g, ' '))}`
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export type ParsedAthleteKey =
  | { kind: 'unassigned' }
  | { kind: 'id'; id: string }
  | { kind: 'name'; name: string }

/** Accepts the raw or already-decoded dynamic route segment. */
export function parseAthleteKey(raw: string): ParsedAthleteKey {
  const key = safeDecode(raw)
  if (key === UNASSIGNED_KEY) return { kind: 'unassigned' }
  if (key.startsWith('name-')) return { kind: 'name', name: safeDecode(key.slice(5)) }
  return { kind: 'id', id: key }
}

interface AthleteEntity {
  key: string
  ids: Set<string>
  name: string
  nickname: string | null
  color: AthleteColorName | null
  photo: string | null
  inRoster: boolean
}

const UNNAMED = 'Unnamed athlete'

/**
 * Merges the athletes table with the athlete_id / athlete_name copies stored
 * on runs. Ids that never reached the athletes table are matched by name to
 * an existing athlete; otherwise they become their own athlete. Runs with
 * only a name join the athlete with that name, or get a name-keyed athlete.
 */
export function resolveAthletes(athletes: RawAthlete[], runs: RawRun[]) {
  const entities: AthleteEntity[] = []
  const byId = new Map<string, AthleteEntity>()
  const byName = new Map<string, AthleteEntity>()

  const register = (entity: AthleteEntity) => {
    entities.push(entity)
    for (const id of entity.ids) byId.set(id, entity)
    const norm = normalizeName(entity.name)
    if (entity.name !== UNNAMED && !byName.has(norm)) byName.set(norm, entity)
  }

  const roster = [...athletes]
    .filter(row => typeof row.id === 'string' && row.id)
    .sort((a, b) => parseTimestamp(b.updated_at ?? b.created_at) - parseTimestamp(a.updated_at ?? a.created_at))
  for (const row of roster) {
    if (byId.has(row.id)) continue
    register({
      key: row.id,
      ids: new Set([row.id]),
      name: row.name?.trim() || UNNAMED,
      nickname: row.nickname?.trim() || null,
      color: toAthleteColor(row.color),
      photo: row.photo_url?.trim() || null,
      inRoster: true,
    })
  }

  // Latest runs first so a renamed athlete shows its current name/colour.
  const newestFirst = [...runs].sort((a, b) => parseTimestamp(b.created_at) - parseTimestamp(a.created_at))
  const runEntity = new Map<string, AthleteEntity>()

  for (const run of newestFirst) {
    const id = run.athlete_id?.trim() || null
    const name = run.athlete_name?.trim().replace(/\s+/g, ' ') || null
    let entity: AthleteEntity | undefined

    if (id) {
      entity = byId.get(id)
      if (!entity && name) {
        entity = byName.get(normalizeName(name))
        if (entity) {
          entity.ids.add(id)
          byId.set(id, entity)
        }
      }
      if (!entity) {
        entity = { key: id, ids: new Set([id]), name: name || UNNAMED, nickname: null, color: null, photo: null, inRoster: false }
        register(entity)
      }
    } else if (name) {
      entity = byName.get(normalizeName(name))
      if (!entity) {
        entity = { key: athleteKeyForName(name), ids: new Set(), name, nickname: null, color: null, photo: null, inRoster: false }
        register(entity)
      }
    }

    if (entity) {
      if (!entity.color) entity.color = toAthleteColor(run.athlete_color)
      runEntity.set(run.id, entity)
    }
  }

  return { entities, runEntity, byId }
}

// ---------------------------------------------------------------------------
// Dataset

function seasonOf(ms: number): number {
  return new Date(ms).getFullYear()
}

function faster(a: DashboardRun, b: DashboardRun): boolean {
  if (a.time !== b.time) return a.time < b.time
  return a.createdAt < b.createdAt
}

function bestOf(runs: DashboardRun[]): DashboardRun | null {
  let best: DashboardRun | null = null
  for (const run of runs) if (!best || faster(run, best)) best = run
  return best
}

export function compareRunsInSession(a: DashboardRun, b: DashboardRun): number {
  if (a.runNumber !== b.runNumber) return a.runNumber - b.runNumber
  return a.createdAt - b.createdAt
}

/** Marks each athlete's all-time best per event (PB) and each season's best (SB). */
function markBests(runs: DashboardRun[]) {
  const groups = new Map<string, DashboardRun[]>()
  for (const run of runs) {
    if (run.isLaps) continue
    const key = `${run.athleteKey}|${run.eventKey}`
    const list = groups.get(key)
    if (list) list.push(run)
    else groups.set(key, [run])
  }
  for (const list of groups.values()) {
    const pb = bestOf(list)
    if (pb) pb.isPB = true
    const seasons = new Map<number, DashboardRun[]>()
    for (const run of list) {
      const year = seasonOf(run.createdAt)
      const seasonRuns = seasons.get(year)
      if (seasonRuns) seasonRuns.push(run)
      else seasons.set(year, [run])
    }
    for (const seasonRuns of seasons.values()) {
      const sb = bestOf(seasonRuns)
      if (sb && !sb.isPB) sb.isSB = true
    }
  }
}

export function summarizeEvents(runs: DashboardRun[], now: number): EventBest[] {
  const groups = new Map<string, DashboardRun[]>()
  for (const run of runs) {
    const list = groups.get(run.eventKey)
    if (list) list.push(run)
    else groups.set(run.eventKey, [run])
  }
  const season = seasonOf(now)
  const bests: EventBest[] = []
  for (const [eventKey, list] of groups) {
    const pb = bestOf(list)
    if (!pb) continue
    const sb = bestOf(list.filter(run => seasonOf(run.createdAt) === season))
    bests.push({
      eventKey,
      distance: pb.isLaps ? 0 : pb.distance,
      startType: pb.isLaps ? null : pb.startType,
      isLaps: pb.isLaps,
      pb,
      sb,
      seasonYear: season,
      runCount: list.length,
    })
  }
  return bests.sort((a, b) => compareEventKeys(a.eventKey, b.eventKey))
}

function summarizeAthlete(
  base: {
    key: string
    ids: string[]
    name: string
    nickname: string | null
    color: AthleteColorName | null
    photo: string | null
    inRoster: boolean
  },
  runs: DashboardRun[],
  now: number,
): DashboardAthlete {
  const sessions = new Set(runs.map(run => run.sessionKey))
  const lastActive = runs.reduce<number | null>((max, run) => (max === null || run.createdAt > max ? run.createdAt : max), null)
  return {
    ...base,
    runCount: runs.length,
    sessionCount: sessions.size,
    lastActive,
    bests: summarizeEvents(runs, now),
  }
}

export interface BuildOptions {
  now?: number
}

export function buildDataset(raw: RawDataset, options: BuildOptions = {}): Dataset {
  const now = options.now ?? Date.now()
  const validRaw = raw.runs.filter(run => isValidTime(run.time_seconds))
  const invalidTimes = raw.runs.length - validRaw.length
  const { runs: uniqueRaw, duplicates } = dedupeRuns(validRaw)

  const sessionRows = new Map<string, RawSession>()
  for (const session of raw.sessions) if (session?.id) sessionRows.set(session.id, session)

  const { entities, runEntity } = resolveAthletes(raw.athletes, uniqueRaw)

  const runs: DashboardRun[] = uniqueRaw.map(row => {
    const sessionRow = row.session_id ? sessionRows.get(row.session_id) : undefined
    const distanceRaw = typeof row.distance === 'number' && Number.isFinite(row.distance)
      ? row.distance
      : typeof sessionRow?.distance === 'number' ? sessionRow.distance : 0
    const distance = distanceRaw > 0 ? distanceRaw : 0
    const isLaps = distance === 0
    const startType = row.start_type || sessionRow?.start_type || null
    const { splits, gateCount } = parseSplits(row.splits_json, distance)
    const entity = runEntity.get(row.id)
    const createdAt = parseTimestamp(row.created_at) || parseTimestamp(sessionRow?.created_at)
    const reaction = typeof row.reaction_time === 'number' && Number.isFinite(row.reaction_time) && row.reaction_time > 0
      ? row.reaction_time
      : null
    return {
      id: row.id,
      sessionId: row.session_id,
      sessionKey: row.session_id ?? UNFILED_KEY,
      userId: row.user_id,
      athleteKey: entity?.key ?? UNASSIGNED_KEY,
      athleteName: entity?.name ?? null,
      athleteColor: entity?.color ?? null,
      runNumber: typeof row.run_number === 'number' ? row.run_number : 0,
      time: row.time_seconds as number,
      distance,
      isLaps,
      startType: isLaps ? null : startType,
      eventKey: eventKeyFor(distance, startType),
      reactionTime: reaction,
      createdAt,
      finishImage: row.thumbnail_url?.trim() || null,
      splits,
      gateCount,
      isPB: false,
      isSB: false,
    }
  })

  markBests(runs)

  // Sessions ---------------------------------------------------------------
  const runsBySession = new Map<string, DashboardRun[]>()
  for (const run of runs) {
    const list = runsBySession.get(run.sessionKey)
    if (list) list.push(run)
    else runsBySession.set(run.sessionKey, [run])
  }

  const sessions: DashboardSession[] = []
  for (const [key, list] of runsBySession) {
    list.sort(compareRunsInSession)
    const row = key === UNFILED_KEY ? undefined : sessionRows.get(key)
    const eventCounts = new Map<string, number>()
    for (const run of list) eventCounts.set(run.eventKey, (eventCounts.get(run.eventKey) ?? 0) + 1)
    const eventKeys = [...eventCounts.keys()].sort(compareEventKeys)
    const mainEvent = [...eventCounts.entries()].sort((a, b) => b[1] - a[1] || compareEventKeys(a[0], b[0]))[0][0]
    const main = parseEventKey(mainEvent)
    // New uploads store the local session date in sessions.created_at; older
    // rows hold the first-upload time, so the earliest of the two wins.
    const dates = list.map(run => run.createdAt).filter(ms => ms > 0)
    const sessionCreated = parseTimestamp(row?.created_at)
    if (sessionCreated > 0) dates.push(sessionCreated)
    const athleteKeys = [...new Set(list.map(run => run.athleteKey))]
    sessions.push({
      key,
      id: key === UNFILED_KEY ? null : key,
      name: key === UNFILED_KEY ? 'Unfiled runs' : row?.name?.trim() || null,
      location: row?.location?.trim() || null,
      notes: row?.notes?.trim() || null,
      deviceModel: row?.device_model?.trim() || null,
      date: dates.length ? Math.min(...dates) : 0,
      distance: main.distance,
      isLaps: main.isLaps,
      startType: main.isLaps ? null : main.startType ?? row?.start_type ?? null,
      eventKey: mainEvent,
      runs: list,
      athleteKeys,
      best: bestOf(list.filter(run => run.eventKey === mainEvent)),
      eventKeys,
    })
  }
  sessions.sort((a, b) => b.date - a.date)

  // Athletes ---------------------------------------------------------------
  const runsByAthlete = new Map<string, DashboardRun[]>()
  for (const run of runs) {
    const list = runsByAthlete.get(run.athleteKey)
    if (list) list.push(run)
    else runsByAthlete.set(run.athleteKey, [run])
  }

  const athletes = entities
    .map(entity =>
      summarizeAthlete(
        {
          key: entity.key,
          ids: [...entity.ids],
          name: entity.name,
          nickname: entity.nickname,
          color: entity.color,
          photo: entity.photo,
          inRoster: entity.inRoster,
        },
        runsByAthlete.get(entity.key) ?? [],
        now,
      ),
    )
    .sort((a, b) => (b.lastActive ?? 0) - (a.lastActive ?? 0) || a.name.localeCompare(b.name))

  const unassignedRuns = runsByAthlete.get(UNASSIGNED_KEY) ?? []
  const unassigned = unassignedRuns.length
    ? summarizeAthlete(
        { key: UNASSIGNED_KEY, ids: [], name: 'Unassigned runs', nickname: null, color: null, photo: null, inRoster: false },
        unassignedRuns,
        now,
      )
    : null

  // Events -----------------------------------------------------------------
  const eventCounts = new Map<string, number>()
  for (const run of runs) eventCounts.set(run.eventKey, (eventCounts.get(run.eventKey) ?? 0) + 1)
  const events: DashboardEvent[] = [...eventCounts.entries()]
    .map(([key, runCount]) => ({ key, runCount, ...parseEventKey(key) }))
    .sort((a, b) => compareEventKeys(a.key, b.key))

  return { runs, sessions, athletes, unassigned, events, dropped: { duplicates, invalidTimes } }
}

export function findAthlete(dataset: Dataset, rawKey: string): DashboardAthlete | null {
  const parsed = parseAthleteKey(rawKey)
  if (parsed.kind === 'unassigned') return dataset.unassigned
  if (parsed.kind === 'id') {
    return dataset.athletes.find(athlete => athlete.key === parsed.id || athlete.ids.includes(parsed.id)) ?? null
  }
  const norm = normalizeName(parsed.name)
  return (
    dataset.athletes.find(athlete => athlete.key === athleteKeyForName(parsed.name)) ??
    dataset.athletes.find(athlete => normalizeName(athlete.name) === norm) ??
    null
  )
}

export function athleteHref(key: string): string {
  // Name keys are already URI-encoded after the "name-" prefix.
  return `/dashboard/athletes/${key.startsWith('name-') ? `name-${encodeURIComponent(safeDecode(key.slice(5)))}` : encodeURIComponent(key)}`
}

export function sessionHref(key: string): string {
  return `/dashboard/sessions/${encodeURIComponent(key)}`
}
