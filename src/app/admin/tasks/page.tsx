import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { TASKS, TASK_TYPES } from '@/lib/constants'
import Link from 'next/link'
import { Plus, Star } from 'lucide-react'

export default async function AdminTasksPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">任务管理</h1>
          <p className="text-gray-600">管理系统预设任务</p>
        </div>
        <Link href="/admin/tasks/new">
          <Button>
            <Plus size={18} className="mr-2" />
            新建任务
          </Button>
        </Link>
      </div>

      <Card>
        <div className="space-y-4">
          {TASKS.map(task => {
            const typeInfo = TASK_TYPES[task.type]
            return (
              <div
                key={task.id}
                className="p-4 border border-gray-200 rounded-xl hover:border-green-300 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{task.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{task.title}</h3>
                      <Badge variant="primary">{typeInfo.label}</Badge>
                      <Badge variant="secondary">{task.points} 积分</Badge>
                      <div className="flex items-center">
                        {Array.from({ length: task.difficulty }).map((_, i) => (
                          <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 whitespace-pre-line">
                      {task.description}
                    </p>
                    {task.requirements && task.requirements.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">任务要求：</p>
                        <ul className="space-y-1">
                          {task.requirements.map((req, i) => (
                            <li key={i} className="text-xs text-gray-600 flex items-start gap-1">
                              <span className="text-green-600">✓</span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <Card className="bg-blue-50">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 mb-1">提示</p>
            <p className="text-sm text-gray-600">
              当前任务为系统预设任务，定义在 /src/lib/constants.ts 中。
              如需修改，请直接编辑该文件。未来版本将支持动态管理任务。
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
