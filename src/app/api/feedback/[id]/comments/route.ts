import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { data, error } = await supabase
    .from('feedback_comments')
    .select('*')
    .eq('post_id', id)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }

  return NextResponse.json(data)
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const body = await request.json()
    const { content, author_name } = body

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      )
    }

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

    const { data, error } = await supabase
      .from('feedback_comments')
      .insert({
        post_id: id,
        content: content.trim(),
        author_name: author_name?.trim() || 'Anonymous',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating comment:', error)
      return NextResponse.json(
        { error: 'Failed to create comment' },
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
