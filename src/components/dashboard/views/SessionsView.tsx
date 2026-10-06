'use client'

import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, Search } from 'lucide-react'
import { compareEventKeys, normalizeName, UNASSIGNED_KEY } from '@/lib/dashboard/normalize'
import { eventName, formatCount } from '@/lib/dashboard/format'
import type { Dataset, DashboardSession } from '@/lib/dashboard/types'
import { DataView, ExportCsvButton } from '../shared'
import { Button, PageHeader, cx } from '../ui'
import { SessionRow, SessionRowHeader, sessionDay } from './SessionRow'

type SortKey = 'date' | 'event' | 'runs' | 'best'
type SortDir = 'asc' | 'desc'

const PAGE = 40

function startOfDay(value: string): number | null {
  if (!value) return null
  const [y, m, d] = value.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d).getTime()
}

function sortSessions(sessions: DashboardSession[], key: SortKey, dir: SortDir): DashboardSession[] {
  const sign = dir === 'asc' ? 1 : -1
  return [...sessions].sort((a, b) => {
    let result = 0
    if (key === 'date') result = a.date - b.date
    if (key === 'runs') result = a.runs.length - b.runs.length
    if (key === 'event') result = compareEventKeys(a.eventKey, b.eventKey)
    if (key === 'best') result = (a.best?.time ?? Infinity) - (b.best?.time ?? Infinity)
    return result * sign || b.date - a.date
  })
}

function SortHeader({
  label,
  column,
  sort,
  onSort,
  align = 'left',
}: {
  label: string
  column: SortKey
  sort: { key: SortKey; dir: SortDir }
  onSort: (key: SortKey) => void
  align?: 'left' | 'right'
}) {
  const active = sort.key === column
  const Icon = sort.dir === 'asc' ? ArrowUp : ArrowDown
  return (
    <button
      type="button"
      onClick={() => onSort(column)}
      aria-label={`Sort by ${label.toLowerCase()}${active ? `, currently ${sort.dir === 'asc' ? 'ascending' : 'descending'}` : ''}`}
      className={cx(
        'inline-flex items-center gap-1 rounded-sm hover:text-(--d-ink)',
        align === 'right' && 'justify-self-end',
        active && 'text-(--d-ink)',
      )}
    >
      {label}
      {active ? <Icon size={12} aria-hidden="true" /> : null}
    </button>
  )
}

