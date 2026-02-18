'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { formatDate } from '@/lib/utils'
import { Eye, Plus, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function AdminObservationsPage() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [observations, setObservations] = useState<any[]>([])

  useEffect(() => {
    fetchObservations()

    // Also refetch when window gains focus (e.g., after navigation back)
    const handleFocus = () => {
      console.log('Window focused, refreshing observations...')
      fetchObservations()
    }

    window.addEventListener('focus', handleFocus)

    // Refetch when page becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Page visible, refreshing observations...')
        fetchObservations()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const fetchObservations = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    }
    try {
      const response = await fetch('/api/admin/observations', {
        credentials: 'include',
        cache: 'no-store', // Disable caching to always get fresh data
      })
      const result = await response.json()
      console.log('Fetched observations:', result.observations)
      if (result.observations) {
        setObservations(result.observations)
      }
    } catch (error) {
      console.error('Failed to fetch observations:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    fetchObservations(true)
  }

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">观察记录</h1>
          <p className="text-gray-600">管理对学生的观察和发现</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={handleRefresh}
            loading={refreshing}
          >
            <RefreshCw size={18} className="mr-2" />
            刷新
          </Button>
          <Link href="/admin/observations/new">
            <Button>
              <Plus size={18} className="mr-2" />
              添加观察
            </Button>
          </Link>
        </div>
      </div>

      {observations && observations.length > 0 ? (
        <div className="space-y-4">
          {(observations as any[]).map((obs: any) => (
            <Card key={obs.id}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Eye size={20} className="text-purple-600" />
                  <div>
                    <h3 className="font-bold text-gray-900">{obs.title}</h3>
                    <p className="text-sm text-gray-500">
                      {(obs.profiles as any)?.nickname || '未命名用户'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {obs.category && (
                    <Badge variant="secondary">{obs.category}</Badge>
                  )}
                  <span className="text-sm text-gray-500">
                    {formatDate(obs.created_at)}
                  </span>
                </div>
              </div>

              <p className="text-gray-700 whitespace-pre-line mb-3">
                {obs.observation}
              </p>

              {obs.suggested_tags && obs.suggested_tags.length > 0 && (
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">相关标签：</p>
                  <div className="flex flex-wrap gap-1">
                    {obs.suggested_tags.map((tag: string, i: number) => (
                      <Badge key={i} variant="secondary" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <div className="text-4xl mb-3">👁️</div>
          <p className="text-gray-600 mb-4">暂无观察记录</p>
          <Link href="/admin/observations/new">
            <Button>添加第一条观察</Button>
          </Link>
        </Card>
      )}
    </div>
  )
}
