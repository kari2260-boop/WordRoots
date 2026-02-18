import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { feedback, points, status } = body

    console.log('🔍 [Approve Work] Request:', { workId: params.id, feedback, points, status })

    if (!points || points <= 0) {
      return NextResponse.json({ error: 'Points must be greater than 0' }, { status: 400 })
    }

    // Get work to find user_id and task_id
    const { data: work, error: workError } = await supabaseAdmin
      .from('works')
      .select('id, user_id, task_id, title')
      .eq('id', params.id)
      .single()

    console.log('🔍 [Approve Work] Work found:', work, 'Error:', workError)

    if (workError || !work) {
      return NextResponse.json({ error: 'Work not found' }, { status: 404 })
    }

    // First, check if user_tasks record exists
    const { data: existingTask } = await supabaseAdmin
      .from('user_tasks')
      .select('id, user_id, task_id, status')
      .eq('user_id', work.user_id)
      .eq('task_id', work.task_id)
      .single()

    console.log('🔍 [Approve Work] Existing task:', existingTask)

    if (existingTask) {
      // Update existing task status
      const { data: updatedTask, error: updateError } = await supabaseAdmin
        .from('user_tasks')
        .update({
          status: status || 'completed',
          reviewed_at: new Date().toISOString()
        })
        .eq('user_id', work.user_id)
        .eq('task_id', work.task_id)
        .select()

      if (updateError) {
        console.error('❌ Update user_tasks error:', updateError)
      } else {
        console.log('✅ [Approve Work] Updated user_tasks status to:', status || 'completed', updatedTask)
      }
    } else {
      // Create user_tasks record if it doesn't exist
      const { error: insertError } = await supabaseAdmin
        .from('user_tasks')
        .insert({
          user_id: work.user_id,
          task_id: work.task_id,
          status: status || 'completed',
          submitted_at: new Date().toISOString(),
          reviewed_at: new Date().toISOString()
        })

      if (insertError) {
        console.error('❌ Insert user_tasks error:', insertError)
      }
    }

    // Store feedback and points in the works table's tags array as metadata
    // Since we can't modify schema, we'll use tags to store this temporarily

    // First, get the current work data to preserve existing tags
    const { data: currentWork, error: getCurrentError } = await supabaseAdmin
      .from('works')
      .select('tags')
      .eq('id', params.id)
      .single()

    console.log('🔍 [Approve Work] Current work tags:', currentWork?.tags)

    const metadataTags = []
    if (feedback) {
      metadataTags.push(`feedback:${feedback}`)
    }
    metadataTags.push(`points:${points}`)
    metadataTags.push(`status:${status || 'completed'}`)

    // Filter out old metadata tags and keep regular tags
    const existingTags = (currentWork?.tags || []).filter((tag: string) =>
      !tag.startsWith('feedback:') &&
      !tag.startsWith('points:') &&
      !tag.startsWith('status:')
    )

    const newTags = [...existingTags, ...metadataTags]
    console.log('🔍 [Approve Work] New tags to save:', newTags)

    const { data: updatedWork, error: workUpdateError } = await supabaseAdmin
      .from('works')
      .update({
        tags: newTags
      })
      .eq('id', params.id)
      .select()

    console.log('✅ [Approve Work] Updated work with metadata:', updatedWork, 'Error:', workUpdateError)

    // Update user's total points
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('total_points')
      .eq('id', work.user_id)
      .single()

    console.log('🔍 [Approve Work] Current profile points:', profile?.total_points)

    if (!profileError && profile) {
      const newPoints = (profile.total_points || 0) + points
      const { error: pointsUpdateError } = await supabaseAdmin
        .from('profiles')
        .update({
          total_points: newPoints
        })
        .eq('id', work.user_id)

      console.log('✅ [Approve Work] Updated points to:', newPoints, 'Error:', pointsUpdateError)
    }

    return NextResponse.json({
      success: true,
      message: 'Work approved and points awarded'
    })
  } catch (error: any) {
    console.error('❌ Approve work error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