function Sessions({ dataset }: { dataset: Dataset }) {
  const [query, setQuery] = useState('')
  const [athlete, setAthlete] = useState('')
  const [event, setEvent] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: 'date', dir: 'desc' })
  const [visible, setVisible] = useState(PAGE)

  const athleteNames = useMemo(() => new Map(dataset.athletes.map(item => [item.key, item.name])), [dataset])

  const filtered = useMemo(() => {
    const q = normalizeName(query)
    const fromMs = startOfDay(from)
    const toStart = startOfDay(to)
    const toMs = toStart === null ? null : toStart + 86400000
    const list = dataset.sessions.filter(session => {
      if (athlete && !session.athleteKeys.includes(athlete)) return false
      if (event && !session.eventKeys.includes(event)) return false
      if (fromMs !== null && session.date < fromMs) return false
      if (toMs !== null && session.date >= toMs) return false
      if (q) {
        const haystack = normalizeName(
          [
            sessionDay(session.date),
            eventName(session),
            session.name ?? '',
            session.location ?? '',
            session.notes ?? '',
            ...session.athleteKeys.map(key => (key === UNASSIGNED_KEY ? 'unassigned' : athleteNames.get(key) ?? '')),
          ].join(' '),
        )
        if (!haystack.includes(q)) return false
      }
      return true
    })
    return sortSessions(list, sort.key, sort.dir)
  }, [dataset, query, athlete, event, from, to, sort, athleteNames])

  const filtersActive = Boolean(query || athlete || event || from || to)
  const exportRuns = useMemo(() => filtered.flatMap(session => session.runs), [filtered])
  const onSort = (key: SortKey) => {
    setSort(current => (current.key === key ? { key, dir: current.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: key === 'best' || key === 'event' ? 'asc' : 'desc' }))
  }
  const clear = () => {
    setQuery('')
    setAthlete('')
    setEvent('')
    setFrom('')
    setTo('')
  }

  const athletesWithRuns = dataset.athletes.filter(item => item.runCount > 0)

  return (
    <>
      <PageHeader
        title="Sessions"
        description="Every timing session, newest first. Open one to see each run’s photos and splits."
        actions={<ExportCsvButton runs={exportRuns} name={['sessions', filtersActive ? 'filtered' : 'all']} />}
      />

      <div className="mb-6 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
        <label className="relative col-span-2 sm:w-64">
          <span className="sr-only">Search sessions</span>
          <Search size={15} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--d-ink-3)" />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search date, athlete, event"
            className="d-input w-full pl-9"
          />
        </label>
        <label className="min-w-0">
          <span className="sr-only">Athlete</span>
          <select value={athlete} onChange={e => setAthlete(e.target.value)} className="d-input w-full sm:w-44">
            <option value="">All athletes</option>
            {athletesWithRuns.map(item => (
              <option key={item.key} value={item.key}>
                {item.name}
              </option>
            ))}
            {dataset.unassigned ? <option value={UNASSIGNED_KEY}>Unassigned</option> : null}
          </select>
        </label>
        <label className="min-w-0">
          <span className="sr-only">Event</span>
          <select value={event} onChange={e => setEvent(e.target.value)} className="d-input w-full sm:w-48">
            <option value="">All events</option>
            {dataset.events.map(item => (
              <option key={item.key} value={item.key}>
                {eventName(item)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-w-0 items-center gap-2 text-[13px] text-(--d-ink-3)">
          <span>From</span>
          <input type="date" value={from} max={to || undefined} onChange={e => setFrom(e.target.value)} className="d-input w-full sm:w-[150px]" />
        </label>
        <label className="flex min-w-0 items-center gap-2 text-[13px] text-(--d-ink-3)">
          <span>To</span>
          <input type="date" value={to} min={from || undefined} onChange={e => setTo(e.target.value)} className="d-input w-full sm:w-[150px]" />
        </label>
        {filtersActive ? (
          <Button variant="ghost" onClick={clear} className="col-span-2 justify-self-start sm:col-span-1">
            Clear filters
          </Button>
        ) : null}
      </div>

      <div className="mb-2 flex items-center justify-between gap-4 text-[13px] text-(--d-ink-3)">
        <p aria-live="polite">
          {filtersActive
            ? `${formatCount(filtered.length, 'session')} of ${dataset.sessions.length.toLocaleString('en-US')}`
            : formatCount(filtered.length, 'session')}
        </p>
        <label className="flex items-center gap-2 md:hidden">
          <span>Sort</span>
          <select
            value={`${sort.key}:${sort.dir}`}
            onChange={e => {
              const [key, dir] = e.target.value.split(':') as [SortKey, SortDir]
              setSort({ key, dir })
            }}
            className="d-input h-8 text-[13px]"
          >
            <option value="date:desc">Newest</option>
            <option value="date:asc">Oldest</option>
            <option value="best:asc">Fastest best</option>
            <option value="runs:desc">Most runs</option>
            <option value="event:asc">Distance</option>
          </select>
        </label>
      </div>

      <SessionRowHeader>
        <span>Finish photos</span>
        <span className="flex gap-4">
          <SortHeader label="Date" column="date" sort={sort} onSort={onSort} />
          <SortHeader label="Event" column="event" sort={sort} onSort={onSort} />
        </span>
        <span>Athletes</span>
        <SortHeader label="Runs" column="runs" sort={sort} onSort={onSort} align="right" />
        <SortHeader label="Best (s)" column="best" sort={sort} onSort={onSort} align="right" />
      </SessionRowHeader>

      {filtered.length === 0 ? (
        <p className="py-14 text-center text-[14px] text-(--d-ink-2)">
          No sessions match these filters.{' '}
          <button type="button" onClick={clear} className="text-(--d-brand-ink) underline-offset-4 hover:underline">
            Clear filters
          </button>
        </p>
      ) : (
        <div className="md:pt-1">
          {filtered.slice(0, visible).map(session => (
            <SessionRow key={session.key} session={session} dataset={dataset} />
          ))}
        </div>
      )}

      {filtered.length > visible ? (
        <div className="mt-8 flex justify-center">
          <Button onClick={() => setVisible(count => count + PAGE)}>Show more ({filtered.length - visible} left)</Button>
        </div>
      ) : null}
    </>
  )
}

export function SessionsView() {
  return <DataView>{dataset => <Sessions dataset={dataset} />}</DataView>
}
