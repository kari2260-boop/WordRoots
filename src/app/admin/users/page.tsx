'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { calculateLevel } from '@/lib/utils'
import Link from 'next/link'
import { Eye } from 'lucide-react'

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/stats', {
        credentials: 'include',
      })
      const result = await response.json()
      if (result.profiles) {
        setUsers(result.profiles)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">用户管理</h1>
          <p className="text-gray-600">查看和管理所有学生用户</p>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">用户</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">基本信息</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">等级</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">积分</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">注册时间</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody>
              {users && users.length > 0 ? (
                (users as any[]).map((user: any) => {
                  const levelInfo = calculateLevel(user.total_points)
                  return (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{user.nickname || '未命名'}</div>
                        <div className="text-sm text-gray-500">{user.id.slice(0, 8)}...</div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {user.age}岁 · {user.grade}年级 · {
                          user.gender === 'male' ? '男' :
                          user.gender === 'female' ? '女' : '其他'
                        }
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary">
                          {levelInfo.emoji} Lv.{levelInfo.level}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {user.total_points}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString('zh-CN')}
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          <Eye size={16} />
                          查看
                        </Link>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    暂无用户
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
