// Row shapes returned by PostgREST for the signed-in user (RLS scopes every
// table to auth.uid()). Only the columns the dashboard selects are listed.

export interface RawSession {
  id: string
  user_id: string | null
  name: string | null
  location: string | null
  notes: string | null
  distance: number | null
  start_type: string | null
  device_model: string | null
  /** Local session date for new uploads; first-upload time on older rows. */
  created_at: string | null
}

export interface RawRun {
  id: string
  session_id: string | null
  user_id: string | null
  athlete_id: string | null
  athlete_name: string | null
  athlete_color: string | null
  run_number: number | null
  time_seconds: number | null
  distance: number | null
  start_type: string | null
  reaction_time: number | null
  is_personal_best: boolean | null
  is_season_best: boolean | null
  thumbnail_url: string | null
  splits_json: string | null
  created_at: string | null
}

export interface RawAthlete {
  id: string
  name: string | null
  nickname: string | null
  color: string | null
  photo_url: string | null
  created_at: string | null
  updated_at: string | null
}

export interface RawCrossing {
  id: string
  session_id: string | null
  run_id: string | null
  gate_role: string | null
  thumbnail_url: string | null
  created_at: string | null
}

export interface RawDataset {
  sessions: RawSession[]
  runs: RawRun[]
  athletes: RawAthlete[]
}

export type AthleteColorName =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'gray'

export interface Split {
  fromGate: number
  toGate: number
  segmentSeconds: number
  cumulativeSeconds: number
  /** Metres from the start gate; null when the run has no distance (laps). */
  fromDistance: number | null
  toDistance: number | null
  /** True when distances were inferred from equal gate spacing. */
  approximate: boolean
}

export interface DashboardRun {
  id: string
  sessionId: string | null
  /** Session route key: the session uuid, or "unfiled". */
  sessionKey: string
  userId: string | null
  /** Athlete route key; "unassigned" when the run has no athlete. */
  athleteKey: string
  athleteName: string | null
  athleteColor: AthleteColorName | null
  runNumber: number
  time: number
  distance: number
  isLaps: boolean
  startType: string | null
  eventKey: string
  reactionTime: number | null
  createdAt: number
  /** Storage path (race-photos bucket) or an external URL for the finish photo. */
  finishImage: string | null
  splits: Split[]
  gateCount: number
  isPB: boolean
  isSB: boolean
}

export interface DashboardSession {
  key: string
  id: string | null
  name: string | null
  location: string | null
  notes: string | null
  deviceModel: string | null
  date: number
  distance: number
  isLaps: boolean
  startType: string | null
  eventKey: string
  runs: DashboardRun[]
  athleteKeys: string[]
  best: DashboardRun | null
  /** Distinct event keys among the session's runs (usually one). */
  eventKeys: string[]
}

export interface EventBest {
  eventKey: string
  distance: number
  startType: string | null
  isLaps: boolean
  pb: DashboardRun
  /** Best in the calendar year of the latest run for this event. */
  sb: DashboardRun | null
  seasonYear: number
  runCount: number
}

export interface DashboardAthlete {
  key: string
  ids: string[]
  name: string
  nickname: string | null
  color: AthleteColorName | null
  /** Storage path or URL of the athlete's photo (race-photos bucket). */
  photo: string | null
  runCount: number
  sessionCount: number
  lastActive: number | null
  bests: EventBest[]
  inRoster: boolean
}

export interface DashboardEvent {
  key: string
  distance: number
  startType: string | null
  isLaps: boolean
  runCount: number
}

export interface Dataset {
  runs: DashboardRun[]
  sessions: DashboardSession[]
  athletes: DashboardAthlete[]
  unassigned: DashboardAthlete | null
  events: DashboardEvent[]
  /** Raw rows dropped while cleaning (duplicates, zero times). */
  dropped: { duplicates: number; invalidTimes: number }
}
