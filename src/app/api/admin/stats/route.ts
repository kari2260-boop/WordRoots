import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Use admin client to bypass RLS
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    const { data: works, error: worksError } = await supabaseAdmin
      .from('works')
      .select('*')
      .order('created_at', { ascending: false })

    const { data: tasks, error: tasksError } = await supabaseAdmin
      .from('user_tasks')
      .select('*')
      .order('created_at', { ascending: false })

    const { data: assessments, error: assessmentsError } = await supabaseAdmin
      .from('assessments')
      .select(`
        *,
        profiles:user_id (
          id,
          nickname
        )
      `)
      .order('created_at', { ascending: false })

    return NextResponse.json({
      profiles: profiles || [],
      works: works || [],
      tasks: tasks || [],
      assessments: assessments || [],
      profilesCount: profiles?.length || 0,
      worksCount: works?.length || 0,
      tasksCount: tasks?.length || 0,
      assessmentsCount: assessments?.length || 0,
      errors: {
        profiles: profilesError?.message,
        works: worksError?.message,
        tasks: tasksError?.message,
        assessments: assessmentsError?.message,
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
