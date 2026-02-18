import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    // Get all chat messages with user profile info
    const { data: messages, error: messagesError } = await supabaseAdmin
      .from('chat_messages')
      .select(`
        *,
        profiles:user_id (
          id,
          nickname
        )
      `)
      .order('created_at', { ascending: false })
      .limit(100)

    if (messagesError) {
      console.error('Messages fetch error:', messagesError)
      return NextResponse.json({ error: messagesError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      messages: messages || []
    })
  } catch (error: any) {
    console.error('Get admin conversations error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
