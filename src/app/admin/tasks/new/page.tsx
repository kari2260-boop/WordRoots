'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewTaskPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    emoji: '',
    type: 'exploration',
    points: 100,
    difficulty: 1,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('动态任务管理功能将在未来版本中实现。当前请编辑 /src/lib/constants.ts 添加任务。')
  }

  return (
    <div className="p-8 space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/tasks" className="text-gray-600 hover:text-gray-900">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">新建任务</h1>
          <p className="text-gray-600">创建新的学习任务</p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="任务标题"
            placeholder="给任务起个名字"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <Textarea
            label="任务描述"
            placeholder="详细描述任务内容和目标"
            rows={5}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />

          <Input
            label="任务图标（Emoji）"
            placeholder="🎨"
            value={formData.emoji}
            onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
          />

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                任务类型
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="exploration">探索发现</option>
                <option value="creative">创意制作</option>
                <option value="reflection">思考记录</option>
                <option value="hands-on">动手实践</option>
                <option value="learning">深度学习</option>
              </select>
            </div>

            <Input
              label="积分奖励"
              type="number"
              min={50}
              max={500}
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                难度等级
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: parseInt(e.target.value) })}
              >
                <option value={1}>⭐ 简单</option>
                <option value={2}>⭐⭐ 中等</option>
                <option value={3}>⭐⭐⭐ 困难</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => router.back()}>
              取消
            </Button>
            <Button type="submit">
              创建任务
            </Button>
          </div>
        </form>
      </Card>

      <Card className="bg-yellow-50">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 mb-1">功能说明</p>
            <p className="text-sm text-gray-600">
              动态任务管理功能将在未来版本中实现。
              当前阶段，如需添加任务，请直接编辑 /src/lib/constants.ts 文件中的 TASKS 数组。
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
