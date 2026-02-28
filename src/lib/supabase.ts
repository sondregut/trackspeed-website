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
  user_name: string | null
  user_email: string | null
  // Joined fields
  promo_codes?: PromoCode & {
    influencer_id: string | null
    influencers?: {
      id: string
      name: string
      email: string
    } | null
  }
}

// Influencer types
export interface Influencer {
  id: string
  email: string
  name: string
  password_hash: string
  code: string
  social_links: Record<string, string>
  application_note: string | null
  stripe_account_id: string | null
  stripe_onboarding_complete: boolean
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  status_reason: string | null
  approved_at: string | null
  approved_by: string | null
  total_signups: number
  total_conversions: number
  total_earnings_cents: number
  created_at: string
  updated_at: string
}

export interface InfluencerReferral {
  id: string
  influencer_id: string
  app_user_id: string
  device_id: string
  trial_expires_at: string
  converted_at: string | null
  created_at: string
}

export interface InfluencerCommission {
  id: string
  influencer_id: string
  referral_id: string
  revenue_cents: number
  commission_cents: number
  status: 'pending' | 'transferred' | 'clawback' | 'failed'
  stripe_transfer_id: string | null
  created_at: string
  transferred_at: string | null
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Lazy initialization to avoid build-time errors when env vars are not set
let _supabase: SupabaseClient | null = null
let _supabaseAdmin: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables')
    }
    _supabase = createClient(supabaseUrl, supabaseAnonKey)
  }
  return _supabase
}

// Service role client for admin operations (bypasses RLS)
export function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase service role key')
    }
    _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
  }
  return _supabaseAdmin
}

// For backwards compatibility (will throw at runtime if env vars not set)
export const supabase = {
  from: (...args: Parameters<SupabaseClient['from']>) => getSupabase().from(...args),
}
