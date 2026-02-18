'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { ArrowLeft, ExternalLink, Calendar, Tag, Plus, History, Check, Award, MessageCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default function WorkDetailPage() {
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [work, setWork] = useState<any>(null)
  const [versions, setVersions] = useState<any[]>([])
  const [showNewVersionForm, setShowNewVersionForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reflection: '',
    link: '',
  })

  useEffect(() => {
    fetchWorkDetail()
  }, [])

  const fetchWorkDetail = async () => {
    try {
      // Check auth
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Fetch work detail from API
      const response = await fetch(`/api/works/${params.id}`, {
        method: 'GET',
        credentials: 'include',
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        throw new Error(result.error || '获取作品详情失败')
      }

      setWork(result.work)
      setVersions(result.versions || [])

      // Pre-fill form with current work data
      setFormData({
        title: result.work.title,
        description: result.work.description || '',
        reflection: result.work.reflection || '',
        link: result.work.link || '',
      })
    } catch (error: any) {
      console.error('Failed to fetch work detail:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitNewVersion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title) return

    setSubmitting(true)

    try {
      const response = await fetch(`/api/works/${work.parent_work_id || work.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          reflection: formData.reflection,
          link: formData.link || null,
          tags: work.tags || null,
        }),
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        throw new Error(result.error || '提交新版本失败')
      }

      alert('✅ 新版本提交成功！')

      // Navigate to the new version
      router.push(`/dashboard/works/${result.work.id}`)
      router.refresh()
    } catch (error: any) {
      console.error('Failed to submit new version:', error)
      alert(error.message || '提交失败，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 flex justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!work) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Card className="text-center py-12">
          <div className="text-4xl mb-3">🤔</div>
          <p className="text-gray-600">作品不存在</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/works"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
          <span>返回作品列表</span>
        </Link>

        <Button
          onClick={() => setShowNewVersionForm(!showNewVersionForm)}
          variant="secondary"
          size="sm"
        >
          <Plus size={16} className="mr-1" />
          提交新版本
        </Button>
      </div>

      {/* Version History */}
      {versions.length > 1 && (
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <History size={18} className="text-green-600" />
            <h3 className="font-semibold text-gray-900">版本历史</h3>
            <Badge variant="secondary" size="sm">{versions.length} 个版本</Badge>
          </div>
          <div className="space-y-2">
            {versions.map((v: any) => (
              <Link
                key={v.id}
                href={`/dashboard/works/${v.id}`}
                className={`block p-3 rounded-lg border transition-colors ${
                  v.id === work.id
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {v.id === work.id && <Check size={16} className="text-green-600" />}
                    <span className="font-medium text-gray-900">版本 {v.version}</span>
                    <span className="text-sm text-gray-600">{v.title}</span>
                  </div>
                  <span className="text-xs text-gray-500">{formatDate(v.created_at)}</span>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* New Version Form */}
      {showNewVersionForm && (
        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-4">提交新版本</h2>
          <form onSubmit={handleSubmitNewVersion} className="space-y-4">
            <Input
              label="作品标题"
              placeholder="给你的新版本起个名字"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <Textarea
              label="作品描述"
              placeholder="这个版本有什么改进？"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <Textarea
              label="你的收获"
              placeholder="在改进过程中，你学到了什么？"
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

            <div className="flex gap-3">
              <Button type="submit" loading={submitting} className="flex-1">
                提交新版本
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowNewVersionForm(false)}
              >
                取消
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Teacher Feedback */}
      {work.user_tasks?.[0]?.status === 'completed' && (
        <Card className="bg-green-50 border-green-200">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Award size={20} className="text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">导师已审核</h3>
            </div>

            {work.user_tasks[0].points_earned > 0 && (
              <div className="bg-white rounded-xl p-4">
                <div className="flex items-center gap-2 text-green-700">
                  <Award size={18} />
                  <span className="font-bold text-xl">+{work.user_tasks[0].points_earned} 积分</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">恭喜！你已获得积分奖励</p>
              </div>
            )}

            {work.user_tasks[0].feedback && (
              <div className="bg-white rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle size={18} className="text-blue-600" />
                  <h4 className="font-medium text-gray-900">导师反馈</h4>
                </div>
                <p className="text-gray-700 whitespace-pre-line">{work.user_tasks[0].feedback}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {work.user_tasks?.[0]?.status === 'pending' && (
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="text-2xl">⏳</div>
            <div>
              <h3 className="font-semibold text-gray-900">等待导师审核</h3>
              <p className="text-sm text-gray-600">导师审核通过后，你将获得积分和反馈</p>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between mb-3">
              <h1 className="text-2xl font-bold text-gray-900 flex-1">{work.title}</h1>
              {work.version && (
                <Badge variant="primary">v{work.version}</Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{formatDate(work.created_at)}</span>
              </div>
              {work.tags && work.tags.length > 0 && (
                <div className="flex items-center gap-1">
                  <Tag size={16} />
                  <span>{work.tags.length} 个标签</span>
                </div>
              )}
              {versions.length > 1 && (
                <div className="flex items-center gap-1 text-green-600">
                  <History size={16} />
                  <span>{versions.length} 个版本</span>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {work.tags && work.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {work.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="primary" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Description */}
          {work.description && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">作品描述</h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-700 whitespace-pre-line">{work.description}</p>
              </div>
            </div>
          )}

          {/* Reflection */}
          {work.reflection && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">我的收获</h3>
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-gray-700 whitespace-pre-line">💭 {work.reflection}</p>
              </div>
            </div>
          )}

          {/* Link */}
          {work.link && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">作品链接</h3>
              <a
                href={work.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl transition-colors"
              >
                <ExternalLink size={18} />
                <span className="break-all">{work.link}</span>
              </a>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
