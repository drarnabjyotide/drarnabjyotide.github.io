import { useNavigate } from 'react-router-dom';
import {
  BookOpen, MessageSquare, CreditCard, FileText, TrendingUp,
  Clock, Bookmark, Brain, ChevronRight, Activity, Zap,
  BookMarked, GitBranch, Stethoscope
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { formatRelativeTime, cn } from '../lib/utils';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const QUICK_ACTIONS = [
  { icon: MessageSquare, label: 'Ask a Question', desc: 'Chat with your textbooks', to: '/chat', color: 'bg-blue-500' },
  { icon: Brain, label: 'Study Session', desc: 'Auto-generate study notes', to: '/study', color: 'bg-teal-500' },
  { icon: CreditCard, label: 'Review Flashcards', desc: 'Spaced repetition study', to: '/flashcards', color: 'bg-purple-500' },
  { icon: FileText, label: 'New USG Report', desc: 'Structured report generator', to: '/reports', color: 'bg-orange-500' },
  { icon: Stethoscope, label: 'Case Assistant', desc: 'DDx and investigations', to: '/case-assistant', color: 'bg-red-500' },
  { icon: GitBranch, label: 'Build Diagram', desc: 'Concept maps & flowcharts', to: '/diagrams', color: 'bg-indigo-500' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, books, conversations, flashcards, notes, reports, darkMode } = useAppStore();

  const indexedBooks = books.filter((b) => b.status === 'indexed');
  const dueFlashcards = flashcards.filter((fc) => new Date(fc.nextReview) <= new Date()).length;
  const bookmarkedItems = conversations.filter((c) => c.bookmarked).length + notes.filter((n) => n.bookmarked).length;
  const recentConvs = conversations.slice(0, 4);

  const stats = [
    { label: 'Textbooks Indexed', value: indexedBooks.length, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950' },
    { label: 'Conversations', value: conversations.length, icon: MessageSquare, color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-950' },
    { label: 'Flashcards Due', value: dueFlashcards, icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950' },
    { label: 'Reports Generated', value: reports.length, icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950' },
    { label: 'Saved Notes', value: notes.length, icon: BookMarked, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950' },
    { label: 'Bookmarked', value: bookmarkedItems, icon: Bookmark, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950' },
  ];

  const modeColors: Record<string, string> = {
    explain: 'blue',
    study: 'teal',
    flashcards: 'purple',
    comparison: 'orange',
    exam_revision: 'red',
    diagram_builder: 'indigo',
    case_assistant: 'green',
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Welcome */}
      <div className={cn(
        'rounded-2xl p-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white relative overflow-hidden'
      )}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-blue-200" />
            <span className="text-blue-200 text-sm font-medium">Good {getTimeOfDay()}</span>
          </div>
          <h2 className="text-2xl font-bold mb-1">Welcome, {user?.name.split(' ')[0]}</h2>
          <p className="text-blue-200">{user?.specialization} • {user?.institution}</p>
          {dueFlashcards > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-lg text-sm">
              <CreditCard className="w-4 h-4" />
              <span>{dueFlashcards} flashcard{dueFlashcards !== 1 ? 's' : ''} due for review</span>
              <button onClick={() => navigate('/flashcards')} className="underline text-blue-100 hover:text-white">Review now</button>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="text-center">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2', bg)}>
              <Icon className={cn('w-5 h-5', color)} />
            </div>
            <div className={cn('text-2xl font-bold', darkMode ? 'text-slate-100' : 'text-slate-800')}>{value}</div>
            <div className="text-xs text-slate-400 mt-0.5">{label}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h3 className={cn('text-sm font-semibold mb-3 uppercase tracking-wide', darkMode ? 'text-slate-400' : 'text-slate-500')}>
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {QUICK_ACTIONS.map(({ icon: Icon, label, desc, to, color }) => (
              <button
                key={to}
                onClick={() => navigate(to)}
                className={cn(
                  'card p-4 text-left hover:shadow-md hover:border-blue-200 transition-all duration-200 group',
                )}
              >
                <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center mb-3 text-white', color)}>
                  <Icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
                </div>
                <div className={cn('text-sm font-semibold mb-0.5', darkMode ? 'text-slate-100' : 'text-slate-800')}>{label}</div>
                <div className="text-xs text-slate-400">{desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Books */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className={cn('text-sm font-semibold uppercase tracking-wide', darkMode ? 'text-slate-400' : 'text-slate-500')}>
              Library
            </h3>
            <button onClick={() => navigate('/library')} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {indexedBooks.slice(0, 4).map((book) => (
              <button
                key={book.id}
                onClick={() => navigate(`/library/${book.id}`)}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-xl border text-left hover:border-blue-200 transition-all',
                  darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-750' : 'bg-white border-slate-200 hover:bg-slate-50'
                )}
              >
                <div
                  className="w-8 h-10 rounded-md flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: book.coverColor }}
                >
                  {book.title.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <div className={cn('text-xs font-medium truncate', darkMode ? 'text-slate-200' : 'text-slate-800')}>
                    {book.title}
                  </div>
                  <div className="text-xs text-slate-400">{book.totalPages} pg • {book.edition} ed.</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Conversations */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className={cn('text-sm font-semibold uppercase tracking-wide', darkMode ? 'text-slate-400' : 'text-slate-500')}>
            Recent Chats
          </h3>
          <button onClick={() => navigate('/chat')} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
            All chats <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {recentConvs.map((conv) => (
            <button
              key={conv.id}
              onClick={() => navigate(`/chat/${conv.id}`)}
              className={cn(
                'card p-4 text-left hover:shadow-md hover:border-blue-200 transition-all group',
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <Badge variant={(modeColors[conv.mode] || 'blue') as 'blue' | 'teal' | 'purple' | 'orange' | 'red' | 'slate'}>
                  {conv.mode.replace('_', ' ')}
                </Badge>
                {conv.bookmarked && <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
              </div>
              <p className={cn('text-sm font-medium line-clamp-2 mb-2', darkMode ? 'text-slate-200' : 'text-slate-700')}>
                {conv.title}
              </p>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="w-3 h-3" />
                {formatRelativeTime(conv.updatedAt)}
              </div>
            </button>
          ))}
          <button
            onClick={() => navigate('/chat')}
            className={cn(
              'border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-blue-300 hover:bg-blue-50/50 transition-all group',
              darkMode ? 'border-slate-600 hover:border-blue-500 hover:bg-blue-950/30' : 'border-slate-200'
            )}
          >
            <MessageSquare className="w-6 h-6 text-slate-300 group-hover:text-blue-500 mb-2 transition-colors" />
            <span className="text-xs font-medium text-slate-400 group-hover:text-blue-600 transition-colors">New Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
