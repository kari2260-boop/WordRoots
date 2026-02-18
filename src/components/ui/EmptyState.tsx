import { Button } from './Button'

interface EmptyStateProps {
  emoji: string
  message: string
  action?: string
  onAction?: () => void
}

export function EmptyState({ emoji, message, action, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="text-6xl mb-4">{emoji}</div>
      <p className="text-gray-600 mb-6 max-w-sm">{message}</p>
      {action && onAction && (
        <Button onClick={onAction}>{action}</Button>
      )}
    </div>
  )
}
