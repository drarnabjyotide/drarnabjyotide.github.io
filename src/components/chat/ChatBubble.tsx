import { Bot, User, FileText } from 'lucide-react';
import type { ChatMessage } from '../../types';
import { ConfidenceBadge } from '../ui/Badge';
import { cn } from '../../lib/utils';

interface Props {
  message: ChatMessage;
}

export default function ChatBubble({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-3', isUser && 'flex-row-reverse')}>
      {/* Avatar */}
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
          isUser
            ? 'bg-brand-600 text-white'
            : 'bg-gradient-to-br from-brand-500 to-purple-600 text-white'
        )}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      <div className={cn('flex flex-col gap-2 max-w-[75%]', isUser && 'items-end')}>
        {/* Bubble */}
        <div
          className={cn(
            'px-4 py-3 rounded-2xl text-sm leading-relaxed',
            isUser
              ? 'bg-brand-600 text-white rounded-tr-sm'
              : 'bg-white border border-gray-100 text-gray-800 shadow-card rounded-tl-sm'
          )}
        >
          {message.isStreaming ? (
            <span>
              {message.content}
              <span className="inline-block w-1.5 h-4 bg-brand-400 ml-0.5 animate-pulse rounded-sm" />
            </span>
          ) : (
            <span className="whitespace-pre-wrap">{message.content}</span>
          )}
        </div>

        {/* Citations */}
        {!isUser && message.citations && message.citations.length > 0 && !message.isStreaming && (
          <div className="space-y-2 w-full">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide pl-1">
              Sources
            </p>
            {message.citations.map((c, i) => (
              <div
                key={i}
                className="bg-surface-50 border border-gray-100 rounded-xl px-3 py-2.5 flex items-start gap-2.5"
              >
                <FileText className="w-3.5 h-3.5 text-brand-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-gray-700 truncate">
                      {c.memory_title}
                    </span>
                    <ConfidenceBadge score={c.confidence} />
                  </div>
                  {c.source_title && (
                    <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                      From: {c.source_title}
                    </p>
                  )}
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed italic">
                    "{c.excerpt}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <span className="text-[10px] text-gray-400 px-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}
