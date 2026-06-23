import { useState, useEffect } from 'react';
import {
  CreditCard, Brain, RotateCcw, Check, X, Minus, Plus,
  Filter, Search, Tag, BookOpen, ChevronRight, Calendar,
  Trash2, Star
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { cn, daysUntil, formatRelativeTime } from '../lib/utils';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import type { Flashcard } from '../types';

type ReviewState = 'browse' | 'reviewing' | 'complete';

export default function FlashcardCenter() {
  const { flashcards, updateFlashcardReview, deleteFlashcard, darkMode } = useAppStore();
  const [state, setState] = useState<ReviewState>('browse');
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [dueOnly, setDueOnly] = useState(false);
  const [reviewCards, setReviewCards] = useState<Flashcard[]>([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionResults, setSessionResults] = useState<Record<string, number>>({});

  const categories = ['All', ...Array.from(new Set(flashcards.map((fc) => fc.category)))];
  const dueCards = flashcards.filter((fc) => new Date(fc.nextReview) <= new Date());

  const filtered = flashcards.filter((fc) => {
    const matchSearch = !search || fc.front.toLowerCase().includes(search.toLowerCase()) || fc.back.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === 'All' || fc.category === filterCategory;
    const matchDiff = filterDifficulty === 'All' || fc.difficulty === filterDifficulty;
    const matchDue = !dueOnly || new Date(fc.nextReview) <= new Date();
    return matchSearch && matchCat && matchDiff && matchDue;
  });

  function startReview() {
    const cards = dueCards.length > 0 ? dueCards : flashcards.slice(0, 10);
    setReviewCards(cards);
    setReviewIndex(0);
    setFlipped(false);
    setSessionResults({});
    setState('reviewing');
  }

  function rate(quality: number) {
    const card = reviewCards[reviewIndex];
    updateFlashcardReview(card.id, quality);
    setSessionResults((prev) => ({ ...prev, [card.id]: quality }));
    if (reviewIndex + 1 >= reviewCards.length) {
      setState('complete');
    } else {
      setReviewIndex((i) => i + 1);
      setFlipped(false);
    }
  }

  if (state === 'reviewing') {
    const card = reviewCards[reviewIndex];
    const progress = ((reviewIndex) / reviewCards.length) * 100;

    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
            <span>Card {reviewIndex + 1} of {reviewCards.length}</span>
            <button onClick={() => setState('browse')} className="text-slate-400 hover:text-slate-600">End session</button>
          </div>
          <div className={cn('h-2 rounded-full overflow-hidden', darkMode ? 'bg-slate-700' : 'bg-slate-200')}>
            <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Card */}
        <div
          onClick={() => setFlipped(!flipped)}
          className={cn(
            'card min-h-[300px] cursor-pointer flex flex-col justify-between p-8 transition-all duration-300 mb-4',
            flipped && (darkMode ? 'bg-blue-950 border-blue-800' : 'bg-blue-50 border-blue-300'),
          )}
        >
          <div className="text-center flex-1 flex flex-col items-center justify-center">
            <div className={cn('text-xs font-semibold uppercase tracking-wider mb-4', flipped ? 'text-blue-500' : 'text-slate-400')}>
              {flipped ? 'Answer' : 'Question'}
            </div>
            <p className={cn('text-lg font-medium leading-relaxed text-center', darkMode ? 'text-slate-100' : 'text-slate-800')}>
              {flipped ? card.back : card.front}
            </p>
            {!flipped && card.hint && (
              <p className="mt-4 text-sm text-slate-400 italic">Hint: {card.hint}</p>
            )}
          </div>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="slate" size="sm">{card.category}</Badge>
            {card.bookTitle && <Badge variant="blue" size="sm">{card.bookTitle.split(' ').slice(0, 2).join(' ')}</Badge>}
            <Badge variant={card.difficulty === 'easy' ? 'green' : card.difficulty === 'hard' ? 'red' : 'orange'} size="sm">
              {card.difficulty}
            </Badge>
          </div>
        </div>

        {!flipped ? (
          <button
            onClick={() => setFlipped(true)}
            className="w-full btn-primary justify-center text-base py-3"
          >
            <RotateCcw className="w-4 h-4" /> Reveal Answer
          </button>
        ) : (
          <div className="space-y-3">
            <p className={cn('text-center text-sm', darkMode ? 'text-slate-400' : 'text-slate-500')}>How well did you know this?</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Didn't know", quality: 0, color: 'bg-red-500 hover:bg-red-600', icon: X },
                { label: 'Hard', quality: 2, color: 'bg-orange-500 hover:bg-orange-600', icon: Minus },
                { label: 'Good', quality: 4, color: 'bg-blue-500 hover:bg-blue-600', icon: Check },
                { label: 'Easy', quality: 5, color: 'bg-green-500 hover:bg-green-600', icon: Star },
              ].map(({ label, quality, color, icon: Icon }) => (
                <button
                  key={quality}
                  onClick={() => rate(quality)}
                  className={cn('py-3 rounded-xl text-white flex flex-col items-center gap-1 transition-all font-medium text-sm', color)}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (state === 'complete') {
    const knew = Object.values(sessionResults).filter((q) => q >= 3).length;
    return (
      <div className="max-w-md mx-auto text-center py-16 animate-fade-in">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className={cn('text-2xl font-bold mb-2', darkMode ? 'text-white' : 'text-slate-800')}>Session Complete!</h2>
        <p className="text-slate-400 mb-6">
          {knew} / {reviewCards.length} cards answered correctly
        </p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{knew}</div>
            <div className="text-xs text-slate-400">Correct</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500">{reviewCards.length - knew}</div>
            <div className="text-xs text-slate-400">Need Review</div>
          </Card>
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={startReview} className="btn-primary">Study Again</button>
          <button onClick={() => setState('browse')} className="btn-secondary">Browse Cards</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Stats + Start */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <div className={cn('text-3xl font-bold', darkMode ? 'text-white' : 'text-slate-800')}>{dueCards.length}</div>
              <div className="text-sm text-slate-400">Cards due for review</div>
            </div>
            <button onClick={startReview} className="btn-primary">
              <Brain className="w-4 h-4" />
              {dueCards.length > 0 ? `Review ${dueCards.length}` : 'Practice All'}
            </button>
          </div>
        </Card>
        {[
          { label: 'Total Cards', value: flashcards.length, icon: CreditCard, color: 'text-blue-600' },
          { label: 'Categories', value: categories.length - 1, icon: Tag, color: 'text-teal-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="p-4">
            <Icon className={cn('w-5 h-5 mb-2', color)} />
            <div className={cn('text-2xl font-bold', darkMode ? 'text-white' : 'text-slate-800')}>{value}</div>
            <div className="text-xs text-slate-400">{label}</div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className={cn('flex flex-wrap gap-3 p-4 rounded-xl border', darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200')}>
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input className="input pl-9" placeholder="Search flashcards…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input w-auto" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className="input w-auto" value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)}>
          {['All', 'easy', 'medium', 'hard'].map((d) => <option key={d}>{d}</option>)}
        </select>
        <button
          onClick={() => setDueOnly(!dueOnly)}
          className={cn('btn text-sm', dueOnly ? 'btn-primary' : 'btn-secondary')}
        >
          <Calendar className="w-4 h-4" /> Due Only
        </button>
      </div>

      {/* Card list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((fc) => {
          const due = new Date(fc.nextReview) <= new Date();
          const daysLeft = daysUntil(fc.nextReview);
          return (
            <Card key={fc.id} className={cn(due && 'ring-1 ring-blue-500')}>
              <div className="p-4">
                <div className="flex items-start gap-2 mb-3">
                  <Badge variant={fc.difficulty === 'easy' ? 'green' : fc.difficulty === 'hard' ? 'red' : 'orange'}>
                    {fc.difficulty}
                  </Badge>
                  {due && <Badge variant="blue">Due now</Badge>}
                  {!due && daysLeft > 0 && <Badge variant="slate">In {daysLeft}d</Badge>}
                  <button onClick={() => deleteFlashcard(fc.id)} className="ml-auto text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className={cn('text-sm font-medium mb-3 line-clamp-3', darkMode ? 'text-slate-200' : 'text-slate-800')}>
                  {fc.front}
                </p>
                <p className={cn('text-xs text-slate-400 line-clamp-2 mb-3')}>
                  {fc.back.replace(/[*#]/g, '').slice(0, 100)}…
                </p>
                <div className="flex items-center gap-2">
                  {fc.bookTitle && (
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <BookOpen className="w-3 h-3" />
                      <span className="truncate max-w-[100px]">{fc.bookTitle.split(' ').slice(0, 2).join(' ')}</span>
                    </div>
                  )}
                  {fc.pageNumber && <span className="text-xs text-slate-400">p.{fc.pageNumber}</span>}
                  {fc.lastReviewed && (
                    <span className="ml-auto text-xs text-slate-400">{formatRelativeTime(fc.lastReviewed)}</span>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-16">
            <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No flashcards found</p>
            <p className="text-sm text-slate-400">Generate them from Chat or Study Center</p>
          </div>
        )}
      </div>
    </div>
  );
}
