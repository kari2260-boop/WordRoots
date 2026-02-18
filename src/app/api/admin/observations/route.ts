import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    console.log('🔍 [Admin Observations API] Fetching all observations...')

    // First, try to count observations
    const { count, error: countError } = await supabaseAdmin
      .from('observations')
      .select('*', { count: 'exact', head: true })

    console.log('🔍 [Admin Observations API] Count query:', { count, error: countError })

    // Get all observations - explicitly select columns to avoid schema cache issues
    const { data: observations, error: observationsError } = await supabaseAdmin
      .from('observations')
      .select('id, user_id, observer_id, title, category, observation, suggested_tags, created_at')
      .order('created_at', { ascending: false })

    console.log('🔍 [Admin Observations API] Raw response:', {
      data: observations,
      error: observationsError,
      dataType: typeof observations,
      isArray: Array.isArray(observations),
      length: observations?.length
    })

    if (observationsError) {
      console.error('❌ Observations fetch error:', observationsError)
      return NextResponse.json({ error: observationsError.message }, { status: 500 })
    }

    console.log(`✅ Found ${observations?.length || 0} observations`)
    if (observations && observations.length > 0) {
      console.log('🔍 First observation:', observations[0])
    } else {
      // If we found 0, try to fetch a specific known ID to debug
      console.log('🔍 [Admin Observations API] Testing fetch by specific ID: 2364aee5-e3db-4ff0-bf20-56e066cf38b4')
      const { data: testObs, error: testError } = await supabaseAdmin
        .from('observations')
        .select('*')
        .eq('id', '2364aee5-e3db-4ff0-bf20-56e066cf38b4')
        .single()
      console.log('🔍 [Admin Observations API] Fetch by ID result:', { data: testObs, error: testError })
    }

    // Get profiles for all user_ids
    if (observations && observations.length > 0) {
      const userIds = [...new Set(observations.map((o: any) => o.user_id).filter(Boolean))]
      console.log(`📋 Fetching profiles for ${userIds.length} users`)

      const { data: profiles } = await supabaseAdmin
        .from('profiles')
        .select('id, nickname, age, grade')
        .in('id', userIds)

      console.log(`✅ Fetched ${profiles?.length || 0} profiles`)

      // Merge profile data
      const observationsWithProfiles = observations.map((obs: any) => ({
        ...obs,
        profiles: profiles?.find((p: any) => p.id === obs.user_id)
      }))

      console.log('✅ Returning observations with profiles:', observationsWithProfiles.length)

      return NextResponse.json({
        success: true,
        observations: observationsWithProfiles
      })
    }

    console.log('✅ Returning empty observations array')

    return NextResponse.json({
      success: true,
      observations: observations || []
    })
  } catch (error: any) {
    console.error('❌ Get admin observations error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
