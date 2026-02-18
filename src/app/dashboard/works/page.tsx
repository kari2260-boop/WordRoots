'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { FolderOpen, ExternalLink, ChevronRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default function WorksPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [works, setWorks] = useState<any[]>([])

  useEffect(() => {
    checkAuthAndFetchWorks()
  }, [])

  const checkAuthAndFetchWorks = async () => {
    try {
      // Check auth
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Fetch works from API
      const response = await fetch('/api/works', {
        method: 'GET',
        credentials: 'include',
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        throw new Error(result.error || '获取作品失败')
      }

      setWorks(result.works || [])
    } catch (error: any) {
      console.error('Failed to fetch works:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 flex justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <FolderOpen size={24} className="text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">我的作品</h1>
        </div>
        <p className="text-gray-600">记录你的成长足迹</p>
      </div>

      {/* Statistics */}
      {works && works.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <Card className="text-center">
            <div className="text-2xl font-bold text-green-600">{works.length}</div>
            <div className="text-xs text-gray-600 mt-1">作品总数</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {new Set((works as any[]).flatMap((w: any) => w.tags || [])).size}
            </div>
            <div className="text-xs text-gray-600 mt-1">涉及领域</div>
          </Card>
        </div>
      )}

      {/* Works List */}
      {works && works.length > 0 ? (
        <div className="space-y-4">
          {(works as any[]).map((work: any) => (
            <Link key={work.id} href={`/dashboard/works/${work.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 flex-1">{work.title}</h3>
                  <div className="flex items-center gap-2">
                    {work.link && (
                      <a
                        href={work.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={20} />
                      </a>
                    )}
                    <ChevronRight size={20} className="text-gray-400" />
                  </div>
                </div>

                {work.description && (
                  <p className="text-gray-700 mb-3 whitespace-pre-line line-clamp-2">{work.description}</p>
                )}

                {work.reflection && (
                  <div className="bg-green-50 rounded-xl p-3 mb-3">
                    <p className="text-sm text-gray-700 line-clamp-2">
                      <span className="font-medium">💭 我的收获：</span>
                      <span className="ml-1">{work.reflection}</span>
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {work.tags?.map((tag, index) => (
                      <Badge key={index} variant="secondary" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(work.created_at)}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          emoji="📦"
          message="还没有作品。完成任务后，你的作品会展示在这里"
        />
      )}
    </div>
  )
}
