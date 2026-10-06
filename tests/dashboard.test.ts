import assert from "node:assert/strict"
import test from "node:test"
import {
  athleteHref,
  athleteKeyForName,
  buildDataset,
  dedupeRuns,
  eventKeyFor,
  findAthlete,
  LAPS_EVENT_KEY,
  parseAthleteKey,
  parseEventKey,
  parseSplits,
  resolveAthletes,
  UNASSIGNED_KEY,
  UNFILED_KEY,
} from "../src/lib/dashboard/normalize.ts"
import {
  buildRunsCsv,
  convertSpeed,
  csvEscape,
  formatDistance,
  formatRelativeDay,
  formatSpeed,
  formatTime,
  isSpeedUnit,
  speedMs,
  startTypeLabel,
} from "../src/lib/dashboard/format.ts"
import { imageSource, runFrames, runImagePath, runPhotoPath } from "../src/lib/dashboard/frames.ts"
import {
  buildDashboardLinkUrl,
  DEFAULT_DASHBOARD_ORIGIN,
  handleDashboardLinkRequest,
  parseBearerToken,
  resolveDashboardOrigin,
  type DashboardLinkDeps,
} from "../src/lib/dashboard/link-request.ts"
import type { RawAthlete, RawRun, RawSession } from "../src/lib/dashboard/types.ts"

const UID = "11111111-1111-4111-8111-111111111111"
const NOW = Date.parse("2026-10-05T12:00:00Z")

let counter = 0
function run(overrides: Partial<RawRun> = {}): RawRun {
  counter += 1
  return {
    id: `run-${counter}`,
    session_id: "s1",
    user_id: UID,
    athlete_id: null,
    athlete_name: null,
    athlete_color: null,
    run_number: counter,
    time_seconds: 3.5,
    distance: 30,
    start_type: "flying",
    reaction_time: null,
    is_personal_best: false,
    is_season_best: false,
    thumbnail_url: `users/${UID}/runs/run-${counter}.jpg`,
    splits_json: null,
    created_at: "2026-09-01T17:00:00Z",
    ...overrides,
  }
}

function session(overrides: Partial<RawSession> = {}): RawSession {
  return {
    id: "s1",
    user_id: UID,
    name: null,
    location: null,
    notes: null,
    distance: 30,
    start_type: "flying",
    device_model: null,
    created_at: "2026-09-02T09:00:00Z",
    ...overrides,
  }
}

function athlete(overrides: Partial<RawAthlete> = {}): RawAthlete {
  return {
    id: "ath-1",
    name: "Mia Lund",
    nickname: null,
    color: "blue",
    photo_url: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...overrides,
  }
}

function splitsJson(rows: Record<string, number>[]): string {
  return JSON.stringify(rows)
}

// --- Cleaning -------------------------------------------------------------

test("dedupe collapses (session, run number, rounded time) and keeps the row with a photo", () => {
  const withoutPhoto = run({ id: "a", run_number: 1, time_seconds: 3.1234, thumbnail_url: null })
  const withPhoto = run({ id: "b", run_number: 1, time_seconds: 3.1231 })
  const differentTime = run({ id: "c", run_number: 1, time_seconds: 3.2 })
  const otherSession = run({ id: "d", session_id: "s2", run_number: 1, time_seconds: 3.1234 })
  const result = dedupeRuns([withoutPhoto, withPhoto, differentTime, otherSession])
  assert.equal(result.duplicates, 1)
  assert.deepEqual(result.runs.map(r => r.id), ["b", "c", "d"])
})

test("dedupe keeps the first row when neither duplicate has a photo", () => {
  const first = run({ id: "x1", run_number: 4, time_seconds: 5, thumbnail_url: null })
  const second = run({ id: "x2", run_number: 4, time_seconds: 5, thumbnail_url: null })
  assert.deepEqual(dedupeRuns([first, second]).runs.map(r => r.id), ["x1"])
})

