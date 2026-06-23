import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import AuthPage from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ChatPage from './pages/Chat';
import MemoriesPage from './pages/Memories';
import LibraryPage from './pages/Library';
import SourcesPage from './pages/Sources';
import SettingsPage from './pages/Settings';
import { useAppStore } from './store/useAppStore';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#1f2937',
            border: '1px solid #f1f3f7',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          },
          success: { iconTheme: { primary: '#3b6ef0', secondary: '#fff' } },
        }}
      />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="memories" element={<MemoriesPage />} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="sources" element={<SourcesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
