'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getDashboardSupabase, safeDashboardPath } from '@/lib/dashboard/supabase-browser'
import { cx } from '../ui'

const APPLE_WEB_ENABLED = process.env.NEXT_PUBLIC_DASHBOARD_APPLE_WEB === '1'

type Notice = { kind: 'error' | 'success'; text: string } | null

function authRedirect(next: string): string {
  const url = new URL('/dashboard/auth', window.location.origin)
  if (next !== '/dashboard') url.searchParams.set('next', next)
  return url.toString()
}

function friendlyError(message: string): string {
  const lower = message.toLowerCase()
  if (lower.includes('invalid login credentials')) return 'That email and password don’t match a TrackSpeed account. If you signed up with Apple or Google, use the link from your iPhone or the matching button.'
  if (lower.includes('signups not allowed') || lower.includes('user not found')) return 'No TrackSpeed account uses that email. Sign in to the app first, then use the same email here.'
  if (lower.includes('rate limit') || lower.includes('too many')) return 'Too many attempts. Wait a minute and try again.'
  if (lower.includes('email not confirmed')) return 'Confirm your email address first, then try again.'
  return message
}

function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  )
}

function AppleMark() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M16.37 12.53c-.02-2.2 1.8-3.26 1.88-3.31-1.02-1.5-2.62-1.7-3.19-1.72-1.36-.14-2.65.8-3.34.8-.69 0-1.75-.78-2.88-.76-1.48.02-2.85.86-3.61 2.19-1.54 2.67-.39 6.62 1.11 8.79.73 1.06 1.61 2.25 2.75 2.21 1.1-.04 1.52-.71 2.86-.71 1.33 0 1.71.71 2.88.69 1.19-.02 1.94-1.08 2.67-2.15.84-1.23 1.19-2.42 1.21-2.48-.03-.01-2.32-.89-2.34-3.55zM14.17 6.06c.61-.74 1.02-1.76.91-2.78-.88.04-1.94.58-2.57 1.32-.56.65-1.06 1.7-.93 2.7.98.08 1.98-.5 2.59-1.24z" />
    </svg>
  )
}

const field = 'h-11 w-full rounded-lg border border-(--d-line-strong) bg-(--d-bg) px-3 text-[15px] text-(--d-ink) placeholder:text-(--d-ink-3)'