test("buildDataset hides zero/negative times, files null sessions as unfiled and orders by run number", () => {
  const dataset = buildDataset(
    {
      sessions: [session(), session({ id: "empty" })],
      runs: [
        run({ id: "r3", run_number: 3, created_at: "2026-09-01T17:00:00Z" }),
        run({ id: "r1", run_number: 1, created_at: "2026-09-01T17:00:00Z" }),
        run({ id: "zero", run_number: 2, time_seconds: 0 }),
        run({ id: "neg", run_number: 5, time_seconds: -1 }),
        run({ id: "lost", session_id: null, run_number: 1 }),
      ],
      athletes: [],
    },
    { now: NOW },
  )
  assert.equal(dataset.dropped.invalidTimes, 2)
  assert.deepEqual(dataset.runs.map(r => r.id).sort(), ["lost", "r1", "r3"])
  const s1 = dataset.sessions.find(s => s.key === "s1")
  assert.ok(s1)
  assert.deepEqual(s1.runs.map(r => r.id), ["r1", "r3"])
  assert.ok(dataset.sessions.some(s => s.key === UNFILED_KEY && s.id === null))
  assert.ok(!dataset.sessions.some(s => s.key === "empty"), "sessions without runs are hidden")
})

test("session date is the earliest run, not the first-upload created_at", () => {
  const dataset = buildDataset(
    {
      sessions: [session({ created_at: "2026-09-10T09:00:00Z" })],
      runs: [
        run({ created_at: "2026-09-01T17:05:00Z" }),
        run({ created_at: "2026-09-01T17:01:00Z" }),
      ],
      athletes: [],
    },
    { now: NOW },
  )
  assert.equal(dataset.sessions[0].date, Date.parse("2026-09-01T17:01:00Z"))
})

test("new sessions use their stored local date, name and device when earlier than the runs", () => {
  const dataset = buildDataset(
    {
      sessions: [session({ name: "Max velocity", device_model: "iPhone 16 Pro", created_at: "2026-09-01T16:55:00Z" })],
      runs: [run({ created_at: "2026-09-01T17:01:00Z" })],
      athletes: [],
    },
    { now: NOW },
  )
  const [only] = dataset.sessions
  assert.equal(only.date, Date.parse("2026-09-01T16:55:00Z"))
  assert.equal(only.name, "Max velocity")
  assert.equal(only.deviceModel, "iPhone 16 Pro")
  const csv = buildRunsCsv(dataset.runs, new Map([[only.key, only]]), "ms")
  assert.ok(csv.split("\r\n")[0].startsWith("session_date,session_name,session_id"))
  assert.ok(csv.split("\r\n")[1].startsWith("2026-09-01,Max velocity,s1,"))
})

// --- Splits ----------------------------------------------------------------

test("splits without distances assume equal gate spacing and are marked approximate", () => {
  const { splits, gateCount } = parseSplits(
    splitsJson([
      { fromGateIndex: 0, toGateIndex: 1, splitNanos: 1_300_000_000, cumulativeSplitNanos: 1_300_000_000 },
      { fromGateIndex: 1, toGateIndex: 2, splitNanos: 1_000_000_000, cumulativeSplitNanos: 2_300_000_000 },
      { fromGateIndex: 2, toGateIndex: 3, splitNanos: 900_000_000, cumulativeSplitNanos: 3_200_000_000 },
    ]),
    30,
  )
  assert.equal(gateCount, 4)
  assert.deepEqual(splits.map(s => s.toDistance), [10, 20, 30])
  assert.deepEqual(splits.map(s => s.fromDistance), [0, 10, 20])
  assert.ok(splits.every(s => s.approximate))
  assert.equal(splits[1].segmentSeconds, 1)
  assert.equal(splits[2].cumulativeSeconds, 3.2)
})

