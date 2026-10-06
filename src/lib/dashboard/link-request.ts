// Request handling for POST /api/dashboard/link, kept free of Next/Supabase
// imports so it can be unit-tested with mocked dependencies.

export const DEFAULT_DASHBOARD_ORIGIN = 'https://mytrackspeed.com'

/** Supabase's default email OTP lifetime (Auth > Email > OTP expiry). */
export const DASHBOARD_LINK_TTL_SECONDS = 60 * 60

export interface DashboardLinkUser {
  id: string
  email?: string | null
  is_anonymous?: boolean | null
}

export type GetUserResult =
  | { ok: true; user: DashboardLinkUser }
  | { ok: false; reason: 'invalid' | 'unavailable' }

export type RateLimitOutcome = null | { status: number; retryAfter?: string | null }

export interface DashboardLinkDeps {
  getUser(token: string): Promise<GetUserResult>
  /** "ip" runs before the token is verified, "user" after. */
  rateLimit(scope: 'ip' | 'user', identifier: string | null): Promise<RateLimitOutcome>
  generateLink(email: string): Promise<{ hashedToken: string } | null>
  origin: string
  now(): number
}

export interface DashboardLinkResponse {
  status: number
  body: Record<string, unknown>
  headers: Record<string, string>
}

const NO_STORE = { 'Cache-Control': 'no-store' }

function respond(status: number, body: Record<string, unknown>, headers: Record<string, string> = {}): DashboardLinkResponse {
  return { status, body, headers: { ...NO_STORE, ...headers } }
}

function failure(status: number, error: string, message: string, headers?: Record<string, string>) {
  return respond(status, { error, message }, headers)
}

const JWT_PATTERN = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/

/** Extracts a JWT-shaped bearer token, or null when absent or malformed. */
export function parseBearerToken(header: string | null | undefined): string | null {
  if (!header) return null
  const match = /^Bearer\s+(\S+)\s*$/i.exec(header)
  if (!match) return null
  const token = match[1]
  if (token.length > 8192 || !JWT_PATTERN.test(token)) return null
  return token
}

/**
 * The link origin comes from configuration, never from the request's Host
 * header. Only https origins (or http on localhost for development) pass.
 */
export function resolveDashboardOrigin(value: string | null | undefined): string {
  if (!value) return DEFAULT_DASHBOARD_ORIGIN
  try {
    const url = new URL(value.trim())
    const isLocal = url.hostname === 'localhost' || url.hostname === '127.0.0.1'
    if (url.protocol !== 'https:' && !(url.protocol === 'http:' && isLocal)) return DEFAULT_DASHBOARD_ORIGIN
    return url.origin
  } catch {
    return DEFAULT_DASHBOARD_ORIGIN
  }
}

/**
 * The one-time token rides in the URL fragment, which browsers never send to
 * the server, so it stays out of request logs and Referer headers.
 */
export function buildDashboardLinkUrl(origin: string, hashedToken: string): string {
  const url = new URL('/dashboard/auth', origin)
  url.hash = new URLSearchParams({ token_hash: hashedToken, type: 'magiclink' }).toString()
  return url.toString()
}

function rateLimitFailure(outcome: NonNullable<RateLimitOutcome>): DashboardLinkResponse {
  if (outcome.status === 429) {
    return failure(429, 'rate_limited', 'Too many sign-in links requested. Try again in a few minutes.', outcome.retryAfter ? { 'Retry-After': outcome.retryAfter } : undefined)
  }
  return failure(503, 'rate_limit_unavailable', 'Sign-in links are temporarily unavailable. Try again shortly.')
}

export async function handleDashboardLinkRequest(
  authorization: string | null,
  deps: DashboardLinkDeps,
): Promise<DashboardLinkResponse> {
  const token = parseBearerToken(authorization)
  if (!token) {
    return failure(401, 'missing_token', 'Send the TrackSpeed session token as "Authorization: Bearer <token>".')
  }

  const ipLimit = await deps.rateLimit('ip', null)
  if (ipLimit) return rateLimitFailure(ipLimit)

  const result = await deps.getUser(token)
  if (!result.ok) {
    return result.reason === 'unavailable'
      ? failure(503, 'auth_unavailable', 'Could not verify the session. Try again shortly.')
      : failure(401, 'invalid_token', 'The session token is invalid or expired. Sign in to TrackSpeed again.')
  }

  const { user } = result
  if (user.is_anonymous) {
    return failure(403, 'anonymous_user', 'Sign in to TrackSpeed with Apple, Google or email before opening the web dashboard.')
  }

  const email = typeof user.email === 'string' ? user.email.trim() : ''
  if (!email) {
    return failure(422, 'email_required', 'This account has no email address, so a sign-in link cannot be created.')
  }

  const userLimit = await deps.rateLimit('user', user.id)
  if (userLimit) return rateLimitFailure(userLimit)

  const link = await deps.generateLink(email)
  if (!link?.hashedToken) {
    return failure(502, 'link_failed', 'Could not create a sign-in link. Try again shortly.')
  }

  const expiresAt = new Date(deps.now() + DASHBOARD_LINK_TTL_SECONDS * 1000).toISOString()
  return respond(200, { url: buildDashboardLinkUrl(deps.origin, link.hashedToken), expiresAt })
}
