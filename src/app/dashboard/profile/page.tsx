import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { Button } from '@/components/ui/Button'
import { LEVELS } from '@/lib/constants'
import { calculateLevel } from '@/lib/utils'
import { User, Award, Target, Sparkles, TrendingUp, LogOut } from 'lucide-react'
import Link from 'next/link'
import { ObservationsList } from '@/components/ObservationsList'
import { WorksFeedbackList } from '@/components/WorksFeedbackList'

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Use admin client to get profile (bypass RLS)
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Use default profile if fetch fails
  const profileData = profile || {
    id: user.id,
    nickname: user.email?.split('@')[0] || '探险家',
    total_points: 0,
    role: 'student',
    age: null,
    grade: null,
    gender: null,
  }

  // Get user data
  const { data: interests } = await supabase
    .from('user_interests')
    .select('category, specific')
    .eq('user_id', user.id)

  const { data: strengths } = await supabase
    .from('user_strengths')
    .select('tag_name, dimension, confidence')
    .eq('user_id', user.id)
    .order('confidence', { ascending: false })

  const { data: traits } = await supabase
    .from('user_traits')
    .select('trait_name, score')
    .eq('user_id', user.id)
    .order('score', { ascending: false })

  const { data: goals } = await supabase
    .from('user_goals')
    .select('type, content')
    .eq('user_id', user.id)

  const { data: completedTasks } = await supabaseAdmin
    .from('user_tasks')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'completed')

  const levelInfo = calculateLevel(profileData.total_points)
  const nextLevel = LEVELS.find(l => l.level === levelInfo.level + 1)
  const progressToNext = nextLevel
    ? ((profileData.total_points - levelInfo.minPoints) / (nextLevel.minPoints - levelInfo.minPoints)) * 100
    : 100

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Profile Header */}
      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-4xl">
            {levelInfo.emoji}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">{profileData.nickname || '探险家'}</h1>
            <p className="text-green-100 text-sm">{levelInfo.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">{levelInfo.level}</div>
            <div className="text-xs text-green-100">当前等级</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">{profileData.total_points}</div>
            <div className="text-xs text-green-100">总积分</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">{completedTasks?.length || 0}</div>
            <div className="text-xs text-green-100">完成任务</div>
          </div>
        </div>

        {nextLevel && (
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-green-100">升级进度</span>
              <span className="font-medium">
                {nextLevel.minPoints - profileData.total_points} 积分后升级
              </span>
            </div>
            <Progress value={progressToNext} color="bg-yellow-400" className="bg-white/20 h-3" />
          </div>
        )}
      </Card>

      {/* Basic Info */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <User size={20} className="text-gray-600" />
          <h2 className="text-lg font-bold text-gray-900">基本信息</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {profileData.age && (
            <div>
              <span className="text-gray-600">年龄：</span>
              <span className="font-medium text-gray-900">{profileData.age} 岁</span>
            </div>
          )}
          {profileData.grade && (
            <div>
              <span className="text-gray-600">年级：</span>
              <span className="font-medium text-gray-900">{profileData.grade} 年级</span>
            </div>
          )}
          {profileData.gender && (
            <div>
              <span className="text-gray-600">性别：</span>
              <span className="font-medium text-gray-900">
                {profileData.gender === 'male' ? '男' : profileData.gender === 'female' ? '女' : '其他'}
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Interests */}
      {interests && interests.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={20} className="text-yellow-500" />
            <h2 className="text-lg font-bold text-gray-900">兴趣爱好</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {(interests as any[])?.map((interest: any, index: number) => (
              <Badge key={index} variant="secondary">
                {interest.category}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Strengths */}
      {strengths && strengths.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Award size={20} className="text-green-600" />
            <h2 className="text-lg font-bold text-gray-900">优势特长</h2>
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

      {/* Personality Traits */}
      {traits && traits.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">性格特点</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {(traits as any[])?.slice(0, 8).map((trait: any, index: number) => (
              <Badge key={index} variant="secondary">
                {trait.trait_name}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Goals */}
      {goals && goals.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Target size={20} className="text-purple-600" />
            <h2 className="text-lg font-bold text-gray-900">我的目标</h2>
          </div>
          <div className="space-y-3">
            {(goals as any[])?.map((goal: any, index: number) => {
              const typeMap: Record<string, { label: string; emoji: string }> = {
                dream: { label: '梦想', emoji: '🌟' },
                skill: { label: '想学', emoji: '📚' },
                short_term: { label: '今年', emoji: '🎯' },
              }
              const info = typeMap[goal.type] || { label: goal.type, emoji: '💭' }
              return (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-lg">{info.emoji}</span>
                  <div className="flex-1">
                    <span className="text-xs text-gray-500">{info.label}</span>
                    <p className="text-sm text-gray-700">{goal.content}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Observations */}
      <ObservationsList />

      {/* Works Feedback */}
      <WorksFeedbackList />

      {/* Actions */}
      <Card>
        <div className="space-y-3">
          <Link href="/dashboard/discover">
            <Button variant="secondary" className="w-full">
              <Sparkles size={18} className="mr-2" />
              持续完善画像
            </Button>
          </Link>
          <Link href="/dashboard/council">
            <Button variant="secondary" className="w-full">
              <Award size={18} className="mr-2" />
              查看未来理事会
            </Button>
          </Link>
          <form action="/auth/signout" method="post">
            <Button variant="secondary" className="w-full" type="submit">
              <LogOut size={18} className="mr-2" />
              退出登录
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
