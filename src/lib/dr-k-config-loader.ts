import { supabaseAdmin } from '@/lib/supabase/admin'

interface DrKKnowledge {
  id: string
  title: string
  content: string
  topic?: string
  is_active: boolean
  order_index: number
}

interface DrKScenario {
  id: string
  title: string
  prompt: string
  scenario_name?: string
  is_active: boolean
  order_index: number
}

interface DrKPrompt {
  id: string
  title: string
  content: string
  category?: string
  is_active: boolean
  order_index: number
}

interface DrKConfig {
  knowledge: DrKKnowledge[]
  scenarios: DrKScenario[]
  prompts: DrKPrompt[]
}

// 从数据库加载 K博士配置
export async function loadDrKConfig(): Promise<DrKConfig> {
  try {
    // 获取知识库
    const { data: knowledge } = await supabaseAdmin
      .from('dr_k_knowledge')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    // 获取场景提示词
    const { data: scenarios } = await supabaseAdmin
      .from('dr_k_scenarios')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    // 获取说话风格
    const { data: prompts } = await supabaseAdmin
      .from('dr_k_prompts')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    return {
      knowledge: knowledge || [],
      scenarios: scenarios || [],
      prompts: prompts || []
    }
  } catch (error) {
    console.error('Failed to load Dr K config:', error)
    return {
      knowledge: [],
      scenarios: [],
      prompts: []
    }
  }
}

// 构建系统提示词（从数据库配置）
export async function buildSystemPromptFromDB(userContext: string): Promise<string> {
  const config = await loadDrKConfig()

  let prompt = `你是K博士🦄，AI 未来家庭社群的AI成长伙伴。

${userContext}

`

  // 添加说话风格
  if (config.prompts.length > 0) {
    prompt += '## 说话风格\n'
    config.prompts.forEach(p => {
      prompt += `${p.content}\n\n`
    })
  }

  // 添加知识库
  if (config.knowledge.length > 0) {
    prompt += '## 知识库\n'
    config.knowledge.forEach(k => {
      prompt += `### ${k.title}\n${k.content}\n\n`
    })
  }

  // 添加场景提示词
  if (config.scenarios.length > 0) {
    prompt += '## 场景提示词\n'
    config.scenarios.forEach(s => {
      prompt += `### ${s.title}\n${s.prompt}\n\n`
    })
  }

  // 如果数据库没有配置，使用默认配置
  if (config.prompts.length === 0 && config.knowledge.length === 0 && config.scenarios.length === 0) {
    // 导入默认配置
    const { buildSystemPrompt } = await import('./custom-dr-k-config')
    return buildSystemPrompt(userContext)
  }

  return prompt
}
