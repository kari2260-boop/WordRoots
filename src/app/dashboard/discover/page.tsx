import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Badge } from '@/components/ui/Badge'
import { Lightbulb, MessageCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function DiscoverPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Get observations from admin
  const { data: observations } = await supabase
    .from('observations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Get recent chat insights
  const { data: recentChats } = await supabase
    .from('chat_messages')
    .select('tags, created_at')
    .eq('user_id', user.id)
    .eq('role', 'assistant')
    .not('tags', 'is', null)
    .order('created_at', { ascending: false })
    .limit(10)

  // Extract all tags from recent chats
  const allTags = (recentChats as any[])?.flatMap((chat: any) => chat.tags || []) || []
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topTags = Object.entries(tagCounts)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 10)
    .map(([tag]) => tag)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Lightbulb size={24} className="text-yellow-500" />
          <h1 className="text-2xl font-bold text-gray-900">持续探索</h1>
        </div>
        <p className="text-gray-600">通过观察和对话，不断丰富你的画像</p>
      </div>

      {/* Chat Insights */}
      {topTags.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle size={20} className="text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">对话中的发现</h2>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            从你和K博士的对话中，我们发现了这些关键词：
          </p>
          <div className="flex flex-wrap gap-2">
            {topTags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link
              href="/dashboard/chat"
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              继续和K博士聊天 →
            </Link>
          </div>
        </Card>
      )}

      {/* Observations from Admin */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span>👁️</span>
          <span>老师的观察</span>
        </h2>

        {observations && observations.length > 0 ? (
          <div className="space-y-4">
            {(observations as any[]).map((obs: any) => (
              <Card key={obs.id}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{obs.title}</h3>
                    <p className="text-sm text-gray-600">{formatDate(obs.created_at)}</p>
                  </div>
                  {obs.category && (
                    <Badge variant="secondary">{obs.category}</Badge>
                  )}
                </div>

                <p className="text-gray-700 whitespace-pre-line mb-3">{obs.observation}</p>

                {obs.suggested_tags && obs.suggested_tags.length > 0 && (
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">相关标签：</p>
                    <div className="flex flex-wrap gap-1">
                      {obs.suggested_tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" size="sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            emoji="📝"
            message="暂无观察记录。当老师或咨询师对你有新的发现时，会记录在这里"
          />
        )}
      </div>

      {/* Tips */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 mb-1">
              如何让画像更完整？
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 多和K博士聊天，分享你的想法和感受</li>
              <li>• 完成不同类型的任务，展示多方面能力</li>
              <li>• 在作品中记录你的收获和反思</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
