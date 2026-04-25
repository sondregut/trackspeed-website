import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { requireServerEnv } from '@/lib/server-secrets'

function getJwtSecret(): Uint8Array {
  return new TextEncoder().encode(requireServerEnv('INFLUENCER_JWT_SECRET'))
}

// POST /api/influencer/auth - Login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()

    // Find influencer by email
    const { data: influencer, error } = await supabase
      .from('influencers')
      .select('*')
      .eq('email', email.toLowerCase())
      .single()

    if (error || !influencer) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Check if rejected or suspended (pending users can login to see their status)
    if (influencer.status === 'rejected' || influencer.status === 'suspended') {
      const statusMessages: Record<string, string> = {
        rejected: 'Your application was not approved.',
        suspended: 'Your account has been suspended.',
      }
      return NextResponse.json(
        { error: statusMessages[influencer.status] || 'Account not active' },
        { status: 403 }
      )
    }

    // Verify password
    const isValid = await bcrypt.compare(password, influencer.password_hash)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Create JWT token
    const token = await new SignJWT({
      influencerId: influencer.id,
      email: influencer.email,
      name: influencer.name,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(getJwtSecret())

    // Set HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set('influencer_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return NextResponse.json({
      success: true,
      influencer: {
        id: influencer.id,
        name: influencer.name,
        email: influencer.email,
        code: influencer.code,
      },
    })
  } catch (error) {
    console.error('Influencer auth error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE /api/influencer/auth - Logout
export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('influencer_token')
  return NextResponse.json({ success: true })
}

// GET /api/influencer/auth - Get current session
export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('influencer_token')?.value

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const { payload } = await jwtVerify(token, getJwtSecret())

    return NextResponse.json({
      authenticated: true,
      influencer: {
        id: payload.influencerId,
        name: payload.name,
        email: payload.email,
      },
    })
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}

// Helper to verify influencer token and get influencer ID
export async function verifyInfluencerToken(request: NextRequest): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('influencer_token')?.value

    if (!token) {
      return null
    }

    const { payload } = await jwtVerify(token, getJwtSecret())
    return payload.influencerId as string
  } catch {
    return null
  }
}
