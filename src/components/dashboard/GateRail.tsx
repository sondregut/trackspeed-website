'use client'

import { formatDistance, formatTime } from '@/lib/dashboard/format'
import type { DashboardRun } from '@/lib/dashboard/types'
import { cx } from './ui'

interface Gate {
  index: number
  position: number
  distance: number | null
  approximate: boolean
  cumulative: number
}

/** Gates in order with their position along the rail (0..1). */
export function railGates(run: DashboardRun): Gate[] {
  if (run.splits.length === 0) {
    return [
      { index: 0, position: 0, distance: run.isLaps ? null : 0, approximate: false, cumulative: 0 },
      { index: 1, position: 1, distance: run.isLaps ? null : run.distance, approximate: false, cumulative: run.time },
    ]
  }
  const last = run.splits[run.splits.length - 1]
  const total = last.toDistance ?? null
  const span = Math.max(1, run.gateCount - 1)
  const gates: Gate[] = [{ index: 0, position: 0, distance: run.isLaps ? null : 0, approximate: false, cumulative: 0 }]
  for (const split of run.splits) {
    const position = total && split.toDistance !== null ? split.toDistance / total : split.toGate / span
    gates.push({
      index: split.toGate,
      position: Math.min(1, Math.max(0, position)),
      distance: split.toDistance,
      approximate: split.approximate,
      cumulative: split.cumulativeSeconds,
    })
  }
  return gates
}

/**
 * The run drawn as the athlete saw it: a straight lane with a tick at every
 * timing gate, segment times above and distance plus elapsed time below.
 */
export function GateRail({ run, className }: { run: DashboardRun; className?: string }) {
  const gates = railGates(run)
  const finishIndex = gates.length - 1
  return (
    <div className={cx('relative h-[84px] select-none', className)} aria-hidden="true">
      <div className="absolute inset-x-0 top-[34px] h-px bg-(--d-line-strong)" />
      <div
        className="absolute top-[33px] h-[3px] rounded-full bg-(--d-brand)"
        style={{ left: 0, right: 0, opacity: 0.35 }}
      />
      {gates.slice(1).map((gate, i) => {
        const previous = gates[i]
        const segment = gate.cumulative - previous.cumulative
        const center = (previous.position + gate.position) / 2
        return (
          <span
            key={`seg-${gate.index}`}
            className="absolute top-[8px] -translate-x-1/2 whitespace-nowrap text-[12px] tabular-nums text-(--d-ink-2)"
            style={{ left: `${center * 100}%` }}
          >
            {formatTime(segment, 2)}
          </span>
        )
      })}
      {gates.map((gate, i) => {
        const edge = i === 0 ? 'left' : i === finishIndex ? 'right' : 'center'
        return (
          <div
            key={`gate-${gate.index}`}
            className={cx(
              'absolute top-[27px] flex flex-col',
              edge === 'left' && 'items-start',
              edge === 'right' && 'items-end -translate-x-full',
              edge === 'center' && 'items-center -translate-x-1/2',
            )}
            style={{ left: `${gate.position * 100}%` }}
          >
            <span
              className={cx('block h-[15px] w-[2px] rounded-full', i === finishIndex ? 'bg-(--d-brand)' : 'bg-(--d-ink)')}
            />
            <span className="mt-1.5 whitespace-nowrap text-[11px] text-(--d-ink-3)">
              {gate.distance === null
                ? i === 0
                  ? 'Start'
                  : i === finishIndex
                    ? 'Finish'
                    : `Gate ${gate.index}`
                : formatDistance(gate.distance, { approximate: gate.approximate })}
            </span>
            <span className="whitespace-nowrap text-[13px] font-medium tabular-nums text-(--d-ink)">
              {formatTime(gate.cumulative, 2)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
