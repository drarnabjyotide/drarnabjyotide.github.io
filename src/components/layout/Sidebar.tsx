import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, MessageSquare, Brain, CreditCard,
  GitBranch, FileText, Stethoscope, Download, Settings,
  Upload, ChevronLeft, ChevronRight, Activity, BookMarked, Zap
} from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { cn } from '../../lib/utils';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/library', icon: BookOpen, label: 'Library' },
  { to: '/chat', icon: MessageSquare, label: 'Chat' },
  { to: '/study', icon: Brain, label: 'Study Center' },
  { to: '/flashcards', icon: CreditCard, label: 'Flashcards' },
  { to: '/diagrams', icon: GitBranch, label: 'Diagrams' },
  { to: '/reports', icon: FileText, label: 'USG Reports' },
  { to: '/case-assistant', icon: Stethoscope, label: 'Case Assistant' },
  { to: '/export', icon: Download, label: 'Obsidian Export' },
];

const BOTTOM_ITEMS = [
  { to: '/admin', icon: Upload, label: 'Admin Upload', adminOnly: true },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen, user, darkMode } = useAppStore();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-16',
        darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200',
        'border-r'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center h-16 px-4 border-b',
        darkMode ? 'border-slate-700' : 'border-slate-200'
      )}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Activity className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <div className={cn('text-sm font-bold truncate', darkMode ? 'text-white' : 'text-slate-900')}>
                MedMother AI
              </div>
              <div className="text-xs text-blue-600 font-medium">RAG Medical Platform</div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const active = location.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                'sidebar-item',
                active && 'active',
                !sidebarOpen && 'justify-center px-2'
              )}
              title={!sidebarOpen ? label : undefined}
            >
              <Icon className="w-4.5 h-4.5 flex-shrink-0 w-[18px] h-[18px]" />
              {sidebarOpen && <span className="truncate">{label}</span>}
              {sidebarOpen && to === '/chat' && (
                <span className="ml-auto bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded-full font-medium">
                  AI
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom items */}
      <div className={cn('border-t py-2 px-2 space-y-1', darkMode ? 'border-slate-700' : 'border-slate-200')}>
        {BOTTOM_ITEMS.map(({ to, icon: Icon, label, adminOnly }) => {
          if (adminOnly && user?.role !== 'admin') return null;
          const active = location.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                'sidebar-item',
                active && 'active',
                !sidebarOpen && 'justify-center px-2'
              )}
              title={!sidebarOpen ? label : undefined}
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" />
              {sidebarOpen && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </div>

      {/* User avatar */}
      {user && (
        <div className={cn(
          'border-t p-3',
          darkMode ? 'border-slate-700' : 'border-slate-200'
        )}>
          <div className={cn('flex items-center gap-3', !sidebarOpen && 'justify-center')}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <div className={cn('text-xs font-medium truncate', darkMode ? 'text-slate-200' : 'text-slate-800')}>
                  {user.name}
                </div>
                <div className="text-xs text-slate-400 capitalize truncate">{user.role}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={cn(
          'absolute -right-3 top-20 w-6 h-6 rounded-full border flex items-center justify-center z-50 transition-colors',
          darkMode
            ? 'bg-slate-800 border-slate-600 text-slate-400 hover:text-slate-200'
            : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700 shadow-sm'
        )}
      >
        {sidebarOpen ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      </button>
    </aside>
  );
}
