import { cn } from '@/lib/utils'

interface OnboardingProgressProps {
  currentStep: number
  totalSteps: number
  stepLabels: string[]
}

export function OnboardingProgress({ currentStep, totalSteps, stepLabels }: OnboardingProgressProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">
          步骤 {currentStep} / {totalSteps}
        </span>
        <span className="text-sm font-medium text-green-600">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full gradient-green transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex items-center justify-between mt-4">
        {stepLabels.map((label, index) => (
          <div
            key={index}
            className={cn(
              'flex flex-col items-center',
              index < currentStep ? 'text-green-600' : index === currentStep ? 'text-gray-900' : 'text-gray-400'
            )}
          >
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-1',
                index < currentStep
                  ? 'bg-green-500 text-white'
                  : index === currentStep
                  ? 'bg-green-100 text-green-600 ring-2 ring-green-500'
                  : 'bg-gray-200 text-gray-500'
              )}
            >
              {index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
