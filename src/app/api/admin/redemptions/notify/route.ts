import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

async function verifyAdmin() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('admin_session')
  return !!sessionCookie?.value
}

export async function POST(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL
  if (!webhookUrl) {
    return NextResponse.json({ ok: true, skipped: true })
  }

  const { code, user_name, device_id, type, source } = await request.json()

  const color = type === 'free' ? 0x2ecc71 : 0x3498db  // green for free, blue for trial

  const embed = {
    title: '🎟️ New Promo Redemption',
    color,
    fields: [
      { name: 'Code', value: code || 'N/A', inline: true },
      { name: 'Type', value: type || 'N/A', inline: true },
      { name: 'User', value: user_name || 'Unknown', inline: true },
      { name: 'Source', value: source || 'N/A', inline: true },
      { name: 'Device', value: device_id?.substring(0, 8) || 'N/A', inline: true },
    ],
    timestamp: new Date().toISOString(),
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] }),
    })
  } catch {
    // Silent failure - don't block anything
  }

  return NextResponse.json({ ok: true })
}
