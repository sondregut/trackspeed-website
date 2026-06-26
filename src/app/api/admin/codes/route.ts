import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { verifyAdminSession } from "@/lib/admin-auth";

const allowedCodeTypes = new Set(['free', 'trial'])

function positiveIntegerOrNull(value: unknown, fieldName: string): number | null | NextResponse {
  if (value === null || value === undefined || value === '') return null
  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    return NextResponse.json(
      { error: `${fieldName} must be a positive integer or null` },
      { status: 400 }
    )
  }
  return value
}

function isoDateOrNull(value: unknown): string | null | NextResponse {
  if (value === null || value === undefined || value === '') return null
  if (typeof value !== 'string') {
    return NextResponse.json(
      { error: 'expires_at must be an ISO date string or null' },
      { status: 400 }
    )
  }

  const timestamp = Date.parse(value)
  if (Number.isNaN(timestamp)) {
    return NextResponse.json(
      { error: 'expires_at must be a valid date' },
      { status: 400 }
    )
  }

  return value
}

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
    const { code, type, duration_days, max_uses, expires_at, note } = body

    // Validate required fields
    if (!code || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!allowedCodeTypes.has(type)) {
      return NextResponse.json(
        { error: 'Invalid code type' },
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

    const parsedDurationDays = positiveIntegerOrNull(duration_days, 'duration_days')
    if (parsedDurationDays instanceof NextResponse) return parsedDurationDays

    const parsedMaxUses = positiveIntegerOrNull(max_uses, 'max_uses')
    if (parsedMaxUses instanceof NextResponse) return parsedMaxUses

    const parsedExpiresAt = isoDateOrNull(expires_at)
    if (parsedExpiresAt instanceof NextResponse) return parsedExpiresAt

    // Check if code already exists
    const supabase = getSupabaseAdmin()
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
        duration_days: parsedDurationDays,
        max_uses: parsedMaxUses,
        expires_at: parsedExpiresAt,
        note: typeof note === 'string' && note.trim() ? note.trim() : null,
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
