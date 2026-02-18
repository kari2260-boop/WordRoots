'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { Eye, Sparkles } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export function ObservationsList() {
  const [loading, setLoading] = useState(true)
  const [observations, setObservations] = useState<any[]>([])
  const [newObservationIds, setNewObservationIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchObservations()
    // Load last seen timestamp from localStorage
    const lastSeenStr = localStorage.getItem('observations_last_seen')
    const lastSeen = lastSeenStr ? new Date(lastSeenStr) : null

    if (lastSeen) {
      console.log('📅 Last seen observations at:', lastSeen)
    }
  }, [])

  const fetchObservations = async () => {
    try {
      console.log('🔍 [ObservationsList] Fetching student observations...')
      const response = await fetch('/api/observations', {
        credentials: 'include',
        cache: 'no-store',
      })
      const result = await response.json()
      console.log('✅ [ObservationsList] Response:', result)
      console.log('✅ [ObservationsList] Observations array:', result.observations)

      if (result.success && result.observations) {
        console.log(`✅ [ObservationsList] Setting ${result.observations.length} observations`)
        setObservations(result.observations)

        // Check for new observations
        const lastSeenStr = localStorage.getItem('observations_last_seen')
        const lastSeen = lastSeenStr ? new Date(lastSeenStr) : null

        console.log('📅 [ObservationsList] Last seen:', lastSeen)

        if (lastSeen) {
          const newIds = new Set<string>()
          result.observations.forEach((obs: any) => {
            const createdAt = new Date(obs.created_at)
            if (createdAt > lastSeen) {
              newIds.add(obs.id)
            }
          })
          setNewObservationIds(newIds)
          console.log(`🆕 Found ${newIds.size} new observations since last visit`)
        } else {
          // First time viewing - mark all as new
          const allIds = new Set<string>(result.observations.map((obs: any) => obs.id))
          setNewObservationIds(allIds)
          console.log(`🆕 First time viewing, marking all ${allIds.size} as new`)
        }

        // Update last seen timestamp when component mounts
        localStorage.setItem('observations_last_seen', new Date().toISOString())
      } else {
        console.log('❌ [ObservationsList] No observations in response or not successful')
      }
    } catch (error) {
      console.error('❌ Failed to fetch observations:', error)
    } finally {
      setLoading(false)
    }
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

  if (!observations || observations.length === 0) {
    return null // Don't show anything if there are no observations
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Eye size={20} className="text-purple-600" />
        <h2 className="text-lg font-bold text-gray-900">老师的观察</h2>
      </div>

      <div className="space-y-4">
        {observations.map((obs: any) => {
          const isNew = newObservationIds.has(obs.id)
          return (
            <div
              key={obs.id}
              className={`border-l-4 ${isNew ? 'border-yellow-400 bg-yellow-50' : 'border-purple-200'} pl-4 rounded-r-lg transition-colors`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{obs.title}</h3>
                  {isNew && (
                    <Badge variant="warning" size="sm">
                      <Sparkles size={12} className="mr-1" />
                      新
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {obs.category && (
                    <Badge variant="secondary" size="sm">{obs.category}</Badge>
                  )}
                  <span className="text-xs text-gray-500">
                    {formatDate(obs.created_at)}
                  </span>
                </div>
              </div>

            <p className="text-sm text-gray-700 whitespace-pre-line mb-2">
              {obs.observation}
            </p>

            {obs.suggested_tags && obs.suggested_tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {obs.suggested_tags.map((tag: string, i: number) => (
                  <Badge key={i} variant="secondary" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          )
        })}
      </div>
    </Card>
  )
}