test("splits with recorded gate distances use them exactly", () => {
  const { splits } = parseSplits(
    splitsJson([
      { fromGateIndex: 0, toGateIndex: 1, splitNanos: 2_000_000_000, cumulativeSplitNanos: 2_000_000_000, fromDistanceMeters: 0, toDistanceMeters: 15 },
      { fromGateIndex: 1, toGateIndex: 2, splitNanos: 1_500_000_000, cumulativeSplitNanos: 3_500_000_000, fromDistanceMeters: 15, toDistanceMeters: 40 },
    ]),
    40,
  )
  assert.deepEqual(splits.map(s => [s.fromDistance, s.toDistance, s.approximate]), [[0, 15, false], [15, 40, false]])
})

test("splits fill in a missing cumulative and tolerate bad input", () => {
  const { splits } = parseSplits(
    splitsJson([
      { fromGateIndex: 0, toGateIndex: 1, splitNanos: 1_000_000_000 },
      { fromGateIndex: 1, toGateIndex: 2, splitNanos: 2_000_000_000 },
    ]),
    20,
  )
  assert.deepEqual(splits.map(s => s.cumulativeSeconds), [1, 3])
  assert.deepEqual(parseSplits("not json", 30), { splits: [], gateCount: 0 })
  assert.deepEqual(parseSplits('{"a":1}', 30), { splits: [], gateCount: 0 })
  assert.deepEqual(parseSplits(null, 30), { splits: [], gateCount: 0 })
})

// --- Laps ------------------------------------------------------------------

test("distance 0 runs are solo laps: own event, no speed, no PB/SB badges", () => {
  const dataset = buildDataset(
    {
      sessions: [session({ distance: 0 })],
      runs: [run({ distance: 0, time_seconds: 61.2 }), run({ distance: 0, time_seconds: 58.4 })],
      athletes: [],
    },
    { now: NOW },
  )
  assert.ok(dataset.runs.every(r => r.isLaps && r.eventKey === LAPS_EVENT_KEY && r.startType === null))
  assert.ok(dataset.runs.every(r => !r.isPB && !r.isSB))
  assert.equal(speedMs(0, 58.4), null)
  assert.equal(dataset.sessions[0].isLaps, true)
  assert.equal(dataset.sessions[0].best?.time, 58.4)
  assert.equal(eventKeyFor(0, "flying"), LAPS_EVENT_KEY)
  assert.deepEqual(parseEventKey(eventKeyFor(18.288, "touchRelease")), { distance: 18.288, startType: "touchRelease", isLaps: false })
})

// --- Athletes --------------------------------------------------------------

test("athletes merge roster rows with run ids and names", () => {
  const raw = {
    sessions: [session()],
    athletes: [athlete({ id: "roster-mia", name: "Mia Lund", color: "blue" })],
    runs: [
      // Run id never reached the athletes table, but the name matches.
      run({ athlete_id: "run-mia", athlete_name: "Mia  Lund", athlete_color: "red", time_seconds: 3.4 }),
      // Name only: joins Mia by name.
      run({ athlete_name: "mia lund", time_seconds: 3.3 }),
      // Unknown id: becomes its own athlete.
      run({ athlete_id: "theo-id", athlete_name: "Theo", athlete_color: "purple", time_seconds: 3.2 }),
      // Unknown name only: name-keyed athlete.
      run({ athlete_name: "Sam Holt", time_seconds: 3.6 }),
      run({ time_seconds: 3.7 }),
    ],
  }
  const { entities } = resolveAthletes(raw.athletes, raw.runs)
  assert.equal(entities.length, 3)
  const dataset = buildDataset(raw, { now: NOW })
  const mia = findAthlete(dataset, "roster-mia")
  assert.ok(mia)
  assert.equal(mia.runCount, 2)
  assert.equal(mia.color, "blue", "roster colour wins over the run copy")
  assert.equal(mia.photo, null)
  const withPhoto = buildDataset(
    { ...raw, athletes: [athlete({ id: "roster-mia", photo_url: `users/${UID}/athletes/roster-mia.jpg` })] },
    { now: NOW },
  )
  assert.equal(findAthlete(withPhoto, "roster-mia")?.photo, `users/${UID}/athletes/roster-mia.jpg`)
  assert.equal(findAthlete(withPhoto, "theo-id")?.photo, null)
  assert.deepEqual(mia.ids.sort(), ["roster-mia", "run-mia"])
  assert.equal(findAthlete(dataset, "run-mia")?.key, "roster-mia", "alias ids resolve to the same athlete")
  assert.equal(findAthlete(dataset, "theo-id")?.color, "purple")
  const sam = dataset.athletes.find(a => a.name === "Sam Holt")
  assert.equal(sam?.key, athleteKeyForName("Sam Holt"))
  assert.equal(dataset.unassigned?.runCount, 1)
  assert.equal(findAthlete(dataset, UNASSIGNED_KEY)?.key, UNASSIGNED_KEY)
})

