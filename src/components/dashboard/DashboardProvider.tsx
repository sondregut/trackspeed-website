'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { buildDataset } from '@/lib/dashboard/normalize'
import { fetchCrossings, fetchDashboardData } from '@/lib/dashboard/data'
import { clearImageCache, configureImageSigning, setImageOverride } from '@/lib/dashboard/images'
import { getDashboardSupabase } from '@/lib/dashboard/supabase-browser'
import { isSpeedUnit, type SpeedUnit } from '@/lib/dashboard/format'
import type { Dataset, DashboardSession, RawCrossing } from '@/lib/dashboard/types'

interface DashboardUser {
  id: string
  email: string | null
}

type Status = 'loading' | 'ready' | 'error'

interface DashboardContextValue {
  user: DashboardUser | null
  demo: boolean
  status: Status
  error: string | null
  dataset: Dataset | null
  sessionsByKey: Map<string, DashboardSession>
  reload: () => void
  signOut: () => Promise<void>
  unit: SpeedUnit
  setUnit: (unit: SpeedUnit) => void
  loadCrossings: (runIds: string[]) => Promise<RawCrossing[]>
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

const UNIT_KEY = 'trackspeed-dashboard-speed-unit'
const DEMO_KEY = 'trackspeed-dashboard-demo'

// Speed unit preference: localStorage when available, memory otherwise.
let memoryUnit: SpeedUnit = 'ms'
const unitListeners = new Set<() => void>()

function readStoredUnit(): SpeedUnit {
  try {
    const value = window.localStorage.getItem(UNIT_KEY)
    return isSpeedUnit(value) ? value : memoryUnit
  } catch {
    return memoryUnit
  }
}

function writeStoredUnit(unit: SpeedUnit) {
  memoryUnit = unit
  try {
    window.localStorage.setItem(UNIT_KEY, unit)
  } catch {
    // Preference only lasts for this page view.
  }
  for (const listener of unitListeners) listener()
}

function subscribeUnit(listener: () => void) {
  unitListeners.add(listener)
  window.addEventListener('storage', listener)
  return () => {
    unitListeners.delete(listener)
    window.removeEventListener('storage', listener)
  }
}

function noopSubscribe() {
  return () => {}
}

/**
 * Demo data is a development-only affordance (?demo=1 under next dev, kept
 * for the browser tab via sessionStorage). Production builds always get false.
 */
function useDemoFlag(): boolean | null {
  const param = useSearchParams().get('demo')
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return
    try {
      if (param === '1') window.sessionStorage.setItem(DEMO_KEY, '1')
      if (param === '0') window.sessionStorage.removeItem(DEMO_KEY)
    } catch {
      // The query parameter alone still works.
    }
  }, [param])
  return useSyncExternalStore(
    noopSubscribe,
    () => {
      if (process.env.NODE_ENV !== 'development') return false
      if (param === '1') return true
      if (param === '0') return false
      try {
        return window.sessionStorage.getItem(DEMO_KEY) === '1'
      } catch {
        return false
      }
    },
    () => null,
  )
}

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const demo = useDemoFlag()
  const [user, setUser] = useState<DashboardUser | null>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState<string | null>(null)
  const [dataset, setDataset] = useState<Dataset | null>(null)
  const unit = useSyncExternalStore(subscribeUnit, readStoredUnit, () => 'ms' as SpeedUnit)
  const [reloadToken, setReloadToken] = useState(0)
  const crossingCache = useRef(new Map<string, RawCrossing[]>())
  const pathnameRef = useRef(pathname)

  useEffect(() => {
    pathnameRef.current = pathname
  }, [pathname])

  const setUnit = useCallback((next: SpeedUnit) => writeStoredUnit(next), [])

  // Authentication -----------------------------------------------------------
  useEffect(() => {
    if (demo === null) return
    if (demo) {
      let cancelled = false
      if (process.env.NODE_ENV === 'development') {
        import('@/lib/dashboard/demo-fixtures').then(mod => {
          if (cancelled) return
          setImageOverride(mod.demoImageResolver)
          setUser({ id: mod.DEMO_USER_ID, email: mod.DEMO_EMAIL })
        })
      }
      return () => {
        cancelled = true
      }
    }

    setImageOverride(null)
    const supabase = getDashboardSupabase()
    configureImageSigning(getDashboardSupabase)
    const toLogin = () => {
      const next = pathnameRef.current
      router.replace(`/dashboard/login${next && next !== '/dashboard' ? `?next=${encodeURIComponent(next)}` : ''}`)
    }

    let active = true
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      const sessionUser = data.session?.user
      if (!sessionUser) {
        toLogin()
        return
      }
      setUser({ id: sessionUser.id, email: sessionUser.email ?? null })
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return
      if (event === 'SIGNED_OUT' || !session?.user) {
        setUser(null)
        toLogin()
        return
      }
      setUser(current => (current?.id === session.user.id ? current : { id: session.user.id, email: session.user.email ?? null }))
    })

    return () => {
      active = false
      subscription.subscription.unsubscribe()
    }
  }, [demo, router])

  // Data -------------------------------------------------------------------
  useEffect(() => {
    if (!user || demo === null) return
    let cancelled = false
    const load = async () => {
      if (demo && process.env.NODE_ENV === 'development') {
        const mod = await import('@/lib/dashboard/demo-fixtures')
        return buildDataset(mod.demoRawDataset())
      }
      const raw = await fetchDashboardData(getDashboardSupabase(), user.id)
      return buildDataset(raw)
    }

    load()
      .then(next => {
        if (cancelled) return
        setDataset(next)
        setError(null)
        setStatus('ready')
      })
      .catch((cause: unknown) => {
        if (cancelled) return
        setError(cause instanceof Error ? cause.message : 'Could not load your data.')
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [user, demo, reloadToken])

  const reload = useCallback(() => {
    crossingCache.current.clear()
    clearImageCache()
    setError(null)
    setStatus(current => (current === 'error' ? 'loading' : current))
    setReloadToken(token => token + 1)
  }, [])

  const signOut = useCallback(async () => {
    if (demo) {
      if (process.env.NODE_ENV === 'development') {
        try {
          window.sessionStorage.removeItem(DEMO_KEY)
        } catch {
          // ignore
        }
      }
      router.replace('/dashboard/login')
      return
    }
    clearImageCache()
    await getDashboardSupabase().auth.signOut()
    router.replace('/dashboard/login')
  }, [demo, router])

  const loadCrossings = useCallback(
    async (runIds: string[]) => {
      if (demo) return []
      const missing = runIds.filter(id => !crossingCache.current.has(id))
      if (missing.length) {
        const rows = await fetchCrossings(getDashboardSupabase(), missing)
        for (const id of missing) crossingCache.current.set(id, [])
        for (const row of rows) {
          if (!row.run_id) continue
          crossingCache.current.get(row.run_id)?.push(row)
        }
      }
      return runIds.flatMap(id => crossingCache.current.get(id) ?? [])
    },
    [demo],
  )

  const sessionsByKey = useMemo(
    () => new Map((dataset?.sessions ?? []).map(session => [session.key, session])),
    [dataset],
  )

  const value = useMemo<DashboardContextValue>(
    () => ({
      user,
      demo: Boolean(demo),
      status: user ? status : 'loading',
      error,
      dataset,
      sessionsByKey,
      reload,
      signOut,
      unit,
      setUnit,
      loadCrossings,
    }),
    [user, demo, status, error, dataset, sessionsByKey, reload, signOut, unit, setUnit, loadCrossings],
  )

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}

export function useDashboard(): DashboardContextValue {
  const value = useContext(DashboardContext)
  if (!value) throw new Error('useDashboard must be used inside DashboardProvider')
  return value
}
