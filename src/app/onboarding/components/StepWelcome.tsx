'use client'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface StepWelcomeProps {
  onNext: () => void
}

export default function StepWelcome({ onNext }: StepWelcomeProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-8xl mb-6 animate-bounce">🦄</div>

      <Card className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          嗨，我是K博士！
        </h1>
        <p className="text-gray-600 mb-4 leading-relaxed">
          很高兴认识你！我是你的成长伙伴，接下来会陪着你一起探索你的超能力。
        </p>
        <p className="text-gray-600 mb-6 leading-relaxed">
          我想先了解一下你，大概需要5分钟。准备好了吗？
        </p>

        <div className="bg-green-50 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3 text-left">
            <span className="text-2xl">💡</span>
            <div className="flex-1">
              <p className="text-sm text-gray-700 font-medium mb-1">
                小提示
              </p>
              <p className="text-sm text-gray-600">
                没有标准答案，选你最真实的想法就好。你的每个回答都会帮我更了解你！
              </p>
            </div>
          </div>
        </div>

        <Button onClick={onNext} size="lg" className="w-full">
          开始探索 →
        </Button>
      </Card>
    </div>
  )
}
