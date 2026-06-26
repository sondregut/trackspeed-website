import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-auth'
import { getSupabaseAdmin } from '@/lib/supabase'
import {
  calculateRewardAmount,
  creatorRewardStatuses,
  defaultRewardPercentageForStatus,
} from '@/lib/creator-reward-rules.mjs'

interface PatchBody {
  status?: string
  verified_view_count?: number | string | null
  reward_percentage?: number | string | null
  reward_amount?: number | string | null
  reward_currency?: string | null
  admin_notes?: string | null
  rejection_reason?: string | null
}

function nullableNumber(value: unknown, fieldName: string): number | null | undefined {
  if (value === undefined) return undefined
  if (value === null || value === '') return null

  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${fieldName} must be a non-negative number.`)
  }

  return parsed
}

function nullableWholeNumber(value: unknown, fieldName: string): number | null | undefined {
  const parsed = nullableNumber(value, fieldName)
  if (parsed === undefined || parsed === null) return parsed

  if (!Number.isInteger(parsed)) {
    throw new Error(`${fieldName} must be a whole number.`)
  }

  return parsed
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  let body: PatchBody

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const updateData: Record<string, unknown> = {}

  if (body.status !== undefined) {
    if (!creatorRewardStatuses.includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status.' }, { status: 400 })
    }
    updateData.status = body.status
  }

  try {
    const verifiedViewCount = nullableWholeNumber(body.verified_view_count, 'Verified view count')
    if (verifiedViewCount !== undefined) updateData.verified_view_count = verifiedViewCount

    const rewardPercentageInput = nullableWholeNumber(body.reward_percentage, 'Reward percentage')
    if (rewardPercentageInput !== undefined) {
      if (
        rewardPercentageInput !== null &&
        rewardPercentageInput !== 50 &&
        rewardPercentageInput !== 100
      ) {
        return NextResponse.json({ error: 'Reward percentage must be 50 or 100.' }, { status: 400 })
      }
      updateData.reward_percentage = rewardPercentageInput
    }

    const rewardAmount = nullableNumber(body.reward_amount, 'Reward amount')
    if (rewardAmount !== undefined) updateData.reward_amount = rewardAmount
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Invalid number.' },
      { status: 400 }
    )
  }

  if (body.reward_currency !== undefined) {
    updateData.reward_currency = body.reward_currency?.trim().toUpperCase() || null
  }

  if (body.admin_notes !== undefined) {
    updateData.admin_notes = body.admin_notes?.trim() || null
  }

  if (body.rejection_reason !== undefined) {
    updateData.rejection_reason = body.rejection_reason?.trim() || null
  }

  const status = typeof updateData.status === 'string' ? updateData.status : null
  const inferredPercentage = status ? defaultRewardPercentageForStatus(status) : null

  if (inferredPercentage && updateData.reward_percentage === undefined) {
    updateData.reward_percentage = inferredPercentage
  }

  if (status === 'paid') {
    updateData.paid_at = new Date().toISOString()
  }

  if (status === 'rejected') {
    updateData.reward_percentage = null
    updateData.reward_amount = null
    updateData.reward_currency = null
    updateData.paid_at = null
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: 'No changes provided.' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()
  const { data: existing, error: existingError } = await supabase
    .from('creator_reward_submissions')
    .select('id, purchase_price, purchase_currency, reward_percentage, reward_amount, status')
    .eq('id', id)
    .single()

  if (existingError || !existing) {
    return NextResponse.json({ error: 'Submission not found.' }, { status: 404 })
  }

  const rewardPercentage =
    updateData.reward_percentage !== undefined
      ? updateData.reward_percentage
      : existing.reward_percentage

  if (
    (status === 'approved_50' || status === 'approved_100') &&
    typeof rewardPercentage === 'number' &&
    updateData.reward_amount === undefined
  ) {
    updateData.reward_amount = calculateRewardAmount(existing.purchase_price, rewardPercentage)
    updateData.reward_currency = updateData.reward_currency ?? existing.purchase_currency
  }

  if (
    status === 'paid' &&
    updateData.reward_amount === undefined &&
    existing.reward_amount == null &&
    typeof rewardPercentage === 'number'
  ) {
    updateData.reward_amount = calculateRewardAmount(existing.purchase_price, rewardPercentage)
    updateData.reward_currency = updateData.reward_currency ?? existing.purchase_currency
  }

  const { data, error } = await supabase
    .from('creator_reward_submissions')
    .update(updateData)
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    console.error('Failed to update creator reward submission:', error)
    return NextResponse.json({ error: 'Failed to update submission.' }, { status: 500 })
  }

  return NextResponse.json({ submission: data })
}
