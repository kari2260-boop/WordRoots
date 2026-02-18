'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Textarea } from '@/components/ui/Textarea'
import { ChatBubble } from '@/components/ChatBubble'
import { Spinner } from '@/components/ui/Spinner'
import { Send } from 'lucide-react'
import type { ChatMessage } from '@/types'

export default function ChatPage() {
  const supabase = createClient()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    loadChatHistory()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadChatHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(50)

      if (data) {
        setMessages(data)
      }

      // If no history, show welcome message
      if (!data || data.length === 0) {
        const welcomeMessage = {
          id: 'welcome',
          user_id: user.id,
          role: 'assistant',
          content: '嗨！我是K博士🦄 很高兴见到你！有什么想聊的吗？可以跟我分享你今天做了什么，遇到了什么困难，或者有什么新想法～',
          created_at: new Date().toISOString(),
          mentor_id: null,
          extracted_tags: null,
        } as any
        setMessages([welcomeMessage])
      }
    } catch (error) {
      console.error('Failed to load chat history:', error)
    } finally {
      setInitialLoading(false)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Add user message to UI
      const newUserMessage = {
        id: `temp-user-${Date.now()}`,
        user_id: user.id,
        role: 'user',
        content: userMessage,
        created_at: new Date().toISOString(),
        mentor_id: null,
        extracted_tags: null,
      } as any
      setMessages(prev => [...prev, newUserMessage])

      // Call API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      })

      if (!response.ok) throw new Error('API request failed')

      const data = await response.json()

      // Add assistant message to UI
      const assistantMessage = {
        id: `temp-assistant-${Date.now()}`,
        user_id: user.id,
        role: 'assistant',
        content: data.reply,
        created_at: new Date().toISOString(),
        mentor_id: null,
        extracted_tags: data.tags,
        tags: data.tags,
      } as any
      setMessages(prev => [...prev, assistantMessage])

    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMessage = {
        id: `error-${Date.now()}`,
        user_id: '',
        role: 'assistant',
        content: '抱歉，我现在有点忙不过来，稍后再试试吧～',
        created_at: new Date().toISOString(),
        mentor_id: null,
        extracted_tags: null,
      } as any
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (initialLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 flex justify-center items-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-5rem)]">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">🦄</span>
          <h1 className="text-2xl font-bold text-gray-900">K博士</h1>
        </div>
        <p className="text-gray-600 text-sm">你的成长伙伴，随时倾听和陪伴</p>
      </div>

      {/* Messages */}
      <Card className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message}
            isUser={message.role === 'user'}
          />
        ))}
        {loading && (
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 text-2xl">🦄</div>
            <div className="chat-bubble chat-bubble-assistant">
              <Spinner size="sm" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </Card>

      {/* Input */}
      <Card className="p-3">
        <div className="flex gap-2">
          <Textarea
            placeholder="跟K博士聊点什么..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={2}
            className="flex-1"
            disabled={loading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="self-end"
          >
            <Send size={20} />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          按 Enter 发送，Shift + Enter 换行
        </p>
      </Card>
    </div>
  )
}
