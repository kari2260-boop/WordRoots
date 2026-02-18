import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log(`🔍 [Student Observations] Fetching observations for user: ${user.id}`)

    // Use admin client to bypass RLS issues
    const { data: observations, error: observationsError } = await supabaseAdmin
      .from('observations')
      .select('id, user_id, observer_id, title, category, observation, suggested_tags, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    console.log(`✅ [Student Observations] Found ${observations?.length || 0} observations`)

    if (observationsError) {
      console.error('❌ Observations fetch error:', observationsError)
      return NextResponse.json({ error: observationsError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      observations: observations || []
    })
  } catch (error: any) {
    console.error('❌ Get observations error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
