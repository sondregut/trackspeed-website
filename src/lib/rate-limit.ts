import { createHash } from 'node:crypto'
import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

interface RateLimitOptions {
  scope: string
  limit: number
  windowSeconds: number
  identifier?: string | null
}

interface RateLimitResult {
  allowed: boolean
  retry_after_seconds: number | null
}

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown'
  }

  return request.headers.get('x-real-ip') || 'unknown'
}

function hashRateLimitKey(parts: string[]): string {
  return createHash('sha256')
    .update(parts.join(':'))
    .digest('hex')
}

export async function enforceRateLimit(
  request: Request,
  options: RateLimitOptions
): Promise<NextResponse | null> {
  const identifier = options.identifier?.trim().toLowerCase() || 'anonymous'
  const keyHash = hashRateLimitKey([
    options.scope,
    getClientIp(request),
    identifier,
  ])

  let result
  try {
    result = await getSupabaseAdmin()
      .rpc('consume_api_rate_limit', {
        rate_key_hash: keyHash,
        scope_name: options.scope,
        max_attempts: options.limit,
        window_seconds: options.windowSeconds,
      })
      .single()
  } catch (error) {
    console.error(`Rate limit check failed for ${options.scope}:`, error)
    return NextResponse.json(
      { error: 'Rate limit unavailable' },
      { status: 503 }
    )
  }

  const { data: rawData, error } = result

  if (error) {
    console.error(`Rate limit check failed for ${options.scope}:`, error)
    return NextResponse.json(
      { error: 'Rate limit unavailable' },
      { status: 503 }
    )
  }

  const data = rawData as RateLimitResult | null
  if (!data || typeof data.allowed !== 'boolean') {
    console.error(`Rate limit check returned an invalid result for ${options.scope}`)
    return NextResponse.json(
      { error: 'Rate limit unavailable' },
      { status: 503 }
    )
  }

  if (!data.allowed) {
    const retryAfter = Math.max(1, data.retry_after_seconds ?? options.windowSeconds)
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: { 'Retry-After': String(retryAfter) },
      }
    )
  }

  return null
}
