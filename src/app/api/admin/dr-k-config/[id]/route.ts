import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// PUT - 更新配置
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { type, title, content, topic, scenario_name, category, is_active, order_index } = body

    let tableName = ''
    let data: any = {
      title,
      content,
      is_active,
      order_index,
      updated_at: new Date().toISOString()
    }

    if (type === 'knowledge') {
      tableName = 'dr_k_knowledge'
      if (topic) data.topic = topic
    } else if (type === 'scenario') {
      tableName = 'dr_k_scenarios'
      if (scenario_name) data.scenario_name = scenario_name
      data.prompt = content
    } else if (type === 'prompt') {
      tableName = 'dr_k_prompts'
      if (category) data.category = category
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    const { data: updatedItem, error } = await supabaseAdmin
      .from(tableName)
      .update(data)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Update config error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      item: updatedItem
    })
  } catch (error: any) {
    console.error('Update config error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - 删除配置
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    let tableName = ''
    if (type === 'knowledge') tableName = 'dr_k_knowledge'
    else if (type === 'scenario') tableName = 'dr_k_scenarios'
    else if (type === 'prompt') tableName = 'dr_k_prompts'
    else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from(tableName)
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Delete config error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true
    })
  } catch (error: any) {
    console.error('Delete config error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
