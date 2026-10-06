'use client'

import type { SupabaseClient } from '@supabase/supabase-js'
import { PHOTO_BUCKET, type ImageSource } from './frames'

// Signs storage paths in batches (<= 100 per request, 1 hour expiry) and keeps
// the results in memory. Missing objects resolve to null and are not retried
// for a while, so optional photos (start/lap) are skipped silently.

const SIGN_SECONDS = 60 * 60
const REFRESH_MARGIN_MS = 5 * 60 * 1000
const MISSING_RETRY_MS = 10 * 60 * 1000
const BATCH_SIZE = 100

type Entry = { url: string | null; expiresAt: number }

const cache = new Map<string, Entry>()
const inflight = new Map<string, Promise<string | null>>()
let queue: { path: string; resolve: (url: string | null) => void }[] = []
let flushTimer: ReturnType<typeof setTimeout> | null = null
let clientGetter: (() => SupabaseClient) | null = null
let overrideResolver: ((path: string) => string | null) | null = null

export function configureImageSigning(getter: () => SupabaseClient) {
  clientGetter = getter
}

/** Development demo mode resolves paths to generated placeholders. */
export function setImageOverride(resolver: ((path: string) => string | null) | null) {
  overrideResolver = resolver
  cache.clear()
  inflight.clear()
}

export function clearImageCache() {
  cache.clear()
  inflight.clear()
}

function cached(path: string): Entry | undefined {
  const entry = cache.get(path)
  if (!entry) return undefined
  if (entry.expiresAt - REFRESH_MARGIN_MS < Date.now()) {
    cache.delete(path)
    return undefined
  }
  return entry
}

async function flush() {
  flushTimer = null
  const batch = queue
  queue = []
  if (batch.length === 0) return

  const waiting = new Map<string, ((url: string | null) => void)[]>()
  for (const item of batch) {
    const list = waiting.get(item.path)
    if (list) list.push(item.resolve)
    else waiting.set(item.path, [item.resolve])
  }
  const paths = [...waiting.keys()]

  for (let i = 0; i < paths.length; i += BATCH_SIZE) {
    const chunk = paths.slice(i, i + BATCH_SIZE)
    const results = new Map<string, string | null>()
    try {
      if (!clientGetter) throw new Error('Image signing is not configured')
      const { data, error } = await clientGetter().storage.from(PHOTO_BUCKET).createSignedUrls(chunk, SIGN_SECONDS)
      if (error) throw error
      for (const item of data ?? []) {
        if (item.path) results.set(item.path, item.error ? null : item.signedUrl || null)
      }
    } catch {
      // Treat a failed batch as temporarily missing; it is retried later.
    }
    const now = Date.now()
    for (const path of chunk) {
      const url = results.get(path) ?? null
      cache.set(path, { url, expiresAt: url ? now + SIGN_SECONDS * 1000 : now + MISSING_RETRY_MS })
      inflight.delete(path)
      for (const resolve of waiting.get(path) ?? []) resolve(url)
    }
  }
}

function signPath(path: string): Promise<string | null> {
  if (overrideResolver) return Promise.resolve(overrideResolver(path))
  const hit = cached(path)
  if (hit) return Promise.resolve(hit.url)
  const pending = inflight.get(path)
  if (pending) return pending
  const promise = new Promise<string | null>(resolve => {
    queue.push({ path, resolve })
    if (!flushTimer) flushTimer = setTimeout(flush, 24)
  })
  inflight.set(path, promise)
  return promise
}

/** Synchronous cache lookup so already-signed images render without a flash. */
export function peekImage(source: ImageSource | null | undefined): string | null | undefined {
  if (!source) return null
  if (source.kind === 'url') return source.url
  if (overrideResolver) return overrideResolver(source.path)
  return cached(source.path)?.url
}

export async function resolveImage(source: ImageSource): Promise<string | null> {
  if (source.kind === 'url') return source.url
  return signPath(source.path)
}

/** Resolves the first candidate that exists. */
export async function resolveFirstImage(sources: ImageSource[]): Promise<string | null> {
  for (const source of sources) {
    const url = await resolveImage(source)
    if (url) return url
  }
  return null
}