test("athlete route keys round-trip through encoded and decoded URL segments", () => {
  const dataset = buildDataset(
    { sessions: [session()], athletes: [], runs: [run({ athlete_name: "Ola Nordmann 100%", time_seconds: 3 })] },
    { now: NOW },
  )
  const ola = dataset.athletes[0]
  const href = athleteHref(ola.key)
  assert.equal(href, "/dashboard/athletes/name-Ola%20Nordmann%20100%25")
  const segment = href.split("/").pop() as string
  assert.equal(findAthlete(dataset, segment)?.key, ola.key, "raw segment")
  assert.equal(findAthlete(dataset, decodeURIComponent(segment))?.key, ola.key, "decoded segment")
  assert.deepEqual(parseAthleteKey("unassigned"), { kind: "unassigned" })
  assert.deepEqual(parseAthleteKey("6f2c"), { kind: "id", id: "6f2c" })
  assert.equal(athleteHref("abc-123"), "/dashboard/athletes/abc-123")
})

test("PB is the athlete's all-time best per event; SB is each other season's best", () => {
  const dataset = buildDataset(
    {
      sessions: [session()],
      athletes: [],
      runs: [
        run({ id: "old-fast", athlete_name: "Mia", time_seconds: 3.0, created_at: "2025-06-01T10:00:00Z" }),
        run({ id: "old-slow", athlete_name: "Mia", time_seconds: 3.4, created_at: "2025-06-02T10:00:00Z" }),
        run({ id: "new-best", athlete_name: "Mia", time_seconds: 3.1, created_at: "2026-06-01T10:00:00Z" }),
        run({ id: "new-slow", athlete_name: "Mia", time_seconds: 3.3, created_at: "2026-06-02T10:00:00Z" }),
        run({ id: "other-event", athlete_name: "Mia", distance: 40, time_seconds: 5, created_at: "2026-06-02T10:00:00Z" }),
        run({ id: "other-athlete", athlete_name: "Jonas", time_seconds: 3.2, created_at: "2026-06-02T10:00:00Z" }),
      ],
    },
    { now: NOW },
  )
  const byId = new Map(dataset.runs.map(r => [r.id, r]))
  assert.equal(byId.get("old-fast")?.isPB, true)
  assert.equal(byId.get("new-best")?.isSB, true)
  assert.equal(byId.get("new-best")?.isPB, false)
  assert.equal(byId.get("old-slow")?.isSB, false)
  assert.equal(byId.get("other-event")?.isPB, true)
  assert.equal(byId.get("other-athlete")?.isPB, true)
  const mia = dataset.athletes.find(a => a.name === "Mia")
  const fly30 = mia?.bests.find(b => b.eventKey === eventKeyFor(30, "flying"))
  assert.equal(fly30?.pb.id, "old-fast")
  assert.equal(fly30?.sb?.id, "new-best")
  assert.equal(fly30?.seasonYear, 2026)
})

// --- Formatting & units ----------------------------------------------------

