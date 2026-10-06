'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { Dialog } from 'radix-ui'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { athleteHref, sessionHref } from '@/lib/dashboard/normalize'
import { runFrames, type RunFrame } from '@/lib/dashboard/frames'
import {
  SPEED_UNIT_LABEL,
  eventName,
  formatDateTime,
  formatDistance,
  formatReaction,
  formatSpeed,
  formatSpeedValue,
  formatTime,
  speedMs,
} from '@/lib/dashboard/format'
import type { DashboardRun, RawCrossing } from '@/lib/dashboard/types'
import { useDashboard } from './DashboardProvider'
import { GateRail } from './GateRail'
import { Photo } from './Photo'
import { AthleteDot, BestBadge, cx } from './ui'

function frameTitle(frame: RunFrame, run: DashboardRun): string {
  if (frame.role === 'start') return 'Start'
  if (frame.role === 'finish') return run.isLaps ? 'Lap finish' : 'Finish'
  return frame.distance !== null ? `Split at ${formatDistance(frame.distance, { approximate: frame.approximate })}` : `Gate ${frame.gate}`
}

function FrameFigure({ frame, run }: { frame: RunFrame; run: DashboardRun }) {
  const [missing, setMissing] = useState(false)
  const onResolved = useCallback((found: boolean) => setMissing(!found), [])
  const optional = frame.role !== 'finish'
  if (optional && missing) return null
  const title = frameTitle(frame, run)
  return (
    <figure className="flex shrink-0 snap-start flex-col">
      <Photo
        sources={frame.sources}
        alt={`${title} photo, run ${run.runNumber}`}
        fit="contain"
        hideWhenMissing={optional}
        onResolved={onResolved}
        className="h-[256px] w-[144px] rounded-lg sm:h-[360px] sm:w-[203px]"
      />
      <figcaption className="mt-2.5 flex items-baseline justify-between gap-3">
        <span className="text-[12px] text-(--d-ink-3)">{title}</span>
        <span className="text-[14px] font-medium tabular-nums text-(--d-ink)">{frame.time === null ? '–' : formatTime(frame.time, frame.role === 'finish' ? 3 : 2)}</span>
      </figcaption>
    </figure>
  )
}

