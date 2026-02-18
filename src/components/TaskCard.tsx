import { Card } from './ui/Card'
import { Badge } from './ui/Badge'
import { TASK_TYPES } from '@/lib/constants'
import type { Task } from '@/types'
import Link from 'next/link'

interface TaskCardProps {
  task: Task
  completed?: boolean
}

export function TaskCard({ task, completed = false }: TaskCardProps) {
  const typeInfo = TASK_TYPES[task.type]

  return (
    <Link href={`/dashboard/tasks/${task.id}`} className="block">
      <Card className="relative cursor-pointer hover:shadow-lg transition-shadow">
        {completed && (
          <div className="absolute top-4 right-4 text-2xl">✅</div>
        )}
        <div className="flex items-start gap-4">
          <div className="text-4xl flex-shrink-0">{task.emoji}</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{task.title}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={typeInfo.color} size="sm">
                {typeInfo.emoji} {typeInfo.label}
              </Badge>
              <Badge variant="warning" size="sm">
                +{task.points} 积分
              </Badge>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: task.difficulty }).map((_, i) => (
                  <span key={i} className="text-yellow-500">⭐</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
