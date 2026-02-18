import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    // Get current user (for authentication only)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    console.log('Get works - User:', user?.id, 'Error:', userError)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's works using admin client - bypasses RLS
    // Only get root works (original versions) to avoid duplicates
    const { data: allWorks, error: worksError } = await supabaseAdmin
      .from('works')
      .select('id, user_id, task_id, title, description, reflection, link, tags, created_at, version, parent_work_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }) as { data: any[] | null, error: any }

    if (worksError) {
      console.error('Works fetch error:', worksError)
      return NextResponse.json({ error: worksError.message }, { status: 500 })
    }

    // Group works by root (parent_work_id or id) and get latest version of each
    const worksMap = new Map()

    for (const work of allWorks || []) {
      const rootId = work.parent_work_id || work.id

      if (!worksMap.has(rootId)) {
        worksMap.set(rootId, work)
      } else {
        const existing = worksMap.get(rootId)
        if (work.version > existing.version) {
          worksMap.set(rootId, work)
        }
      }
    }

    const works = Array.from(worksMap.values())

    // Get user_tasks data to include status and reviewed_at
    const { data: userTasks } = await supabaseAdmin
      .from('user_tasks')
      .select('user_id, task_id, status, reviewed_at')
      .eq('user_id', user.id)

    // Merge user_tasks data with works
    const worksWithStatus = works.map((work: any) => {
      const userTask = (userTasks || []).find(
        (t: any) => t.user_id === work.user_id && t.task_id === work.task_id
      )
      return {
        ...work,
        user_tasks: userTask ? [userTask] : []
      }
    })

    return NextResponse.json({
      success: true,
      works: worksWithStatus || []
    })
  } catch (error: any) {
    console.error('Get works error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
