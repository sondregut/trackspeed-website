import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

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
    const body = await request.json()
    const { title, description, category, author_name } = body

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
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
        description: description?.trim() || null,
        category: category || 'feature',
        author_name: author_name?.trim() || null,
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
