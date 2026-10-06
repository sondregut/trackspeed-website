'use client'

import Link from 'next/link'
import { athleteHref } from '@/lib/dashboard/normalize'
import { imageSource, runPhotoPath, type ImageSource } from '@/lib/dashboard/frames'
import { formatDistance, formatReaction, formatSpeedValue, formatTime, speedMs, SPEED_UNIT_LABEL } from '@/lib/dashboard/format'
import type { DashboardRun, RawCrossing } from '@/lib/dashboard/types'
import { useDashboard } from './DashboardProvider'
import { Photo } from './Photo'
import { AthleteDot, BestBadge, cx } from './ui'

export function finishSources(run: DashboardRun, crossings: RawCrossing[] = []): ImageSource[] {
  const sources: ImageSource[] = []
  const stored = imageSource(run.finishImage)
  if (stored) sources.push(stored)
  else {
    const fallback = runPhotoPath(run, '')
    if (fallback) sources.push({ kind: 'path', path: fallback })
  }
  for (const row of crossings) {
    if (row.run_id === run.id && row.gate_role === 'finish') {
      const source = imageSource(row.thumbnail_url)
      if (source) sources.push(source)
    }
  }
  return sources
}

function athleteLabel(run: DashboardRun) {
  return run.athleteName ?? 'Unassigned'
}

function splitLabel(split: DashboardRun['splits'][number]): string {
  return split.toDistance === null ? `Gate ${split.toGate}` : formatDistance(split.toDistance, { approximate: split.approximate })
}

/** Gate labels shared by every run in the list, or null when layouts differ. */
function sharedSplitLabels(runs: DashboardRun[]): string[] | null {
  let labels: string[] | null = null
  for (const run of runs) {
    if (run.splits.length === 0) continue
    const next = run.splits.map(splitLabel)
    if (labels === null) labels = next
    else if (labels.join('|') !== next.join('|')) return null
  }
  return labels
}

function SplitCells({ run, showLabels = true, dense = false }: { run: DashboardRun; showLabels?: boolean; dense?: boolean }) {
  if (run.splits.length === 0) return <span className="text-(--d-ink-3)">–</span>
  return (
    <div className={cx('flex', dense ? 'gap-3' : 'gap-2')}>
      {run.splits.map(split => (
        <div key={split.toGate} className={dense ? 'min-w-[44px]' : 'w-[58px] shrink-0'}>
          {showLabels ? <div className="text-[11px] leading-4 text-(--d-ink-3)">{splitLabel(split)}</div> : null}
          <div className="text-[13px] leading-5 tabular-nums text-(--d-ink)">{formatTime(split.cumulativeSeconds, 2)}</div>
          <div className="text-[11px] leading-4 tabular-nums text-(--d-ink-3)">+{formatTime(split.segmentSeconds, 2)}</div>
        </div>
      ))}
    </div>
  )
}

function Badges({ run }: { run: DashboardRun }) {
  if (!run.isPB && !run.isSB) return null
  return <BestBadge kind={run.isPB ? 'PB' : 'SB'} />
}

export interface RunColumns {
  reaction: boolean
  splits: boolean
  speed: boolean
}

export function runColumns(runs: DashboardRun[]): RunColumns {
  return {
    reaction: runs.some(run => run.reactionTime !== null),
    splits: runs.some(run => run.splits.length > 0),
    speed: runs.some(run => !run.isLaps),
  }
}

/**
 * Runs as a table on wide screens and stacked rows on phones. Every row
 * opens the run panel with all photos and splits. Pass `columns` to keep
 * several lists (one per session) aligned with each other.
 */
