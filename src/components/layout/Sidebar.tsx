import { NavLink, useNavigate } from 'react-router-dom';
import {
  Brain, LayoutDashboard, MessageSquare, Library,
  BookMarked, Database, Settings, LogOut, X, Sparkles,
  ChevronRight,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/chat', icon: MessageSquare, label: 'Chat' },
  { to: '/memories', icon: BookMarked, label: 'Memories' },
  { to: '/library', icon: Library, label: 'Library' },
  { to: '/sources', icon: Database, label: 'Sources' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen, signOut, userEmail, memories, isDemoMode } = useAppStore();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/auth');
    toast.success('Signed out');
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 h-full z-30 flex flex-col bg-white border-r border-gray-100 transition-all duration-300',
          sidebarOpen ? 'w-56' : 'w-0 lg:w-14 overflow-hidden'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-gray-100 min-h-[60px]">
          <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-sm">
            <Brain className="w-4 h-4 text-white" />
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-gray-900 text-sm tracking-tight">MemoryOS</span>
              {isDemoMode && (
                <span className="ml-1.5 text-[10px] font-medium bg-brand-100 text-brand-600 px-1.5 py-0.5 rounded-full">
                  demo
                </span>
              )}
            </div>
          )}
          {sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-gray-400 hover:text-gray-600 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-brand-600' : '')} />
                  {sidebarOpen && <span className="truncate">{label}</span>}
                  {sidebarOpen && isActive && (
                    <ChevronRight className="w-3 h-3 ml-auto text-brand-400" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-100 p-3 space-y-2">
          {sidebarOpen && (
            <div className="px-2.5 py-2 rounded-xl bg-surface-50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
                <span className="text-xs text-gray-500 truncate">{memories.length} memories</span>
              </div>
            </div>
          )}
          <div className={cn('flex items-center gap-3 px-2.5 py-2 rounded-xl', sidebarOpen && 'justify-between')}>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-700 truncate">{userEmail}</p>
              </div>
            )}
            <button
              onClick={handleSignOut}
              title="Sign out"
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
