import { Menu, Search, Bell, Plus } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useLocation, useNavigate } from 'react-router-dom';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/chat': 'Chat',
  '/memories': 'Memories',
  '/library': 'Library',
  '/sources': 'Sources',
  '/settings': 'Settings',
};

export default function TopBar() {
  const { setSidebarOpen, sidebarOpen, setSearchQuery, searchQuery } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();
  const title = PAGE_TITLES[location.pathname] || 'MemoryOS';

  return (
    <header className="h-[60px] bg-white border-b border-gray-100 flex items-center gap-3 px-4 sticky top-0 z-10">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      <h1 className="text-base font-semibold text-gray-900 hidden sm:block">{title}</h1>

      {/* Search */}
      <div className="flex-1 max-w-md mx-auto relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search memories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-surface-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-300 transition-all"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={() => navigate('/memories?new=1')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Remember</span>
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}
