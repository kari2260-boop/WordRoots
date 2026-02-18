import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { AIClient, getAvailableProvider } from '@/lib/ai-client'
import { TAG_KEYWORDS } from '@/lib/ai-config'
import { buildSystemPrompt } from '@/lib/custom-dr-k-config'
import { buildSystemPromptFromDB } from '@/lib/dr-k-config-loader'

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile for context
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    const profileData = profile as any

    // Get user interests, strengths for context
    const { data: interests } = await supabase
      .from('user_interests')
      .select('category')
      .eq('user_id', user.id)
      .limit(5)

    const { data: strengths } = await supabase
      .from('user_strengths')
      .select('tag_name')
      .eq('user_id', user.id)
      .limit(5)

    // Get recent chat history for context (increased to 20 messages for better context)
    const { data: recentMessages } = await supabaseAdmin
      .from('chat_messages')
      .select('role, content')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)

    const chatHistory = recentMessages?.reverse() || []

    console.log(`💬 [Chat] Loaded ${chatHistory.length} messages for context`)

    // Build system prompt with user context
    const userContext = `
## 用户画像
- 昵称：${profileData?.nickname || '探险家'}
- 年龄：${profileData?.age || '未知'}岁
- 年级：${profileData?.grade || '未知'}年级
${interests && interests.length > 0 ? `- 兴趣：${(interests as any[]).map((i: any) => i.category).join('、')}` : ''}
${strengths && strengths.length > 0 ? `- 优势：${(strengths as any[]).map((s: any) => s.tag_name).join('、')}` : ''}
`

    // 优先从数据库加载配置，如果数据库为空则使用文件配置
    const systemPrompt = await buildSystemPromptFromDB(userContext)

    // Initialize AI client with available provider
    const provider = getAvailableProvider()
    const aiClient = new AIClient(provider)

    console.log(`🤖 Using AI provider: ${provider}`)

    // Prepare messages
    const messages = [
      ...(chatHistory as any[]).map((msg: any) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      {
        role: 'user' as const,
        content: message,
      },
    ]

    // Call AI API
    const { reply, error } = await aiClient.chat(messages, systemPrompt)

    if (error) {
      console.error('AI API error:', error)
    }

    // Extract tags (simple keyword extraction)
    const tags = extractTags(message, reply)

    // Save user message using admin client
    await (supabaseAdmin as any).from('chat_messages').insert({
      user_id: user.id,
      role: 'user',
      content: message,
    })

    // Save assistant message using admin client
    await (supabaseAdmin as any).from('chat_messages').insert({
      user_id: user.id,
      role: 'assistant',
      content: reply,
      tags: tags.length > 0 ? tags : null,
    })

    console.log('✅ [Chat] Messages saved successfully')

    return NextResponse.json({ reply, tags })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}

// Simple tag extraction from conversation
function extractTags(userMessage: string, assistantReply: string): string[] {
  const tags: string[] = []
  const text = userMessage + ' ' + assistantReply

  // Use keywords from config
  for (const [tag, patterns] of Object.entries(TAG_KEYWORDS)) {
    if (patterns.some(pattern => text.includes(pattern))) {
      tags.push(tag)
    }
  }

  return tags
}
