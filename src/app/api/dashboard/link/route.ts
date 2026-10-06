import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { enforceRateLimit } from '@/lib/rate-limit'
import {
  handleDashboardLinkRequest,
  resolveDashboardOrigin,
  type RateLimitOutcome,
} from '@/lib/dashboard/link-request'

// POST /api/dashboard/link
// Called by the TrackSpeed iOS app with the signed-in user's access token.
// Returns a one-time sign-in link for the web dashboard. Never log the token
// or the generated link.
export async function POST(request: NextRequest) {
  const toOutcome = (response: NextResponse | null): RateLimitOutcome =>
    response ? { status: response.status, retryAfter: response.headers.get('Retry-After') } : null

  const result = await handleDashboardLinkRequest(request.headers.get('authorization'), {
    origin: resolveDashboardOrigin(process.env.DASHBOARD_PUBLIC_ORIGIN),
    now: () => Date.now(),
    rateLimit: async (scope, identifier) =>
      toOutcome(
        scope === 'ip'
          ? await enforceRateLimit(request, { scope: 'dashboard-link-ip', limit: 30, windowSeconds: 15 * 60 })
          : await enforceRateLimit(request, { scope: 'dashboard-link-user', limit: 6, windowSeconds: 10 * 60, identifier }),
      ),
    getUser: async token => {
      try {
        const { data, error } = await getSupabaseAdmin().auth.getUser(token)
        if (error || !data.user) {
          const status = error?.status ?? 401
          return { ok: false, reason: status >= 500 || status === 0 ? 'unavailable' : 'invalid' }
        }
        return { ok: true, user: { id: data.user.id, email: data.user.email, is_anonymous: data.user.is_anonymous } }
      } catch {
        return { ok: false, reason: 'unavailable' }
      }
    },
    generateLink: async email => {
      try {
        const { data, error } = await getSupabaseAdmin().auth.admin.generateLink({ type: 'magiclink', email })
        if (error || !data.properties?.hashed_token) {
          console.error('Dashboard sign-in link generation failed', { status: error?.status ?? null, code: error?.code ?? null })
          return null
        }
        return { hashedToken: data.properties.hashed_token }
      } catch {
        console.error('Dashboard sign-in link generation threw')
        return null
      }
    },
  })

  return NextResponse.json(result.body, { status: result.status, headers: result.headers })
}