test("speed conversions and formatting", () => {
  assert.equal(speedMs(30, 3), 10)
  assert.equal(speedMs(30, 0), null)
  assert.equal(convertSpeed(10, "ms"), 10)
  assert.equal(convertSpeed(10, "kmh"), 36)
  assert.ok(Math.abs(convertSpeed(10, "mph") - 22.369) < 0.001)
  assert.equal(formatSpeed(10, "ms"), "10.00 m/s")
  assert.equal(formatSpeed(10, "kmh"), "36.0 km/h")
  assert.equal(formatSpeed(10, "mph"), "22.4 mph")
  assert.equal(formatSpeed(null, "mph"), "–")
  assert.ok(isSpeedUnit("kmh") && !isSpeedUnit("knots"))
})

test("time, distance and start-type labels", () => {
  assert.equal(formatTime(3.1234), "3.12")
  assert.equal(formatTime(3.1235, 3), "3.124")
  assert.equal(formatTime(59.999), "1:00.00")
  assert.equal(formatTime(65.321), "1:05.32")
  assert.equal(formatTime(650.5, 1), "10:50.5")
  assert.equal(formatDistance(18.288), "20 yd")
  assert.equal(formatDistance(36.576), "40 yd")
  assert.equal(formatDistance(30), "30 m")
  assert.equal(formatDistance(27.5), "27.5 m")
  assert.equal(formatDistance(10, { approximate: true }), "≈10 m")
  assert.equal(startTypeLabel("touchRelease"), "Touch release")
  assert.equal(startTypeLabel("voiceCommand"), "Voice command")
  assert.equal(startTypeLabel("inFrame"), "In-frame start")
  assert.equal(startTypeLabel(null), "Start not recorded")
  const now = new Date(2026, 9, 5, 12).getTime()
  assert.equal(formatRelativeDay(new Date(2026, 9, 5, 8).getTime(), { now }), "Today")
  assert.equal(formatRelativeDay(new Date(2026, 9, 4, 23).getTime(), { now, inSentence: true }), "yesterday")
  assert.equal(formatRelativeDay(new Date(2026, 9, 1).getTime(), { now }), "4 days ago")
  assert.match(formatRelativeDay(new Date(2026, 7, 20).getTime(), { now, inSentence: true }), /^on /)
  assert.equal(formatRelativeDay(null, { now }), "Never")
})

test("CSV escapes text, neutralises formulas and expands splits into columns", () => {
  assert.equal(csvEscape('Ola "Rocket", Jr'), '"Ola ""Rocket"", Jr"')
  assert.equal(csvEscape("=HYPERLINK(1)"), "'=HYPERLINK(1)")
  assert.equal(csvEscape("-3.2"), "-3.2")
  const dataset = buildDataset(
    {
      sessions: [session()],
      athletes: [],
      runs: [
        run({
          athlete_name: "=cmd",
          splits_json: splitsJson([
            { fromGateIndex: 0, toGateIndex: 1, splitNanos: 1_500_000_000, cumulativeSplitNanos: 1_500_000_000 },
            { fromGateIndex: 1, toGateIndex: 2, splitNanos: 2_000_000_000, cumulativeSplitNanos: 3_500_000_000 },
          ]),
        }),
      ],
    },
    { now: NOW },
  )
  const csv = buildRunsCsv(dataset.runs, new Map(dataset.sessions.map(s => [s.key, s])), "kmh")
  const [header, row] = csv.trim().split("\r\n")
  assert.ok(header.includes("speed_km_per_h"))
  assert.ok(header.endsWith("split_2_to_m,split_2_segment_s,split_2_cumulative_s,split_2_distance_estimated"))
  assert.ok(row.includes("'=cmd"))
  assert.ok(row.includes("30.857"), "30 m in 3.5 s is 30.857 km/h")
  assert.ok(row.endsWith("30,2.000,3.500,yes"))
})

// --- Photos ----------------------------------------------------------------

