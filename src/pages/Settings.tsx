import { useState } from 'react';
import {
  User, Bell, Shield, Palette, Database, Globe, Key,
  Save, Check, Moon, Sun, Monitor
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { cn } from '../lib/utils';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export default function Settings() {
  const { user, darkMode, toggleDarkMode } = useAppStore();
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [name, setName] = useState(user?.name || '');
  const [institution, setInstitution] = useState(user?.institution || '');

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Integrations', icon: Globe },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'data', label: 'Data & Privacy', icon: Database },
  ];

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar nav */}
        <div className="lg:col-span-1">
          <Card padding="sm">
            <nav className="space-y-1">
              {sections.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left',
                    activeSection === id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-4">
          {activeSection === 'profile' && (
            <Card>
              <div className="p-6">
                <h3 className={cn('text-lg font-semibold mb-6', darkMode ? 'text-white' : 'text-slate-800')}>Profile Settings</h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {user?.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div className={cn('font-semibold', darkMode ? 'text-white' : 'text-slate-800')}>{user?.name}</div>
                    <div className="text-sm text-slate-400">{user?.email}</div>
                    <Badge variant="blue" size="sm" className="mt-1 capitalize">{user?.role}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full Name</label>
                    <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Institution</label>
                    <input className="input" value={institution} onChange={(e) => setInstitution(e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Specialization</label>
                    <select className="input">
                      {['Obstetrics & Gynecology', 'Radiology', 'Internal Medicine', 'Pediatrics', 'Surgery', 'General Practice'].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Role</label>
                    <select className="input" value={user?.role}>
                      {['doctor', 'resident', 'student', 'radiologist', 'sonologist', 'admin'].map((r) => (
                        <option key={r} className="capitalize">{r}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button onClick={handleSave} className="mt-4 btn-primary">
                  {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
                </button>
              </div>
            </Card>
          )}

          {activeSection === 'appearance' && (
            <Card>
              <div className="p-6">
                <h3 className={cn('text-lg font-semibold mb-6', darkMode ? 'text-white' : 'text-slate-800')}>Appearance</h3>
                <div className="mb-6">
                  <label className="label">Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[{ label: 'Light', icon: Sun, value: false }, { label: 'Dark', icon: Moon, value: true }, { label: 'System', icon: Monitor, value: null }].map(({ label, icon: Icon, value }) => (
                      <button
                        key={label}
                        onClick={() => value !== null && darkMode !== value && toggleDarkMode()}
                        className={cn(
                          'p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all',
                          (value === darkMode) ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : 'border-slate-200 dark:border-slate-700 hover:border-blue-200'
                        )}
                      >
                        <Icon className={cn('w-5 h-5', value === darkMode ? 'text-blue-600' : 'text-slate-400')} />
                        <span className={cn('text-sm font-medium', value === darkMode ? 'text-blue-600' : 'text-slate-500')}>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeSection === 'integrations' && (
            <Card>
              <div className="p-6">
                <h3 className={cn('text-lg font-semibold mb-6', darkMode ? 'text-white' : 'text-slate-800')}>Integrations</h3>
                <div className="space-y-4">
                  {[
                    { name: 'LLM Provider', desc: 'Connect to Anthropic Claude, OpenAI, or Ollama', status: 'placeholder', icon: '🤖' },
                    { name: 'Vector Database', desc: 'Connect to Pinecone, Weaviate, or ChromaDB', status: 'placeholder', icon: '🗄️' },
                    { name: 'OCR Service', desc: 'Connect to AWS Textract or Google Document AI', status: 'placeholder', icon: '📄' },
                    { name: 'Obsidian Vault', desc: 'Local vault path for direct file export', status: 'configured', icon: '🗂️' },
                  ].map(({ name, desc, status, icon }) => (
                    <div key={name} className={cn('flex items-start gap-4 p-4 rounded-xl border', darkMode ? 'border-slate-700' : 'border-slate-200')}>
                      <div className="text-2xl">{icon}</div>
                      <div className="flex-1">
                        <div className={cn('font-medium text-sm', darkMode ? 'text-slate-200' : 'text-slate-800')}>{name}</div>
                        <div className="text-xs text-slate-400">{desc}</div>
                      </div>
                      <Badge variant={status === 'configured' ? 'green' : 'orange'}>
                        {status === 'placeholder' ? 'Not configured' : 'Configured'}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className={cn('mt-4 p-3 rounded-xl border text-xs', darkMode ? 'bg-blue-950 border-blue-800 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700')}>
                  💡 <strong>Integration note:</strong> Connect your preferred LLM provider, vector database, and OCR service to enable real RAG queries over uploaded textbooks. This MVP uses simulated responses.
                </div>
              </div>
            </Card>
          )}

          {activeSection === 'security' && (
            <Card>
              <div className="p-6">
                <h3 className={cn('text-lg font-semibold mb-6', darkMode ? 'text-white' : 'text-slate-800')}>Security</h3>
                <div className="space-y-4">
                  <div>
                    <label className="label">Change Password</label>
                    <input type="password" className="input" placeholder="Current password" />
                    <input type="password" className="input mt-2" placeholder="New password" />
                    <input type="password" className="input mt-2" placeholder="Confirm new password" />
                  </div>
                  <button className="btn-primary text-sm"><Key className="w-4 h-4" /> Update Password</button>
                </div>
              </div>
            </Card>
          )}

          {activeSection === 'data' && (
            <Card>
              <div className="p-6">
                <h3 className={cn('text-lg font-semibold mb-6', darkMode ? 'text-white' : 'text-slate-800')}>Data & Privacy</h3>
                <div className="space-y-4">
                  <div className={cn('p-4 rounded-xl border', darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200')}>
                    <div className={cn('font-medium text-sm mb-1', darkMode ? 'text-slate-200' : 'text-slate-700')}>Local Storage</div>
                    <div className="text-xs text-slate-400">All data is stored locally in your browser. No data is sent to external servers without explicit integration configuration.</div>
                  </div>
                  <button className="btn-secondary text-sm text-red-500 border-red-200 hover:bg-red-50">
                    Clear all local data
                  </button>
                </div>
              </div>
            </Card>
          )}

          {(activeSection === 'notifications') && (
            <Card>
              <div className="p-6">
                <h3 className={cn('text-lg font-semibold mb-6', darkMode ? 'text-white' : 'text-slate-800')}>Notifications</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Flashcard review reminders', desc: 'Get reminded when cards are due' },
                    { label: 'Study session suggestions', desc: 'Daily study prompts based on your schedule' },
                    { label: 'New book indexed', desc: 'Alert when admin adds a new textbook' },
                  ].map(({ label, desc }) => (
                    <div key={label} className="flex items-start gap-3">
                      <input type="checkbox" defaultChecked className="mt-1 rounded" />
                      <div>
                        <div className={cn('text-sm font-medium', darkMode ? 'text-slate-200' : 'text-slate-700')}>{label}</div>
                        <div className="text-xs text-slate-400">{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
