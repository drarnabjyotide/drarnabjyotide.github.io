import { useState } from 'react';
import { RotateCcw, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import type { Flashcard } from '../../types';
import { cn } from '../../lib/utils';
import { useAppStore } from '../../store/appStore';

interface FlashcardPreviewProps {
  flashcards: Flashcard[];
  darkMode?: boolean;
}

export default function FlashcardPreview({ flashcards, darkMode }: FlashcardPreviewProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const addFlashcard = useAppStore((s) => s.addFlashcard);
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const card = flashcards[index];
  if (!card) return null;

  function prev() { setIndex((i) => (i - 1 + flashcards.length) % flashcards.length); setFlipped(false); }
  function next() { setIndex((i) => (i + 1) % flashcards.length); setFlipped(false); }

  function saveCard() {
    addFlashcard(card);
    setSaved((s) => new Set(s).add(card.id));
  }

  return (
    <div className={cn('rounded-xl border p-4', darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200')}>
      <div className="flex items-center justify-between mb-3">
        <span className={cn('text-xs font-medium', darkMode ? 'text-slate-400' : 'text-slate-500')}>
          Flashcard {index + 1} / {flashcards.length}
        </span>
        <div className="flex gap-1">
          <button onClick={prev} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={next} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        onClick={() => setFlipped(!flipped)}
        className={cn(
          'rounded-lg p-4 min-h-[100px] cursor-pointer transition-all border',
          flipped
            ? darkMode ? 'bg-blue-950 border-blue-800' : 'bg-blue-50 border-blue-200'
            : darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'
        )}
      >
        <div className="text-xs font-medium text-slate-400 mb-2">{flipped ? 'ANSWER' : 'QUESTION'}</div>
        <p className={cn('text-sm', darkMode ? 'text-slate-200' : 'text-slate-700')}>
          {flipped ? card.back : card.front}
        </p>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <button onClick={() => setFlipped(!flipped)} className="btn-ghost text-xs gap-1">
          <RotateCcw className="w-3 h-3" /> Flip
        </button>
        <button
          onClick={saveCard}
          disabled={saved.has(card.id)}
          className={cn('ml-auto btn text-xs', saved.has(card.id) ? 'bg-green-100 text-green-700' : 'btn-primary')}
        >
          <Plus className="w-3 h-3" />
          {saved.has(card.id) ? 'Saved!' : 'Save Card'}
        </button>
      </div>
    </div>
  );
}
