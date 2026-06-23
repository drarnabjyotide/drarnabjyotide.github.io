import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, BookOpen, CheckCircle2, Clock, AlertCircle,
  ChevronRight, MoreHorizontal, Layers, Tag
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { cn, formatDate } from '../lib/utils';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const SUBJECTS = ['All', 'Obstetrics', 'Gynecology', 'Radiology', 'Anatomy', 'Internal Medicine'];

export default function Library() {
  const navigate = useNavigate();
  const { books, selectedBookIds, setSelectedBookIds, darkMode } = useAppStore();
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('All');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filtered = books.filter((b) => {
    const matchSearch = !search ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.authors.some((a) => a.toLowerCase().includes(search.toLowerCase())) ||
      b.tags.some((t) => t.includes(search.toLowerCase()));
    const matchSubject = subject === 'All' || b.subject === subject;
    return matchSearch && matchSubject;
  });

  function toggleBook(id: string) {
    setSelectedBookIds(
      selectedBookIds.includes(id)
        ? selectedBookIds.filter((i) => i !== id)
        : [...selectedBookIds, id]
    );
  }

  const statusIcon = { indexed: CheckCircle2, processing: Clock, failed: AlertCircle };
  const statusColor = { indexed: 'text-green-500', processing: 'text-orange-400', failed: 'text-red-500' };
  const statusLabel = { indexed: 'Indexed', processing: 'Processing…', failed: 'Failed' };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <h2 className={cn('text-xl font-bold', darkMode ? 'text-white' : 'text-slate-800')}>
            Medical Library
          </h2>
          <p className="text-sm text-slate-400">
            {books.filter((b) => b.status === 'indexed').length} books indexed • {selectedBookIds.length} selected for chat
          </p>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => navigate('/admin')}
            className="btn-primary text-sm"
          >
            <BookOpen className="w-4 h-4" /> Upload Book
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className={cn(
        'flex flex-col sm:flex-row gap-3 p-4 rounded-xl border',
        darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      )}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author, topic…"
            className="input pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {SUBJECTS.map((s) => (
            <button
              key={s}
              onClick={() => setSubject(s)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                subject === s
                  ? 'bg-blue-600 text-white'
                  : darkMode
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Selection status */}
      {selectedBookIds.length > 0 && (
        <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl">
          <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span className="text-sm text-blue-700 dark:text-blue-300">
            <strong>{selectedBookIds.length} book{selectedBookIds.length !== 1 ? 's' : ''}</strong> selected for AI chat context
          </span>
          <button onClick={() => navigate('/chat')} className="ml-auto btn-primary text-xs py-1 px-3">
            Open Chat
          </button>
        </div>
      )}

      {/* Books grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((book) => {
          const StatusIcon = statusIcon[book.status];
          const isSelected = selectedBookIds.includes(book.id);

          return (
            <div
              key={book.id}
              className={cn(
                'card overflow-hidden hover:shadow-md transition-all duration-200',
                isSelected && 'ring-2 ring-blue-500'
              )}
            >
              {/* Cover */}
              <div
                className="h-32 flex items-center justify-center relative"
                style={{ backgroundColor: book.coverColor + '20' }}
              >
                <div
                  className="w-16 h-20 rounded-md shadow-md flex flex-col items-center justify-center text-white text-lg font-bold"
                  style={{ backgroundColor: book.coverColor }}
                >
                  {book.title.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                </div>
                <button
                  onClick={() => toggleBook(book.id)}
                  className={cn(
                    'absolute top-2 right-2 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all',
                    isSelected
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-slate-200 text-transparent hover:border-blue-400'
                  )}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start gap-2 mb-1">
                  <h3 className={cn(
                    'text-sm font-semibold leading-tight flex-1',
                    darkMode ? 'text-slate-100' : 'text-slate-800'
                  )}>
                    {book.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mb-2">
                  {book.authors.slice(0, 2).join(', ')}{book.authors.length > 2 ? ' et al.' : ''}
                </p>
                <p className="text-xs text-slate-400 mb-3">
                  {book.edition} ed. • {book.year} • {book.publisher}
                </p>

                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="blue" size="sm">{book.subject}</Badge>
                  <div className={cn('flex items-center gap-1 text-xs', statusColor[book.status])}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusLabel[book.status]}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                  <span><Layers className="w-3 h-3 inline mr-0.5" />{book.totalPages}p</span>
                  <span>{book.totalChapters}ch</span>
                  <span>{book.totalFigures} figs</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/library/${book.id}`)}
                    className="flex-1 btn-secondary text-xs py-1.5"
                  >
                    View <ChevronRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => { if (book.status === 'indexed') toggleBook(book.id); }}
                    disabled={book.status !== 'indexed'}
                    className={cn(
                      'flex-1 text-xs py-1.5',
                      isSelected ? 'btn-primary' : 'btn-secondary',
                      'btn'
                    )}
                  >
                    {isSelected ? 'Selected' : 'Select'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No books found</p>
          <p className="text-sm text-slate-400">Try a different search or upload a new textbook</p>
        </div>
      )}
    </div>
  );
}
