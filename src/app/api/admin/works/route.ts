import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    // Get all works - explicitly select columns to avoid schema cache issues
    const { data: works, error: worksError } = await supabaseAdmin
      .from('works')
      .select('id, user_id, task_id, title, description, reflection, link, tags, created_at, version, parent_work_id')
      .order('created_at', { ascending: false })

    console.log('🔍 [Admin Works API] Raw works from DB:', works?.map((w: any) => ({
      id: w.id,
      title: w.title,
      tags: w.tags
    })))

    if (worksError) {
      console.error('Works fetch error:', worksError)
      return NextResponse.json({ error: worksError.message }, { status: 500 })
    }

    // Get profiles separately
    const userIds = [...new Set(works?.map((w: any) => w.user_id).filter(Boolean))]
    const { data: profiles } = await supabaseAdmin
      .from('profiles')
      .select('id, nickname, age, grade')
      .in('id', userIds)

    // Manually merge profiles with works
    const worksWithProfiles = (works || []).map((work: any) => ({
      ...work,
      profiles: profiles?.find((p: any) => p.id === work.user_id)
    }))

    // Get all user_tasks data
    const { data: userTasks, error: tasksError } = await supabaseAdmin
      .from('user_tasks')
      .select('user_id, task_id, status, points_earned, feedback')

    // Merge user_tasks data with works and extract status from tags
    const worksWithStatus = worksWithProfiles.map((work: any) => {
      const userTask = (userTasks || []).find(
        (t: any) => t.user_id === work.user_id && t.task_id === work.task_id
      )

      // Extract status from tags
      let status = 'pending'
      if (work.tags && Array.isArray(work.tags)) {
        const statusTag = work.tags.find((tag: string) => tag.startsWith('status:'))
        if (statusTag) {
          status = statusTag.substring('status:'.length)
        }
      }

      return {
        ...work,
        status,
        user_tasks: userTask ? [userTask] : []
      }
    })

    console.log('🔍 [Admin Works API] Works with status:', worksWithStatus.map((w: any) => ({
      id: w.id,
      title: w.title,
      tags: w.tags,
      status: w.status
    })))

    return NextResponse.json({
      success: true,
      works: worksWithStatus
    })
  } catch (error: any) {
    console.error('Get admin works error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
