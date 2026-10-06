'use client'

import Link from 'next/link'
import { sessionHref, UNASSIGNED_KEY, UNFILED_KEY } from '@/lib/dashboard/normalize'
import { eventName, formatClock, formatTime } from '@/lib/dashboard/format'
import type { Dataset, DashboardSession } from '@/lib/dashboard/types'
import { finishSources } from '../RunsList'
import { Photo } from '../Photo'
import { AthleteDot } from '../ui'

export function sessionDay(ms: number): string {
  if (!ms) return 'Date unknown'
  return new Date(ms).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

export function SessionAthletes({ session, dataset }: { session: DashboardSession; dataset: Dataset }) {
  const athletes = session.athleteKeys
    .map(key => (key === UNASSIGNED_KEY ? null : dataset.athletes.find(athlete => athlete.key === key)))
    .filter((athlete): athlete is NonNullable<typeof athlete> => Boolean(athlete))
  const hasUnassigned = session.athleteKeys.includes(UNASSIGNED_KEY)
  const names = athletes.map(athlete => athlete.name)
  if (hasUnassigned) names.push('unassigned')
  const label = names.length === 0 ? 'No athletes' : names.join(', ')

  if (athletes.length === 1 && !hasUnassigned) {
    return (
      <span className="inline-flex min-w-0 items-center gap-2 text-(--d-ink-2)">
        <AthleteDot color={athletes[0].color} />
        <span className="truncate">{athletes[0].name}</span>
      </span>
    )
  }
  if (athletes.length === 0) return <span className="text-(--d-ink-3)">Unassigned</span>
  return (
    <span className="inline-flex min-w-0 items-center gap-2 text-(--d-ink-2)" title={label}>
      <span className="flex gap-[3px]" aria-hidden="true">
        {athletes.slice(0, 5).map(athlete => (
          <AthleteDot key={athlete.key} color={athlete.color} />
        ))}
      </span>
      <span className="truncate">
        {athletes.length} athletes{hasUnassigned ? ' + unassigned' : ''}
      </span>
      <span className="sr-only">: {label}</span>
    </span>
  )
}

export function SessionThumbs({ session, count = 4 }: { session: DashboardSession; count?: number }) {
  const runs = session.runs.slice(0, count)
  return (
    <div className="flex gap-1" aria-hidden="true">
      {runs.map(run => (
        <Photo key={run.id} sources={finishSources(run)} alt="" className="h-12 w-9 rounded-[5px]" />
      ))}
      {Array.from({ length: Math.max(0, count - runs.length) }).map((_, i) => (
        <div key={`pad-${i}`} className="h-12 w-9 rounded-[5px] bg-(--d-raise)" />
      ))}
    </div>
  )
}

/** Column labels matching SessionRow on wide screens. */
export function SessionRowHeader({ children }: { children?: React.ReactNode }) {
  return (
    <div className="hidden grid-cols-[156px_minmax(0,1.1fr)_minmax(0,1fr)_64px_84px] gap-x-5 border-b border-(--d-line) pb-2.5 text-[12px] text-(--d-ink-3) md:grid">
      {children ?? (
        <>
          <span>Finish photos</span>
          <span>Session</span>
          <span>Athletes</span>
          <span className="justify-self-end">Runs</span>
          <span className="justify-self-end">Best (s)</span>
        </>
      )}
    </div>
  )
}

/** One session as a navigable row: finish photos, date, event, athletes, best time. */
export function SessionRow({ session, dataset }: { session: DashboardSession; dataset: Dataset }) {
  const title = session.key === UNFILED_KEY ? 'Unfiled runs' : session.name ?? sessionDay(session.date)
  return (
    <Link
      href={sessionHref(session.key)}
      className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-5 gap-y-3 border-b border-(--d-line) py-3.5 transition-colors hover:bg-(--d-raise) md:-mx-3 md:grid-cols-[156px_minmax(0,1.1fr)_minmax(0,1fr)_64px_84px] md:rounded-lg md:border-b-0 md:px-3"
    >
      <div className="order-3 col-span-2 md:order-none md:col-span-1">
        <SessionThumbs session={session} />
      </div>
      <div className="min-w-0">
        <div className="truncate text-[14px] font-medium text-(--d-ink)">{title}</div>
        <div className="truncate text-[13px] text-(--d-ink-3)">
          {session.name && session.key !== UNFILED_KEY ? `${sessionDay(session.date)}, ` : ''}
          {eventName(session)}
          {session.eventKeys.length > 1 ? ', mixed' : ''}
          <span className="md:hidden">, {session.runs.length} {session.runs.length === 1 ? 'run' : 'runs'}</span>
          {session.key !== UNFILED_KEY ? <span className="hidden md:inline">, {formatClock(session.date)}</span> : null}
        </div>
      </div>
      <div className="hidden min-w-0 text-[14px] md:block">
        <SessionAthletes session={session} dataset={dataset} />
      </div>
      <div className="hidden text-right text-[14px] tabular-nums text-(--d-ink-2) md:block">
        {session.runs.length}
        <span className="sr-only"> runs</span>
      </div>
      <div className="text-right">
        <div className="text-[16px] font-semibold tabular-nums text-(--d-ink)">{session.best ? formatTime(session.best.time, 2) : '–'}</div>
        <div className={session.isLaps ? 'text-[11px] text-(--d-ink-3)' : 'text-[11px] text-(--d-ink-3) md:hidden'}>{session.isLaps ? 'fastest lap' : 'best'}</div>
      </div>
    </Link>
  )
}