export function RunPanel({
  runs,
  index,
  onIndexChange,
  onClose,
  showSessionLink = false,
}: {
  runs: DashboardRun[]
  index: number | null
  onIndexChange: (index: number) => void
  onClose: () => void
  showSessionLink?: boolean
}) {
  const { unit, loadCrossings } = useDashboard()
  const run = index === null ? null : runs[index] ?? null
  const [crossings, setCrossings] = useState<{ runId: string; rows: RawCrossing[] } | null>(null)

  useEffect(() => {
    if (!run) return
    let cancelled = false
    loadCrossings([run.id])
      .then(rows => {
        if (!cancelled) setCrossings({ runId: run.id, rows })
      })
      .catch(() => {
        if (!cancelled) setCrossings({ runId: run.id, rows: [] })
      })
    return () => {
      cancelled = true
    }
  }, [run, loadCrossings])

  const hasPrev = index !== null && index > 0
  const hasNext = index !== null && index < runs.length - 1

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.target instanceof HTMLInputElement) return
    if (event.key === 'ArrowLeft' && hasPrev) {
      event.preventDefault()
      onIndexChange((index as number) - 1)
    }
    if (event.key === 'ArrowRight' && hasNext) {
      event.preventDefault()
      onIndexChange((index as number) + 1)
    }
  }

  const frames = run ? runFrames(run, crossings?.runId === run.id ? crossings.rows : []) : []
  const speed = run && !run.isLaps ? speedMs(run.distance, run.time) : null
  const approximate = run?.splits.some(split => split.approximate) ?? false

  return (
    <Dialog.Root open={run !== null} onOpenChange={open => (!open ? onClose() : undefined)}>
      <Dialog.Portal>
        <Dialog.Overlay className="ts-dash-vars fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          onKeyDown={onKeyDown}
          aria-describedby={undefined}
          className="ts-dash-vars fixed inset-x-0 bottom-0 z-50 max-h-[92dvh] overflow-y-auto rounded-t-2xl border border-(--d-line) bg-(--d-bg) shadow-(--d-shadow) outline-none sm:inset-auto sm:left-1/2 sm:top-1/2 sm:max-h-[88dvh] sm:w-[min(1080px,calc(100vw-48px))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 text-(--d-ink)"
        >
          {run ? (
            <div className="px-5 pb-6 pt-5 sm:px-8 sm:pb-8 sm:pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <Dialog.Title className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] font-medium text-(--d-ink)">
                    <span>Run {run.runNumber}</span>
                    {run.athleteName ? (
                      <Link href={athleteHref(run.athleteKey)} onClick={onClose} className="inline-flex items-center gap-2 font-normal text-(--d-ink-2) hover:text-(--d-ink)">
                        <AthleteDot color={run.athleteColor} />
                        {run.athleteName}
                      </Link>
                    ) : (
                      <span className="font-normal text-(--d-ink-3)">Unassigned</span>
                    )}
                  </Dialog.Title>
                  <p className="mt-1 text-[13px] text-(--d-ink-3)">
                    {eventName(run)}, {formatDateTime(run.createdAt)}
                    {showSessionLink && run.sessionKey ? (
                      <>
                        {' '}
                        <Link href={sessionHref(run.sessionKey)} onClick={onClose} className="text-(--d-brand-ink) underline-offset-4 hover:underline">
                          Open session
                        </Link>
                      </>
                    ) : null}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    disabled={!hasPrev}
                    onClick={() => hasPrev && onIndexChange((index as number) - 1)}
                    aria-label="Previous run"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-(--d-ink-2) hover:bg-(--d-raise) disabled:opacity-30"
                  >
                    <ChevronLeft size={18} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    disabled={!hasNext}
                    onClick={() => hasNext && onIndexChange((index as number) + 1)}
                    aria-label="Next run"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-(--d-ink-2) hover:bg-(--d-raise) disabled:opacity-30"
                  >
                    <ChevronRight size={18} aria-hidden="true" />
                  </button>
                  <Dialog.Close
                    aria-label="Close"
                    className="ml-1 flex h-9 w-9 items-center justify-center rounded-lg text-(--d-ink-2) hover:bg-(--d-raise)"
                  >
                    <X size={18} aria-hidden="true" />
                  </Dialog.Close>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-end gap-x-10 gap-y-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-[44px] font-semibold leading-none tracking-[-0.03em] text-(--d-ink)">
                      {formatTime(run.time, 3)}
                    </span>
                    {run.isPB ? <BestBadge kind="PB" /> : run.isSB ? <BestBadge kind="SB" /> : null}
                  </div>
                  <p className="mt-1.5 text-[12px] text-(--d-ink-3)">{run.isLaps ? 'Lap time, seconds' : 'Seconds'}</p>
                </div>
                {speed !== null ? (
                  <div>
                    <div className="text-[22px] font-medium leading-none text-(--d-ink)">{formatSpeedValue(speed, unit)}</div>
                    <p className="mt-1.5 text-[12px] text-(--d-ink-3)">Average speed, {SPEED_UNIT_LABEL[unit]}</p>
                  </div>
                ) : null}
                {run.reactionTime !== null ? (
                  <div>
                    <div className="text-[22px] font-medium leading-none text-(--d-ink)">{formatReaction(run.reactionTime)}</div>
                    <p className="mt-1.5 text-[12px] text-(--d-ink-3)">Reaction, seconds</p>
                  </div>
                ) : null}
              </div>

              <div className="mt-8">
                <GateRail run={run} />
              </div>

              <div className="d-scroll-x -mx-5 mt-6 px-5 sm:-mx-8 sm:px-8">
                <div className="flex snap-x gap-4 pb-2">
                  {frames.map(frame => (
                    <FrameFigure key={`${run.id}-${frame.key}`} frame={frame} run={run} />
                  ))}
                </div>
              </div>

              {run.splits.length ? (
                <div className="mt-8">
                  <h3 className="mb-2 text-[13px] font-medium text-(--d-ink)">Splits</h3>
                  <div className="d-scroll-x">
                    <table className="w-full min-w-[440px] border-collapse text-[13px]">
                      <thead>
                        <tr className="border-b border-(--d-line) text-left text-[12px] text-(--d-ink-3)">
                          <th scope="col" className="py-2 pr-4 font-normal">Segment</th>
                          <th scope="col" className="py-2 pr-4 text-right font-normal">Segment time (s)</th>
                          <th scope="col" className="py-2 pr-4 text-right font-normal">Elapsed (s)</th>
                          <th scope="col" className="py-2 text-right font-normal">Speed</th>
                        </tr>
                      </thead>
                      <tbody>
                        {run.splits.map(split => {
                          const segmentDistance =
                            split.fromDistance !== null && split.toDistance !== null ? split.toDistance - split.fromDistance : null
                          return (
                            <tr key={split.toGate} className="border-b border-(--d-line) last:border-b-0">
                              <td className="py-2 pr-4 text-(--d-ink-2)">
                                {split.fromDistance !== null && split.toDistance !== null
                                  ? `${formatDistance(split.fromDistance, { approximate: split.approximate && split.fromDistance > 0 })} to ${formatDistance(split.toDistance, { approximate: split.approximate })}`
                                  : `Gate ${split.fromGate} to ${split.toGate}`}
                              </td>
                              <td className="py-2 pr-4 text-right tabular-nums text-(--d-ink)">{formatTime(split.segmentSeconds, 3)}</td>
                              <td className="py-2 pr-4 text-right tabular-nums text-(--d-ink)">{formatTime(split.cumulativeSeconds, 3)}</td>
                              <td className={cx('py-2 text-right tabular-nums', split.approximate ? 'text-(--d-ink-3)' : 'text-(--d-ink-2)')}>
                                {split.approximate ? '≈ ' : ''}
                                {formatSpeed(speedMs(segmentDistance, split.segmentSeconds), unit)}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                  {approximate ? (
                    <p className="mt-2 text-[12px] text-(--d-ink-3)">
                      ≈ Gate positions weren’t recorded for this run, so they’re assumed to be evenly spaced.
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
