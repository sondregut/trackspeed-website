'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { athleteHref, normalizeName } from '@/lib/dashboard/normalize'
import { eventName, formatCount, formatRelativeDay, formatTime } from '@/lib/dashboard/format'
import type { Dataset, DashboardAthlete } from '@/lib/dashboard/types'
import { AthleteAvatar } from '../AthleteAvatar'
import { DataView } from '../shared'
import { AthleteDot, EmptyState, PageHeader } from '../ui'

function BestEvents({ athlete, limit = 2 }: { athlete: DashboardAthlete; limit?: number }) {
  const bests = [...athlete.bests].filter(best => !best.isLaps).sort((a, b) => b.runCount - a.runCount).slice(0, limit)
  if (bests.length === 0) {
    const laps = athlete.bests.find(best => best.isLaps)
    return laps ? (
      <span className="text-(--d-ink-2)">
        Fastest lap <span className="tabular-nums text-(--d-ink)">{formatTime(laps.pb.time, 2)}</span>
      </span>
    ) : (
      <span className="text-(--d-ink-3)">No timed runs</span>
    )
  }
  return (
    <span className="flex flex-col gap-0.5">
      {bests.map(best => (
        <span key={best.eventKey} className="flex items-baseline justify-between gap-3 text-[13px] md:justify-start">
          <span className="text-(--d-ink-2)">{eventName(best)}</span>
          <span className="font-medium tabular-nums text-(--d-ink)">{formatTime(best.pb.time, 2)}</span>
        </span>
      ))}
    </span>
  )
}

function AthleteRow({ athlete }: { athlete: DashboardAthlete }) {
  return (
    <Link
      href={athleteHref(athlete.key)}
      className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-2 border-b border-(--d-line) py-4 transition-colors hover:bg-(--d-raise) md:-mx-3 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)_90px_110px] md:items-center md:rounded-lg md:border-b-0 md:px-3"
    >
      <span className="flex min-w-0 items-center gap-3">
        <AthleteAvatar name={athlete.name} color={athlete.color} photo={athlete.photo} size={34} />
        <span className="min-w-0">
          <span className="block truncate text-[15px] font-medium text-(--d-ink)">{athlete.name}</span>
          {athlete.nickname ? <span className="block truncate text-[12px] text-(--d-ink-3)">{athlete.nickname}</span> : null}
        </span>
      </span>
      <span className="text-right text-[13px] text-(--d-ink-3) md:order-last">{formatRelativeDay(athlete.lastActive)}</span>
      <span className="col-span-2 pl-[46px] md:col-span-1 md:pl-0">
        <BestEvents athlete={athlete} />
      </span>
      <span className="hidden text-right text-[14px] tabular-nums text-(--d-ink-2) md:block">
        {athlete.runCount.toLocaleString('en-US')}
        <span className="sr-only"> runs</span>
      </span>
    </Link>
  )
}

function Athletes({ dataset }: { dataset: Dataset }) {
  const [query, setQuery] = useState('')
  const active = dataset.athletes.filter(athlete => athlete.runCount > 0)
  const rosterOnly = dataset.athletes.filter(athlete => athlete.runCount === 0)
  const filtered = useMemo(() => {
    const q = normalizeName(query)
    if (!q) return active
    return active.filter(athlete => normalizeName(athlete.name).includes(q) || normalizeName(athlete.nickname ?? '').includes(q))
  }, [active, query])
  const unassigned = dataset.unassigned
  const share = unassigned ? Math.round((unassigned.runCount / dataset.runs.length) * 100) : 0

  return (
    <>
      <PageHeader
        title="Athletes"
        description="Everyone you’ve timed. Pick the athlete in the app before each run to keep their history together."
      />

      {unassigned ? (
        <Link
          href={athleteHref(unassigned.key)}
          className="mb-10 flex flex-col gap-3 rounded-xl border border-(--d-line-strong) px-5 py-4 transition-colors hover:bg-(--d-raise) sm:flex-row sm:items-center sm:justify-between"
        >
          <span className="flex items-center gap-3">
            <AthleteDot color={null} size={10} />
            <span>
              <span className="block text-[15px] font-medium text-(--d-ink)">Unassigned runs</span>
              <span className="block text-[13px] text-(--d-ink-2)">
                {formatCount(unassigned.runCount, 'run')} in {formatCount(unassigned.sessionCount, 'session')} were timed without an athlete
                {share >= 50 ? `, ${share}% of everything you’ve timed` : ''}.
              </span>
            </span>
          </span>
          <span className="pl-[22px] text-[13px] text-(--d-ink-3) sm:pl-0">Last run {formatRelativeDay(unassigned.lastActive, { inSentence: true })}</span>
        </Link>
      ) : null}

      {active.length > 6 ? (
        <label className="relative mb-4 block max-w-xs">
          <span className="sr-only">Search athletes</span>
          <Search size={15} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--d-ink-3)" />
          <input
            type="search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search athletes"
            className="d-input w-full pl-9"
          />
        </label>
      ) : null}

      {active.length === 0 ? (
        <EmptyState title="No athletes yet">
          Add athletes in the TrackSpeed app and select one before a run. Their runs, bests and photos will appear here.
        </EmptyState>
      ) : (
        <div>
          <div className="hidden grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)_90px_110px] gap-x-6 border-b border-(--d-line) pb-2.5 text-[12px] text-(--d-ink-3) md:grid">
            <span>Athlete</span>
            <span>Most-run events, personal best</span>
            <span className="text-right">Runs</span>
            <span className="text-right">Last active</span>
          </div>
          {filtered.map(athlete => (
            <AthleteRow key={athlete.key} athlete={athlete} />
          ))}
          {filtered.length === 0 ? <p className="py-8 text-center text-[14px] text-(--d-ink-3)">No athletes match “{query}”.</p> : null}
        </div>
      )}

      {rosterOnly.length ? (
        <p className="mt-8 text-[13px] text-(--d-ink-3)">
          Also in your roster without uploaded runs: {rosterOnly.map(athlete => athlete.name).join(', ')}.
        </p>
      ) : null}
    </>
  )
}

export function AthletesView() {
  return <DataView>{dataset => <Athletes dataset={dataset} />}</DataView>
}
