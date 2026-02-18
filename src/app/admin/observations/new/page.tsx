'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

function NewObservationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [users, setUsers] = useState<any[]>([])

  const preselectedUserId = searchParams.get('user_id')

  const [formData, setFormData] = useState({
    user_id: preselectedUserId || '',
    title: '',
    category: '',
    observation: '',
    suggested_tags: '',
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      // Use API instead of direct Supabase query
      const response = await fetch('/api/admin/stats')
      const data = await response.json()

      setUsers(data.profiles || [])
    } catch (error) {
      console.error('Failed to load users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const tags = formData.suggested_tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t)

      const response = await fetch('/api/admin/observations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          student_id: formData.user_id,
          title: formData.title,
          category: formData.category || null,
          observation: formData.observation,
          suggested_tags: tags.length > 0 ? tags : null,
        }),
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        throw new Error(result.error || '创建失败')
      }

      alert('✅ 观察记录已保存')
      router.push('/admin/observations')
    } catch (error: any) {
      console.error('Failed to create observation:', error)
      alert(error.message || '创建失败，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/observations" className="text-gray-600 hover:text-gray-900">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">添加观察记录</h1>
          <p className="text-gray-600">记录对学生的观察和发现</p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              选择学生 *
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.user_id}
              onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
              required
            >
              <option value="">请选择</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.nickname || '未命名用户'}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="标题 *"
            placeholder="简短概括这次观察"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <Input
            label="分类（选填）"
            placeholder="例如：学习表现、社交互动、情绪管理"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />

          <Textarea
            label="观察内容 *"
            placeholder="详细记录你观察到的行为、表现或特点"
            rows={6}
            value={formData.observation}
            onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              相关标签（选填）
            </label>
            <Input
              placeholder="用逗号分隔，例如：专注力强, 善于合作, 创意思维"
              value={formData.suggested_tags}
              onChange={(e) => setFormData({ ...formData, suggested_tags: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">
              这些标签会帮助我们更好地理解学生的特点
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              取消
            </Button>
            <Button type="submit" loading={submitting}>
              保存观察
            </Button>
          </div>
        </form>
      </Card>

      <Card className="bg-blue-50">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 mb-1">观察记录提示</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 记录具体的行为和表现，而非主观判断</li>
              <li>• 关注学生的优势和闪光点</li>
              <li>• 标签有助于积累用户画像数据</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default function NewObservationPage() {
  return (
    <Suspense fallback={
      <div className="p-8 flex justify-center">
        <Spinner size="lg" />
      </div>
    }>
      <NewObservationForm />
    </Suspense>
  )
}
