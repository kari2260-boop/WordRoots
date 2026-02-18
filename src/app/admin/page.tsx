import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Users, ListChecks, MessageSquare, TrendingUp } from 'lucide-react'

async function getAdminStats() {
  try {
    const response = await fetch('http://localhost:3000/api/admin/stats', {
      cache: 'no-store'
    })
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch admin stats:', error)
    return {
      profiles: [],
      works: [],
      tasks: [],
      profilesCount: 0,
      worksCount: 0,
      tasksCount: 0
    }
  }
}

export default async function AdminDashboardPage() {
  // Admin page doesn't require login - only authorization code

  // Get data from API
  const stats = await getAdminStats()

  const totalUsers = stats.profilesCount || 0
  const totalWorks = stats.worksCount || 0
  const completedTasks = stats.tasks?.filter((t: any) => t.status === 'completed').length || 0
  const totalMessages = 0 // TODO: Add chat_messages function

  const recentUsers = stats.profiles?.slice(0, 5) || []
  const recentWorks = stats.works?.slice(0, 5) || []

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">管理总览</h1>
        <p className="text-gray-600">AI 未来家庭社群 数据概览</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <Users size={24} className="text-green-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {totalUsers || 0}
          </div>
          <div className="text-sm text-gray-600">总用户数</div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <ListChecks size={24} className="text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {completedTasks || 0}
          </div>
          <div className="text-sm text-gray-600">完成任务数</div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <TrendingUp size={24} className="text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {totalWorks || 0}
          </div>
          <div className="text-sm text-gray-600">提交作品数</div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <MessageSquare size={24} className="text-yellow-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {totalMessages || 0}
          </div>
          <div className="text-sm text-gray-600">对话消息数</div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-4">最近注册用户</h2>
          {recentUsers && recentUsers.length > 0 ? (
            <div className="space-y-3">
              {(recentUsers as any[]).map((user: any) => (
                <div key={user.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <div className="font-medium text-gray-900">{user.nickname || '未命名'}</div>
                    <div className="text-sm text-gray-500">
                      {user.age}岁 · {user.grade}年级
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString('zh-CN')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">暂无用户</p>
          )}
        </Card>

        {/* Recent Works */}
        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-4">最近提交作品</h2>
          {recentWorks && recentWorks.length > 0 ? (
            <div className="space-y-3">
              {(recentWorks as any[]).map((work: any) => (
                <div key={work.id} className="py-2 border-b border-gray-100 last:border-0">
                  <div className="font-medium text-gray-900 mb-1">{work.title}</div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{(work.profiles as any)?.nickname || '未知用户'}</span>
                    <span>{new Date(work.created_at).toLocaleDateString('zh-CN')}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">暂无作品</p>
          )}
        </Card>
      </div>
    </div>
  )
}
