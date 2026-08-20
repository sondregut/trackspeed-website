import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { enforceRateLimit } from '@/lib/rate-limit'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  let query = supabase
    .from('feedback_posts')
    .select('*, feedback_comments(count)')
    .order('vote_count', { ascending: false })

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching feedback posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feedback posts' },
      { status: 500 }
    )
  }

  const posts = (data ?? []).map((post) => ({
    ...post,
    comment_count: post.feedback_comments?.[0]?.count ?? 0,
    feedback_comments: undefined,
  }))

  return NextResponse.json(posts)
}

export async function POST(request: Request) {
  try {
    const rateLimitResponse = await enforceRateLimit(request, {
      scope: 'public_feedback_create',
      limit: 10,
      windowSeconds: 60 * 60,
    })
    if (rateLimitResponse) return rateLimitResponse

    const body = await request.json()
    const { title, description, category, author_name } = body

    if (typeof title !== 'string' || !title.trim() || title.trim().length > 160) {
      return NextResponse.json(
        { error: 'Title must be between 1 and 160 characters' },
        { status: 400 }
      )
    }

    if (description !== undefined && description !== null && (
      typeof description !== 'string' || description.trim().length > 5_000
    )) {
      return NextResponse.json(
        { error: 'Description must be 5,000 characters or fewer' },
        { status: 400 }
      )
    }

    if (author_name !== undefined && author_name !== null && (
      typeof author_name !== 'string' || author_name.trim().length > 80
    )) {
      return NextResponse.json(
        { error: 'Name must be 80 characters or fewer' },
        { status: 400 }
      )
    }

    const validCategories = ['feature', 'bug', 'improvement']
    if (category && !validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('feedback_posts')
      .insert({
        title: title.trim(),
        description: typeof description === 'string' ? description.trim() || null : null,
        category: category || 'feature',
        author_name: typeof author_name === 'string' ? author_name.trim() || null : null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating feedback post:', error)
      return NextResponse.json(
        { error: 'Failed to create feedback post' },
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
