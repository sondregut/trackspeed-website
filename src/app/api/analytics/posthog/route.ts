import { NextResponse } from 'next/server'

const ALLOWED_EVENTS = new Set(['$pageview', 'cookie_consent_accepted'])

function getPostHogHost() {
  const host =
    process.env.POSTHOG_HOST ??
    process.env.NEXT_PUBLIC_POSTHOG_HOST ??
    'https://eu.i.posthog.com'

  return host.replace(/\/+$/, '')
}

function sanitizeString(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return null

  const trimmed = value.trim()
  if (!trimmed) return null

  return trimmed.slice(0, maxLength)
}

function sanitizeProperties(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {}
  }

  const sanitized: Record<string, unknown> = {}
  for (const [key, rawValue] of Object.entries(value)) {
    if (!key || key.length > 80) continue

    if (typeof rawValue === 'string') {
      sanitized[key] = rawValue.slice(0, 500)
    } else if (typeof rawValue === 'number' || typeof rawValue === 'boolean' || rawValue === null) {
      sanitized[key] = rawValue
    }
  }

  return sanitized
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const event = sanitizeString('event' in body ? body.event : null, 80)
  const distinctId = sanitizeString('distinctId' in body ? body.distinctId : null, 120)
  if (!event || !ALLOWED_EVENTS.has(event) || !distinctId) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const apiKey = process.env.POSTHOG_API_KEY ?? process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!apiKey) {
    console.warn('PostHog key not set - skipping website analytics event')
    return NextResponse.json({ ok: false, skipped: true }, { status: 202 })
  }

  const properties = sanitizeProperties('properties' in body ? body.properties : null)
  const userAgent = sanitizeString(request.headers.get('user-agent'), 500)
  const referrer = sanitizeString(request.headers.get('referer'), 500)

  const response = await fetch(`${getPostHogHost()}/i/v0/e/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: apiKey,
      event,
      distinct_id: distinctId,
      properties: {
        ...properties,
        source: 'website_cookie_consent',
        $lib: 'trackspeed-web',
        ...(userAgent ? { $useragent: userAgent } : {}),
        ...(referrer ? { $referrer: referrer } : {}),
      },
    }),
  })

  if (!response.ok) {
    console.warn(`PostHog website forward ${event} returned ${response.status}`)
    return NextResponse.json({ error: 'PostHog forward failed' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
