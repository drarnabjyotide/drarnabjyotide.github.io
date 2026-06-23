import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/appStore';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import Chat from './pages/Chat';
import StudyCenter from './pages/StudyCenter';
import FlashcardCenter from './pages/FlashcardCenter';
import DiagramCenter from './pages/DiagramCenter';
import ReportGenerator from './pages/ReportGenerator';
import CaseAssistant from './pages/CaseAssistant';
import ObsidianExport from './pages/ObsidianExport';
import Settings from './pages/Settings';
import AdminUpload from './pages/AdminUpload';
import BookViewer from './pages/BookViewer';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const { darkMode } = useAppStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="library" element={<Library />} />
          <Route path="library/:bookId" element={<BookViewer />} />
          <Route path="chat" element={<Chat />} />
          <Route path="chat/:conversationId" element={<Chat />} />
          <Route path="study" element={<StudyCenter />} />
          <Route path="flashcards" element={<FlashcardCenter />} />
          <Route path="diagrams" element={<DiagramCenter />} />
          <Route path="reports" element={<ReportGenerator />} />
          <Route path="case-assistant" element={<CaseAssistant />} />
          <Route path="export" element={<ObsidianExport />} />
          <Route path="settings" element={<Settings />} />
          <Route path="admin" element={<AdminUpload />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
