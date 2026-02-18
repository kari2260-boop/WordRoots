'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { formatDate } from '@/lib/utils'
import { MessageSquare } from 'lucide-react'

export default function AdminConversationsPage() {
  const [loading, setLoading] = useState(true)
  const [messagesByUser, setMessagesByUser] = useState<any>({})

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/admin/conversations', {
        credentials: 'include',
      })
      const result = await response.json()
      if (result.messages) {
        // Group by user
        const grouped = (result.messages as any[]).reduce((acc: any, msg: any) => {
          const userId = msg.user_id
          if (!acc[userId]) {
            acc[userId] = {
              user: msg.profiles,
              userId,
              messages: [],
            }
          }
          acc[userId].messages.push(msg)
          return acc
        }, {} as Record<string, any>) || {}
        setMessagesByUser(grouped)
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  const conversations = Object.values(messagesByUser) as any[]

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">对话记录</h1>
        <p className="text-gray-600">查看用户与K博士的对话历史</p>
      </div>

      {conversations.length > 0 ? (
        <div className="space-y-4">
          {conversations.map((conv: any) => (
            <Card key={conv.userId}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <MessageSquare size={20} className="text-green-600" />
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {conv.user?.nickname || '未命名用户'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {conv.messages.length} 条消息
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  最近：{formatDate(conv.messages[0].created_at)}
                </span>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {conv.messages.slice(0, 10).map((msg: any) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-gray-100 ml-8'
                        : 'bg-green-50 mr-8'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {msg.role === 'user' ? '👤 用户' : '🦄 K博士'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(msg.created_at).toLocaleString('zh-CN')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{msg.content}</p>
                    {msg.tags && msg.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {msg.tags.map((tag: string, i: number) => (
                          <Badge key={i} variant="secondary" size="sm">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {conv.messages.length > 10 && (
                <p className="text-sm text-gray-500 text-center mt-3 pt-3 border-t border-gray-200">
                  还有 {conv.messages.length - 10} 条更早的消息
                </p>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <div className="text-4xl mb-3">💬</div>
          <p className="text-gray-600">暂无对话记录</p>
        </Card>
      )}
    </div>
  )
}
