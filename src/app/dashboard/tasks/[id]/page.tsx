'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { TASKS, TASK_TYPES } from '@/lib/constants'
import { ArrowLeft, Star, Award } from 'lucide-react'
import Link from 'next/link'

export default function TaskDetailPage() {
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()

  const taskId = parseInt(params.id as string)
  const task = TASKS.find(t => t.id === taskId)

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [userTask, setUserTask] = useState<any>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reflection: '',
    link: '',
  })

  useEffect(() => {
    checkTaskStatus()
  }, [])

  const checkTaskStatus = async () => {
    try {
      // Use API to check task status
      const response = await fetch('/api/admin/stats')
      const data = await response.json()

      const userTask = data.tasks?.find((t: any) => t.task_id === taskId)

      if (userTask) {
        setIsCompleted(userTask.status === 'completed')
        setUserTask(userTask)
      }
    } catch (error) {
      console.error('Failed to check task status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!task || !formData.title) return

    setSubmitting(true)

    try {
      console.log('Submitting task:', task.id)

      // Get user first to ensure we have auth
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('请先登录')
      }

      // Use API instead of direct Supabase
      const response = await fetch('/api/tasks/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: include cookies
        body: JSON.stringify({
          task_id: task.id,
          title: formData.title,
          description: formData.description,
          reflection: formData.reflection,
          link: formData.link || null,
          tags: [TASK_TYPES[task.type].label],
        }),
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        throw new Error(result.error || '提交失败')
      }

      console.log('Task submitted successfully:', result)

      alert('✅ 作品提交成功！等待导师审核后将获得积分')

      router.push('/dashboard/works')
      router.refresh()
    } catch (error: any) {
      console.error('Failed to submit task:', error)
      alert(error.message || '提交失败，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  if (!task) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Card className="text-center py-12">
          <div className="text-4xl mb-3">🤔</div>
          <p className="text-gray-600">任务不存在</p>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 flex justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  const typeInfo = TASK_TYPES[task.type]

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <Link
        href="/dashboard/tasks"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={20} />
        <span>返回任务列表</span>
      </Link>

      <Card>
        <div className="flex items-start gap-3 mb-4">
          <span className="text-4xl">{task.emoji}</span>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h1>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="primary">{typeInfo.label}</Badge>
              <Badge variant="secondary">
                <Award size={14} className="mr-1" />
                {task.points} 积分
              </Badge>
              <div className="flex items-center">
                {Array.from({ length: task.difficulty }).map((_, i) => (
                  <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 whitespace-pre-line">{task.description}</p>
        </div>

        {task.requirements && task.requirements.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">任务要求：</h3>
            <ul className="space-y-1">
              {task.requirements.map((req, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      {isCompleted ? (
        <Card className="text-center py-8 bg-green-50">
          <div className="text-4xl mb-3">✅</div>
          <p className="text-green-700 font-medium mb-2">你已完成这个任务</p>
          <p className="text-sm text-gray-600 mb-4">继续探索其他任务吧</p>
          <Link href="/dashboard/tasks">
            <Button>查看更多任务</Button>
          </Link>
        </Card>
      ) : (
        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-4">提交作品</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="作品标题"
              placeholder="给你的作品起个名字"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <Textarea
              label="作品描述"
              placeholder="简单介绍一下你做了什么"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <Textarea
              label="你的收获"
              placeholder="完成这个任务后，你有什么感受或收获？"
              rows={3}
              value={formData.reflection}
              onChange={(e) => setFormData({ ...formData, reflection: e.target.value })}
            />

            <Input
              label="作品链接（选填）"
              placeholder="如果有线上作品，可以贴链接"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            />

            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">💡</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    提交后会获得 <span className="font-bold text-green-600">{task.points} 积分</span>，K博士也会看到你的作品哦！
                  </p>
                </div>
              </div>
            </div>

            <Button type="submit" loading={submitting} className="w-full" size="lg">
              提交作品
            </Button>
          </form>
        </Card>
      )}
    </div>
  )
}
