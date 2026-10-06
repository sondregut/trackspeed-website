'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { formatDate, formatSpeed, formatTime, speedMs, type SpeedUnit } from '@/lib/dashboard/format'
import type { DashboardRun } from '@/lib/dashboard/types'
import { cx } from './ui'

export interface ProgressionPoint {
  date: number
  run: DashboardRun
  runCount: number
}

const HEIGHT = 260
const MARGIN = { top: 22, right: 20, bottom: 30, left: 46 }
const STEPS = [0.01, 0.02, 0.05, 0.1, 0.2, 0.25, 0.5, 1, 2, 5, 10, 15, 30, 60]

function niceTicks(min: number, max: number): number[] {
  if (min === max) {
    const pad = Math.max(0.05, min * 0.02)
    min -= pad
    max += pad
  }
  const raw = (max - min) / 4
  const step = STEPS.find(candidate => candidate >= raw) ?? raw
  const start = Math.floor(min / step) * step
  const end = Math.ceil(max / step) * step
  const ticks: number[] = []
  for (let value = start; value <= end + step / 2; value += step) ticks.push(Math.round(value * 1000) / 1000)
  return ticks
}

function dateTicks(min: number, max: number, count: number): number[] {
  if (max <= min) return [min]
  const ticks: number[] = []
  for (let i = 0; i < count; i += 1) ticks.push(min + ((max - min) * i) / (count - 1))
  return ticks
}

/**
 * Best time per session for one athlete and event. Faster times sit higher
 * (the y axis runs from slow at the bottom to fast at the top).
 */
