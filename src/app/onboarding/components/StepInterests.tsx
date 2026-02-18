'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Textarea } from '@/components/ui/Textarea'
import { ONBOARDING_QUESTIONS } from '@/lib/assessment'
import type { OnboardingData } from '@/types'
import { cn } from '@/lib/utils'

interface StepInterestsProps {
  data: OnboardingData['interests']
  onUpdate: (data: OnboardingData['interests']) => void
  onNext: () => void
  onBack: () => void
}

export default function StepInterests({ data, onUpdate, onNext, onBack }: StepInterestsProps) {
  const [formData, setFormData] = useState({
    interest_categories: data.interest_categories || [],
    interest_specific: data.interest_specific || '',
    interest_proud: data.interest_proud || '',
    interest_curiosity: data.interest_curiosity || '',
  })

  const questions = ONBOARDING_QUESTIONS.filter(q => q.step === 'interests')
  const categoriesQuestion = questions.find(q => q.id === 'interest_categories')
  const maxSelections = categoriesQuestion?.maxSelections || 5

  useEffect(() => {
    onUpdate(formData)
  }, [formData])

  const handleCategoryToggle = (value: string) => {
    const current = formData.interest_categories as string[]
    if (current.includes(value)) {
      setFormData({
        ...formData,
        interest_categories: current.filter(v => v !== value)
      })
    } else if (current.length < maxSelections) {
      setFormData({
        ...formData,
        interest_categories: [...current, value]
      })
    }
  }

  const isValid = formData.interest_categories.length > 0

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          你的兴趣爱好
        </h2>
        <p className="text-gray-600">
          让我了解你喜欢做什么
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <label className="block text-base font-medium text-gray-900 mb-3">
            {categoriesQuestion?.question}
            <span className="text-sm text-gray-500 ml-2">
              (最多选{maxSelections}个)
            </span>
          </label>
          <p className="text-sm text-gray-600 mb-4">
            {categoriesQuestion?.description}
          </p>

          <div className="grid grid-cols-2 gap-2">
            {categoriesQuestion?.options?.map((option) => {
              const isSelected = (formData.interest_categories as string[]).includes(option.value)
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleCategoryToggle(option.value)}
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
            已选择 {formData.interest_categories.length} / {maxSelections}
          </div>
        </Card>

        {questions.slice(1).map((question) => (
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
