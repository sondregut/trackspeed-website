import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { requireServerEnv, timingSafeEqualString } from '@/lib/server-secrets'
import { enforceRateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    const rateLimitResponse = await enforceRateLimit(request, {
      scope: 'admin-auth',
      limit: 5,
      windowSeconds: 15 * 60,
    })
    if (rateLimitResponse) return rateLimitResponse

    const { password } = await request.json()
    let adminPassword: string
    let sessionToken: string

    try {
      adminPassword = requireServerEnv('ADMIN_PASSWORD')
      sessionToken = requireServerEnv('ADMIN_SESSION_TOKEN')
    } catch (error) {
      console.error('Admin auth env not configured:', error)
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    if (typeof password !== 'string' || !timingSafeEqualString(password, adminPassword)) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Set the session cookie
    const cookieStore = await cookies()
    cookieStore.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  return NextResponse.json({ success: true })
}
