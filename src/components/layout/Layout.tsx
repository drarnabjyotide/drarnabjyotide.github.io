import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAppStore } from '../../store/appStore';
import { cn } from '../../lib/utils';

export default function Layout() {
  const { sidebarOpen, darkMode } = useAppStore();

  return (
    <div className={cn('flex h-screen overflow-hidden', darkMode ? 'dark bg-slate-900' : 'bg-slate-50')}>
      <Sidebar />
      <div
        className={cn(
          'flex flex-col flex-1 overflow-hidden transition-all duration-300',
          sidebarOpen ? 'ml-64' : 'ml-16'
        )}
      >
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
