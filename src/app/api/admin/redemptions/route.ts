import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('promo_redemptions')
    .select(`
      *,
      promo_codes (
        code,
        type,
        duration_days
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
