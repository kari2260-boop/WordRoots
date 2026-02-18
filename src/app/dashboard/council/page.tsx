import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { COUNCIL_MENTORS, TASKS } from '@/lib/constants'
import { getMentorsWithStatus } from '@/lib/council'
import { calculateLevel } from '@/lib/utils'
import { Award, Lock, Check } from 'lucide-react'

export default async function CouncilPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
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
  }

  // Get unlocked mentors
  const { data: unlockedMentors } = await supabase
    .from('council_unlocks')
    .select('mentor_id')
    .eq('user_id', user.id)

  const unlockedIds = new Set((unlockedMentors as any[])?.map((u: any) => u.mentor_id) || [])

  // Get completed tasks
  const { data: completedTasks } = await supabase
    .from('user_tasks')
    .select('task_id')
    .eq('user_id', user.id)
    .eq('status', 'completed')

  const completedTaskIds = (completedTasks as any[])?.map((t: any) => t.task_id) || []
  const completedTasksData = TASKS.filter(t => completedTaskIds.includes(t.id))

  // Calculate user level
  const userLevel = calculateLevel(profileData.total_points).level

  // Count completed tasks by type
  const completedTasksByType = completedTasksData.reduce((acc, task) => {
    acc[task.type] = (acc[task.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Get mentor status
  const mentorsStatus = getMentorsWithStatus(
    userLevel,
    completedTasksByType,
    Array.from(unlockedIds)
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Award size={24} className="text-yellow-500" />
          <h1 className="text-2xl font-bold text-gray-900">未来理事会</h1>
        </div>
        <p className="text-gray-600">完成条件解锁更多AI导师</p>
      </div>

      {/* Statistics */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center justify-around">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {mentorsStatus.filter(m => m.unlocked).length}
            </div>
            <div className="text-xs text-gray-600 mt-1">已解锁</div>
          </div>
          <div className="w-px h-8 bg-gray-300" />
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {COUNCIL_MENTORS.length}
            </div>
            <div className="text-xs text-gray-600 mt-1">总导师数</div>
          </div>
        </div>
      </Card>

      {/* Mentors */}
      <div className="space-y-4">
        {mentorsStatus.map((mentorStatus) => {
          const mentor = mentorStatus
          const isUnlocked = mentorStatus.unlocked
          const progress = mentorStatus.progress

          return (
            <Card
              key={mentor.id}
              className={`relative overflow-hidden ${
                isUnlocked ? 'border-2 border-yellow-400' : 'opacity-75'
              }`}
            >
              {isUnlocked && (
                <div className="absolute top-3 right-3">
                  <div className="bg-yellow-400 text-yellow-900 rounded-full p-1.5">
                    <Check size={16} />
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className={`text-5xl ${!isUnlocked && 'grayscale opacity-50'}`}>
                  {mentor.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{mentor.name}</h3>
                    {isUnlocked ? (
                      <Badge variant="success" size="sm">已解锁</Badge>
                    ) : (
                      <Badge variant="secondary" size="sm">
                        <Lock size={12} className="mr-1" />
                        未解锁
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{mentor.description}</p>

                  {!isUnlocked && (
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>解锁条件</span>
                        <span>{progress.current} / {progress.required}</span>
                      </div>
                      <Progress
                        value={(progress.current / progress.required) * 100}
                        className="mb-2"
                      />
                      <p className="text-xs text-gray-500">
                        {mentor.unlockCondition.type === 'level' &&
                          `达到 Lv.${mentor.unlockCondition.value}`
                        }
                        {mentor.unlockCondition.type === 'tasks_completed' &&
                          `完成 ${mentor.unlockCondition.value} 个${
                            mentor.unlockCondition.taskTypes
                              ? mentor.unlockCondition.taskTypes.join('或') + '类型的'
                              : ''
                          }任务`
                        }
                      </p>
                    </div>
                  )}

                  {isUnlocked && (
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">{mentor.name}</span> 已加入你的理事会！
                        未来你可以直接向 TA 请教问题。
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Tips */}
      <Card className="bg-blue-50">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 mb-1">
              什么是未来理事会？
            </p>
            <p className="text-sm text-gray-600">
              这是一群有特殊专长的AI导师，每位导师都擅长不同的领域。
              当你达到相应条件时，就能解锁他们，获得更专业的指导！
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
