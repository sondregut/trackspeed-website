import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { sendEmail } from '@/lib/email'
import { cookies } from 'next/headers'

// Verify admin auth (check for admin_session cookie)
async function verifyAdmin() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('admin_session')
  // Just check if the cookie exists - same pattern as other admin routes
  return !!sessionCookie?.value
}

// GET /api/admin/influencers - List all influencers
export async function GET(request: NextRequest) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const supabase = getSupabaseAdmin()

    let query = supabase
      .from('influencers')
      .select('*')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data: influencers, error } = await query

    if (error) {
      console.error('Failed to fetch influencers:', error)
      return NextResponse.json({ error: 'Failed to fetch influencers' }, { status: 500 })
    }

    return NextResponse.json({ influencers })
  } catch (error) {
    console.error('Admin influencers error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// PATCH /api/admin/influencers - Update influencer status
export async function PATCH(request: NextRequest) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, status, statusReason } = body

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID and status are required' },
        { status: 400 }
      )
    }

    const validStatuses = ['pending', 'approved', 'rejected', 'suspended']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    // Build update object
    const updateData: Record<string, unknown> = {
      status,
      status_reason: statusReason || null,
      updated_at: new Date().toISOString(),
    }

    // Set approved_at if approving
    if (status === 'approved') {
      updateData.approved_at = new Date().toISOString()
      updateData.approved_by = 'admin' // Could be enhanced to track actual admin user

      // Also create the promo code for this influencer
      const { data: influencer } = await supabase
        .from('influencers')
        .select('code, email, name')
        .eq('id', id)
        .single()

      if (influencer) {
        // Check if promo code already exists
        const { data: existingCode } = await supabase
          .from('promo_codes')
          .select('id')
          .eq('code', influencer.code)
          .single()

        if (!existingCode) {
          // Create promo code linked to influencer
          await supabase.from('promo_codes').insert({
            code: influencer.code,
            type: 'trial',
            duration_days: 30, // 30-day trial for influencer codes
            max_uses: null, // Unlimited
            is_active: true,
            influencer_id: id,
            note: `Influencer code - auto-created on approval`,
          })
        }

        // Reactivate any previously deactivated codes (e.g., after suspension)
        await supabase
          .from('promo_codes')
          .update({ is_active: true })
          .eq('influencer_id', id)

        // Send approval email
        await sendEmail({
          to: influencer.email,
          template: 'influencer_approved',
          data: { name: influencer.name, code: influencer.code },
          metadata: { influencer_id: id },
        })
      }
    }

    // Deactivate all promo codes when suspending
    if (status === 'suspended') {
      await supabase
        .from('promo_codes')
        .update({ is_active: false })
        .eq('influencer_id', id)
    }

    const { error } = await supabase
      .from('influencers')
      .update(updateData)
      .eq('id', id)

    if (error) {
      console.error('Failed to update influencer:', error)
      return NextResponse.json({ error: 'Failed to update influencer' }, { status: 500 })
    }

    console.log(`Influencer ${id} status updated to ${status}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin influencer update error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
