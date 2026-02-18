import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // Get current user (for authentication only)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    console.log('Submit new version - User:', user?.id, 'Original Work ID:', params.id)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get request body
    const body = await request.json()
    const { title, description, reflection, link, tags } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Get original work to verify ownership and get details
    const { data: originalWork, error: originalError } = await supabaseAdmin
      .from('works')
      .select('id, user_id, task_id, version, parent_work_id')
      .eq('id', params.id)
      .single()

    if (originalError || !originalWork) {
      return NextResponse.json({ error: 'Original work not found' }, { status: 404 })
    }

    if (originalWork.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Find the root work ID (for version history)
    const rootWorkId = originalWork.parent_work_id || originalWork.id

    // Get the latest version number
    const { data: latestVersion } = await supabaseAdmin
      .from('works')
      .select('version')
      .or(`id.eq.${rootWorkId},parent_work_id.eq.${rootWorkId}`)
      .order('version', { ascending: false })
      .limit(1)
      .single()

    const newVersion = (latestVersion?.version || 1) + 1

    // Insert new version
    const { data: newWork, error: insertError } = await supabaseAdmin
      .from('works')
      .insert({
        user_id: user.id,
        task_id: originalWork.task_id,
        title: title,
        description: description || null,
        reflection: reflection || null,
        link: link || null,
        tags: tags || null,
        version: newVersion,
        parent_work_id: rootWorkId
      })
      .select()
      .single()

    if (insertError) {
      console.error('New version creation error:', insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      work: newWork
    })
  } catch (error: any) {
    console.error('Submit new version error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // Get current user (for authentication only)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    console.log('Get work detail - User:', user?.id, 'Work ID:', params.id)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get work detail using admin client - bypasses RLS
    const { data: work, error: workError } = await supabaseAdmin
      .from('works')
      .select('id, user_id, task_id, title, description, reflection, link, tags, created_at, version, parent_work_id')
      .eq('id', params.id)
      .eq('user_id', user.id) // Ensure user can only view their own works
      .single()

    if (workError) {
      console.error('Work fetch error:', workError)
      return NextResponse.json({ error: workError.message }, { status: 500 })
    }

    if (!work) {
      return NextResponse.json({ error: 'Work not found' }, { status: 404 })
    }

    // Get user_tasks data for this work
    const { data: userTasks, error: tasksError } = await supabaseAdmin
      .from('user_tasks')
      .select('status, points_earned, feedback, completed_at')
      .eq('user_id', work.user_id)
      .eq('task_id', work.task_id)

    // Get version history - find the root work (original version)
    let rootWorkId = work.parent_work_id || work.id

    // Get all versions of this work
    const { data: versions, error: versionsError } = await supabaseAdmin
      .from('works')
      .select('id, title, version, created_at')
      .or(`id.eq.${rootWorkId},parent_work_id.eq.${rootWorkId}`)
      .order('version', { ascending: true })

    return NextResponse.json({
      success: true,
      work: {
        ...work,
        user_tasks: userTasks || []
      },
      versions: versions || []
    })
  } catch (error: any) {
    console.error('Get work detail error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