test("run frames try fixed upload paths first, then crossings, and convert legacy URLs", () => {
  const dataset = buildDataset(
    {
      sessions: [session()],
      athletes: [],
      runs: [
        run({
          id: "abc",
          thumbnail_url: "https://x.supabase.co/storage/v1/object/public/race-photos/sessions/s1/run_1.jpg",
          splits_json: splitsJson([
            { fromGateIndex: 0, toGateIndex: 1, splitNanos: 1_000_000_000, cumulativeSplitNanos: 1_000_000_000 },
            { fromGateIndex: 1, toGateIndex: 2, splitNanos: 1_000_000_000, cumulativeSplitNanos: 2_000_000_000 },
            { fromGateIndex: 2, toGateIndex: 3, splitNanos: 1_000_000_000, cumulativeSplitNanos: 3_000_000_000 },
          ]),
        }),
      ],
    },
    { now: NOW },
  )
  const frames = runFrames(dataset.runs[0], [
    { id: "c1", session_id: "tok", run_id: "abc", gate_role: "start", thumbnail_url: "crossings/tok/1.jpg", created_at: null },
    { id: "c2", session_id: "tok", run_id: "abc", gate_role: "split_2", thumbnail_url: "crossings/tok/2.jpg", created_at: null },
    { id: "c3", session_id: "tok", run_id: "other", gate_role: "finish", thumbnail_url: "crossings/tok/3.jpg", created_at: null },
  ])
  assert.deepEqual(frames.map(f => f.key), ["start", "lap1", "lap2", "finish"])
  // The legacy finish path doesn't follow {runId}.jpg, so the uppercase convention is used.
  assert.deepEqual(frames[0].sources, [
    { kind: "path", path: `users/${UID}/runs/ABC_start.jpg` },
    { kind: "path", path: "crossings/tok/1.jpg" },
  ])
  assert.deepEqual(frames[2].sources.map(s => (s.kind === "path" ? s.path : s.url)), [`users/${UID}/runs/ABC_lap2.jpg`, "crossings/tok/2.jpg"])
  assert.equal(frames[1].time, 1)
  assert.equal(frames[3].sources[0].kind === "path" && frames[3].sources[0].path, "sessions/s1/run_1.jpg")
  assert.equal(frames[3].time, 3.5)
  assert.deepEqual(imageSource("https://cdn.example.com/a.jpg"), { kind: "url", url: "https://cdn.example.com/a.jpg" })
  assert.deepEqual(imageSource("/race-photos/users/u/runs/r.jpg"), { kind: "path", path: "users/u/runs/r.jpg" })
  assert.equal(imageSource("  "), null)
})

// --- Link endpoint ---------------------------------------------------------

const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1In0.c2lnbmF0dXJl"

function deps(overrides: Partial<DashboardLinkDeps> = {}) {
  const calls: string[] = []
  const base: DashboardLinkDeps = {
    origin: "https://mytrackspeed.com",
    now: () => Date.parse("2026-10-05T10:00:00Z"),
    rateLimit: async scope => {
      calls.push(`rate:${scope}`)
      return null
    },
    getUser: async () => {
      calls.push("getUser")
      return { ok: true, user: { id: UID, email: "coach@example.com", is_anonymous: false } }
    },
    generateLink: async email => {
      calls.push(`generate:${email}`)
      return { hashedToken: "hashed123" }
    },
  }
  return { deps: { ...base, ...overrides }, calls }
}

test("link endpoint rejects missing and malformed bearer tokens before any lookup", async () => {
  const { deps: d, calls } = deps()
  for (const header of [null, "", "Basic abc", "Bearer", "Bearer not-a-jwt", `Bearer ${TOKEN} extra`]) {
    const res = await handleDashboardLinkRequest(header, d)
    assert.equal(res.status, 401)
    assert.equal(res.body.error, "missing_token")
    assert.equal(res.headers["Cache-Control"], "no-store")
  }
  assert.deepEqual(calls, [])
  assert.equal(parseBearerToken(`bearer ${TOKEN}`), TOKEN)
})

