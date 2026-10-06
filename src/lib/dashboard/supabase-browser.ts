'use client'

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Browser-only client for the coach dashboard. It uses the public anon key
// plus the signed-in user's JWT, so row-level security limits every query and
// signed URL to the user's own data. Never use the service-role key here.
let client: SupabaseClient | null = null

export const DASHBOARD_AUTH_STORAGE_KEY = 'trackspeed-dashboard-auth'

export function getDashboardSupabase(): SupabaseClient {
  if (typeof window === 'undefined') {
    throw new Error('The dashboard Supabase client is browser-only')
  }
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !anonKey) throw new Error('Missing Supabase environment variables')
    client = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        // /dashboard/auth exchanges codes and token hashes explicitly.
        detectSessionInUrl: false,
        flowType: 'pkce',
        storageKey: DASHBOARD_AUTH_STORAGE_KEY,
      },
    })
  }
  return client
}

/** Only same-site dashboard paths are allowed as post-login destinations. */
export function safeDashboardPath(value: string | null | undefined): string {
  if (!value || !value.startsWith('/dashboard') || value.startsWith('//') || value.includes('\\')) return '/dashboard'
  if (value.startsWith('/dashboard/login') || value.startsWith('/dashboard/auth')) return '/dashboard'
  return value
}
