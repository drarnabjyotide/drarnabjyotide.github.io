import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Eye, EyeOff, BookOpen, Brain, FileText, Zap, Shield, Wifi } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { cn } from '../lib/utils';

export default function Login() {
  const navigate = useNavigate();
  const login = useAppStore((s) => s.login);
  const [email, setEmail] = useState('priya.sharma@medcollege.edu');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const ok = await login(email, password);
    if (ok) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Use any valid email.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-teal-900 relative overflow-hidden flex-col justify-between p-12">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-40 right-20 w-96 h-96 rounded-full bg-teal-400/20 blur-3xl" />
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-xl">MedMother AI</div>
              <div className="text-blue-200 text-sm">Medical Education Platform</div>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white mb-4">
            Knowledge grounded in<br />
            <span className="text-teal-300">your textbooks.</span>
          </h2>
          <p className="text-blue-200 text-lg leading-relaxed mb-12">
            Upload medical textbooks, ask any question, and get answers with exact page references, figure citations, and chapter sources.
          </p>

          <div className="space-y-4">
            {[
              { icon: BookOpen, text: 'RAG-powered answers from uploaded textbooks' },
              { icon: Brain, text: 'Auto-generate flashcards, mnemonics, and study notes' },
              { icon: FileText, text: 'Structured USG reports with textbook terminology' },
              { icon: Zap, text: 'Export to Obsidian with backlinks and YAML frontmatter' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-teal-300" />
                </div>
                <p className="text-blue-100 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center gap-6">
          {[
            { icon: Shield, label: 'Private & Secure' },
            { icon: Wifi, label: 'Offline-First PWA' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-blue-200 text-sm">
              <Icon className="w-4 h-4" />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-slate-800">MedMother AI</div>
              <div className="text-xs text-blue-600">Medical Education Platform</div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-800 mb-1">Welcome back</h1>
          <p className="text-slate-500 mb-8">Sign in to access your medical knowledge platform</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@hospital.edu"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="label mb-0">Password</label>
                <button type="button" className="text-xs text-blue-600 hover:underline">Forgot password?</button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center text-base py-2.5"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="text-xs text-blue-700 font-medium mb-1">Demo credentials</p>
            <p className="text-xs text-blue-600">Email: priya.sharma@medcollege.edu</p>
            <p className="text-xs text-blue-600">Password: any value</p>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don’t have an account?{' '}
            <button className="text-blue-600 hover:underline font-medium">Contact your institution admin</button>
          </p>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-center text-xs text-slate-400">
              For doctors, residents, students & radiologists • Powered by RAG
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