test("link endpoint maps auth failures", async () => {
  const invalid = await handleDashboardLinkRequest(`Bearer ${TOKEN}`, deps({ getUser: async () => ({ ok: false, reason: "invalid" }) }).deps)
  assert.deepEqual([invalid.status, invalid.body.error], [401, "invalid_token"])
  const down = await handleDashboardLinkRequest(`Bearer ${TOKEN}`, deps({ getUser: async () => ({ ok: false, reason: "unavailable" }) }).deps)
  assert.deepEqual([down.status, down.body.error], [503, "auth_unavailable"])
  const anon = await handleDashboardLinkRequest(
    `Bearer ${TOKEN}`,
    deps({ getUser: async () => ({ ok: true, user: { id: UID, email: null, is_anonymous: true } }) }).deps,
  )
  assert.deepEqual([anon.status, anon.body.error], [403, "anonymous_user"])
  const noEmail = await handleDashboardLinkRequest(
    `Bearer ${TOKEN}`,
    deps({ getUser: async () => ({ ok: true, user: { id: UID, email: "  " } }) }).deps,
  )
  assert.deepEqual([noEmail.status, noEmail.body.error], [422, "email_required"])
})

test("link endpoint enforces rate limits by IP before verifying and by user after", async () => {
  const ip = deps({ rateLimit: async scope => (scope === "ip" ? { status: 429, retryAfter: "120" } : null) })
  const ipRes = await handleDashboardLinkRequest(`Bearer ${TOKEN}`, ip.deps)
  assert.deepEqual([ipRes.status, ipRes.body.error, ipRes.headers["Retry-After"]], [429, "rate_limited", "120"])
  assert.ok(!ip.calls.includes("getUser"), "token is not verified once the IP is limited")

  const user = deps({ rateLimit: async scope => (scope === "user" ? { status: 429, retryAfter: null } : null) })
  const userRes = await handleDashboardLinkRequest(`Bearer ${TOKEN}`, user.deps)
  assert.equal(userRes.status, 429)
  assert.ok(!user.calls.some(c => c.startsWith("generate:")))

  const unavailable = await handleDashboardLinkRequest(`Bearer ${TOKEN}`, deps({ rateLimit: async () => ({ status: 503 }) }).deps)
  assert.deepEqual([unavailable.status, unavailable.body.error], [503, "rate_limit_unavailable"])
})

test("link endpoint returns a dashboard URL on the configured origin", async () => {
  const { deps: d, calls } = deps()
  const res = await handleDashboardLinkRequest(`Bearer ${TOKEN}`, d)
  assert.equal(res.status, 200)
  assert.equal(res.body.url, "https://mytrackspeed.com/dashboard/auth#token_hash=hashed123&type=magiclink")
  assert.equal(new URL(res.body.url as string).search, "", "the token never appears in the query string")
  assert.equal(res.body.expiresAt, "2026-10-05T11:00:00.000Z")
  assert.equal(res.headers["Cache-Control"], "no-store")
  assert.deepEqual(calls, ["rate:ip", "getUser", "rate:user", "generate:coach@example.com"])

  const failed = await handleDashboardLinkRequest(`Bearer ${TOKEN}`, deps({ generateLink: async () => null }).deps)
  assert.deepEqual([failed.status, failed.body.error], [502, "link_failed"])
})

test("dashboard origin comes from configuration and only allows https or localhost", () => {
  assert.equal(resolveDashboardOrigin(undefined), DEFAULT_DASHBOARD_ORIGIN)
  assert.equal(resolveDashboardOrigin("https://staging.mytrackspeed.com/some/path"), "https://staging.mytrackspeed.com")
  assert.equal(resolveDashboardOrigin("http://evil.example.com"), DEFAULT_DASHBOARD_ORIGIN)
  assert.equal(resolveDashboardOrigin("http://localhost:3417"), "http://localhost:3417")
  assert.equal(resolveDashboardOrigin("javascript:alert(1)"), DEFAULT_DASHBOARD_ORIGIN)
  assert.equal(resolveDashboardOrigin("not a url"), DEFAULT_DASHBOARD_ORIGIN)
  assert.equal(
    buildDashboardLinkUrl("https://mytrackspeed.com", "a+b/c="),
    "https://mytrackspeed.com/dashboard/auth#token_hash=a%2Bb%2Fc%3D&type=magiclink",
  )
})

