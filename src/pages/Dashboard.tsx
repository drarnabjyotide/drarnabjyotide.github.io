import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Search, TrendingUp, Pin, Clock, Upload,
  MessageSquare, BookMarked, Zap, ChevronRight,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import MemoryCard from '../components/memories/MemoryCard';
import MemoryEditor from '../components/memories/MemoryEditor';
import OnboardingModal from '../components/ui/OnboardingModal';
import { formatRelativeTime, getSourceIcon } from '../lib/utils';
import { MemoryCardSkeleton } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { memories, sources, conversations, userEmail } = useAppStore();
  const [editorOpen, setEditorOpen] = useState(false);
  const [loading] = useState(false);
  const navigate = useNavigate();

  const firstName = userEmail.split('@')[0].split('.')[0];
  const pinnedMemories = memories.filter((m) => m.pinned);
  const recentMemories = [...memories].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ).slice(0, 3);
  const recentSources = [...sources].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ).slice(0, 4);

  const stats = [
    { label: 'Memories', value: memories.length, icon: BookMarked, color: 'text-brand-600 bg-brand-50' },
    { label: 'Sources', value: sources.length, icon: Upload, color: 'text-purple-600 bg-purple-50' },
    { label: 'Conversations', value: conversations.length, icon: MessageSquare, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'This week', value: memories.filter(m => {
      const d = new Date(m.created_at);
      const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
      return d > weekAgo;
    }).length, icon: TrendingUp, color: 'text-amber-600 bg-amber-50' },
  ];

  return (
    <div className="space-y-8">
      <OnboardingModal />
      <MemoryEditor open={editorOpen} onClose={() => setEditorOpen(false)} />

      {/* Welcome */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {firstName} 👋
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {memories.length} memories stored · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => setEditorOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Remember this</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-4 shadow-card border border-gray-50">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            icon: MessageSquare, label: 'Ask your memories', desc: 'Chat with your knowledge base',
            color: 'from-brand-500 to-brand-700', onClick: () => navigate('/chat'),
          },
          {
            icon: Upload, label: 'Import a file', desc: 'PDF, TXT, MD, DOCX supported',
            color: 'from-purple-500 to-purple-700', onClick: () => navigate('/sources'),
          },
          {
            icon: Zap, label: 'Quick memory', desc: 'Capture a thought right now',
            color: 'from-amber-500 to-amber-600', onClick: () => setEditorOpen(true),
          },
        ].map(({ icon: Icon, label, desc, color, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-card border border-gray-50 hover:shadow-card-hover transition-all text-left group"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{label}</p>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-gray-500 transition-colors" />
          </button>
        ))}
      </div>

      {/* Pinned memories */}
      {pinnedMemories.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Pin className="w-4 h-4 text-brand-500" />
            <h3 className="text-sm font-semibold text-gray-700">Pinned</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pinnedMemories.map((m) => (
              <MemoryCard key={m.id} memory={m} onEdit={() => {}} compact />
            ))}
          </div>
        </section>
      )}

      {/* Two-column: timeline + recent imports */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-700">Recent memories</h3>
            </div>
            <button
              onClick={() => navigate('/memories')}
              className="text-xs text-brand-500 hover:text-brand-700 font-medium"
            >
              View all
            </button>
          </div>
          <div className="space-y-3">
            {loading
              ? [1, 2, 3].map((k) => <MemoryCardSkeleton key={k} />)
              : recentMemories.map((m) => (
                  <MemoryCard key={m.id} memory={m} compact />
                ))}
          </div>
        </div>

        {/* Recent imports */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-700">Recent imports</h3>
            </div>
            <button
              onClick={() => navigate('/library')}
              className="text-xs text-brand-500 hover:text-brand-700 font-medium"
            >
              Library
            </button>
          </div>
          <div className="space-y-2">
            {recentSources.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-card border border-gray-50 hover:shadow-card-hover transition-all cursor-pointer"
                onClick={() => navigate('/library')}
              >
                <span className="text-xl">{getSourceIcon(s.source_type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">{s.title}</p>
                  <p className="text-[11px] text-gray-400">{formatRelativeTime(s.created_at)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Sample conversation */}
          <div className="mt-6 p-4 bg-gradient-to-br from-brand-50 to-purple-50 rounded-2xl border border-brand-100">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-brand-500" />
              <span className="text-xs font-semibold text-brand-700">Try asking</span>
            </div>
            <div className="space-y-2">
              {[
                'What were my 2024 accomplishments?',
                'What is my deep work philosophy?',
                'What are my health goals?',
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => navigate('/chat', { state: { prefill: q } })}
                  className="w-full text-left text-xs text-brand-700 bg-white rounded-xl px-3 py-2 hover:bg-brand-50 transition-colors border border-brand-100"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
