import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAppStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    // Simulate auth delay
    await new Promise((r) => setTimeout(r, 900));
    signIn(email);
    toast.success(mode === 'signup' ? 'Account created!' : 'Welcome back!');
    navigate('/');
    setLoading(false);
  };

  const handleDemo = () => {
    signIn('demo@memoryos.app');
    toast.success('Signed in as demo user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">MemoryOS</h1>
          <p className="text-sm text-gray-500 mt-1">Your personal memory vault</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-modal p-6 border border-gray-100">
          {/* Tabs */}
          <div className="flex bg-surface-100 rounded-xl p-1 mb-6">
            {(['signin', 'signup'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  mode === m
                    ? 'bg-white text-gray-900 shadow-card'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {m === 'signin' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-3.5 py-2.5 bg-surface-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-300 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 py-2.5 pr-10 bg-surface-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-300 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'signin' ? 'Sign in' : 'Create account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={handleDemo}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-surface-50 border border-gray-200 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-brand-500" />
              Try demo (no account needed)
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Your data stays private and encrypted.
          <br />MemoryOS never trains on your memories.
        </p>
      </div>
    </div>
  );
}