export function LoginView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = safeDashboardPath(searchParams.get('next'))
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState<null | 'password' | 'link' | 'google' | 'apple'>(null)
  const [notice, setNotice] = useState<Notice>(null)

  useEffect(() => {
    let active = true
    getDashboardSupabase()
      .auth.getSession()
      .then(({ data }) => {
        if (active && data.session) router.replace(next)
      })
    return () => {
      active = false
    }
  }, [router, next])

  const signInWithPassword = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!email.trim() || !password) {
      setNotice({ kind: 'error', text: 'Enter your email and password.' })
      return
    }
    setBusy('password')
    setNotice(null)
    const { error } = await getDashboardSupabase().auth.signInWithPassword({ email: email.trim(), password })
    setBusy(null)
    if (error) {
      setNotice({ kind: 'error', text: friendlyError(error.message) })
      return
    }
    router.replace(next)
  }

  const sendLink = async () => {
    if (!email.trim()) {
      setNotice({ kind: 'error', text: 'Enter the email address you use in the TrackSpeed app.' })
      return
    }
    setBusy('link')
    setNotice(null)
    const { error } = await getDashboardSupabase().auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: false, emailRedirectTo: authRedirect(next) },
    })
    setBusy(null)
    if (error) {
      setNotice({ kind: 'error', text: friendlyError(error.message) })
      return
    }
    setNotice({ kind: 'success', text: `Sign-in link sent to ${email.trim()}. Open it in this browser.` })
  }

  const oauth = async (provider: 'google' | 'apple') => {
    setBusy(provider)
    setNotice(null)
    const { error } = await getDashboardSupabase().auth.signInWithOAuth({
      provider,
      options: { redirectTo: authRedirect(next) },
    })
    if (error) {
      setBusy(null)
      setNotice({ kind: 'error', text: friendlyError(error.message) })
    }
  }

  return (
    <main id="main" className="mx-auto flex min-h-dvh w-full max-w-[440px] flex-col px-5 py-10 sm:py-16">
      <div className="flex items-center gap-2.5">
        <Image src="/trackspeed-icon-1d43ec40.png" alt="" width={28} height={28} sizes="28px" className="rounded-[8px]" />
        <span className="text-[16px] font-semibold tracking-[-0.03em] text-(--d-ink)">TrackSpeed</span>
      </div>

      <h1 className="mt-12 text-[28px] font-semibold leading-tight tracking-[-0.02em] text-(--d-ink)">Open your dashboard</h1>
      <p className="mt-2 text-[15px] leading-relaxed text-(--d-ink-2)">
        Every run, split and finish photo from the TrackSpeed app, for all your athletes.
      </p>

      <section aria-labelledby="phone-title" className="mt-9 rounded-2xl border border-(--d-line) px-5 py-5 sm:px-6">
        <h2 id="phone-title" className="text-[15px] font-semibold text-(--d-ink)">Sign in from your iPhone</h2>
        <p className="mt-1 text-[14px] text-(--d-ink-2)">Works with any account, including Sign in with Apple.</p>
        <ol className="mt-5 flex flex-col gap-4">
          {[
            'Open TrackSpeed on your iPhone.',
            'Go to Settings, then Web Dashboard.',
            'Tap “Send sign-in link to your computer”, then open the link on this computer.',
          ].map((step, i) => (
            <li key={step} className="flex gap-3.5 text-[14px] leading-snug text-(--d-ink)">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--d-brand-wash) text-[12px] font-semibold text-(--d-brand-ink)">
                {i + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <div className="my-8 flex items-center gap-3 text-[12px] text-(--d-ink-3)" role="separator">
        <span className="h-px flex-1 bg-(--d-line)" />
        or sign in here
        <span className="h-px flex-1 bg-(--d-line)" />
      </div>

      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          onClick={() => void oauth('google')}
          disabled={busy !== null}
          className="flex h-11 items-center justify-center gap-2.5 rounded-lg border border-(--d-line-strong) text-[14px] font-medium text-(--d-ink) hover:bg-(--d-raise) disabled:opacity-60"
        >
          <GoogleMark /> {busy === 'google' ? 'Opening Google…' : 'Continue with Google'}
        </button>
        {APPLE_WEB_ENABLED ? (
          <button
            type="button"
            onClick={() => void oauth('apple')}
            disabled={busy !== null}
            className="flex h-11 items-center justify-center gap-2.5 rounded-lg border border-(--d-line-strong) text-[14px] font-medium text-(--d-ink) hover:bg-(--d-raise) disabled:opacity-60"
          >
            <AppleMark /> {busy === 'apple' ? 'Opening Apple…' : 'Continue with Apple'}
          </button>
        ) : null}
      </div>

      <form onSubmit={signInWithPassword} className="mt-6 flex flex-col gap-3" noValidate>
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] text-(--d-ink-2)">Email</span>
          <input type="email" autoComplete="email" inputMode="email" value={email} onChange={e => setEmail(e.target.value)} className={field} placeholder="you@example.com" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] text-(--d-ink-2)">Password</span>
          <input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} className={field} />
        </label>
        <button
          type="submit"
          disabled={busy !== null}
          className="mt-1 h-11 rounded-lg bg-(--d-ink) text-[14px] font-medium text-(--d-bg) hover:opacity-90 disabled:opacity-60"
        >
          {busy === 'password' ? 'Signing in…' : 'Sign in'}
        </button>
        <button
          type="button"
          onClick={() => void sendLink()}
          disabled={busy !== null}
          className="h-10 rounded-lg text-[14px] text-(--d-ink-2) hover:bg-(--d-raise) hover:text-(--d-ink) disabled:opacity-60"
        >
          {busy === 'link' ? 'Sending…' : 'Email me a sign-in link instead'}
        </button>
      </form>

      <div aria-live="polite" className="min-h-[1px]">
        {notice ? (
          <p
            role={notice.kind === 'error' ? 'alert' : undefined}
            className={cx(
              'mt-4 rounded-lg px-3.5 py-3 text-[14px] leading-snug',
              notice.kind === 'error' ? 'bg-(--d-raise) text-(--d-danger)' : 'bg-(--d-brand-wash) text-(--d-brand-ink)',
            )}
          >
            {notice.text}
          </p>
        ) : null}
      </div>

      {!APPLE_WEB_ENABLED ? (
        <p className="mt-8 text-[13px] leading-relaxed text-(--d-ink-3)">
          Signed up with Apple? Use the link from your iPhone. Apple sign-in on the web isn’t available yet.
        </p>
      ) : null}
    </main>
  )
}
