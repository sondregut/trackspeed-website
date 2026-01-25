import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Types for our database tables (matches migration schema)
export interface PromoCode {
  id: string
  code: string
  type: 'free' | 'trial'
  duration_days: number | null  // NULL = forever
  max_uses: number | null       // NULL = unlimited
  current_uses: number
  expires_at: string | null
  note: string | null
  is_active: boolean
  created_at: string
}

export interface PromoRedemption {
  id: string
  code_id: string
  user_id: string | null
  device_id: string
  pro_expires_at: string | null
  redeemed_at: string
  // Joined fields
  promo_codes?: PromoCode
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Lazy initialization to avoid build-time errors when env vars are not set
let _supabase: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables')
    }
    _supabase = createClient(supabaseUrl, supabaseAnonKey)
  }
  return _supabase
}

// For backwards compatibility (will throw at runtime if env vars not set)
export const supabase = {
  from: (...args: Parameters<SupabaseClient['from']>) => getSupabase().from(...args),
}
