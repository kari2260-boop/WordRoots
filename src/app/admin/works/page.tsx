'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { Eye, Calendar, User } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default function AdminWorksPage() {
  const [loading, setLoading] = useState(true)
  const [works, setWorks] = useState<any[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  useEffect(() => {
    fetchWorks()
  }, [])

  const fetchWorks = async () => {
    try {
      const response = await fetch('/api/admin/works', {
        credentials: 'include',
      })

      const result = await response.json()
      console.log('🔍 [Admin Works Page] API Response:', result)

      if (result.works) {
        console.log('🔍 [Admin Works Page] Works data:', result.works.map((w: any) => ({
          id: w.id,
          title: w.title,
          status: w.status,
          tags: w.tags
        })))
        setWorks(result.works)
      }
    } catch (error) {
      console.error('Failed to fetch works:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredWorks = works.filter(work => {
    if (filter === 'all') return true
    if (filter === 'approved') return work.status === 'completed' || work.status === 'approved'
    return work.status === filter
  })

  // Count works by status
  const pendingCount = works.filter(w => !w.status || w.status === 'pending').length
  const approvedCount = works.filter(w => w.status === 'completed' || w.status === 'approved').length

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">作品管理</h1>
        <p className="text-gray-600">审核学生提交的作品，给予反馈和积分</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          全部 ({works.length})
        </Button>
        <Button
          variant={filter === 'pending' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('pending')}
        >
          待审核 ({pendingCount})
        </Button>
        <Button
          variant={filter === 'approved' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('approved')}
        >
          已通过 ({approvedCount})
        </Button>
      </div>

      {/* Works List */}
      <div className="space-y-4">
        {filteredWorks.length > 0 ? (
          filteredWorks.map((work: any) => (
            <Card key={work.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{work.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>{work.profiles?.nickname || '未命名'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{formatDate(work.created_at)}</span>
                    </div>
                    {work.version > 1 && (
                      <Badge variant="secondary" size="sm">v{work.version}</Badge>
                    )}
                  </div>
                </div>
                <Link href={`/admin/works/${work.id}`}>
                  <Button size="sm" variant="outline">
                    <Eye size={16} className="mr-1" />
                    查看详情
                  </Button>
                </Link>
              </div>

              {work.description && (
                <p className="text-gray-700 line-clamp-2 mb-3">{work.description}</p>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {work.tags?.filter((tag: string) =>
                    !tag.startsWith('feedback:') &&
                    !tag.startsWith('points:') &&
                    !tag.startsWith('status:')
                  ).map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
                {work.status && (work.status === 'completed' || work.status === 'approved') && (
                  <Badge variant="success" size="sm">✓ 已通过</Badge>
                )}
                {(!work.status || work.status === 'pending') && (
                  <Badge variant="warning" size="sm">待审核</Badge>
                )}
              </div>
            </Card>
          ))
        ) : (
          <Card className="text-center py-12">
            <div className="text-4xl mb-3">📦</div>
            <p className="text-gray-600">暂无作品</p>
          </Card>
        )}
      </div>
    </div>
  )
}
