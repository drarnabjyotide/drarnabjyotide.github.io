import { BookOpen, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { Citation } from '../../types';
import { cn } from '../../lib/utils';

interface CitationCardProps {
  citation: Citation;
  index: number;
  darkMode?: boolean;
}

export default function CitationCard({ citation, index, darkMode }: CitationCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={cn(
      'rounded-lg border text-sm overflow-hidden',
      darkMode ? 'bg-blue-950/40 border-blue-800/60' : 'bg-blue-50 border-blue-200'
    )}>
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          'w-full flex items-start gap-3 p-3 text-left hover:bg-blue-100/50 dark:hover:bg-blue-900/30 transition-colors',
        )}
      >
        <div className="w-5 h-5 rounded bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className={cn('font-medium text-xs', darkMode ? 'text-blue-300' : 'text-blue-800')}>
            {citation.bookTitle}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            {citation.chapterTitle} • p.{citation.pageNumber}
          </div>
          <div className={cn(
            'text-xs mt-1 flex items-center gap-1',
            darkMode ? 'text-blue-400' : 'text-blue-600'
          )}>
            <div
              className="h-1.5 rounded-full bg-blue-400"
              style={{ width: `${Math.round(citation.relevanceScore * 100)}%`, maxWidth: '60px' }}
            />
            <span>{Math.round(citation.relevanceScore * 100)}% relevant</span>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
        )}
      </button>
      {expanded && (
        <div className={cn(
          'px-4 pb-3 pt-0 border-t text-xs italic leading-relaxed',
          darkMode ? 'border-blue-800/60 text-slate-300' : 'border-blue-200 text-slate-600'
        )}>
          &ldquo;{citation.passage}&rdquo;
        </div>
      )}
    </div>
  );
}
