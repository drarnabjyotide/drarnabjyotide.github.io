import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';

export default function Layout() {
  const { sidebarOpen } = useAppStore();

  return (
    <div className="min-h-screen bg-surface-50 flex">
      <Sidebar />
      <div
        className={cn(
          'flex-1 flex flex-col min-w-0 transition-all duration-300',
          sidebarOpen ? 'lg:ml-56' : 'lg:ml-14'
        )}
      >
        <TopBar />
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
