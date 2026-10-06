'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { findAthlete, sessionHref, UNASSIGNED_KEY, UNFILED_KEY } from '@/lib/dashboard/normalize'
import {
  eventName,
  eventSubtitle,
  eventTitle,
  formatCount,
  formatDate,
  formatRelativeDay,
  formatSpeed,
  formatTime,
  speedMs,
} from '@/lib/dashboard/format'
import type { Dataset, DashboardAthlete, DashboardRun, DashboardSession } from '@/lib/dashboard/types'
import { useDashboard } from '../DashboardProvider'
import { ProgressionChart, type ProgressionPoint } from '../ProgressionChart'
import { RunPanel } from '../RunPanel'
import { RunsList, runColumns } from '../RunsList'
import { AthleteAvatar } from '../AthleteAvatar'
import { DataView, ExportCsvButton } from '../shared'
import { AthleteDot, Button, EmptyState, PageHeader, SectionTitle, cx } from '../ui'
import { sessionDay } from './SessionRow'

const SESSIONS_PAGE = 8

function BackLink() {
  return (
    <Link href="/dashboard/athletes" className="mb-4 inline-flex items-center gap-1 rounded-md text-[13px] text-(--d-ink-3) hover:text-(--d-ink)">
      <ChevronLeft size={15} aria-hidden="true" /> Athletes
    </Link>
  )
}

