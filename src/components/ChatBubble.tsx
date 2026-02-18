import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/types'

interface ChatBubbleProps {
  message: ChatMessage
  isUser: boolean
}

export function ChatBubble({ message, isUser }: ChatBubbleProps) {
  return (
    <div className={cn('flex items-start gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <div className="flex-shrink-0 text-2xl">
        {isUser ? '👤' : '🦄'}
      </div>
      <div
        className={cn(
          'chat-bubble',
          isUser ? 'chat-bubble-user' : 'chat-bubble-assistant'
        )}
      >
        {message.content}
      </div>
    </div>
  )
}
