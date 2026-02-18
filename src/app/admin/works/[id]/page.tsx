'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { ArrowLeft, ExternalLink, Calendar, User, Award, CheckCircle, XCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { TASKS } from '@/lib/constants'
import Link from 'next/link'

export default function AdminWorkDetailPage() {
  const router = useRouter()
  const params = useParams()

  const [loading, setLoading] = useState(true)
  const [work, setWork] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [points, setPoints] = useState(0)

  useEffect(() => {
    fetchWorkDetail()
  }, [])

  const fetchWorkDetail = async () => {
    try {
      const response = await fetch(`/api/admin/works/${params.id}`, {
        credentials: 'include',
      })

      const result = await response.json()
      if (result.work) {
        setWork(result.work)

        // Extract feedback and points from tags (stored as metadata)
        let extractedFeedback = ''
        let extractedPoints = 0

        if (result.work.tags && Array.isArray(result.work.tags)) {
          result.work.tags.forEach((tag: string) => {
            if (tag.startsWith('feedback:')) {
              extractedFeedback = tag.substring('feedback:'.length)
            } else if (tag.startsWith('points:')) {
              extractedPoints = parseInt(tag.substring('points:'.length), 10)
            }
          })
        }

        setFeedback(extractedFeedback || '')

        // Set default points from extracted metadata, task default, or 0
        const task = TASKS.find(t => t.id === result.work.task_id)
        const defaultPoints = extractedPoints || task?.points || 0
        setPoints(defaultPoints)
      }
    } catch (error) {
      console.error('Failed to fetch work detail:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!points || points <= 0) {
      alert('请输入积分数量')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch(`/api/admin/works/${params.id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          feedback,
          points,
          status: 'completed'
        }),
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        throw new Error(result.error || '审核失败')
      }

      alert('✅ 审核通过，积分已发放！')
      router.push('/admin/works')
    } catch (error: any) {
      console.error('Failed to approve:', error)
      alert(error.message || '审核失败，请重试')
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

  if (!work) {
    return (
      <div className="p-8">
        <Card className="text-center py-12">
          <div className="text-4xl mb-3">🤔</div>
          <p className="text-gray-600">作品不存在</p>
        </Card>
      </div>
    )
  }

  const userTask = work.user_tasks?.[0]
  const isCompleted = userTask?.status === 'completed'
  const task = TASKS.find(t => t.id === work.task_id)

  return (
    <div className="p-8 space-y-6 max-w-4xl">
      <Link
        href="/admin/works"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={20} />
        <span>返回作品列表</span>
      </Link>

      {/* Work Detail */}
      <Card>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between mb-3">
              <h1 className="text-2xl font-bold text-gray-900 flex-1">{work.title}</h1>
              {work.version > 1 && (
                <Badge variant="primary">v{work.version}</Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <User size={16} />
                <span>{work.profiles?.nickname || '未命名'} ({work.profiles?.age}岁，{work.profiles?.grade}年级)</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{formatDate(work.created_at)}</span>
              </div>
              {isCompleted && (
                <Badge variant="success">
                  <CheckCircle size={14} className="mr-1" />
                  已审核
                </Badge>
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
              <h3 className="text-sm font-semibold text-gray-900 mb-2">学生收获</h3>
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

      {/* Review Section */}
      {isCompleted ? (
        <Card className="bg-green-50">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle size={20} className="text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">已审核通过</h3>
            </div>
            {userTask.points_earned > 0 && (
              <div className="flex items-center gap-2 text-green-700">
                <Award size={18} />
                <span className="font-medium">已获得 {userTask.points_earned} 积分</span>
              </div>
            )}
            {userTask.feedback && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">导师反馈：</h4>
                <p className="text-gray-700 whitespace-pre-line">{userTask.feedback}</p>
              </div>
            )}
          </div>
        </Card>
      ) : (
        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-4">审核作品</h2>
          <div className="space-y-4">
            <div>
              <Input
                label={`奖励积分${task ? ` (任务默认: ${task.points} 积分)` : ''}`}
                type="number"
                min="0"
                placeholder="输入积分数量"
                value={points}
                onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
              />
              <p className="text-xs text-gray-500 mt-1">💡 可以根据完成质量调整积分</p>
            </div>

            <Textarea
              label="导师反馈"
              placeholder="给学生写一些鼓励和建议..."
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />

            <div className="flex gap-3">
              <Button
                onClick={handleApprove}
                loading={submitting}
                disabled={!points || points <= 0}
                className="flex-1"
              >
                <CheckCircle size={18} className="mr-2" />
                通过并发放积分
              </Button>
            </div>

            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm text-gray-700">
                💡 提示：审核通过后，学生将获得积分奖励，并能看到你的反馈
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
