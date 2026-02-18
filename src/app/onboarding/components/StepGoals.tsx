'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Textarea } from '@/components/ui/Textarea'
import { ONBOARDING_QUESTIONS } from '@/lib/assessment'
import type { OnboardingData } from '@/types'

interface StepGoalsProps {
  data: OnboardingData['goals']
  onUpdate: (data: OnboardingData['goals']) => void
  onNext: () => void
  onBack: () => void
}

export default function StepGoals({ data, onUpdate, onNext, onBack }: StepGoalsProps) {
  const [formData, setFormData] = useState({
    goals_dream: data.goals_dream || '',
    goals_learn: data.goals_learn || '',
    goals_this_year: data.goals_this_year || '',
    goals_support: data.goals_support || '',
    goals_obstacles: data.goals_obstacles || '',
  })

  const questions = ONBOARDING_QUESTIONS.filter(q => q.step === 'goals')

  const emojiMap: Record<string, string> = {
    'goals_dream': '🌟',
    'goals_learn': '📚',
    'goals_this_year': '🎯',
    'goals_support': '🤝',
    'goals_obstacles': '🧗',
  }

  useEffect(() => {
    onUpdate(formData)
  }, [formData])

  const isValid = formData.goals_dream || formData.goals_learn || formData.goals_this_year

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          你的目标和梦想
        </h2>
        <p className="text-gray-600">
          最后，聊聊你想成为什么样的人
        </p>
      </div>

      <div className="space-y-6">
        {questions.map((question, index) => (
          <Card key={question.id}>
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl">{emojiMap[question.id] || '💭'}</span>
              <div className="flex-1">
                <label className="block text-base font-medium text-gray-900 mb-1">
                  {question.question}
                </label>
                <p className="text-sm text-gray-600">
                  {question.description}
                </p>
              </div>
            </div>
            <Textarea
              placeholder={`分享你的想法...${index < 3 ? '' : '（选填）'}`}
              rows={3}
              value={formData[question.id as keyof typeof formData] as string}
              onChange={(e) => setFormData({
                ...formData,
                [question.id]: e.target.value
              })}
            />
          </Card>
        ))}

        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💫</span>
            <div className="flex-1">
              <p className="text-sm text-gray-700 font-medium mb-1">
                你做得很棒！
              </p>
              <p className="text-sm text-gray-600">
                准备好了就可以完成入门测评，开始你的成长之旅啦！
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={onBack} className="flex-1">
            上一步
          </Button>
          <Button onClick={onNext} disabled={!isValid} className="flex-1">
            完成测评
          </Button>
        </div>
      </div>
    </div>
  )
}
