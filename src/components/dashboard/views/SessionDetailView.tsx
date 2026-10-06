'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { athleteHref, UNASSIGNED_KEY, UNFILED_KEY } from '@/lib/dashboard/normalize'
import { eventName, formatClock, formatCount, formatSpeed, formatTime, speedMs } from '@/lib/dashboard/format'
import type { DashboardRun, DashboardSession, RawCrossing } from '@/lib/dashboard/types'
import { useDashboard } from '../DashboardProvider'
import { RunPanel } from '../RunPanel'
import { RunsList } from '../RunsList'
import { DataView, ExportCsvButton } from '../shared'
import { AthleteDot, EmptyState, PageHeader, SectionTitle } from '../ui'
import { sessionDay } from './SessionRow'

function BackLink() {
  return (
    <Link href="/dashboard/sessions" className="mb-4 inline-flex items-center gap-1 rounded-md text-[13px] text-(--d-ink-3) hover:text-(--d-ink)">
      <ChevronLeft size={15} aria-hidden="true" /> Sessions
    </Link>
  )
}

function longDay(ms: number): string {
  if (!ms) return 'Date unknown'
  return new Date(ms).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function SessionDetail({ session }: { session: DashboardSession }) {
  const { unit, loadCrossings } = useDashboard()
  const [crossings, setCrossings] = useState<RawCrossing[]>([])
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    loadCrossings(session.runs.map(run => run.id))
      .then(rows => {
        if (!cancelled) setCrossings(rows)
      })
      .catch(() => {
        // Crossing photos are optional; the finish photo still shows.
      })
    return () => {
      cancelled = true
    }
  }, [session, loadCrossings])

  const athleteBests = useMemo(() => {
    const map = new Map<string, DashboardRun>()
    for (const run of session.runs) {
      if (run.eventKey !== session.eventKey) continue
      const current = map.get(run.athleteKey)
      if (!current || run.time < current.time) map.set(run.athleteKey, run)
    }
    return [...map.values()].sort((a, b) => a.time - b.time)
  }, [session])

  const isUnfiled = session.key === UNFILED_KEY
  const athleteCount = session.athleteKeys.filter(key => key !== UNASSIGNED_KEY).length
  const best = session.best
  const details = [
    eventName(session),
    session.eventKeys.length > 1 ? `plus ${session.eventKeys.length - 1} other ${session.eventKeys.length === 2 ? 'distance' : 'distances'}` : null,
    formatCount(session.runs.length, 'run'),
    athleteCount ? formatCount(athleteCount, 'athlete') : null,
    !isUnfiled && session.date ? `started at ${formatClock(session.date)}` : null,
  ].filter(Boolean)

  return (
    <>
      <PageHeader
        leading={<BackLink />}
        title={isUnfiled ? 'Unfiled runs' : session.name ?? longDay(session.date)}
        description={
          <>
            <span>
              {session.name && !isUnfiled ? `${longDay(session.date)}. ` : ''}
              {details.join(', ')}.
            </span>
            {session.location || session.deviceModel ? (
              <span className="mt-1 block text-[14px] text-(--d-ink-3)">
                {[session.location, session.deviceModel ? `Timed with ${session.deviceModel}` : null].filter(Boolean).join('. ')}
              </span>
            ) : null}
            {isUnfiled ? (
              <span className="mt-1 block text-[14px] text-(--d-ink-3)">These runs uploaded without a session, usually from an older app version.</span>
            ) : null}
          </>
        }
        actions={<ExportCsvButton runs={session.runs} name={['session', isUnfiled || !session.date ? 'unfiled' : new Date(session.date).toISOString().slice(0, 10)]} />}
      />

      {session.notes ? <p className="-mt-4 mb-8 max-w-2xl text-[14px] leading-relaxed text-(--d-ink-2)">{session.notes}</p> : null}

      {best ? (
        <section aria-label="Session bests" className="mb-10 flex flex-wrap gap-x-10 gap-y-5 border-y border-(--d-line) py-5">
          <div>
            <p className="text-[13px] text-(--d-ink-3)">{session.isLaps ? 'Fastest lap' : 'Fastest run'}</p>
            <p className="mt-1 text-[30px] font-semibold leading-none tracking-[-0.02em] text-(--d-ink)">{formatTime(best.time, 2)}</p>
            <p className="mt-1.5 text-[13px] text-(--d-ink-2)">
              {best.athleteName ?? 'Unassigned'}
              {!best.isLaps ? `, ${formatSpeed(speedMs(best.distance, best.time), unit)}` : ''}
            </p>
          </div>
          {athleteBests.length > 1 ? (
            <div className="min-w-0">
              <p className="text-[13px] text-(--d-ink-3)">Best per athlete</p>
              <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
                {athleteBests.map(run => (
                  <li key={run.athleteKey} className="flex items-center gap-2 text-[14px]">
                    <AthleteDot color={run.athleteColor} />
                    {run.athleteKey === UNASSIGNED_KEY ? (
                      <span className="text-(--d-ink-3)">Unassigned</span>
                    ) : (
                      <Link href={athleteHref(run.athleteKey)} className="text-(--d-ink-2) underline-offset-4 hover:text-(--d-ink) hover:underline">
                        {run.athleteName}
                      </Link>
                    )}
                    <span className="font-medium tabular-nums text-(--d-ink)">{formatTime(run.time, 2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      <section aria-labelledby="runs-title">
        <SectionTitle id="runs-title" aside="Select a run for every photo and split">
          Runs
        </SectionTitle>
        <RunsList
          runs={session.runs}
          crossings={crossings}
          onOpen={run => setOpenIndex(session.runs.findIndex(item => item.id === run.id))}
          caption={`Runs, ${isUnfiled ? 'unfiled' : sessionDay(session.date)}`}
        />
        {session.runs.some(run => run.splits.some(split => split.approximate)) ? (
          <p className="mt-4 text-[12px] text-(--d-ink-3)">≈ Gate positions weren’t recorded, so split distances assume evenly spaced gates.</p>
        ) : null}
      </section>

      <RunPanel runs={session.runs} index={openIndex} onIndexChange={setOpenIndex} onClose={() => setOpenIndex(null)} />
    </>
  )
}

export function SessionDetailView({ sessionKey }: { sessionKey: string }) {
  const { sessionsByKey } = useDashboard()
  let key = sessionKey
  try {
    key = decodeURIComponent(sessionKey)
  } catch {
    // keep the raw key
  }
  return (
    <DataView>
      {() => {
        const session = sessionsByKey.get(key)
        if (!session) {
          return (
            <>
              <BackLink />
              <EmptyState title="Session not found">
                It may have been deleted in the app, or it has no uploaded runs yet.
              </EmptyState>
            </>
          )
        }
        return <SessionDetail key={session.key} session={session} />
      }}
    </DataView>
  )
}
