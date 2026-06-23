import { useState } from 'react';
import { CheckCircle, XCircle, RefreshCw, Zap, AlertCircle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import FileUploader from '../components/sources/FileUploader';
import { formatRelativeTime } from '../lib/utils';
import type { Connection } from '../types';
import toast from 'react-hot-toast';

const CONNECTOR_META: Record<string, { label: string; icon: string; desc: string; color: string }> = {
  gdrive: {
    label: 'Google Drive',
    icon: '📁',
    desc: 'Sync documents, spreadsheets, and slides from your Drive',
    color: 'from-yellow-400 to-yellow-500',
  },
  gmail: {
    label: 'Gmail',
    icon: '✉️',
    desc: 'Import emails, threads, and attachments as searchable memories',
    color: 'from-red-400 to-red-500',
  },
  calendar: {
    label: 'Google Calendar',
    icon: '📅',
    desc: 'Capture meetings, events, and scheduled items',
    color: 'from-emerald-400 to-emerald-500',
  },
  notes: {
    label: 'Apple Notes',
    icon: '📝',
    desc: 'Import your Apple Notes library as searchable memories',
    color: 'from-yellow-300 to-amber-400',
  },
};

function ConnectionCard({ conn }: { conn: Connection }) {
  const { connectProvider, disconnectProvider } = useAppStore();
  const [loading, setLoading] = useState(false);
  const meta = CONNECTOR_META[conn.provider];
  const isConnected = conn.status === 'connected' || conn.status === 'mock';

  const handleToggle = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    if (isConnected) {
      disconnectProvider(conn.id);
      toast.success(`Disconnected ${meta.label}`);
    } else {
      connectProvider(conn.provider);
      toast.success(`${meta.label} connected (demo mode)`);
    }
    setLoading(false);
  };

  const handleSync = async () => {
    if (!isConnected) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    toast.success(`${meta.label} synced`);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-50 p-5">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-2xl flex-shrink-0 shadow-sm`}>
          {meta.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-semibold text-gray-900">{meta.label}</h3>
            {isConnected && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <CheckCircle className="w-3 h-3" />
                {conn.status === 'mock' ? 'Demo' : 'Live'}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mb-3 leading-relaxed">{meta.desc}</p>

          {isConnected && conn.last_synced && (
            <p className="text-[11px] text-gray-400 mb-3">
              Last synced {formatRelativeTime(conn.last_synced)}
            </p>
          )}

          {conn.status === 'mock' && (
            <div className="flex items-center gap-1.5 text-[11px] text-amber-600 bg-amber-50 px-2.5 py-1.5 rounded-xl mb-3">
              <AlertCircle className="w-3 h-3 flex-shrink-0" />
              Running in demo mode with sample data
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleToggle}
              disabled={loading}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl transition-colors disabled:opacity-60 ${
                isConnected
                  ? 'text-gray-600 border border-gray-200 hover:bg-gray-50'
                  : 'bg-brand-600 text-white hover:bg-brand-700'
              }`}
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : isConnected ? (
                <>
                  <XCircle className="w-3.5 h-3.5" />
                  Disconnect
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  Connect
                </>
              )}
            </button>
            {isConnected && (
              <button
                onClick={handleSync}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-60"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Sync now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SourcesPage() {
  const { connections } = useAppStore();

  return (
    <div className="space-y-8">
      {/* File upload */}
      <section>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Upload files</h3>
        <div className="bg-white rounded-2xl shadow-card border border-gray-50 p-5">
          <FileUploader />
        </div>
      </section>

      {/* Connectors */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">Connected sources</h3>
          <span className="text-xs text-gray-400">
            {connections.filter((c) => c.status !== 'disconnected').length} of {connections.length} active
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {connections.map((conn) => (
            <ConnectionCard key={conn.id} conn={conn} />
          ))}
        </div>
      </section>

      <div className="bg-surface-50 border border-dashed border-gray-200 rounded-2xl p-5 text-center">
        <p className="text-sm font-medium text-gray-500 mb-1">More connectors coming soon</p>
        <p className="text-xs text-gray-400">Notion, Obsidian, Twitter/X, Readwise, Kindle highlights, and more</p>
      </div>
    </div>
  );
}
