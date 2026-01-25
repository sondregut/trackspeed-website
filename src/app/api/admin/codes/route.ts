import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
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
  try {
    const body = await request.json()
    const { code, type, duration_days, max_uses, expires_at, note } = body

    // Validate required fields
    if (!code || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate code format (alphanumeric, uppercase)
    const normalizedCode = code.toUpperCase().trim()
    if (!/^[A-Z0-9]+$/.test(normalizedCode)) {
      return NextResponse.json(
        { error: 'Code must be alphanumeric' },
        { status: 400 }
      )
    }

    // Check if code already exists
    const { data: existing } = await supabase
      .from('promo_codes')
      .select('id')
      .eq('code', normalizedCode)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Code already exists' },
        { status: 409 }
      )
    }

    // Insert the new code
    const { data, error } = await supabase
      .from('promo_codes')
      .insert({
        code: normalizedCode,
        type,
        duration_days: duration_days || null,
        max_uses: max_uses || null,
        expires_at: expires_at || null,
        note: note || null,
        is_active: true,
        current_uses: 0,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating promo code:', error)
      return NextResponse.json(
        { error: 'Failed to create promo code' },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}
