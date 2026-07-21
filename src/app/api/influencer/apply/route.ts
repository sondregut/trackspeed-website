import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { sendEmail } from '@/lib/email'
import { enforceRateLimit } from '@/lib/rate-limit'
import bcrypt from 'bcryptjs'

const maxSocialLinks = 5
const maxSocialValueLength = 300
const maxApplicationNoteLength = 4000

function normalizeText(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null
  const normalized = value.trim()
  if (!normalized) return null
  return normalized.slice(0, maxLength)
}

function normalizeSocialLinks(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .slice(0, maxSocialLinks)
      .map(([key, linkValue]) => [
        key.trim().toLowerCase().slice(0, 40),
        normalizeText(linkValue, maxSocialValueLength),
      ])
      .filter((entry): entry is [string, string] => Boolean(entry[0]) && Boolean(entry[1]))
  )
}

// POST /api/influencer/apply - Submit influencer application
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, socialLinks, applicationNote } = body
    const normalizedName = normalizeText(name, 120)
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : null
    const normalizedSocialLinks = normalizeSocialLinks(socialLinks)
    const normalizedApplicationNote = normalizeText(applicationNote, maxApplicationNoteLength)

    const rateLimitResponse = await enforceRateLimit(request, {
      scope: 'influencer-apply',
      limit: 3,
      windowSeconds: 60 * 60,
      identifier: normalizedEmail,
    })
    if (rateLimitResponse) return rateLimitResponse

    // Validate required fields
    if (!normalizedName || !normalizedEmail || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Validate password strength
    if (typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    if (Object.keys(normalizedSocialLinks).length === 0) {
      return NextResponse.json(
        { error: 'Add at least one TikTok or Instagram handle.' },
        { status: 400 }
      )
    }

    if (!normalizedApplicationNote) {
      return NextResponse.json(
        { error: 'Application note is required' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdmin()

    // Check if email already exists
    const { data: existing } = await supabase
      .from('influencers')
      .select('id')
      .eq('email', normalizedEmail)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'An application with this email already exists' },
        { status: 409 }
      )
    }

    // Generate unique code: NAME30 format (e.g., "Sondre" -> "SONDRE30")
    const firstName = normalizedName
      .split(/\s+/)[0] // Take first word/name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 15)

    const baseCode = `${firstName || 'CREATOR'}30`

    // Check if code exists and append number if needed
    let code = baseCode
    let suffix = 2
    let codeExists = true

    while (codeExists) {
      const { data: existingCode } = await supabase
        .from('influencers')
        .select('id')
        .eq('code', code)
        .maybeSingle()

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
        email: normalizedEmail,
        name: normalizedName,
        password_hash: passwordHash,
        code,
        social_links: normalizedSocialLinks,
        application_note: normalizedApplicationNote,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to create influencer application:', error)
      return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 })
    }

    console.log(`New influencer application: ${normalizedEmail} (code: ${code})`)

    // Send confirmation email
    const emailResult = await sendEmail({
      to: normalizedEmail,
      template: 'influencer_application_received',
      data: { name: normalizedName },
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