export function ProgressionChart({
  points,
  unit,
  onSelect,
  label,
}: {
  points: ProgressionPoint[]
  unit: SpeedUnit
  onSelect?: (run: DashboardRun) => void
  label: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(720)
  const [active, setActive] = useState<number | null>(null)
  const [showTable, setShowTable] = useState(false)
  const descriptionId = useId()

  useEffect(() => {
    const element = containerRef.current
    if (!element || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(entries => {
      const next = Math.round(entries[0]?.contentRect.width ?? 0)
      if (next > 0) setWidth(next)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const sorted = useMemo(() => [...points].sort((a, b) => a.date - b.date), [points])
  const pbIndex = useMemo(() => {
    let best = -1
    sorted.forEach((point, i) => {
      if (best === -1 || point.run.time < sorted[best].run.time) best = i
    })
    return best
  }, [sorted])

  const innerW = Math.max(40, width - MARGIN.left - MARGIN.right)
  const innerH = HEIGHT - MARGIN.top - MARGIN.bottom
  const times = sorted.map(point => point.run.time)
  const yTicks = niceTicks(Math.min(...times), Math.max(...times))
  const yMin = yTicks[0]
  const yMax = yTicks[yTicks.length - 1]
  const dates = sorted.map(point => point.date)
  let xMin = Math.min(...dates)
  let xMax = Math.max(...dates)
  if (xMin === xMax) {
    xMin -= 86400000 * 3
    xMax += 86400000 * 3
  }
  const x = (date: number) => MARGIN.left + ((date - xMin) / (xMax - xMin)) * innerW
  // Faster (smaller) times at the top.
  const y = (time: number) => MARGIN.top + ((time - yMin) / (yMax - yMin || 1)) * innerH
  const xTicks = dateTicks(xMin, xMax, width < 480 ? 3 : 5)
  const path = sorted.map((point, i) => `${i === 0 ? 'M' : 'L'}${x(point.date).toFixed(1)},${y(point.run.time).toFixed(1)}`).join(' ')
  const lastIndex = sorted.length - 1

  const nearest = (clientX: number) => {
    const element = containerRef.current
    if (!element || sorted.length === 0) return null
    const left = element.getBoundingClientRect().left
    const px = clientX - left
    let best = 0
    let bestDistance = Infinity
    sorted.forEach((point, i) => {
      const distance = Math.abs(x(point.date) - px)
      if (distance < bestDistance) {
        best = i
        bestDistance = distance
      }
    })
    return best
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (sorted.length === 0) return
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      const current = active ?? lastIndex
      const next = event.key === 'ArrowLeft' ? Math.max(0, current - 1) : Math.min(lastIndex, current + 1)
      setActive(next)
    } else if (event.key === 'Home') {
      event.preventDefault()
      setActive(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      setActive(lastIndex)
    } else if ((event.key === 'Enter' || event.key === ' ') && active !== null && onSelect) {
      event.preventDefault()
      onSelect(sorted[active].run)
    }
  }

  // Skip the latest-value label when it would collide with the PB label.
  const showLastLabel =
    lastIndex >= 0 &&
    lastIndex !== pbIndex &&
    (pbIndex < 0 ||
      Math.abs(x(sorted[lastIndex].date) - x(sorted[pbIndex].date)) > 72 ||
      Math.abs(y(sorted[lastIndex].run.time) - y(sorted[pbIndex].run.time)) > 22)

  const activePoint = active !== null ? sorted[active] : null
  const describe = (point: ProgressionPoint) =>
    `${formatDate(point.date)}: ${formatTime(point.run.time, 2)} seconds, best of ${point.runCount} ${point.runCount === 1 ? 'run' : 'runs'}`

  const labelFor = (i: number, kind: 'pb' | 'last') => {
    const point = sorted[i]
    const px = x(point.date)
    const py = y(point.run.time)
    const anchor = px > MARGIN.left + innerW - 40 ? 'end' : px < MARGIN.left + 40 ? 'start' : 'middle'
    const text = kind === 'pb' ? `PB ${formatTime(point.run.time, 2)}` : formatTime(point.run.time, 2)
    const above = py - 12 > MARGIN.top - 8
    return (
      <text
        key={`${kind}-${i}`}
        x={px}
        y={above ? py - 12 : py + 20}
        textAnchor={anchor}
        className={cx('text-[12px] tabular-nums', kind === 'pb' ? 'fill-(--d-ink) font-semibold' : 'fill-(--d-ink-2)')}
      >
        {text}
      </text>
    )
  }

  return (
    <div>
      <div
        ref={containerRef}
        className="relative outline-none focus-visible:rounded-lg"
        tabIndex={0}
        role="group"
        aria-label={`${label}. Use the left and right arrow keys to move between sessions${onSelect ? ', Enter to open the run' : ''}.`}
        aria-describedby={descriptionId}
        onKeyDown={onKeyDown}
        onFocus={() => setActive(current => current ?? lastIndex)}
        onBlur={() => setActive(null)}
        onPointerMove={event => setActive(nearest(event.clientX))}
        onPointerLeave={() => setActive(null)}
        onClick={event => {
          const index = nearest(event.clientX)
          if (index !== null && onSelect) onSelect(sorted[index].run)
        }}
        style={{ cursor: onSelect ? 'pointer' : 'default' }}
      >
        <svg width={width} height={HEIGHT} className="block max-w-full" aria-hidden="true">
          {yTicks.map(tick => (
            <g key={tick}>
              <line x1={MARGIN.left} x2={MARGIN.left + innerW} y1={y(tick)} y2={y(tick)} className="stroke-(--d-grid)" strokeWidth={1} />
              <text x={MARGIN.left - 10} y={y(tick)} dy="0.32em" textAnchor="end" className="fill-(--d-ink-3) text-[11px] tabular-nums">
                {formatTime(tick, yTicks.some(value => Math.round(value * 100) % 10 !== 0) ? 2 : 1)}
              </text>
            </g>
          ))}
          {xTicks.map((tick, i) => (
            <text
              key={tick}
              x={x(tick)}
              y={HEIGHT - 8}
              textAnchor={i === 0 ? 'start' : i === xTicks.length - 1 ? 'end' : 'middle'}
              className="fill-(--d-ink-3) text-[11px]"
            >
              {formatDate(tick, { withYear: false })}
            </text>
          ))}
          {activePoint ? (
            <line
              x1={x(activePoint.date)}
              x2={x(activePoint.date)}
              y1={MARGIN.top - 6}
              y2={MARGIN.top + innerH}
              className="stroke-(--d-ink-3)"
              strokeWidth={1}
            />
          ) : null}
          <path d={path} fill="none" className="stroke-(--d-chart)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {sorted.map((point, i) => (
            <circle
              key={point.run.id}
              cx={x(point.date)}
              cy={y(point.run.time)}
              r={i === active ? 6 : i === pbIndex ? 5 : 4}
              className="fill-(--d-chart) stroke-(--d-bg)"
              strokeWidth={2}
            />
          ))}
          {pbIndex >= 0 ? labelFor(pbIndex, 'pb') : null}
          {showLastLabel ? labelFor(lastIndex, 'last') : null}
        </svg>

        {activePoint ? (
          <div
            className="pointer-events-none absolute z-10 min-w-[150px] rounded-lg border border-(--d-line) bg-(--d-bg) px-3 py-2 shadow-(--d-shadow)"
            style={{
              left: Math.min(Math.max(x(activePoint.date) - 75, 0), Math.max(0, width - 170)),
              top: Math.max(0, y(activePoint.run.time) - 86),
            }}
          >
            <div className="text-[15px] font-semibold tabular-nums text-(--d-ink)">{formatTime(activePoint.run.time, 3)} s</div>
            <div className="text-[12px] text-(--d-ink-2)">{formatDate(activePoint.date)}</div>
            <div className="mt-1 text-[12px] text-(--d-ink-3)">
              Best of {activePoint.runCount} {activePoint.runCount === 1 ? 'run' : 'runs'}
              {activePoint.run.isLaps ? '' : `, ${formatSpeed(speedMs(activePoint.run.distance, activePoint.run.time), unit)}`}
            </div>
          </div>
        ) : null}
        <p id={descriptionId} className="sr-only" aria-live="polite">
          {activePoint ? describe(activePoint) : `${sorted.length} sessions plotted.`}
        </p>
      </div>

      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={() => setShowTable(value => !value)}
          aria-expanded={showTable}
          className="rounded-md px-2 py-1 text-[12px] text-(--d-ink-3) hover:text-(--d-ink)"
        >
          {showTable ? 'Hide data table' : 'Show data table'}
        </button>
      </div>
      {showTable ? (
        <div className="d-scroll-x mt-1 max-h-72 overflow-y-auto rounded-lg border border-(--d-line)">
          <table className="w-full border-collapse text-[13px]">
            <caption className="sr-only">{label}</caption>
            <thead className="sticky top-0 bg-(--d-bg)">
              <tr className="border-b border-(--d-line) text-left text-[12px] text-(--d-ink-3)">
                <th scope="col" className="px-3 py-2 font-normal">Date</th>
                <th scope="col" className="px-3 py-2 text-right font-normal">Best time (s)</th>
                <th scope="col" className="px-3 py-2 text-right font-normal">Runs</th>
              </tr>
            </thead>
            <tbody>
              {[...sorted].reverse().map(point => (
                <tr key={point.run.id} className="border-b border-(--d-line) last:border-b-0">
                  <td className="px-3 py-1.5 text-(--d-ink-2)">{formatDate(point.date)}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums text-(--d-ink)">{formatTime(point.run.time, 3)}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums text-(--d-ink-2)">{point.runCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}
