'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { formatDate } from '@/lib/utils'
import { ClipboardList } from 'lucide-react'

export default function AdminAssessmentsPage() {
  const [loading, setLoading] = useState(true)
  const [assessments, setAssessments] = useState<any[]>([])

  useEffect(() => {
    fetchAssessments()
  }, [])

  const fetchAssessments = async () => {
    try {
      const response = await fetch('/api/admin/stats', {
        credentials: 'include',
      })
      const result = await response.json()
      console.log('Assessments API response:', result)
      if (result.assessments) {
        console.log('Assessments data:', result.assessments)
        setAssessments(result.assessments)
      } else {
        console.log('No assessments in response')
      }
    } catch (error) {
      console.error('Failed to fetch assessments:', error)
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

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">测评数据</h1>
        <p className="text-gray-600">查看用户入门测评结果</p>
      </div>

      {assessments && assessments.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {(assessments as any[]).map((assessment: any) => {
            const data = assessment.data
            return (
              <Card key={assessment.id}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <ClipboardList size={20} className="text-blue-600" />
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {(assessment.profiles as any)?.nickname || '未命名用户'}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" size="sm">
                          {assessment.type}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatDate(assessment.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Basic Info */}
                  {data.basicInfo && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">基本信息</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        {data.basicInfo.age && <p>年龄：{data.basicInfo.age}岁</p>}
                        {data.basicInfo.grade && <p>年级：{data.basicInfo.grade}年级</p>}
                        {data.basicInfo.gender && (
                          <p>性别：{
                            data.basicInfo.gender === 'male' ? '男' :
                            data.basicInfo.gender === 'female' ? '女' : '其他'
                          }</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Interests */}
                  {data.interests?.interest_categories && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">兴趣爱好</h4>
                      <div className="flex flex-wrap gap-1">
                        {data.interests.interest_categories.map((cat: string, i: number) => (
                          <Badge key={i} variant="secondary" size="sm">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Strengths */}
                  {data.strengths?.strength_self && (
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">优势特长</h4>
                      <div className="flex flex-wrap gap-1">
                        {data.strengths.strength_self.map((str: string, i: number) => (
                          <Badge key={i} variant="secondary" size="sm">
                            {str}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Personality */}
                  {data.personality?.personality_traits && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">性格特点</h4>
                      <div className="flex flex-wrap gap-1">
                        {data.personality.personality_traits.map((trait: string, i: number) => (
                          <Badge key={i} variant="secondary" size="sm">
                            {trait}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Goals */}
                {data.goals && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">目标梦想</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      {data.goals.goals_dream && (
                        <p><span className="font-medium">梦想：</span>{data.goals.goals_dream}</p>
                      )}
                      {data.goals.goals_learn && (
                        <p><span className="font-medium">想学：</span>{data.goals.goals_learn}</p>
                      )}
                      {data.goals.goals_this_year && (
                        <p><span className="font-medium">今年：</span>{data.goals.goals_this_year}</p>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="text-center py-12">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-gray-600">暂无测评数据</p>
        </Card>
      )}
    </div>
  )
}