test("constructed photo paths match the app's uppercase storage folders", () => {
  const uid = "6f1c2a9e-3b4d-4e5f-8a7b-0c1d2e3f4a5b"
  const runId = "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d"
  const UID_UP = uid.toUpperCase()
  const RUN_UP = runId.toUpperCase()

  // Postgres returns lowercase ids; the stored thumbnail path is uppercase.
  const stored = { id: runId, userId: uid, finishImage: `users/${UID_UP}/runs/${RUN_UP}.jpg` }
  assert.equal(runPhotoPath(stored, "_start"), `users/${UID_UP}/runs/${RUN_UP}_start.jpg`)
  assert.equal(runPhotoPath(stored, "_lap2"), `users/${UID_UP}/runs/${RUN_UP}_lap2.jpg`)
  assert.equal(runPhotoPath(stored, ""), `users/${UID_UP}/runs/${RUN_UP}.jpg`)

  // The folder comes from the run's own path, keeping its exact casing.
  const mixed = { id: runId, userId: uid, finishImage: `users/${uid}/runs/${runId}.jpg` }
  assert.equal(runPhotoPath(mixed, "_start"), `users/${uid}/runs/${runId}_start.jpg`)

  // No photo yet: build the path in uppercase.
  const none = { id: runId, userId: uid, finishImage: null }
  assert.equal(runPhotoPath(none, "_lap1"), `users/${UID_UP}/runs/${RUN_UP}_lap1.jpg`)
  assert.equal(runImagePath(uid, runId, ""), `users/${UID_UP}/runs/${RUN_UP}.jpg`)
  assert.equal(runPhotoPath({ id: runId, userId: null, finishImage: null }, "_start"), null)

  const dataset = buildDataset(
    {
      sessions: [session()],
      athletes: [athlete({ id: "ath-photo", photo_url: `users/${UID_UP}/athletes/ATH-PHOTO.jpg` })],
      runs: [
        run({
          id: runId,
          user_id: uid,
          athlete_id: "ath-photo",
          thumbnail_url: `users/${UID_UP}/runs/${RUN_UP}.jpg`,
          splits_json: splitsJson([
            { fromGateIndex: 0, toGateIndex: 1, splitNanos: 1_000_000_000, cumulativeSplitNanos: 1_000_000_000 },
            { fromGateIndex: 1, toGateIndex: 2, splitNanos: 1_000_000_000, cumulativeSplitNanos: 2_000_000_000 },
          ]),
        }),
      ],
    },
    { now: NOW },
  )
  const paths = runFrames(dataset.runs[0], [
    { id: "c", session_id: "tok", run_id: runId, gate_role: "finish", thumbnail_url: "crossings/AbC123/Finish.jpg", created_at: null },
  ]).map(frame => frame.sources.map(s => (s.kind === "path" ? s.path : s.url)))
  assert.deepEqual(paths, [
    [`users/${UID_UP}/runs/${RUN_UP}_start.jpg`],
    [`users/${UID_UP}/runs/${RUN_UP}_lap1.jpg`],
    [`users/${UID_UP}/runs/${RUN_UP}.jpg`, "crossings/AbC123/Finish.jpg"],
  ])
  // Stored paths (athlete photos, crossings) are used exactly as written.
  assert.equal(findAthlete(dataset, "ath-photo")?.photo, `users/${UID_UP}/athletes/ATH-PHOTO.jpg`)
})
