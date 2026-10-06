import React, { useState } from 'react';

interface LoginViewProps {
  onLogin: (email: string, password: string) => { success: boolean; error?: string };
  onNavigate: (view: 'register' | 'landing') => void;
  onQuickDemoLogin: (email: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onNavigate, onQuickDemoLogin }) => {
  const [email, setEmail] = useState('kamalesh@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = onLogin(email.trim(), password);
    if (!result.success) {
      setError(result.error || 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-8 w-full max-w-md">
        {/* Header matching Fig 8.3 */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
          <p className="text-sm text-slate-500 mt-1">Login to manage your tasks.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="kamalesh@example.com"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm shadow-sm transition-all cursor-pointer mt-2"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-slate-100 text-xs text-slate-600">
          New user?{' '}
          <button
            onClick={() => onNavigate('register')}
            className="text-blue-600 hover:underline font-semibold cursor-pointer"
          >
            Create an account
          </button>
        </div>

        {/* Quick Demo Credentials Box */}
        <div className="mt-6 p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">
            One-Click Academic Demo Accounts
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onQuickDemoLogin('kamalesh@example.com')}
              className="text-left p-2 rounded bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-xs transition-colors"
            >
              <div className="font-semibold text-slate-800">Kamalesh R</div>
              <div className="text-[10px] text-slate-500">6 tasks (Fig 8.4)</div>
            </button>
            <button
              type="button"
              onClick={() => onQuickDemoLogin('ramya@example.com')}
              className="text-left p-2 rounded bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-xs transition-colors"
            >
              <div className="font-semibold text-slate-800">Ramya K</div>
              <div className="text-[10px] text-slate-500">User Isolation test</div>
            </button>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => onNavigate('landing')}
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
