import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, User, ShieldAlert, ArrowLeft, CheckCircle2, KeyRound } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';
import { authService } from '../services/authService';
import { useToast } from '../components/Toast';

export default function AdminLogin() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (authService.isAuthenticated()) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await authService.login(username, password);
      if (result.success) {
        addToast('Welcome to ideaX Admin Management', 'success');
        const from = location.state?.from?.pathname || '/admin/dashboard';
        navigate(from, { replace: true });
      } else {
        setError(result.message || 'Invalid credentials.');
      }
    } catch (err) {
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-brand-yellow selection:text-black">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-yellow/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Return to website link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-brand-muted hover:text-brand-yellow transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to ideaX Official Website</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <BrandLogo size="lg" showTagline={false} to="/" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            Admin Management Portal
          </h2>
          <p className="text-xs text-brand-muted mt-1">
            Sign in to manage projects, customer reviews, and website settings.
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-[#141414] py-8 px-6 sm:px-10 rounded-3xl border border-brand-border shadow-2xl relative z-10">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs sm:text-sm flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#1e1e1e] border border-brand-border text-white text-sm focus:outline-none focus:border-brand-yellow transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-brand-yellow text-black hover:bg-brand-yellowHover shadow-glow-yellow-sm hover:shadow-glow-yellow transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>

          {/* Development Notice & Instructions */}
          <div className="mt-6 pt-6 border-t border-brand-border/60 space-y-3">
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200/90 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Development Default Credentials:</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setUsername('admin');
                    setPassword('admin');
                    setError('');
                  }}
                  className="text-[10px] font-bold text-brand-yellow hover:underline"
                >
                  Auto-Fill
                </button>
              </div>
              <p>
                Username: <code className="bg-black/40 px-1.5 py-0.5 rounded text-white font-mono">admin</code> | 
                Password: <code className="bg-black/40 px-1.5 py-0.5 rounded text-white font-mono">admin</code>
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-amber-500/20 text-[10px]">
                <span className="text-gray-400">Trouble signing in?</span>
                <button
                  type="button"
                  onClick={() => {
                    authService.resetToDefault();
                    setUsername('admin');
                    setPassword('admin');
                    setError('');
                    addToast('Credentials reset to defaults: admin / admin', 'info');
                  }}
                  className="text-amber-400 hover:text-white underline font-semibold"
                >
                  Reset Credentials
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
