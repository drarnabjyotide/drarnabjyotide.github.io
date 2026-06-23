import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Layers, Image, ChevronDown, ChevronRight, MessageSquare, Brain, Tag } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { SAMPLE_CHAPTERS, SAMPLE_FIGURES } from '../data/sampleData';
import { cn } from '../lib/utils';
import Badge from '../components/ui/Badge';
import { useState } from 'react';

export default function BookViewer() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { books, setSelectedBookIds, selectedBookIds, darkMode } = useAppStore();
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set(['c1']));
  const [activeTab, setActiveTab] = useState<'chapters' | 'figures' | 'info'>('chapters');

  const book = books.find((b) => b.id === bookId);
  if (!book) return <div className="p-8 text-slate-500">Book not found</div>;

  const chapters = SAMPLE_CHAPTERS.filter((c) => c.bookId === book.id);
  const figures = SAMPLE_FIGURES.filter((f) => f.bookId === book.id);
  const isSelected = selectedBookIds.includes(book.id);

  function toggleChapter(id: string) {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function selectForChat() {
    if (!isSelected) setSelectedBookIds([...selectedBookIds, book.id]);
    navigate('/chat');
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      {/* Back + Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/library')}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className={cn('text-xl font-bold truncate', darkMode ? 'text-white' : 'text-slate-800')}>
            {book.title}
          </h2>
          <p className="text-sm text-slate-400">
            {book.authors.slice(0, 2).join(', ')} • {book.edition} edition • {book.year}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={selectForChat} className="btn-primary text-sm">
            <MessageSquare className="w-4 h-4" /> Chat with book
          </button>
          <button onClick={() => navigate('/study')} className="btn-secondary text-sm">
            <Brain className="w-4 h-4" /> Study
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: cover + stats */}
        <div className="space-y-4">
          <div className={cn(
            'card p-6 text-center',
          )}>
            <div
              className="w-32 h-40 rounded-xl shadow-lg flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4"
              style={{ backgroundColor: book.coverColor }}
            >
              {book.title.split(' ').map((w) => w[0]).join('').slice(0, 2)}
            </div>
            <div className={cn('font-bold mb-1', darkMode ? 'text-white' : 'text-slate-800')}>{book.title}</div>
            <div className="text-sm text-slate-400 mb-3">{book.publisher}</div>
            <Badge variant="blue">{book.subject}</Badge>
          </div>

          <div className="card p-4 space-y-3">
            {[
              { label: 'Total Pages', value: book.totalPages, icon: Layers },
              { label: 'Chapters', value: book.totalChapters, icon: BookOpen },
              { label: 'Figures', value: book.totalFigures, icon: Image },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Icon className="w-4 h-4" /> {label}
                </div>
                <span className={cn('text-sm font-semibold', darkMode ? 'text-slate-200' : 'text-slate-700')}>{value}</span>
              </div>
            ))}
          </div>

          <div className="card p-4">
            <div className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">Tags</div>
            <div className="flex flex-wrap gap-1">
              {book.tags.map((tag) => (
                <Badge key={tag} variant="slate" size="sm">
                  <Tag className="w-2.5 h-2.5 inline mr-1" />{tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Right: content tabs */}
        <div className="lg:col-span-2 space-y-4">
          <div className={cn(
            'flex gap-1 p-1 rounded-xl border',
            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
          )}>
            {(['chapters', 'figures', 'info'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all capitalize',
                  activeTab === tab
                    ? 'bg-white shadow-sm text-blue-700 dark:bg-slate-700 dark:text-blue-300'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'chapters' && (
            <div className="card overflow-hidden">
              {chapters.length > 0 ? chapters.map((ch) => (
                <div key={ch.id} className={cn('border-b last:border-b-0', darkMode ? 'border-slate-700' : 'border-slate-100')}>
                  <button
                    onClick={() => toggleChapter(ch.id)}
                    className={cn(
                      'w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors',
                    )}
                  >
                    <div className={cn(
                      'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0',
                      'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                    )}>
                      {ch.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={cn('text-sm font-medium', darkMode ? 'text-slate-200' : 'text-slate-700')}>{ch.title}</div>
                      <div className="text-xs text-slate-400">p.{ch.startPage}–{ch.endPage}</div>
                    </div>
                    {expandedChapters.has(ch.id) ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                  </button>
                  {expandedChapters.has(ch.id) && (
                    <div className={cn('pl-14 pb-3 space-y-1', darkMode ? 'bg-slate-750' : 'bg-slate-50/50')}>
                      {ch.subchapters.map((sc) => (
                        <div key={sc.id} className="flex items-center gap-2 py-1 px-4">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          <span className="text-xs text-slate-500">{sc.title}</span>
                          <span className="ml-auto text-xs text-slate-400">p.{sc.startPage}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )) : (
                <div className="p-8 text-center text-slate-400">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Chapter index not loaded for this book</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'figures' && (
            <div className="space-y-3">
              {figures.length > 0 ? figures.map((fig) => (
                <div key={fig.id} className="card p-4 flex gap-4">
                  <div className={cn(
                    'w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0',
                    'bg-slate-100 dark:bg-slate-700'
                  )}>
                    <Image className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={cn('text-sm font-medium mb-1', darkMode ? 'text-slate-200' : 'text-slate-700')}>{fig.caption}</div>
                    <div className="text-xs text-slate-400 mb-2">{fig.description}</div>
                    <div className="flex gap-2">
                      <Badge variant="slate" size="sm">{fig.type}</Badge>
                      <Badge variant="blue" size="sm">p.{fig.pageNumber}</Badge>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="card p-8 text-center text-slate-400">
                  <Image className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Figure index coming soon</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'info' && (
            <div className="card p-6 space-y-4">
              <div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Description</div>
                <p className={cn('text-sm', darkMode ? 'text-slate-300' : 'text-slate-700')}>{book.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['Publisher', book.publisher],
                  ['Edition', book.edition],
                  ['Year', book.year],
                  ['Subject', book.subject],
                  ['Uploaded', new Date(book.uploadedAt).toLocaleDateString()],
                  ['Status', book.status],
                ].map(([k, v]) => (
                  <div key={k as string}>
                    <div className="text-xs text-slate-400 mb-0.5">{k as string}</div>
                    <div className={cn('text-sm font-medium capitalize', darkMode ? 'text-slate-200' : 'text-slate-700')}>{v as string}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
