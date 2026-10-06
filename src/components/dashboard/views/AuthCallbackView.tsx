'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { EmailOtpType } from '@supabase/supabase-js'
import { getDashboardSupabase, safeDashboardPath } from '@/lib/dashboard/supabase-browser'

const OTP_TYPES: EmailOtpType[] = ['magiclink', 'email', 'signup', 'invite', 'recovery', 'email_change']

type Failure = 'expired' | 'other-browser' | 'denied' | 'missing' | 'unknown'

function classify(message: string | null | undefined, code?: string | null): Failure {
  const text = `${code ?? ''} ${message ?? ''}`.toLowerCase()
  if (text.includes('expired') || text.includes('otp') || (text.includes('invalid') && text.includes('link'))) return 'expired'
  if (text.includes('code verifier') || text.includes('flow state') || text.includes('pkce')) return 'other-browser'
  if (text.includes('access_denied') || text.includes('denied') || text.includes('cancel')) return 'denied'
  return 'unknown'
}

const COPY: Record<Failure, { title: string; body: string }> = {
  expired: {
    title: 'This sign-in link has expired',
    body: 'Links work once and for a limited time. Send a new one from the TrackSpeed app: Settings, then Web Dashboard.',
  },
  'other-browser': {
    title: 'Open the link in the same browser',
    body: 'This link was requested from a different browser. Request a new one here, or send one from the TrackSpeed app.',
  },
  denied: {
    title: 'Sign-in was cancelled',
    body: 'Nothing was changed. Try again whenever you’re ready.',
  },
  missing: {
    title: 'This link is incomplete',
    body: 'Copy the whole link from the email or message, or send a new one from the TrackSpeed app.',
  },
  unknown: {
    title: 'Sign-in didn’t work',
    body: 'Send a new link from the TrackSpeed app (Settings, then Web Dashboard) or try another sign-in method.',
  },
}

export function AuthCallbackView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [failure, setFailure] = useState<Failure | null>(null)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    const next = safeDashboardPath(searchParams.get('next'))
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const errorCode = searchParams.get('error_code') ?? hash.get('error_code')
    const errorText = searchParams.get('error_description') ?? hash.get('error_description') ?? searchParams.get('error') ?? hash.get('error')
    // App links carry token_hash in the fragment (never sent to the server);
    // older links used the query string, which still works.
    const tokenHash = searchParams.get('token_hash') ?? hash.get('token_hash')
    const typeParam = (searchParams.get('type') ?? hash.get('type')) as EmailOtpType | null
    const code = searchParams.get('code')

    // Drop the one-time credentials (query and fragment) from the address bar
    // and history before anything else runs.
    window.history.replaceState(null, '', '/dashboard/auth')

    const run = async () => {
      if (errorCode || errorText) return classify(errorText, errorCode)
      const supabase = getDashboardSupabase()
      if (tokenHash) {
        const type = typeParam && OTP_TYPES.includes(typeParam) ? typeParam : 'email'
        const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
        return error ? classify(error.message, error.code) : null
      }
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        return error ? classify(error.message, error.code) : null
      }
      const { data } = await supabase.auth.getSession()
      return data.session ? null : 'missing'
    }

    run()
      .then(result => {
        if (result) setFailure(result)
        else router.replace(next)
      })
      .catch(() => setFailure('unknown'))
  }, [router, searchParams])

  return (
    <main id="main" className="mx-auto flex min-h-dvh w-full max-w-[440px] flex-col justify-center px-5 py-16">
      {failure ? (
        <div role="alert">
          <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-(--d-ink)">{COPY[failure].title}</h1>
          <p className="mt-2 text-[15px] leading-relaxed text-(--d-ink-2)">{COPY[failure].body}</p>
          <Link
            href="/dashboard/login"
            className="mt-6 inline-flex h-10 items-center rounded-lg bg-(--d-ink) px-4 text-[14px] font-medium text-(--d-bg) hover:opacity-90"
          >
            Back to sign in
          </Link>
        </div>
      ) : (
        <div aria-live="polite" className="flex items-center gap-3 text-[15px] text-(--d-ink-2)">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-(--d-line-strong) border-t-(--d-brand)" aria-hidden="true" />
          Signing you in…
        </div>
      )}
    </main>
  )
}
