import { AI_PROVIDERS } from './ai-config'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface ChatCompletionResponse {
  reply: string
  error?: string
}

export class AIClient {
  private provider: string
  private apiKey: string
  private baseURL: string
  private model: string

  constructor(provider: string = 'deepseek') {
    this.provider = provider

    // Get API key from environment
    const envKey = `${provider.toUpperCase()}_API_KEY`
    this.apiKey = process.env[envKey] || ''

    const config = AI_PROVIDERS[provider as keyof typeof AI_PROVIDERS]
    if (!config) {
      throw new Error(`Unknown AI provider: ${provider}`)
    }

    this.baseURL = config.baseURL
    this.model = config.model
  }

  async chat(messages: Message[], systemPrompt?: string): Promise<ChatCompletionResponse> {
    if (!this.apiKey) {
      return {
        reply: '抱歉，K博士暂时不在线。管理员还没有配置 API Key。',
        error: 'API key not configured'
      }
    }

    try {
      if (this.provider === 'anthropic') {
        return await this.chatAnthropic(messages, systemPrompt)
      } else {
        // OpenAI-compatible API (DeepSeek, ZhipuAI, OpenAI)
        return await this.chatOpenAI(messages, systemPrompt)
      }
    } catch (error: any) {
      console.error(`${this.provider} API error:`, error)
      return {
        reply: '抱歉，K博士遇到了一些技术问题，请稍后再试。',
        error: error.message
      }
    }
  }

  private async chatOpenAI(messages: Message[], systemPrompt?: string): Promise<ChatCompletionResponse> {
    const apiMessages = []

    if (systemPrompt) {
      apiMessages.push({
        role: 'system',
        content: systemPrompt
      })
    }

    apiMessages.push(...messages.map(msg => ({
      role: msg.role,
      content: msg.content
    })))

    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: apiMessages,
        max_tokens: 300,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`API request failed: ${error}`)
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || '抱歉，我没有理解你的问题。'

    return { reply }
  }

  private async chatAnthropic(messages: Message[], systemPrompt?: string): Promise<ChatCompletionResponse> {
    const Anthropic = require('@anthropic-ai/sdk')
    const anthropic = new Anthropic({ apiKey: this.apiKey })

    const response = await anthropic.messages.create({
      model: this.model,
      max_tokens: 300,
      system: systemPrompt,
      messages: messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }))
    })

    const reply = response.content[0].type === 'text' ? response.content[0].text : ''
    return { reply }
  }
}

// Helper function to get available provider
export function getAvailableProvider(): string {
  // Check in order of preference
  const providers = ['custom', 'deepseek', 'zhipu', 'openai', 'anthropic']

  for (const provider of providers) {
    const envKey = `${provider.toUpperCase()}_API_KEY`
    if (process.env[envKey] && process.env[envKey] !== 'your-api-key') {
      return provider
    }
  }

  return 'custom' // Default
}
