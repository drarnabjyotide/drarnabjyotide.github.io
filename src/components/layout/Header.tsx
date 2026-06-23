import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, Sun, Moon, LogOut, User, Zap } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { cn } from '../../lib/utils';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/library': 'Medical Library',
  '/chat': 'AI Chat',
  '/study': 'Study Center',
  '/flashcards': 'Flashcard Center',
  '/diagrams': 'Diagram Builder',
  '/reports': 'USG Report Generator',
  '/case-assistant': 'Case Assistant',
  '/export': 'Obsidian Export',
  '/settings': 'Settings',
  '/admin': 'Admin — Book Upload',
};

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, darkMode, toggleDarkMode, logout, globalSearchQuery, setGlobalSearchQuery } = useAppStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const title = Object.entries(PAGE_TITLES).find(([k]) => location.pathname.startsWith(k))?.[1] ?? 'MedMother AI';

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header
      className={cn(
        'h-16 flex items-center gap-4 px-6 border-b flex-shrink-0',
        darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
      )}
    >
      <h1 className={cn('text-lg font-semibold', darkMode ? 'text-slate-100' : 'text-slate-800')}>
        {title}
      </h1>

      {/* Search */}
      <div className="flex-1 max-w-md ml-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search textbooks, notes, figures…"
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            className={cn(
              'w-full pl-9 pr-4 py-2 rounded-lg text-sm border transition-all',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              darkMode
                ? 'bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
            )}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Model badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-full">
          <Zap className="w-3 h-3 text-blue-600" />
          <span className="text-xs font-medium text-blue-700 dark:text-blue-300">RAG Active</span>
        </div>

        {/* Dark mode */}
        <button
          onClick={toggleDarkMode}
          className={cn(
            'p-2 rounded-lg transition-colors',
            darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
          )}
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <button
          className={cn(
            'relative p-2 rounded-lg transition-colors',
            darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
          )}
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {user?.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <span className={cn('text-sm font-medium hidden sm:block', darkMode ? 'text-slate-200' : 'text-slate-700')}>
              {user?.name.split(' ')[0]}
            </span>
          </button>

          {showUserMenu && (
            <div
              className={cn(
                'absolute right-0 top-full mt-1 w-56 rounded-xl border shadow-lg py-1 z-50',
                darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              )}
            >
              <div className={cn('px-4 py-3 border-b', darkMode ? 'border-slate-700' : 'border-slate-100')}>
                <div className={cn('text-sm font-medium', darkMode ? 'text-slate-200' : 'text-slate-800')}>{user?.name}</div>
                <div className="text-xs text-slate-400">{user?.email}</div>
                <div className="text-xs text-blue-600 capitalize mt-0.5">{user?.specialization}</div>
              </div>
              <button
                onClick={() => { navigate('/settings'); setShowUserMenu(false); }}
                className={cn(
                  'w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors text-left',
                  darkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-50'
                )}
              >
                <User className="w-4 h-4" /> Profile & Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
