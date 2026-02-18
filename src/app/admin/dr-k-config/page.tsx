'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { Badge } from '@/components/ui/Badge'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'

type ConfigType = 'knowledge' | 'scenario' | 'prompt'

interface ConfigItem {
  id: string
  title: string
  content: string
  topic?: string
  scenario_name?: string
  category?: string
  is_active: boolean
  order_index: number
}

export default function DrKConfigPage() {
  const [activeTab, setActiveTab] = useState<ConfigType>('knowledge')
  const [items, setItems] = useState<ConfigItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<ConfigItem>>({})
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchItems()
  }, [activeTab])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/dr-k-config?type=${activeTab}`, {
        credentials: 'include',
      })
      const result = await response.json()
      if (result.success) {
        setItems(result.items || [])
      }
    } catch (error) {
      console.error('Failed to fetch items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setIsCreating(true)
    setEditForm({
      title: '',
      content: '',
      is_active: true,
      order_index: items.length,
    })
  }

  const handleEdit = (item: ConfigItem) => {
    setEditingId(item.id)
    setEditForm(item)
  }

  const handleSave = async () => {
    try {
      const url = isCreating
        ? `/api/admin/dr-k-config`
        : `/api/admin/dr-k-config/${editingId}`

      const response = await fetch(url, {
        method: isCreating ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          type: activeTab,
          ...editForm,
        }),
      })

      if (response.ok) {
        setEditingId(null)
        setIsCreating(false)
        setEditForm({})
        fetchItems()
      }
    } catch (error) {
      console.error('Failed to save:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除吗？')) return

    try {
      const response = await fetch(`/api/admin/dr-k-config/${id}?type=${activeTab}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        fetchItems()
      }
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setIsCreating(false)
    setEditForm({})
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">K博士配置管理</h1>
        <p className="text-gray-600">管理 K博士的知识库、场景提示词和说话风格</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === 'knowledge' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setActiveTab('knowledge')}
        >
          知识库
        </Button>
        <Button
          variant={activeTab === 'scenario' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setActiveTab('scenario')}
        >
          场景提示词
        </Button>
        <Button
          variant={activeTab === 'prompt' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setActiveTab('prompt')}
        >
          说话风格
        </Button>
      </div>

      {/* Create Button */}
      <div>
        <Button onClick={handleCreate} disabled={isCreating}>
          <Plus size={16} className="mr-1" />
          添加新{activeTab === 'knowledge' ? '知识' : activeTab === 'scenario' ? '场景' : '风格'}
        </Button>
      </div>

      {/* Create Form */}
      {isCreating && (
        <Card className="bg-yellow-50">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                标题
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={editForm.title || ''}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="输入标题"
              />
            </div>

            {activeTab === 'knowledge' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  主题分类
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={editForm.topic || ''}
                  onChange={(e) => setEditForm({ ...editForm, topic: e.target.value })}
                  placeholder="例如: learning, emotion, social"
                />
              </div>
            )}

            {activeTab === 'scenario' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  场景名称
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={editForm.scenario_name || ''}
                  onChange={(e) => setEditForm({ ...editForm, scenario_name: e.target.value })}
                  placeholder="例如: difficulty, achievement"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                内容
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={8}
                value={editForm.content || ''}
                onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                placeholder="输入详细内容..."
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save size={16} className="mr-1" />
                保存
              </Button>
              <Button variant="secondary" onClick={handleCancel}>
                <X size={16} className="mr-1" />
                取消
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Items List */}
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id}>
            {editingId === item.id ? (
              // Edit Mode
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    标题
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={editForm.title || ''}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    内容
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows={8}
                    value={editForm.content || ''}
                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSave}>
                    <Save size={16} className="mr-1" />
                    保存
                  </Button>
                  <Button variant="secondary" onClick={handleCancel}>
                    <X size={16} className="mr-1" />
                    取消
                  </Button>
                </div>
              </div>
            ) : (
              // View Mode
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                      {item.is_active ? (
                        <Badge variant="success" size="sm">启用</Badge>
                      ) : (
                        <Badge variant="secondary" size="sm">禁用</Badge>
                      )}
                      {item.topic && (
                        <Badge variant="secondary" size="sm">{item.topic}</Badge>
                      )}
                      {item.scenario_name && (
                        <Badge variant="secondary" size="sm">{item.scenario_name}</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => handleEdit(item)}>
                      <Edit size={14} className="mr-1" />
                      编辑
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 size={14} className="mr-1" />
                      删除
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                    {item.content}
                  </pre>
                </div>
              </div>
            )}
          </Card>
        ))}

        {items.length === 0 && (
          <Card className="text-center py-12">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-gray-600">暂无配置，点击上方按钮添加</p>
          </Card>
        )}
      </div>
    </div>
  )
}
