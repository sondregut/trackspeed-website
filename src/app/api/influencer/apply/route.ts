import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { sendEmail } from '@/lib/email'
import bcrypt from 'bcryptjs'

// POST /api/influencer/apply - Submit influencer application
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, socialLinks, applicationNote } = body

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdmin()

    // Check if email already exists
    const { data: existing } = await supabase
      .from('influencers')
      .select('id')
      .eq('email', email.toLowerCase())
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'An application with this email already exists' },
        { status: 409 }
      )
    }

    // Generate unique code: NAME30 format (e.g., "Sondre" -> "SONDRE30")
    const firstName = name
      .split(/\s+/)[0] // Take first word/name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 15)

    const baseCode = `${firstName}30`

    // Check if code exists and append number if needed
    let code = baseCode
    let suffix = 2
    let codeExists = true

    while (codeExists) {
      const { data: existingCode } = await supabase
        .from('influencers')
        .select('id')
        .eq('code', code)
        .single()

      if (!existingCode) {
        codeExists = false
      } else {
        code = `${firstName}30_${suffix}`
        suffix++
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create influencer application
    const { data: influencer, error } = await supabase
      .from('influencers')
      .insert({
        email: email.toLowerCase(),
        name,
        password_hash: passwordHash,
        code,
        social_links: socialLinks || {},
        application_note: applicationNote || null,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to create influencer application:', error)
      return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 })
    }

    console.log(`New influencer application: ${email} (code: ${code})`)

    // Send confirmation email
    const emailResult = await sendEmail({
      to: email.toLowerCase(),
      template: 'influencer_application_received',
      data: { name },
      metadata: { influencer_id: influencer.id },
    })

    if (!emailResult.success) {
      console.error('Failed to send confirmation email:', emailResult.error)
    }

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully. We will review and get back to you.',
    })
  } catch (error) {
    console.error('Influencer apply error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
