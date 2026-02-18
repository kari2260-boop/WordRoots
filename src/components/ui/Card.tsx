import { cn } from '@/lib/utils'
import type { CardProps } from '@/types'

export function Card({
  children,
  className,
  padding = 'md',
  onClick,
}: CardProps) {
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-2xl card-shadow',
        paddings[padding],
        onClick && 'cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
    >
      {children}
    </div>
  )
}
