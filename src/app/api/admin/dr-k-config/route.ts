import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// GET - 获取配置列表
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'knowledge', 'scenario', 'prompt'

    let tableName = ''
    if (type === 'knowledge') tableName = 'dr_k_knowledge'
    else if (type === 'scenario') tableName = 'dr_k_scenarios'
    else if (type === 'prompt') tableName = 'dr_k_prompts'
    else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    const { data: items, error } = await supabaseAdmin
      .from(tableName)
      .select('*')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Fetch config error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      items: items || []
    })
  } catch (error: any) {
    console.error('Get config error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - 创建新配置
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, title, content, topic, scenario_name, category, is_active, order_index } = body

    let tableName = ''
    let data: any = {
      title,
      content,
      is_active: is_active ?? true,
      order_index: order_index ?? 0
    }

    if (type === 'knowledge') {
      tableName = 'dr_k_knowledge'
      data.topic = topic
    } else if (type === 'scenario') {
      tableName = 'dr_k_scenarios'
      data.scenario_name = scenario_name
      data.prompt = content
    } else if (type === 'prompt') {
      tableName = 'dr_k_prompts'
      data.category = category
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    const { data: newItem, error } = await supabaseAdmin
      .from(tableName)
      .insert(data)
      .select()
      .single()

    if (error) {
      console.error('Create config error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      item: newItem
    })
  } catch (error: any) {
    console.error('Create config error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
