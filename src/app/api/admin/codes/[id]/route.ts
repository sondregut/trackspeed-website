import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const { is_active, max_uses } = body

    // Build update object dynamically from provided fields
    const updates: Record<string, unknown> = {}

    if (typeof is_active === 'boolean') {
      updates.is_active = is_active
    }

    if ('max_uses' in body) {
      if (max_uses !== null && (!Number.isInteger(max_uses) || max_uses <= 0)) {
        return NextResponse.json(
          { error: 'max_uses must be a positive integer or null' },
          { status: 400 }
        )
      }
      updates.max_uses = max_uses
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('promo_codes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating promo code:', error)
      return NextResponse.json(
        { error: 'Failed to update promo code' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Promo code not found' },
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { error } = await supabase
      .from('promo_codes')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting promo code:', error)
      return NextResponse.json(
        { error: 'Failed to delete promo code' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}
