import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  isSafetyWarning?: boolean;
}

export const ChatMessage = ({ role, content, timestamp, isSafetyWarning }: ChatMessageProps) => {
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('flex gap-3 mb-4', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        {isUser ? (
          <>
            <AvatarFallback className="bg-primary">
              <User className="w-5 h-5 text-primary-foreground" />
            </AvatarFallback>
          </>
        ) : (
          <>
            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500">
              <Bot className="w-5 h-5 text-white" />
            </AvatarFallback>
          </>
        )}
      </Avatar>

      <div className={cn('flex flex-col max-w-[75%]', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-3 shadow-sm',
            isUser
              ? 'bg-primary text-primary-foreground rounded-tr-sm'
              : isSafetyWarning
              ? 'bg-amber-500/10 border border-amber-500/20 text-foreground rounded-tl-sm'
              : 'bg-muted text-foreground rounded-tl-sm'
          )}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
        </div>
        {timestamp && (
          <span className="text-xs text-muted-foreground mt-1">
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </motion.div>
  );
};
