import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number // 0-100
  color?: string
  height?: 'sm' | 'md'
  className?: string
}

export function Progress({
  value,
  color = 'bg-green-500',
  height = 'md',
  className,
}: ProgressProps) {
  const heights = {
    sm: 'h-1',
    md: 'h-2',
  }

  return (
    <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', heights[height], className)}>
      <div
        className={cn('h-full progress-bar rounded-full transition-all duration-500', color)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
