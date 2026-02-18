import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Get current user (for authentication)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { data } = body

    // Update profile using admin client
    await supabaseAdmin
      .from('profiles')
      .update({
        age: data.basicInfo.age,
        grade: data.basicInfo.grade,
        gender: data.basicInfo.gender,
        onboarding_completed: true,
      })
      .eq('id', user.id)

    // Insert assessment
    const { data: assessment, error: assessmentError } = await supabaseAdmin
      .from('assessments')
      .insert({
        user_id: user.id,
        type: 'onboarding',
        source: 'self',
        data: data,
      })
      .select()
      .single()

    if (assessmentError) {
      console.error('Assessment insert error:', assessmentError)
      throw new Error('Failed to save assessment')
    }

    // Insert interests
    if (data.interests?.interest_categories && Array.isArray(data.interests.interest_categories)) {
      const interests = data.interests.interest_categories.map((category: string) => ({
        user_id: user.id,
        category,
        specific: data.interests.interest_specific || '',
        intensity: 3,
        source: 'self',
        assessment_id: assessment?.id,
      }))
      await supabaseAdmin.from('user_interests').insert(interests)
    }

    // Insert strengths
    if (data.strengths?.strength_self && Array.isArray(data.strengths.strength_self)) {
      const strengths = data.strengths.strength_self.map((strength: string) => ({
        user_id: user.id,
        dimension: 'cognitive',
        tag_name: strength,
        confidence: 0.5,
        source: 'self',
      }))
      await supabaseAdmin.from('user_strengths').insert(strengths)
    }

    // Insert traits
    if (data.personality?.personality_traits && Array.isArray(data.personality.personality_traits)) {
      const traits = data.personality.personality_traits.map((trait: string) => ({
        user_id: user.id,
        trait_name: trait,
        score: 0.7,
        source: 'self',
        assessment_id: assessment?.id,
      }))
      await supabaseAdmin.from('user_traits').insert(traits)
    }

    // Insert goals
    const goals = []
    if (data.goals?.goals_dream) {
      goals.push({ user_id: user.id, type: 'dream', content: data.goals.goals_dream })
    }
    if (data.goals?.goals_learn) {
      goals.push({ user_id: user.id, type: 'skill', content: data.goals.goals_learn })
    }
    if (data.goals?.goals_this_year) {
      goals.push({ user_id: user.id, type: 'short_term', content: data.goals.goals_this_year })
    }
    if (goals.length > 0) {
      await supabaseAdmin.from('user_goals').insert(goals)
    }

    return NextResponse.json({
      success: true,
      message: 'Onboarding data saved successfully'
    })
  } catch (error: any) {
    console.error('Save onboarding data error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
