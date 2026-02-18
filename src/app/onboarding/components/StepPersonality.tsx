'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Textarea } from '@/components/ui/Textarea'
import { ONBOARDING_QUESTIONS } from '@/lib/assessment'
import type { OnboardingData } from '@/types'
import { cn } from '@/lib/utils'

interface StepPersonalityProps {
  data: OnboardingData['personality']
  onUpdate: (data: OnboardingData['personality']) => void
  onNext: () => void
  onBack: () => void
}

export default function StepPersonality({ data, onUpdate, onNext, onBack }: StepPersonalityProps) {
  const [formData, setFormData] = useState({
    personality_traits: data.personality_traits || [],
    personality_energy: data.personality_energy || '',
    personality_learning: data.personality_learning || '',
    personality_ideal_day: data.personality_ideal_day || '',
    personality_challenges: data.personality_challenges || '',
  })

  const questions = ONBOARDING_QUESTIONS.filter(q => q.step === 'personality')
  const traitsQuestion = questions.find(q => q.id === 'personality_traits')
  const maxSelections = traitsQuestion?.maxSelections || 5

  useEffect(() => {
    onUpdate(formData)
  }, [formData])

  const handleTraitToggle = (value: string) => {
    const current = formData.personality_traits as string[]
    if (current.includes(value)) {
      setFormData({
        ...formData,
        personality_traits: current.filter(v => v !== value)
      })
    } else if (current.length < maxSelections) {
      setFormData({
        ...formData,
        personality_traits: [...current, value]
      })
    }
  }

  const handleSingleChoice = (questionId: string, value: string) => {
    setFormData({
      ...formData,
      [questionId]: value
    })
  }

  const isValid = formData.personality_traits.length > 0

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          你的性格特点
        </h2>
        <p className="text-gray-600">
          更深入地了解真实的你
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <label className="block text-base font-medium text-gray-900 mb-3">
            {traitsQuestion?.question}
            <span className="text-sm text-gray-500 ml-2">
              (最多选{maxSelections}个)
            </span>
          </label>
          <p className="text-sm text-gray-600 mb-4">
            {traitsQuestion?.description}
          </p>

          <div className="grid grid-cols-2 gap-2">
            {traitsQuestion?.options?.map((option) => {
              const isSelected = (formData.personality_traits as string[]).includes(option.value)
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleTraitToggle(option.value)}
                  className={cn(
                    'px-4 py-3 rounded-xl text-sm font-medium transition-all text-left',
                    'flex items-center gap-2',
                    isSelected
                      ? 'bg-green-500 text-white ring-2 ring-green-500 ring-offset-2'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  <span className="text-xl">{option.emoji}</span>
                  <span>{option.label}</span>
                </button>
              )
            })}
          </div>

          <div className="text-sm text-gray-500 mt-3 text-center">
            已选择 {formData.personality_traits.length} / {maxSelections}
          </div>
        </Card>

        {questions.slice(1, 3).map((question) => (
          <Card key={question.id}>
            <label className="block text-base font-medium text-gray-900 mb-3">
              {question.question}
            </label>
            <p className="text-sm text-gray-600 mb-4">
              {question.description}
            </p>

            <div className="space-y-2">
              {question.options?.map((option) => {
                const isSelected = formData[question.id as keyof typeof formData] === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSingleChoice(question.id, option.value)}
                    className={cn(
                      'w-full px-4 py-3 rounded-xl text-sm font-medium transition-all text-left',
                      'flex items-center gap-3',
                      isSelected
                        ? 'bg-green-500 text-white ring-2 ring-green-500 ring-offset-2'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    <span className="text-xl">{option.emoji}</span>
                    <span>{option.label}</span>
                  </button>
                )
              })}
            </div>
          </Card>
        ))}

        {questions.slice(3).map((question) => (
          <Card key={question.id}>
            <Textarea
              label={question.question}
              placeholder={question.description}
              rows={3}
              value={formData[question.id as keyof typeof formData] as string}
              onChange={(e) => setFormData({
                ...formData,
                [question.id]: e.target.value
              })}
            />
          </Card>
        ))}

        <div className="flex gap-3">
          <Button variant="secondary" onClick={onBack} className="flex-1">
            上一步
          </Button>
          <Button onClick={onNext} disabled={!isValid} className="flex-1">
            下一步
          </Button>
        </div>
      </div>
    </div>
  )
}
