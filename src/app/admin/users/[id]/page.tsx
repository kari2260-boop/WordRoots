'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { formatDate } from '@/lib/utils'
import { getLevelInfo } from '@/lib/constants'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'

export default function AdminUserDetailPage() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetchUserDetail()
  }, [])

  const fetchUserDetail = async () => {
    try {
      const response = await fetch(`/api/admin/users/${params.id}`, {
        credentials: 'include',
      })
      const result = await response.json()
      if (result.success) {
        setData(result)
      }
    } catch (error) {
      console.error('Failed to fetch user detail:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!data || !data.profile) {
    return <div className="p-8">用户不存在</div>
  }

  const profile = data.profile
  const levelInfo = getLevelInfo(profile.total_points || 0)

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/users"
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {profile.nickname || '未命名'}
            </h1>
            <p className="text-gray-600">用户详细画像</p>
          </div>
        </div>
        <Link href={`/admin/observations/new?user_id=${params.id}`}>
          <Button>
            <Plus size={18} className="mr-2" />
            添加观察记录
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Basic Info */}
        <Card>
          <h3 className="text-sm font-medium text-gray-700 mb-4">基本信息</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">年龄</span>
              <span className="font-medium text-gray-900">{profile.age}岁</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">年级</span>
              <span className="font-medium text-gray-900">{profile.grade}年级</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">性别</span>
              <span className="font-medium text-gray-900">
                {profile.gender === 'male' ? '男' : profile.gender === 'female' ? '女' : '其他'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">注册时间</span>
              <span className="font-medium text-gray-900">
                {formatDate(profile.created_at)}
              </span>
            </div>
          </div>
        </Card>

        {/* Level & Points */}
        <Card>
          <h3 className="text-sm font-medium text-gray-700 mb-4">等级积分</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{levelInfo.current.emoji}</span>
              <div>
                <div className="text-lg font-bold text-gray-900">Lv.{levelInfo.current.level}</div>
                <div className="text-sm text-gray-600">{levelInfo.current.name}</div>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {profile.total_points || 0}
              </div>
              <div className="text-sm text-gray-600">总积分</div>
            </div>
          </div>
        </Card>

        {/* Activity */}
        <Card>
          <h3 className="text-sm font-medium text-gray-700 mb-4">活跃度</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">完成任务</span>
              <span className="font-bold text-gray-900">{data.completedTasks?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">提交作品</span>
              <span className="font-bold text-gray-900">{data.works?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">观察记录</span>
              <span className="font-bold text-gray-900">{data.observations?.length || 0}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Interests */}
      {data.interests && data.interests.length > 0 && (
        <Card>
          <h3 className="text-lg font-bold text-gray-900 mb-4">兴趣爱好</h3>
          <div className="flex flex-wrap gap-2">
            {data.interests.map((interest: any, index: number) => (
              <Badge key={index} variant="secondary">
                {interest.category}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Strengths */}
      {data.strengths && data.strengths.length > 0 && (
        <Card>
          <h3 className="text-lg font-bold text-gray-900 mb-4">优势特长</h3>
          <div className="flex flex-wrap gap-2">
            {data.strengths.map((strength: any, index: number) => (
              <Badge key={index} variant="success">
                {strength.tag_name}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Personality Traits */}
      {data.traits && data.traits.length > 0 && (
        <Card>
          <h3 className="text-lg font-bold text-gray-900 mb-4">性格特点</h3>
          <div className="flex flex-wrap gap-2">
            {data.traits.map((trait: any, index: number) => (
              <Badge key={index} variant="secondary">
                {trait.trait_name}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Goals */}
      {data.goals && data.goals.length > 0 && (
        <Card>
          <h3 className="text-lg font-bold text-gray-900 mb-4">目标梦想</h3>
          <div className="space-y-3">
            {data.goals.map((goal: any, index: number) => {
              const typeMap: Record<string, { label: string; emoji: string }> = {
                dream: { label: '梦想', emoji: '🌟' },
                skill: { label: '想学', emoji: '📚' },
                short_term: { label: '今年', emoji: '🎯' },
              }
              const info = typeMap[goal.type] || { label: goal.type, emoji: '💭' }
              return (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-xl">{info.emoji}</span>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">{info.label}</div>
                    <p className="text-sm text-gray-700">{goal.content}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Observations */}
      <Card>
        <h3 className="text-lg font-bold text-gray-900 mb-4">观察记录</h3>
        {data.observations && data.observations.length > 0 ? (
          <div className="space-y-4">
            {data.observations.map((obs: any) => (
              <div key={obs.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{obs.title}</h4>
                  {obs.category && <Badge variant="secondary">{obs.category}</Badge>}
                </div>
                <p className="text-sm text-gray-700 mb-2">{obs.observation}</p>
                {obs.suggested_tags && obs.suggested_tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {obs.suggested_tags.map((tag: string, i: number) => (
                      <Badge key={i} variant="secondary" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-2">
                  {formatDate(obs.created_at)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">暂无观察记录</p>
        )}
      </Card>
    </div>
  )
}
