'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Activity, LogOut, Timer, Users } from 'lucide-react'
import { useDashboard } from './DashboardProvider'
import { UnitSwitch, cx } from './ui'

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: Activity, match: (path: string) => path === '/dashboard' },
  { href: '/dashboard/athletes', label: 'Athletes', icon: Users, match: (path: string) => path.startsWith('/dashboard/athletes') },
  { href: '/dashboard/sessions', label: 'Sessions', icon: Timer, match: (path: string) => path.startsWith('/dashboard/sessions') },
]

function Wordmark() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2.5 rounded-md" aria-label="TrackSpeed dashboard home">
      <Image src="/trackspeed-icon-1d43ec40.png" alt="" width={26} height={26} sizes="26px" className="rounded-[7px]" />
      <span className="text-[15px] font-semibold tracking-[-0.03em] text-(--d-ink)">TrackSpeed</span>
    </Link>
  )
}

function Account({ compact = false }: { compact?: boolean }) {
  const { user, signOut, demo } = useDashboard()
  return (
    <div className={cx('flex flex-col gap-3', compact ? '' : 'border-t border-(--d-line) pt-4')}>
      <div className="min-w-0">
        <p className="text-[12px] text-(--d-ink-3)">{demo ? 'Demo data' : 'Signed in as'}</p>
        <p className="truncate text-[13px] text-(--d-ink)" title={user?.email ?? undefined}>
          {user?.email ?? (user ? 'Account without email' : '…')}
        </p>
      </div>
      <button
        type="button"
        onClick={() => void signOut()}
        className="inline-flex h-8 items-center gap-2 self-start rounded-md px-2 -ml-2 text-[13px] text-(--d-ink-2) hover:bg-(--d-raise) hover:text-(--d-ink)"
      >
        <LogOut size={14} aria-hidden="true" /> Sign out
      </button>
    </div>
  )
}

function MobileAccountMenu() {
  const [open, setOpen] = useState(false)
  const { user, unit, setUnit } = useDashboard()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointer = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const initial = (user?.email ?? '?').slice(0, 1).toUpperCase()

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Account and settings"
        onClick={() => setOpen(value => !value)}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-(--d-line-strong) text-[13px] font-medium text-(--d-ink-2)"
      >
        {initial}
      </button>
      {open ? (
        <div className="absolute right-0 top-10 z-30 w-[min(280px,calc(100vw-32px))] rounded-xl border border-(--d-line) bg-(--d-bg) p-4 shadow-(--d-shadow)">
          <p className="mb-2 text-[12px] text-(--d-ink-3)">Speed</p>
          <UnitSwitch unit={unit} onChange={setUnit} className="mb-4 w-full" />
          <Account compact />
        </div>
      ) : null}
    </div>
  )
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { unit, setUnit } = useDashboard()

  return (
    <div className="relative lg:grid lg:min-h-dvh lg:grid-cols-[232px_minmax(0,1fr)]">
      {/* Full-height divider; the sidebar itself stays sticky in the viewport. */}
      <div aria-hidden="true" className="absolute inset-y-0 left-[231px] hidden w-px bg-(--d-line) lg:block" />
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh flex-col px-5 py-6 lg:flex">
        <Wordmark />
        <nav aria-label="Dashboard" className="mt-9 flex flex-col gap-0.5">
          {NAV.map(item => {
            const active = item.match(pathname)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cx(
                  'relative flex h-9 items-center gap-3 rounded-lg px-3 text-[14px] transition-colors',
                  active ? 'bg-(--d-raise) font-medium text-(--d-ink)' : 'text-(--d-ink-2) hover:bg-(--d-raise) hover:text-(--d-ink)',
                )}
              >
                {active ? <span aria-hidden="true" className="absolute -left-5 top-2 h-5 w-0.5 rounded-full bg-(--d-brand)" /> : null}
                <Icon size={16} strokeWidth={1.75} aria-hidden="true" className={active ? 'text-(--d-brand-ink)' : ''} />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="mt-auto flex flex-col gap-5">
          <div>
            <p className="mb-2 text-[12px] text-(--d-ink-3)">Speed</p>
            <UnitSwitch unit={unit} onChange={setUnit} className="w-full" />
          </div>
          <Account />
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-20 border-b border-(--d-line) bg-(--d-bg)/95 backdrop-blur lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Wordmark />
          <MobileAccountMenu />
        </div>
        <nav aria-label="Dashboard" className="flex gap-1 px-2">
          {NAV.map(item => {
            const active = item.match(pathname)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cx(
                  'relative flex h-10 items-center px-3 text-[14px]',
                  active ? 'font-medium text-(--d-ink)' : 'text-(--d-ink-3)',
                )}
              >
                {item.label}
                {active ? <span aria-hidden="true" className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-(--d-brand)" /> : null}
              </Link>
            )
          })}
        </nav>
      </div>

      <main id="main" className="min-w-0 px-4 pb-20 pt-7 sm:px-8 lg:px-12 lg:pt-12">
        <div className="mx-auto w-full max-w-[1120px]">{children}</div>
      </main>
    </div>
  )
}
