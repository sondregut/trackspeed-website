import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-auth'
import { decryptPayoutHandle } from '@/lib/creator-reward-crypto'
import { getSupabaseAdmin } from '@/lib/supabase'

const screenshotBucket = 'creator-reward-screenshots'

export async function GET(request: NextRequest) {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const supabase = getSupabaseAdmin()

  let query = supabase
    .from('creator_reward_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    console.error('Failed to fetch creator reward submissions:', error)
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 })
  }

  const submissions = await Promise.all((data ?? []).map(async (submission) => {
    let screenshot_signed_url: string | null = null

    if (submission.screenshot_url) {
      const { data: signedUrlData, error: signedUrlError } = await supabase
        .storage
        .from(screenshotBucket)
        .createSignedUrl(submission.screenshot_url, 60 * 60)

      if (signedUrlError) {
        console.warn('Failed to create creator reward screenshot signed URL:', signedUrlError)
      } else {
        screenshot_signed_url = signedUrlData.signedUrl
      }
    }

    return {
      ...submission,
      payout_handle_or_email: decryptPayoutHandle(submission.payout_handle_or_email),
      screenshot_signed_url,
    }
  }))

  return NextResponse.json({ submissions })
}
