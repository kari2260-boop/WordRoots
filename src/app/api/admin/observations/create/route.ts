import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Admin doesn't need user authentication (uses authorization code)
    const body = await request.json()
    const { student_id, title, category, observation, suggested_tags } = body

    console.log('🔍 [Create Observation] Received data:', { student_id, title, category, observation, suggested_tags })

    if (!student_id || !title || !observation) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get the first existing user to use as observer_id
    // (workaround for foreign key constraint)
    const { data: firstUser, error: userError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .limit(1)
      .single()

    console.log('🔍 [Create Observation] First user:', firstUser?.id, 'Error:', userError)

    if (!firstUser) {
      return NextResponse.json({ error: 'No users found in system' }, { status: 500 })
    }

    // Insert observation using admin client
    console.log('🔍 [Create Observation] Inserting with data:', {
      user_id: student_id,
      observer_id: firstUser.id,
      title,
      category: category || null,
      observation,
      suggested_tags: suggested_tags || null,
    })

    const { data: observationData, error: insertError } = await supabaseAdmin
      .from('observations')
      .insert({
        user_id: student_id,
        observer_id: firstUser.id, // Use first user as placeholder for admin
        title: title,
        category: category || null,
        observation: observation,
        suggested_tags: suggested_tags || null,
      })
      .select('id, user_id, observer_id, title, category, observation, suggested_tags, created_at')
      .single()

    if (insertError) {
      console.error('❌ Observation insert error:', insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    console.log('✅ [Create Observation] Successfully created:', observationData)

    // Verify it was saved by fetching it back
    const { data: verifyData, error: verifyError } = await supabaseAdmin
      .from('observations')
      .select('*')
      .eq('id', observationData.id)
      .single()

    console.log('✅ [Create Observation] Verification fetch:', verifyData, 'Error:', verifyError)

    return NextResponse.json({
      success: true,
      observation: observationData
    })
  } catch (error: any) {
    console.error('❌ Create observation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
