import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', params.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user interests
    const { data: interests } = await supabaseAdmin
      .from('user_interests')
      .select('*')
      .eq('user_id', params.id)

    // Get user strengths
    const { data: strengths } = await supabaseAdmin
      .from('user_strengths')
      .select('*')
      .eq('user_id', params.id)

    // Get user traits
    const { data: traits } = await supabaseAdmin
      .from('user_traits')
      .select('*')
      .eq('user_id', params.id)

    // Get user goals
    const { data: goals } = await supabaseAdmin
      .from('user_goals')
      .select('*')
      .eq('user_id', params.id)

    // Get user tasks
    const { data: tasks } = await supabaseAdmin
      .from('user_tasks')
      .select('*')
      .eq('user_id', params.id)
      .order('created_at', { ascending: false })

    // Get completed tasks
    const { data: completedTasks } = await supabaseAdmin
      .from('user_tasks')
      .select('task_id')
      .eq('user_id', params.id)
      .eq('status', 'completed')

    // Get user works
    const { data: works } = await supabaseAdmin
      .from('works')
      .select('*')
      .eq('user_id', params.id)
      .order('created_at', { ascending: false })

    // Get user assessments
    const { data: assessments } = await supabaseAdmin
      .from('assessments')
      .select('*')
      .eq('user_id', params.id)
      .order('created_at', { ascending: false })

    // Get user observations
    const { data: observations } = await supabaseAdmin
      .from('observations')
      .select('*')
      .eq('user_id', params.id)
      .order('created_at', { ascending: false })

    return NextResponse.json({
      success: true,
      profile,
      interests: interests || [],
      strengths: strengths || [],
      traits: traits || [],
      goals: goals || [],
      tasks: tasks || [],
      completedTasks: completedTasks || [],
      works: works || [],
      assessments: assessments || [],
      observations: observations || []
    })
  } catch (error: any) {
    console.error('Get admin user detail error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
