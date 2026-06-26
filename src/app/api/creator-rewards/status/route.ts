import { NextRequest, NextResponse } from 'next/server'
import { enforceRateLimit } from '@/lib/rate-limit'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const claimId = searchParams.get('claim_id')?.trim().toLowerCase()

  const rateLimitResponse = await enforceRateLimit(request, {
    scope: 'creator-reward-status',
    limit: 20,
    windowSeconds: 60 * 60,
    identifier: claimId,
  })
  if (rateLimitResponse) return rateLimitResponse

  if (!claimId) {
    return NextResponse.json({ error: 'Claim ID is required.' }, { status: 400 })
  }

  const { data, error } = await getSupabaseAdmin()
    .from('creator_reward_submissions')
    .select(`
      claim_id,
      email,
      social_platform,
      post_url,
      submitted_view_count,
      verified_view_count,
      country,
      payout_method,
      status,
      reward_percentage,
      reward_amount,
      reward_currency,
      rejection_reason,
      paid_at,
      created_at,
      updated_at
    `)
    .eq('claim_id', claimId)
    .maybeSingle()

  if (error) {
    console.error('Creator reward status lookup failed:', error)
    return NextResponse.json({ error: 'Could not load claim status.' }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: 'Claim not found.' }, { status: 404 })
  }

  return NextResponse.json(data)
}
