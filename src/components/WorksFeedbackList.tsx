'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { Award, Sparkles, MessageSquare } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export function WorksFeedbackList() {
  const [loading, setLoading] = useState(true)
  const [works, setWorks] = useState<any[]>([])
  const [newWorkIds, setNewWorkIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchWorks()
  }, [])

  const fetchWorks = async () => {
    try {
      console.log('🔍 [WorksFeedbackList] Fetching student works...')
      const response = await fetch('/api/works', {
        credentials: 'include',
        cache: 'no-store',
      })
      const result = await response.json()
      console.log('✅ [WorksFeedbackList] Response:', result)

      if (result.success && result.works) {
        // Filter only approved works with feedback
        const approvedWorks = result.works.filter((work: any) => {
          if (!work.tags || !Array.isArray(work.tags)) return false
          return work.tags.some((tag: string) =>
            tag.startsWith('status:') &&
            (tag.includes('completed') || tag.includes('approved'))
          )
        })

        console.log(`✅ [WorksFeedbackList] Found ${approvedWorks.length} approved works`)
        setWorks(approvedWorks)

        // Check for new feedback
        const lastSeenStr = localStorage.getItem('works_feedback_last_seen')
        const lastSeen = lastSeenStr ? new Date(lastSeenStr) : null

        if (lastSeen) {
          const newIds = new Set<string>()
          approvedWorks.forEach((work: any) => {
            // Check if there's a reviewed_at timestamp in user_tasks
            const reviewedAt = work.user_tasks?.[0]?.reviewed_at
            if (reviewedAt && new Date(reviewedAt) > lastSeen) {
              newIds.add(work.id)
            }
          })
          setNewWorkIds(newIds)
          console.log(`🆕 Found ${newIds.size} new feedback since last visit`)
        } else {
          // First time viewing - mark all as new
          const allIds = new Set(approvedWorks.map((work: any) => work.id))
          setNewWorkIds(allIds)
        }

        // Update last seen timestamp
        localStorage.setItem('works_feedback_last_seen', new Date().toISOString())
      }
    } catch (error) {
      console.error('❌ Failed to fetch works:', error)
    } finally {
      setLoading(false)
    }
  }

  // Extract feedback and points from tags
  const extractMetadata = (work: any) => {
    let feedback = ''
    let points = 0

    if (work.tags && Array.isArray(work.tags)) {
      work.tags.forEach((tag: string) => {
        if (tag.startsWith('feedback:')) {
          feedback = tag.substring('feedback:'.length)
        } else if (tag.startsWith('points:')) {
          points = parseInt(tag.substring('points:'.length), 10)
        }
      })
    }

    return { feedback, points }
  }

  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-8">
          <Spinner size="md" />
        </div>
      </Card>
    )
  }

  if (!works || works.length === 0) {
    return null // Don't show anything if there are no approved works
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Award size={20} className="text-green-600" />
        <h2 className="text-lg font-bold text-gray-900">作品反馈</h2>
      </div>

      <div className="space-y-4">
        {works.map((work: any) => {
          const isNew = newWorkIds.has(work.id)
          const { feedback, points } = extractMetadata(work)

          return (
            <div
              key={work.id}
              className={`border-l-4 ${isNew ? 'border-yellow-400 bg-yellow-50' : 'border-green-200'} pl-4 rounded-r-lg transition-colors`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{work.title}</h3>
                  {isNew && (
                    <Badge variant="warning" size="sm">
                      <Sparkles size={12} className="mr-1" />
                      新
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {points > 0 && (
                    <Badge variant="success" size="sm">
                      +{points} 积分
                    </Badge>
                  )}
                  <span className="text-xs text-gray-500">
                    {formatDate(work.created_at)}
                  </span>
                </div>
              </div>

              {feedback && (
                <div className="bg-white rounded-lg p-3 mb-2">
                  <div className="flex items-center gap-1 mb-1">
                    <MessageSquare size={14} className="text-gray-500" />
                    <span className="text-xs font-medium text-gray-600">老师反馈</span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {feedback}
                  </p>
                </div>
              )}

              {work.description && (
                <p className="text-xs text-gray-600 line-clamp-2">
                  {work.description}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
