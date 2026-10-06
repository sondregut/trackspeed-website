'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { athleteHref, sessionHref, UNASSIGNED_KEY } from '@/lib/dashboard/normalize'
import {
  eventSubtitle,
  eventTitle,
  formatDate,
  formatRelativeDay,
  formatSpeed,
  formatTime,
  speedMs,
} from '@/lib/dashboard/format'
import type { Dataset, DashboardRun } from '@/lib/dashboard/types'
import { useDashboard } from '../DashboardProvider'
import { DataView } from '../shared'
import { PageHeader, SectionTitle, AthleteDot, TextLink } from '../ui'
import { SessionRow, SessionRowHeader } from './SessionRow'

interface EventLeaders {
  key: string
  distance: number
  startType: string | null
  isLaps: boolean
  leaders: DashboardRun[]
}

function leadersByEvent(dataset: Dataset): EventLeaders[] {
  const byEvent = new Map<string, Map<string, DashboardRun>>()
  for (const run of dataset.runs) {
    let athletes = byEvent.get(run.eventKey)
    if (!athletes) {
      athletes = new Map()
      byEvent.set(run.eventKey, athletes)
    }
    const current = athletes.get(run.athleteKey)
    if (!current || run.time < current.time || (run.time === current.time && run.createdAt < current.createdAt)) {
      athletes.set(run.athleteKey, run)
    }
  }
  return dataset.events
    .filter(event => byEvent.has(event.key))
    .map(event => ({
      key: event.key,
      distance: event.distance,
      startType: event.startType,
      isLaps: event.isLaps,
      leaders: [...(byEvent.get(event.key) as Map<string, DashboardRun>).values()].sort((a, b) => a.time - b.time),
    }))
}

function Stat({ label, value, detail }: { label: string; value: React.ReactNode; detail?: React.ReactNode }) {
  return (
    <div className="min-w-0 py-1">
      <dt className="text-[13px] text-(--d-ink-3)">{label}</dt>
      <dd className="mt-1.5 truncate text-[30px] font-semibold leading-none tracking-[-0.02em] text-(--d-ink)">{value}</dd>
      {detail ? <dd className="mt-2 truncate text-[13px] text-(--d-ink-2)">{detail}</dd> : null}
    </div>
  )
}

function AthleteName({ run }: { run: DashboardRun }) {
  if (run.athleteKey === UNASSIGNED_KEY) {
    return (
      <span className="inline-flex min-w-0 items-center gap-2 text-(--d-ink-3)">
        <AthleteDot color={null} /> Unassigned
      </span>
    )
  }
  return (
    <Link href={athleteHref(run.athleteKey)} className="inline-flex min-w-0 items-center gap-2 text-(--d-ink) underline-offset-4 hover:underline">
      <AthleteDot color={run.athleteColor} />
      <span className="truncate">{run.athleteName}</span>
    </Link>
  )
}

function Overview({ dataset }: { dataset: Dataset }) {
  const { unit } = useDashboard()
  const events = useMemo(() => leadersByEvent(dataset), [dataset])
  const latest = dataset.sessions[0]
  const recent = dataset.sessions.slice(0, 6)
  const athleteCount = dataset.athletes.filter(athlete => athlete.runCount > 0).length

  return (
    <>
      <PageHeader title="Overview" description="Every run your phones have uploaded, with the fastest times by event." />

      <dl className="grid grid-cols-2 gap-x-6 gap-y-7 border-y border-(--d-line) py-6 sm:grid-cols-4 sm:gap-x-0 sm:divide-x sm:divide-(--d-line) sm:[&>div]:px-6 sm:[&>div:first-child]:pl-0">
        <Stat label="Athletes" value={athleteCount.toLocaleString('en-US')} detail={dataset.unassigned ? `${dataset.unassigned.runCount.toLocaleString('en-US')} runs unassigned` : 'All runs assigned'} />
        <Stat label="Sessions" value={dataset.sessions.length.toLocaleString('en-US')} />
        <Stat label="Runs" value={dataset.runs.length.toLocaleString('en-US')} />
        <Stat
          label="Last session"
          value={latest ? formatRelativeDay(latest.date) : '–'}
          detail={latest ? <Link href={sessionHref(latest.key)} className="underline-offset-4 hover:underline">{formatDate(latest.date)}</Link> : null}
        />
      </dl>

      <section className="mt-12" aria-labelledby="pbs-title">
        <SectionTitle id="pbs-title" aside="Fastest per event across all athletes">Personal bests</SectionTitle>
        <div className="border-t border-(--d-line)">
          {events.map(event => {
            const [best, ...others] = event.leaders
            return (
              <div key={event.key} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-1 border-b border-(--d-line) py-4 md:grid-cols-[180px_120px_minmax(0,1fr)_120px] md:items-baseline">
                <div className="min-w-0">
                  <div className="text-[15px] font-medium text-(--d-ink)">{eventTitle(event)}</div>
                  <div className="text-[13px] text-(--d-ink-3)">{eventSubtitle(event)}</div>
                </div>
                <div className="max-md:text-right">
                  <div className="text-[22px] font-semibold leading-tight tracking-[-0.01em] tabular-nums text-(--d-ink)">{formatTime(best.time, 2)}</div>
                  <div className="text-[12px] text-(--d-ink-3)">{event.isLaps ? 'Fastest lap' : formatSpeed(speedMs(best.distance, best.time), unit)}</div>
                </div>
                <div className="col-span-2 min-w-0 md:col-span-1">
                  <div className="text-[14px]"><AthleteName run={best} /></div>
                  {others.length ? (
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-(--d-ink-2)">
                      {others.slice(0, 3).map(run => (
                        <span key={run.athleteKey} className="inline-flex items-center gap-1.5">
                          <AthleteDot color={run.athleteColor} size={6} />
                          <span className="max-w-[9rem] truncate">{run.athleteKey === UNASSIGNED_KEY ? 'Unassigned' : run.athleteName}</span>
                          <span className="tabular-nums text-(--d-ink-3)">{formatTime(run.time, 2)}</span>
                        </span>
                      ))}
                      {others.length > 3 ? <span className="text-(--d-ink-3)">and {others.length - 3} more</span> : null}
                    </div>
                  ) : null}
                </div>
                <div className="col-span-2 text-[13px] text-(--d-ink-3) md:col-span-1 md:text-right">
                  <Link href={sessionHref(best.sessionKey)} className="underline-offset-4 hover:text-(--d-ink) hover:underline">
                    {formatDate(best.createdAt)}
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="mt-12" aria-labelledby="recent-title">
        <SectionTitle id="recent-title" aside={<TextLink href="/dashboard/sessions">All {dataset.sessions.length.toLocaleString('en-US')} sessions</TextLink>}>
          Recent sessions
        </SectionTitle>
        <SessionRowHeader />
        <div className="max-md:border-t max-md:border-(--d-line) md:pt-1">
          {recent.map(session => (
            <SessionRow key={session.key} session={session} dataset={dataset} />
          ))}
        </div>
      </section>

      {dataset.dropped.duplicates > 0 ? (
        <p className="mt-10 text-[12px] text-(--d-ink-3)">
          {dataset.dropped.duplicates === 1
            ? 'One duplicate upload from an older app version is hidden.'
            : `${dataset.dropped.duplicates.toLocaleString('en-US')} duplicate uploads from older app versions are hidden.`}
        </p>
      ) : null}
    </>
  )
}

export function OverviewView() {
  return <DataView>{dataset => <Overview dataset={dataset} />}</DataView>
}
