import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { TaskCard } from '@/components/TaskCard'
import { LEVELS, TASKS } from '@/lib/constants'
import { calculateLevel } from '@/lib/utils'
import Link from 'next/link'
import { Sparkles, TrendingUp, Target } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  console.log('Dashboard - User:', user?.id, 'Error:', userError)

  if (!user) {
    console.log('Dashboard - No user, redirecting to login')
    redirect('/login')
  }

  // Get profile with admin client (bypass RLS)
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  console.log('Dashboard - Profile found:', !!profile, 'Error:', profileError)

  // If profile fetch fails, create a default profile object
  const profileData = profile || {
    id: user.id,
    nickname: user.email?.split('@')[0] || '探险家',
    total_points: 0,
    role: 'student',
  }

  console.log('Dashboard - Using profile:', profileData)

  // Get completed task IDs using admin client
  const { data: completedTasks } = await supabaseAdmin
    .from('user_tasks')
    .select('task_id')
    .eq('user_id', user.id)
    .eq('status', 'completed')

  const completedTaskIds = new Set<number>((completedTasks as any[])?.map((t: any) => t.task_id) || [])

  console.log('Dashboard - Completed tasks:', completedTasks?.length || 0)

  // Get user strengths
  const { data: strengths } = await supabase
    .from('user_strengths')
    .select('tag_name, dimension')
    .eq('user_id', user.id)
    .limit(5)

  // Get recent works
  const { data: recentWorks } = await supabase
    .from('works')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(3)

  // Calculate level
  const levelInfo = calculateLevel(profileData.total_points)
  const nextLevel = LEVELS.find(l => l.level === levelInfo.level + 1)
  const progressToNext = nextLevel
    ? ((profileData.total_points - levelInfo.minPoints) / (nextLevel.minPoints - levelInfo.minPoints)) * 100
    : 100

  console.log('Dashboard - Level calculation:', {
    total_points: profileData.total_points,
    currentLevel: levelInfo,
    nextLevel: nextLevel,
    progressToNext: progressToNext
  })

  // Get recommended tasks (incomplete tasks)
  const recommendedTasks = TASKS.filter(task => !completedTaskIds.has(task.id)).slice(0, 3)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* User Card */}
      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold">{profileData.nickname || '探险家'}</h1>
              <span className="text-3xl">{levelInfo.emoji}</span>
            </div>
            <p className="text-green-100 text-sm">{levelInfo.name}</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/admin"
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
            >
              🔧 管理
            </Link>
            <Link
              href="/dashboard/profile"
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
            >
              查看画像
            </Link>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-100">等级进度</span>
            <span className="font-medium">
              {profileData.total_points} / {nextLevel?.minPoints || profileData.total_points} 积分
            </span>
          </div>
          <Progress value={progressToNext} color="bg-yellow-400" className="bg-white/20 h-3" />
          {nextLevel && (
            <p className="text-xs text-green-100">
              还需 {nextLevel.minPoints - profileData.total_points} 积分升至 {nextLevel.name}
            </p>
          )}
        </div>
      </Card>

      {/* Strengths */}
      {strengths && strengths.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={20} className="text-yellow-500" />
            <h2 className="text-lg font-bold text-gray-900">你的闪光点</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {(strengths as any[])?.map((strength: any, index: number) => (
              <Badge key={index} variant="success">
                {strength.tag_name}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Recommended Tasks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target size={20} className="text-green-600" />
            <h2 className="text-lg font-bold text-gray-900">推荐任务</h2>
          </div>
          <Link
            href="/dashboard/tasks"
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            查看全部 →
          </Link>
        </div>

        {recommendedTasks.length > 0 ? (
          <div className="space-y-3">
            {recommendedTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task as any}
                completed={false}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-8">
            <div className="text-4xl mb-3">🎉</div>
            <p className="text-gray-600 mb-2">太棒了！你已经完成所有任务</p>
            <p className="text-sm text-gray-500">继续和K博士聊天探索更多可能</p>
          </Card>
        )}
      </div>

      {/* Recent Works */}
      {recentWorks && recentWorks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">最近作品</h2>
            </div>
            <Link
              href="/dashboard/works"
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              查看全部 →
            </Link>
          </div>

          <div className="space-y-3">
            {(recentWorks as any[])?.map((work: any) => (
              <Card key={work.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{work.title}</h3>
                    {work.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {work.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{new Date(work.created_at).toLocaleDateString('zh-CN')}</span>
                      {work.tags && work.tags.length > 0 && (
                        <>
                          <span>·</span>
                          <div className="flex gap-1">
                            {work.tags.slice(0, 2).map((tag, i) => (
                              <Badge key={i} variant="secondary" size="sm">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
