import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Download, Trash2, Cloud, CloudOff,
  Bell, Eye, Lock, AlertTriangle, ChevronRight,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

function SettingRow({
  icon: Icon, label, desc, children, danger,
}: {
  icon: React.ElementType; label: string; desc?: string; children?: React.ReactNode; danger?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${danger ? 'bg-red-50' : 'bg-surface-100'}`}>
          <Icon className={`w-4 h-4 ${danger ? 'text-red-500' : 'text-gray-500'}`} />
        </div>
        <div>
          <p className={`text-sm font-medium ${danger ? 'text-red-600' : 'text-gray-800'}`}>{label}</p>
          {desc && <p className="text-xs text-gray-400 mt-0.5 max-w-sm">{desc}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-brand-600' : 'bg-gray-200'}`}
      style={{ height: '22px' }}
    >
      <div
        className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform`}
        style={{
          width: '18px',
          height: '18px',
          transform: checked ? 'translateX(20px)' : 'translateX(2px)',
        }}
      />
    </button>
  );
}

export default function SettingsPage() {
  const { signOut, memories, sources, userEmail } = useAppStore();
  const navigate = useNavigate();
  const [cloudSync, setCloudSync] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [showSensitive, setShowSensitive] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const handleExport = () => {
    const data = {
      exported_at: new Date().toISOString(),
      memories,
      sources: sources.map((s) => ({ ...s, raw_content: s.raw_content.slice(0, 200) + '…' })),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `memoryos-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported');
  };

  const handleDeleteAccount = () => {
    if (deleteConfirm !== 'DELETE') {
      toast.error('Type DELETE to confirm');
      return;
    }
    setDeleteModal(false);
    signOut();
    navigate('/auth');
    toast.success('Account deleted');
  };

  return (
    <div className="max-w-2xl space-y-6">
      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete account"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">
              This will permanently delete all your memories, sources, and conversations. This cannot be undone.
            </p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Type DELETE to confirm
            </label>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="DELETE"
              className="w-full px-3.5 py-2.5 bg-surface-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteModal(false)}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              className="flex-1 px-4 py-2.5 bg-red-500 text-white text-sm font-medium rounded-xl hover:bg-red-600 transition-colors"
            >
              Delete everything
            </button>
          </div>
        </div>
      </Modal>

      {/* Account */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-50 px-5">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide pt-4 pb-2">Account</h3>
        <div className="divide-y divide-gray-50">
          <SettingRow icon={Lock} label="Email" desc={userEmail}>
            <span className="text-xs text-gray-400 bg-surface-100 px-2 py-1 rounded-lg">
              Demo mode
            </span>
          </SettingRow>
          <SettingRow
            icon={Download}
            label="Export data"
            desc={`Export all ${memories.length} memories and ${sources.length} sources as JSON`}
          >
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          </SettingRow>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-50 px-5">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide pt-4 pb-2">Privacy</h3>
        <div className="divide-y divide-gray-50">
          <SettingRow
            icon={cloudSync ? Cloud : CloudOff}
            label="Cloud sync"
            desc="Sync your memories to cloud storage. Disabled keeps everything local."
          >
            <Toggle checked={cloudSync} onChange={setCloudSync} />
          </SettingRow>
          <SettingRow
            icon={Eye}
            label="Show sensitive content"
            desc="When enabled, sensitive memories are not blurred by default"
          >
            <Toggle checked={showSensitive} onChange={setShowSensitive} />
          </SettingRow>
          <SettingRow
            icon={Shield}
            label="Data stays private"
            desc="MemoryOS never trains on your memories or shares your data."
          >
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              Always on
            </span>
          </SettingRow>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-50 px-5">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide pt-4 pb-2">Notifications</h3>
        <div className="divide-y divide-gray-50">
          <SettingRow
            icon={Bell}
            label="Import notifications"
            desc="Get notified when a source finishes syncing"
          >
            <Toggle checked={notifications} onChange={setNotifications} />
          </SettingRow>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl shadow-card border border-red-100 px-5">
        <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wide pt-4 pb-2">Danger zone</h3>
        <div className="divide-y divide-gray-50">
          <SettingRow
            icon={Trash2}
            label="Delete account"
            desc="Permanently delete your account and all data. This cannot be undone."
            danger
          >
            <button
              onClick={() => setDeleteModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </SettingRow>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 pb-4">
        MemoryOS · Version 0.1.0 · Made with ♥ for your second brain
      </p>
    </div>
  );
}