function BestsTable({ athlete, onOpen }: { athlete: DashboardAthlete; onOpen: (run: DashboardRun) => void }) {
  // Unassigned runs mix several people, so their best isn't anyone's PB.
  const bestLabel = athlete.key === UNASSIGNED_KEY ? 'Fastest' : 'Personal best'
  const { unit } = useDashboard()
  const seasonYear = athlete.bests[0]?.seasonYear ?? new Date().getFullYear()
  return (
    <>
    <ul className="md:hidden">
      {athlete.bests.map(best => (
        <li key={best.eventKey} className="flex items-start justify-between gap-4 border-b border-(--d-line) py-3 last:border-b-0">
          <div className="min-w-0">
            <div className="text-[15px] font-medium text-(--d-ink)">{eventTitle(best)}</div>
            <div className="text-[12px] text-(--d-ink-3)">{eventSubtitle(best)}</div>
            <div className="mt-1 text-[12px] tabular-nums text-(--d-ink-3)">
              {best.sb ? `${seasonYear} best ${formatTime(best.sb.time, 2)}, ` : ''}
              {formatCount(best.runCount, 'run')}
            </div>
          </div>
          <button type="button" onClick={() => onOpen(best.pb)} className="shrink-0 rounded-sm text-right" aria-label={`Open ${bestLabel.toLowerCase()} run, ${formatTime(best.pb.time, 3)} seconds`}>
            <span className="block text-[20px] font-semibold tabular-nums text-(--d-ink)">{formatTime(best.pb.time, 2)}</span>
            <span className="block text-[12px] text-(--d-ink-3)">
              {best.isLaps ? 'fastest lap' : formatSpeed(speedMs(best.pb.distance, best.pb.time), unit)}
            </span>
          </button>
        </li>
      ))}
    </ul>
    <div className="d-scroll-x hidden md:block">
      <table className="w-full min-w-[560px] border-collapse text-[14px]">
        <caption className="sr-only">Personal and season bests by event</caption>
        <thead>
          <tr className="border-b border-(--d-line) text-left text-[12px] text-(--d-ink-3)">
            <th scope="col" className="py-2.5 pr-4 font-normal">Event</th>
            <th scope="col" className="py-2.5 pr-4 font-normal">{bestLabel} (s)</th>
            <th scope="col" className="py-2.5 pr-4 font-normal">{seasonYear} best (s)</th>
            <th scope="col" className="py-2.5 pr-4 text-right font-normal">Speed</th>
            <th scope="col" className="py-2.5 pr-4 text-right font-normal">Runs</th>
            <th scope="col" className="py-2.5 text-right font-normal">Set on</th>
          </tr>
        </thead>
        <tbody>
          {athlete.bests.map(best => (
            <tr key={best.eventKey} className="border-b border-(--d-line) last:border-b-0">
              <th scope="row" className="py-3 pr-4 text-left font-normal">
                <span className="block font-medium text-(--d-ink)">{eventTitle(best)}</span>
                <span className="block text-[12px] text-(--d-ink-3)">{eventSubtitle(best)}</span>
              </th>
              <td className="py-3 pr-4">
                <button
                  type="button"
                  onClick={() => onOpen(best.pb)}
                  className="rounded-sm text-[18px] font-semibold tabular-nums text-(--d-ink) underline-offset-4 hover:underline"
                  aria-label={`Open ${bestLabel.toLowerCase()} run, ${formatTime(best.pb.time, 3)} seconds`}
                >
                  {formatTime(best.pb.time, 2)}
                </button>
                {best.isLaps ? <span className="ml-2 text-[12px] text-(--d-ink-3)">fastest lap</span> : null}
              </td>
              <td className="py-3 pr-4">
                {best.sb ? (
                  <button
                    type="button"
                    onClick={() => onOpen(best.sb as DashboardRun)}
                    className="rounded-sm tabular-nums text-(--d-ink-2) underline-offset-4 hover:text-(--d-ink) hover:underline"
                  >
                    {formatTime(best.sb.time, 2)}
                  </button>
                ) : (
                  <span className="text-(--d-ink-3)">–</span>
                )}
              </td>
              <td className="py-3 pr-4 text-right tabular-nums text-(--d-ink-2)">
                {best.isLaps ? '–' : formatSpeed(speedMs(best.pb.distance, best.pb.time), unit)}
              </td>
              <td className="py-3 pr-4 text-right tabular-nums text-(--d-ink-2)">{best.runCount}</td>
              <td className="py-3 text-right text-(--d-ink-3)">{formatDate(best.pb.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  )
}

function progressionPoints(runs: DashboardRun[], eventKey: string, sessionsByKey: Map<string, DashboardSession>): ProgressionPoint[] {
  const bySession = new Map<string, DashboardRun[]>()
  for (const run of runs) {
    if (run.eventKey !== eventKey) continue
    const list = bySession.get(run.sessionKey)
    if (list) list.push(run)
    else bySession.set(run.sessionKey, [run])
  }
  const points: ProgressionPoint[] = []
  for (const [key, list] of bySession) {
    const best = list.reduce((a, b) => (b.time < a.time ? b : a))
    points.push({ date: sessionsByKey.get(key)?.date || best.createdAt, run: best, runCount: list.length })
  }
  return points
}

function AthleteDetail({ dataset, athlete }: { dataset: Dataset; athlete: DashboardAthlete }) {
  const { unit, sessionsByKey } = useDashboard()
  const runs = useMemo(() => dataset.runs.filter(run => run.athleteKey === athlete.key), [dataset, athlete])
  const sessions = useMemo(
    () =>
      dataset.sessions
        .filter(session => session.runs.some(run => run.athleteKey === athlete.key))
        .map(session => ({ session, runs: session.runs.filter(run => run.athleteKey === athlete.key) })),
    [dataset, athlete],
  )
  const orderedRuns = useMemo(() => sessions.flatMap(group => group.runs), [sessions])
  const columns = useMemo(() => runColumns(orderedRuns), [orderedRuns])

  const chartEvents = useMemo(
    () => athlete.bests.filter(best => !best.isLaps).sort((a, b) => b.runCount - a.runCount),
    [athlete],
  )
  const [eventKey, setEventKey] = useState<string | null>(null)
  const selectedEvent = chartEvents.find(best => best.eventKey === eventKey) ?? chartEvents[0] ?? null
  const points = useMemo(
    () => (selectedEvent ? progressionPoints(runs, selectedEvent.eventKey, sessionsByKey) : []),
    [runs, selectedEvent, sessionsByKey],
  )

  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const openRun = (run: DashboardRun) => {
    const index = orderedRuns.findIndex(item => item.id === run.id)
    if (index >= 0) setOpenIndex(index)
  }
  const [visibleSessions, setVisibleSessions] = useState(SESSIONS_PAGE)
  const isUnassigned = athlete.key === UNASSIGNED_KEY

  return (
    <>
      <PageHeader
        leading={<BackLink />}
        title={
          <span className="flex items-center gap-3.5">
            {isUnassigned ? (
              <AthleteDot color={null} size={12} />
            ) : (
              <AthleteAvatar name={athlete.name} color={athlete.color} photo={athlete.photo} size={44} />
            )}
            <span className="min-w-0 truncate">{athlete.name}</span>
          </span>
        }
        description={
          <>
            {formatCount(athlete.runCount, 'run')} in {formatCount(athlete.sessionCount, 'session')}, last active{' '}
            {formatRelativeDay(athlete.lastActive, { inSentence: true })}.
            {isUnassigned ? (
              <span className="mt-1 block text-[14px] text-(--d-ink-3)">
                These were timed without an athlete selected. Select an athlete in the app before a run to file it here by name.
              </span>
            ) : null}
          </>
        }
        actions={<ExportCsvButton runs={orderedRuns} name={[athlete.name]} />}
      />

      <section aria-labelledby="bests-title">
        <SectionTitle id="bests-title">{isUnassigned ? 'Fastest times' : 'Personal and season bests'}</SectionTitle>
        <BestsTable athlete={athlete} onOpen={openRun} />
      </section>

      {selectedEvent && points.length > 0 ? (
        <section className="mt-12" aria-labelledby="progress-title">
          <SectionTitle id="progress-title" aside="Best time per session, faster is higher">
            Progression
          </SectionTitle>
          {chartEvents.length > 1 ? (
            <div role="group" aria-label="Event" className="mb-5 flex flex-wrap gap-1.5">
              {chartEvents.map(best => {
                const selected = best.eventKey === selectedEvent.eventKey
                return (
                  <button
                    key={best.eventKey}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setEventKey(best.eventKey)}
                    className={cx(
                      'h-8 rounded-full border px-3 text-[13px] transition-colors',
                      selected
                        ? 'border-(--d-ink) bg-(--d-ink) text-(--d-bg)'
                        : 'border-(--d-line-strong) text-(--d-ink-2) hover:border-(--d-ink-3) hover:text-(--d-ink)',
                    )}
                  >
                    {eventName(best)}
                  </button>
                )
              })}
            </div>
          ) : (
            <p className="mb-4 text-[13px] text-(--d-ink-2)">{eventName(selectedEvent)}</p>
          )}
          {points.length < 2 ? (
            <p className="rounded-lg border border-dashed border-(--d-line-strong) px-4 py-6 text-center text-[14px] text-(--d-ink-2)">
              One session so far. The trend appears after a second session at this distance.
            </p>
          ) : (
            <ProgressionChart
              points={points}
              unit={unit}
              onSelect={openRun}
              label={`${athlete.name}, ${eventName(selectedEvent)}, best time per session`}
            />
          )}
        </section>
      ) : null}

      <section className="mt-12" aria-labelledby="sessions-title">
        <SectionTitle id="sessions-title" aside={formatCount(sessions.length, 'session')}>
          Runs by session
        </SectionTitle>
        <div className="flex flex-col gap-10">
          {sessions.slice(0, visibleSessions).map(({ session, runs: sessionRuns }) => (
            <div key={session.key}>
              <div className="mb-1 flex items-baseline justify-between gap-4 border-b border-(--d-line) pb-2">
                <Link href={sessionHref(session.key)} className="min-w-0 truncate text-[14px] font-medium text-(--d-ink) underline-offset-4 hover:underline">
                  {session.key === UNFILED_KEY ? 'Unfiled runs' : session.name ?? sessionDay(session.date)}
                  {session.name && session.key !== UNFILED_KEY ? (
                    <span className="ml-2 font-normal text-(--d-ink-3)">{sessionDay(session.date)}</span>
                  ) : null}
                </Link>
                <span className="shrink-0 text-[13px] text-(--d-ink-3)">
                  {eventName(session)}, {formatCount(sessionRuns.length, 'run')}
                </span>
              </div>
              <RunsList runs={sessionRuns} onOpen={openRun} showAthlete={false} columns={columns} caption={`Runs on ${sessionDay(session.date)}`} />
            </div>
          ))}
        </div>
        {sessions.length > visibleSessions ? (
          <div className="mt-8 flex justify-center">
            <Button onClick={() => setVisibleSessions(count => count + SESSIONS_PAGE)}>
              Show more sessions ({sessions.length - visibleSessions} left)
            </Button>
          </div>
        ) : null}
      </section>

      <RunPanel runs={orderedRuns} index={openIndex} onIndexChange={setOpenIndex} onClose={() => setOpenIndex(null)} showSessionLink />
    </>
  )
}

export function AthleteDetailView({ athleteKey }: { athleteKey: string }) {
  return (
    <DataView>
      {dataset => {
        const athlete = findAthlete(dataset, athleteKey)
        if (!athlete) {
          return (
            <>
              <BackLink />
              <EmptyState title="Athlete not found">
                This athlete has no uploaded runs on this account. They may have been renamed or removed in the app.
              </EmptyState>
            </>
          )
        }
        if (athlete.runCount === 0) {
          return (
            <>
              <PageHeader leading={<BackLink />} title={athlete.name} />
              <EmptyState title={`No runs for ${athlete.name} yet`}>
                Select {athlete.name} in the TrackSpeed app before a run. Their times, splits and photos will show up here after the session uploads.
              </EmptyState>
            </>
          )
        }
        return <AthleteDetail key={athlete.key} dataset={dataset} athlete={athlete} />
      }}
    </DataView>
  )
}
