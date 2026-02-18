import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Get current user (for authentication only)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    console.log('Submit task - User:', user?.id, 'Error:', userError)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', details: userError?.message }, { status: 401 })
    }

    // Get request body
    const body = await request.json()
    const { task_id, title, description, reflection, link, tags } = body

    if (!task_id || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Insert user_task using admin client
    const { data: taskData, error: taskError } = await (supabaseAdmin as any)
      .from('user_tasks')
      .insert({
        user_id: user.id,
        task_id: task_id,
        status: 'pending',
        submitted_at: new Date().toISOString()
      })
      .select()
      .single()

    if (taskError) {
      console.error('Task creation error:', taskError)
      return NextResponse.json({ error: taskError.message }, { status: 500 })
    }

    // Insert work using admin client
    const { data: workData, error: workError } = await (supabaseAdmin as any)
      .from('works')
      .insert({
        user_id: user.id,
        task_id: task_id,
        title: title,
        description: description || null,
        reflection: reflection || null,
        link: link || null,
        tags: tags || null
      })
      .select()
      .single()

    if (workError) {
      console.error('Work creation error:', workError)
      return NextResponse.json({ error: workError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      task: taskData,
      work: workData
    })
  } catch (error: any) {
    console.error('Submit task error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
