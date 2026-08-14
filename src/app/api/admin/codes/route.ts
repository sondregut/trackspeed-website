import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { verifyAdminSession } from "@/lib/admin-auth";
import {
  parsePromoCodeCreateInput,
  promoCodeRedemptionReadiness,
} from "@/lib/promo-code-contract";

export async function GET() {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('promo_codes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching promo codes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch promo codes' },
      { status: 500 }
    )
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = parsePromoCodeCreateInput(body)
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 })
    }
    const createRecord = parsed.value

    // Check if code already exists
    const supabase = getSupabaseAdmin()
    const { data: existing, error: existingError } = await supabase
      .from('promo_codes')
      .select('id')
      .eq('code', createRecord.code)
      .maybeSingle()

    if (existingError) {
      console.error('Error checking promo code uniqueness:', existingError)
      return NextResponse.json(
        { error: 'Failed to verify promo code availability' },
        { status: 500 }
      )
    }

    if (existing) {
      return NextResponse.json(
        { error: 'Code already exists' },
        { status: 409 }
      )
    }

    // Insert the new code
    const { data, error } = await supabase
      .from('promo_codes')
      .insert(createRecord)
      .select()
      .single()

    if (error) {
      console.error('Error creating promo code:', error)
      const message =
        error.code === '23505'
          ? 'Code already exists'
          : 'Failed to create promo code'
      return NextResponse.json(
        { error: message },
        { status: error.code === '23505' ? 409 : 500 }
      )
    }

    return NextResponse.json(
      {
        ...data,
        redemption_readiness: promoCodeRedemptionReadiness(data),
      },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}