export function RunsList({
  runs,
  onOpen,
  showAthlete = true,
  crossings = [],
  caption,
  columns,
}: {
  runs: DashboardRun[]
  onOpen: (run: DashboardRun) => void
  showAthlete?: boolean
  crossings?: RawCrossing[]
  caption?: string
  columns?: RunColumns
}) {
  const { unit } = useDashboard()
  const own = runColumns(runs)
  const hasReaction = columns?.reaction ?? own.reaction
  const hasSplits = columns?.splits ?? own.splits
  const hasSpeed = columns?.speed ?? own.speed
  const shared = sharedSplitLabels(runs)

  return (
    <>
      {/* Wide screens */}
      <div className="d-scroll-x hidden md:block">
        <table className="w-full min-w-[640px] table-fixed border-collapse text-left text-[14px]">
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <colgroup>
            <col className="w-[56px]" />
            <col className="w-[52px]" />
            {showAthlete ? <col className="w-[22%]" /> : null}
            <col className="w-[128px]" />
            {hasSpeed ? <col className="w-[104px]" /> : null}
            {hasReaction ? <col className="w-[104px]" /> : null}
            <col />
          </colgroup>
          <thead>
            <tr className="border-b border-(--d-line) align-bottom text-[12px] text-(--d-ink-3)">
              <th scope="col" className="py-2.5 pr-3 font-normal">Photo</th>
              <th scope="col" className="py-2.5 pr-3 font-normal">Run</th>
              {showAthlete ? <th scope="col" className="py-2.5 pr-4 font-normal">Athlete</th> : null}
              <th scope="col" className="py-2.5 pr-4 font-normal">Time (s)</th>
              {hasSpeed ? <th scope="col" className="py-2.5 pr-6 text-right font-normal">Speed ({SPEED_UNIT_LABEL[unit]})</th> : null}
              {hasReaction ? <th scope="col" className="py-2.5 pr-6 text-right font-normal">Reaction (s)</th> : null}
              {hasSplits ? (
                <th scope="col" className="py-2.5 pl-2 font-normal">
                  {shared ? (
                    <>
                      <span className="sr-only">Splits at </span>
                      <span className="flex gap-2">
                        {shared.map(label => (
                          <span key={label} className="w-[58px] shrink-0">{label}</span>
                        ))}
                      </span>
                    </>
                  ) : (
                    'Splits'
                  )}
                </th>
              ) : (
                <th aria-hidden="true" />
              )}
            </tr>
          </thead>
          <tbody>
            {runs.map(run => (
              <tr
                key={run.id}
                onClick={() => onOpen(run)}
                className="group cursor-pointer border-b border-(--d-line) align-middle transition-colors last:border-b-0 hover:bg-(--d-raise)"
              >
                <td className="py-2 pr-3">
                  <Photo sources={finishSources(run, crossings)} alt={`Finish photo, run ${run.runNumber}`} className="h-12 w-9 rounded-[5px]" />
                </td>
                <td className="py-2 pr-3 tabular-nums text-(--d-ink-3)">{run.runNumber}</td>
                {showAthlete ? (
                  <td className="truncate py-2 pr-4">
                    {run.athleteName ? (
                      <Link
                        href={athleteHref(run.athleteKey)}
                        onClick={event => event.stopPropagation()}
                        className="inline-flex max-w-full items-center gap-2 rounded-sm text-(--d-ink) underline-offset-4 hover:underline"
                      >
                        <AthleteDot color={run.athleteColor} />
                        <span className="truncate">{run.athleteName}</span>
                      </Link>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-(--d-ink-3)">
                        <AthleteDot color={null} />
                        Unassigned
                      </span>
                    )}
                  </td>
                ) : null}
                <td className="py-2 pr-4">
                  <button
                    type="button"
                    onClick={event => {
                      event.stopPropagation()
                      onOpen(run)
                    }}
                    aria-label={`Open run ${run.runNumber}, ${formatTime(run.time, 3)} seconds${showAthlete ? `, ${athleteLabel(run)}` : ''}`}
                    className="inline-flex items-center gap-2 rounded-sm text-[15px] font-medium tabular-nums text-(--d-ink)"
                  >
                    {formatTime(run.time, 3)}
                    <Badges run={run} />
                  </button>
                </td>
                {hasSpeed ? (
                  <td className="py-2 pr-6 text-right tabular-nums text-(--d-ink-2)">
                    {run.isLaps ? '–' : formatSpeedValue(speedMs(run.distance, run.time), unit)}
                  </td>
                ) : null}
                {hasReaction ? (
                  <td className="py-2 pr-6 text-right tabular-nums text-(--d-ink-2)">{formatReaction(run.reactionTime)}</td>
                ) : null}
                <td className="py-2 pl-2">{hasSplits ? <SplitCells run={run} showLabels={!shared} /> : null}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phones */}
      <ul className="md:hidden" aria-label={caption}>
        {runs.map(run => (
          <li key={run.id} className="border-b border-(--d-line) last:border-b-0">
            <button
              type="button"
              onClick={() => onOpen(run)}
              className="flex w-full gap-3 py-3 text-left"
              aria-label={`Open run ${run.runNumber}, ${formatTime(run.time, 3)} seconds${showAthlete ? `, ${athleteLabel(run)}` : ''}`}
            >
              <Photo sources={finishSources(run, crossings)} alt="" className="h-[60px] w-[44px] shrink-0 rounded-md" />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-2 text-[14px]">
                    <span className="shrink-0 tabular-nums text-(--d-ink-3)">{showAthlete ? run.runNumber : `Run ${run.runNumber}`}</span>
                    {showAthlete ? (
                      <>
                        <AthleteDot color={run.athleteColor} />
                        <span className={cx('truncate', run.athleteName ? 'text-(--d-ink)' : 'text-(--d-ink-3)')}>{athleteLabel(run)}</span>
                      </>
                    ) : null}
                  </span>
                  <span className="flex shrink-0 items-center gap-2 text-[16px] font-medium tabular-nums text-(--d-ink)">
                    <Badges run={run} />
                    {formatTime(run.time, 3)}
                  </span>
                </div>
                <div className="mt-0.5 flex flex-wrap gap-x-3 text-[12px] tabular-nums text-(--d-ink-3)">
                  {!run.isLaps ? <span>{formatSpeedValue(speedMs(run.distance, run.time), unit)} {SPEED_UNIT_LABEL[unit]}</span> : <span>Lap</span>}
                  {run.reactionTime !== null ? <span>Reaction {formatReaction(run.reactionTime)} s</span> : null}
                </div>
                {run.splits.length ? (
                  <div className="d-scroll-x mt-2">
                    <SplitCells run={run} dense />
                  </div>
                ) : null}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}
