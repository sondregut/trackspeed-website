import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createHash } from 'crypto'

function getVoterIdentifier(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
  return createHash('sha256').update(ip + 'feedback-salt').digest('hex').substring(0, 16)
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const voterIdentifier = getVoterIdentifier(request)

  // Check if post exists
  const { data: post } = await supabase
    .from('feedback_posts')
    .select('id')
    .eq('id', id)
    .single()

  if (!post) {
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    )
  }

  // Try to insert vote (unique constraint will prevent duplicates)
  const { error } = await supabase
    .from('feedback_votes')
    .insert({
      post_id: id,
      voter_identifier: voterIdentifier,
    })

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Already voted' },
        { status: 409 }
      )
    }
    console.error('Error voting:', error)
    return NextResponse.json(
      { error: 'Failed to vote' },
      { status: 500 }
    )
  }

  // Get updated vote count
  const { data: updated } = await supabase
    .from('feedback_posts')
    .select('vote_count')
    .eq('id', id)
    .single()

  return NextResponse.json({ vote_count: updated?.vote_count ?? 0 })
}
