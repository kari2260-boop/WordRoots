'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import type { OnboardingData } from '@/types'

interface StepBasicInfoProps {
  data: OnboardingData['basicInfo']
  onUpdate: (data: OnboardingData['basicInfo']) => void
  onNext: () => void
  onBack: () => void
}

const GRADES = [
  { value: '4', label: '四年级' },
  { value: '5', label: '五年级' },
  { value: '6', label: '六年级' },
  { value: '7', label: '初一' },
  { value: '8', label: '初二' },
  { value: '9', label: '初三' },
]

const GENDERS = [
  { value: 'male', label: '男生', emoji: '👦' },
  { value: 'female', label: '女生', emoji: '👧' },
  { value: 'other', label: '其他', emoji: '🙂' },
]

export default function StepBasicInfo({ data, onUpdate, onNext, onBack }: StepBasicInfoProps) {
  const [formData, setFormData] = useState({
    age: data.age || '',
    grade: data.grade || '',
    gender: data.gender || '',
  })

  const handleNext = () => {
    if (!formData.age || !formData.grade || !formData.gender) {
      return
    }
    onUpdate({
      age: typeof formData.age === 'string' ? parseInt(formData.age) : formData.age,
      grade: formData.grade,
      gender: formData.gender,
    })
    onNext()
  }

  const isValid = formData.age && formData.grade && formData.gender

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          先介绍一下自己吧
        </h2>
        <p className="text-gray-600">
          让我更了解你的基本情况
        </p>
      </div>

      <Card>
        <div className="space-y-6">
          <Input
            type="number"
            label="你今年多大了？"
            placeholder="输入年龄"
            min={8}
            max={18}
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              现在读几年级？
            </label>
            <div className="grid grid-cols-3 gap-2">
              {GRADES.map((grade) => (
                <button
                  key={grade.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, grade: grade.value })}
                  className={`
                    px-4 py-3 rounded-xl text-sm font-medium transition-all
                    ${formData.grade === grade.value
                      ? 'bg-green-500 text-white ring-2 ring-green-500 ring-offset-2'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {grade.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              性别
            </label>
            <div className="grid grid-cols-3 gap-3">
              {GENDERS.map((gender) => (
                <button
                  key={gender.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: gender.value })}
                  className={`
                    px-4 py-4 rounded-xl text-sm font-medium transition-all
                    flex flex-col items-center gap-2
                    ${formData.gender === gender.value
                      ? 'bg-green-500 text-white ring-2 ring-green-500 ring-offset-2'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  <span className="text-2xl">{gender.emoji}</span>
                  <span>{gender.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <Button variant="secondary" onClick={onBack} className="flex-1">
            上一步
          </Button>
          <Button onClick={handleNext} disabled={!isValid} className="flex-1">
            下一步
          </Button>
        </div>
      </Card>
    </div>
  )
}
