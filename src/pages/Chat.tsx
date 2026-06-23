import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Trash2, Sparkles, MessageSquare, RotateCcw } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import ChatBubble from '../components/chat/ChatBubble';
import { ChatSkeletonMessage } from '../components/ui/Skeleton';
import { queryMemories } from '../lib/mockAI';
import type { ChatMessage } from '../types';
import toast from 'react-hot-toast';

const SUGGESTIONS = [
  'What were my biggest accomplishments in 2024?',
  'What is my deep work philosophy?',
  'What are my health and sleep goals?',
  'Tell me about my Japan trip',
  'What books have I read?',
  'What are my product goals for 2025?',
];

export default function ChatPage() {
  const { chatMessages, addChatMessage, updateChatMessage, clearChat, memories, addConversation } = useAppStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const location = useLocation();

  useEffect(() => {
    const prefill = (location.state as { prefill?: string })?.prefill;
    if (prefill) {
      setInput(prefill);
      inputRef.current?.focus();
    }
  }, [location.state]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const send = async (question: string) => {
    if (!question.trim() || isLoading) return;
    setInput('');
    setIsLoading(true);

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).slice(2),
      role: 'user',
      content: question.trim(),
      timestamp: new Date(),
    };
    addChatMessage(userMsg);

    // Placeholder AI message
    const aiId = Math.random().toString(36).slice(2);
    const aiPlaceholder: ChatMessage = {
      id: aiId,
      role: 'assistant',
      content: '',
      citations: [],
      timestamp: new Date(),
      isStreaming: true,
    };
    addChatMessage(aiPlaceholder);

    try {
      const { answer, citations } = await queryMemories(question, memories, chatMessages);

      // Stream word-by-word
      const words = answer.split(' ');
      let current = '';
      for (const word of words) {
        current += (current ? ' ' : '') + word;
        updateChatMessage(aiId, { content: current, citations, isStreaming: true });
        await new Promise((r) => setTimeout(r, 25 + Math.random() * 35));
      }
      updateChatMessage(aiId, { content: answer, citations, isStreaming: false });

      addConversation({ question: question.trim(), answer, citations });
    } catch {
      updateChatMessage(aiId, {
        content: 'Something went wrong. Please try again.',
        isStreaming: false,
      });
      toast.error('Failed to get response');
    }

    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const handleClear = () => {
    clearChat();
    toast.success('Chat cleared');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-60px-48px)] max-h-[800px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Memory Chat</h2>
          <p className="text-xs text-gray-500">Answers are always sourced from your memories</p>
        </div>
        {chatMessages.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-gray-200"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-6 pb-4 min-h-0">
        {chatMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center mb-4 shadow-sm">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-2">Ask your memories</h3>
            <p className="text-sm text-gray-500 max-w-sm mb-8">
              Every answer is sourced from your own documents and memories. No guessing — just citations.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-left text-xs text-gray-600 bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5 inline mr-2 text-gray-400" />
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {chatMessages.map((m) => (
              <ChatBubble key={m.id} message={m} />
            ))}
            {isLoading && !chatMessages.at(-1)?.isStreaming && <ChatSkeletonMessage />}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 mt-3">
        <div className="flex gap-3 items-end bg-white border border-gray-200 rounded-2xl p-3 shadow-card focus-within:ring-2 focus-within:ring-brand-200 focus-within:border-brand-300 transition-all">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your memories..."
            rows={1}
            className="flex-1 resize-none text-sm text-gray-800 placeholder-gray-400 focus:outline-none leading-relaxed max-h-32 overflow-y-auto"
            style={{ minHeight: '24px' }}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || isLoading}
            className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center flex-shrink-0 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
        <p className="text-[11px] text-gray-400 text-center mt-2">
          Shift+Enter for new line · answers cite your memories only
        </p>
      </div>
    </div>
  );
}
