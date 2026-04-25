import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifyAdminSession } from "@/lib/admin-auth";

export async function GET() {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('promo_redemptions')
    .select(`
      *,
      promo_codes (
        code,
        type,
        duration_days,
        influencer_id,
        influencers (
          id,
          name,
          email
        )
      )
    `)
    .order('redeemed_at', { ascending: false })

  if (error) {
    console.error('Error fetching redemptions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch redemptions' },
      { status: 500 }
    )
  }

  return NextResponse.json(data)
}

export async function PATCH(request: Request) {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { redemption_id, action } = body

    if (!redemption_id || action !== 'revoke') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('promo_redemptions')
      .update({ pro_expires_at: new Date().toISOString() })
      .eq('id', redemption_id)
      .select()
      .single()

    if (error) {
      console.error('Error revoking redemption:', error)
      return NextResponse.json(
        { error: 'Failed to revoke redemption' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Redemption not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}
