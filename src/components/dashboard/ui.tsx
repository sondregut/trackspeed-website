'use client'

import Link from 'next/link'
import { RotateCw } from 'lucide-react'
import type { AthleteColorName } from '@/lib/dashboard/types'
import { SPEED_UNIT_LABEL, SPEED_UNITS, type SpeedUnit } from '@/lib/dashboard/format'

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ')
}

export function AthleteDot({ color, size = 8, className }: { color: AthleteColorName | null; size?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cx('inline-block shrink-0 rounded-full', className)}
      style={{ width: size, height: size, background: `var(--d-athlete-${color ?? 'none'})` }}
    />
  )
}

export function BestBadge({ kind }: { kind: 'PB' | 'SB' }) {
  const label = kind === 'PB' ? 'Personal best' : 'Season best'
  return (
    <span
      title={label}
      className={cx(
        'inline-flex h-5 items-center rounded-full px-1.5 text-[11px] font-semibold leading-none',
        kind === 'PB'
          ? 'bg-(--d-brand-wash) text-(--d-brand-ink)'
          : 'border border-(--d-line-strong) text-(--d-ink-2)',
      )}
    >
      <span aria-hidden="true">{kind}</span>
      <span className="sr-only">{label}</span>
    </span>
  )
}

export function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div aria-hidden="true" className={cx('d-skeleton', className)} style={style} />
}

export function PageHeader({
  title,
  description,
  actions,
  leading,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  leading?: React.ReactNode
}) {
  return (
    <header className="flex flex-col gap-4 pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {leading}
        <h1 className="text-[26px] font-semibold leading-tight tracking-[-0.02em] text-(--d-ink) sm:text-[30px]">{title}</h1>
        {description ? <div className="mt-1.5 text-[15px] text-(--d-ink-2)">{description}</div> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  )
}

export function SectionTitle({ children, aside, id }: { children: React.ReactNode; aside?: React.ReactNode; id?: string }) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-4">
      <h2 id={id} className="text-[15px] font-semibold text-(--d-ink)">{children}</h2>
      {aside ? <div className="text-[13px] text-(--d-ink-3)">{aside}</div> : null}
    </div>
  )
}

export function Button({
  children,
  variant = 'secondary',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' }) {
  return (
    <button
      type="button"
      {...props}
      className={cx(
        'inline-flex h-9 items-center justify-center gap-2 rounded-lg px-3.5 text-[14px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary' && 'bg-(--d-ink) text-(--d-bg) hover:opacity-90',
        variant === 'secondary' && 'border border-(--d-line-strong) bg-(--d-bg) text-(--d-ink) hover:bg-(--d-raise)',
        variant === 'ghost' && 'text-(--d-ink-2) hover:bg-(--d-raise) hover:text-(--d-ink)',
        className,
      )}
    >
      {children}
    </button>
  )
}

export function EmptyState({ title, children, action }: { title: string; children?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-(--d-line-strong) px-6 py-10 text-center">
      <p className="text-[15px] font-medium text-(--d-ink)">{title}</p>
      {children ? <div className="mx-auto mt-1.5 max-w-md text-[14px] leading-relaxed text-(--d-ink-2)">{children}</div> : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="rounded-xl border border-(--d-line-strong) px-6 py-10 text-center">
      <p className="text-[15px] font-medium text-(--d-ink)">Your data didn’t load</p>
      <p className="mx-auto mt-1.5 max-w-md text-[14px] leading-relaxed text-(--d-ink-2)">
        {message} Check your connection and try again.
      </p>
      {onRetry ? (
        <div className="mt-4 flex justify-center">
          <Button onClick={onRetry}>
            <RotateCw size={15} aria-hidden="true" /> Try again
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export function UnitSwitch({ unit, onChange, className }: { unit: SpeedUnit; onChange: (unit: SpeedUnit) => void; className?: string }) {
  return (
    <div role="group" aria-label="Speed unit" className={cx('inline-flex rounded-lg bg-(--d-raise) p-0.5', className)}>
      {SPEED_UNITS.map(option => {
        const selected = option === unit
        return (
          <button
            key={option}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option)}
            className={cx(
              'h-7 flex-1 rounded-md px-2.5 text-[12px] font-medium transition-colors',
              selected ? 'bg-(--d-bg) text-(--d-ink) shadow-[0_0_0_1px_var(--d-line)]' : 'text-(--d-ink-3) hover:text-(--d-ink)',
            )}
          >
            {SPEED_UNIT_LABEL[option]}
          </button>
        )
      })}
    </div>
  )
}

export function TextLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={cx('text-(--d-brand-ink) underline-offset-4 hover:underline', className)}>
      {children}
    </Link>
  )
}
