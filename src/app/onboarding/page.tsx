'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ONBOARDING_STEPS } from '@/lib/assessment'
import { OnboardingProgress } from '@/components/OnboardingProgress'
import StepWelcome from './components/StepWelcome'
import StepBasicInfo from './components/StepBasicInfo'
import StepInterests from './components/StepInterests'
import StepStrengths from './components/StepStrengths'
import StepPersonality from './components/StepPersonality'
import StepGoals from './components/StepGoals'
import StepComplete from './components/StepComplete'
import type { OnboardingData } from '@/types'

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<OnboardingData>({
    basicInfo: {},
    interests: {},
    strengths: {},
    personality: {},
    goals: {},
  })

  // Ensure profile exists (backup if trigger didn't run)
  React.useEffect(() => {
    const ensureProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Check if profile exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      // If profile doesn't exist, create it
      if (!profile) {
        await (supabase as any).from('profiles').insert({
          id: user.id,
          role: 'student',
          nickname: user.user_metadata?.nickname || null,
          age: user.user_metadata?.age || null,
        })
      }
    }
    ensureProfile()
  }, [])

  const steps = [
    <StepWelcome key="welcome" onNext={() => setCurrentStep(1)} />,
    <StepBasicInfo
      key="basic"
      data={data.basicInfo}
      onUpdate={(basicInfo) => setData({ ...data, basicInfo })}
      onNext={() => setCurrentStep(2)}
      onBack={() => setCurrentStep(0)}
    />,
    <StepInterests
      key="interests"
      data={data.interests}
      onUpdate={(interests) => setData({ ...data, interests })}
      onNext={() => setCurrentStep(3)}
      onBack={() => setCurrentStep(1)}
    />,
    <StepStrengths
      key="strengths"
      data={data.strengths}
      onUpdate={(strengths) => setData({ ...data, strengths })}
      onNext={() => setCurrentStep(4)}
      onBack={() => setCurrentStep(2)}
    />,
    <StepPersonality
      key="personality"
      data={data.personality}
      onUpdate={(personality) => setData({ ...data, personality })}
      onNext={() => setCurrentStep(5)}
      onBack={() => setCurrentStep(3)}
    />,
    <StepGoals
      key="goals"
      data={data.goals}
      onUpdate={(goals) => setData({ ...data, goals })}
      onNext={() => handleComplete()}
      onBack={() => setCurrentStep(4)}
    />,
    <StepComplete key="complete" data={data} />,
  ]

  const handleComplete = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Submit onboarding data via API
      const response = await fetch('/api/onboarding/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ data }),
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        throw new Error(result.error || '保存失败')
      }

      console.log('✅ Onboarding data saved successfully')
      setCurrentStep(6)
    } catch (error) {
      console.error('Failed to save onboarding data:', error)
      alert('保存测评数据失败，请重试或联系管理员')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-8 pb-safe">
        {currentStep > 0 && currentStep < 6 && (
          <OnboardingProgress
            currentStep={currentStep}
            totalSteps={6}
            stepLabels={ONBOARDING_STEPS.slice(1, 7).map(s => s.title)}
          />
        )}
        {steps[currentStep]}
      </div>
    </div>
  )
}
