'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { OnboardingData } from '@/types'

interface StepCompleteProps {
  data: OnboardingData
}

export default function StepComplete({ data }: StepCompleteProps) {
  const router = useRouter()

  const handleStart = () => {
    router.push('/dashboard')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-8xl mb-6 animate-bounce">🎉</div>

      <Card className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          太棒了，我们准备好啦！
        </h1>

        <div className="space-y-4 my-6">
          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-start gap-3 text-left">
              <span className="text-2xl">🦄</span>
              <div className="flex-1">
                <p className="text-sm text-gray-700 leading-relaxed">
                  我已经大概了解你了！接下来，我会根据你的特点推荐适合你的任务和挑战。
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4">
            <div className="flex items-start gap-3 text-left">
              <span className="text-2xl">💡</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  你的成长伙伴已就位
                </p>
                <p className="text-sm text-gray-600">
                  K博士随时在这里陪你聊天、解答问题、给你鼓励。记住，每个人的成长节奏都不一样，慢慢来就好！
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-2xl mb-2">📚</div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                探索任务
              </p>
              <p className="text-xs text-gray-600">
                完成任务获得积分和经验
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-2xl mb-2">🎨</div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                记录作品
              </p>
              <p className="text-xs text-gray-600">
                保存你的成长足迹
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-2xl mb-2">💬</div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                对话K博士
              </p>
              <p className="text-xs text-gray-600">
                随时来找我聊天
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-2xl mb-2">🏆</div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                解锁导师
              </p>
              <p className="text-xs text-gray-600">
                达成条件召唤更多导师
              </p>
            </div>
          </div>
        </div>

        <Button onClick={handleStart} size="lg" className="w-full">
          开始探索 →
        </Button>
      </Card>
    </div>
  )
}
