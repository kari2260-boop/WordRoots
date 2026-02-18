import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { TaskCard } from '@/components/TaskCard'
import { TASKS, TASK_TYPES } from '@/lib/constants'
import { ListTodo } from 'lucide-react'

export default async function TasksPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Get completed task IDs
  const { data: completedTasks } = await supabase
    .from('user_tasks')
    .select('task_id')
    .eq('user_id', user.id)
    .eq('status', 'completed')

  const completedTaskIds = new Set<string>((completedTasks as any[])?.map((t: any) => t.task_id) || [])

  // Separate tasks into completed and available
  const availableTasks = TASKS.filter(task => !completedTaskIds.has(task.id))
  const completedTasksList = TASKS.filter(task => completedTaskIds.has(task.id))

  // Group available tasks by type
  const tasksByType = availableTasks.reduce((acc, task) => {
    if (!acc[task.type]) acc[task.type] = []
    acc[task.type].push(task)
    return acc
  }, {} as Record<string, any[]>)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <ListTodo size={24} className="text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">任务广场</h1>
        </div>
        <p className="text-gray-600">完成任务，获得积分和经验</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center">
          <div className="text-2xl font-bold text-green-600">{completedTasksList.length}</div>
          <div className="text-xs text-gray-600 mt-1">已完成</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-blue-600">{availableTasks.length}</div>
          <div className="text-xs text-gray-600 mt-1">待完成</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-gray-900">{TASKS.length}</div>
          <div className="text-xs text-gray-600 mt-1">总任务</div>
        </Card>
      </div>

      {/* Available Tasks by Type */}
      {Object.entries(tasksByType).map(([type, tasks]) => {
        const typeInfo = TASK_TYPES[type as keyof typeof TASK_TYPES]
        return (
          <div key={type}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{typeInfo.emoji}</span>
              <h2 className="text-lg font-bold text-gray-900">{typeInfo.label}</h2>
              <span className="text-sm text-gray-500">({tasks.length})</span>
            </div>
            <div className="space-y-3">
              {tasks.map(task => (
                <TaskCard key={task.id} task={task as any} completed={false} />
              ))}
            </div>
          </div>
        )
      })}

      {availableTasks.length === 0 && (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            太棒了！
          </h3>
          <p className="text-gray-600">
            你已经完成所有任务
          </p>
        </Card>
      )}

      {/* Completed Tasks */}
      {completedTasksList.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span>✅</span>
            <span>已完成 ({completedTasksList.length})</span>
          </h2>
          <div className="space-y-3">
            {completedTasksList.map(task => (
              <TaskCard key={task.id} task={task as any} completed={true} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
