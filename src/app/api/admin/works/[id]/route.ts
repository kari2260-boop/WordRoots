import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get work detail with user profile info
    const { data: work, error: workError } = await supabaseAdmin
      .from('works')
      .select(`
        *,
        profiles:user_id (
          id,
          nickname,
          age,
          grade
        )
      `)
      .eq('id', params.id)
      .single() as { data: any, error: any }

    if (workError) {
      console.error('Work fetch error:', workError)
      return NextResponse.json({ error: workError.message }, { status: 500 })
    }

    if (!work) {
      return NextResponse.json({ error: 'Work not found' }, { status: 404 })
    }

    // Get user_tasks data for this work
    const { data: userTasks, error: tasksError } = await (supabaseAdmin as any)
      .from('user_tasks')
      .select('status, points_earned, feedback, submitted_at')
      .eq('user_id', work.user_id)
      .eq('task_id', work.task_id)

    return NextResponse.json({
      success: true,
      work: {
        ...work,
        user_tasks: userTasks || []
      }
    })
  } catch (error: any) {
    console.error('Get admin work detail error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
