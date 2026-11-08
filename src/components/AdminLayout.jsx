import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  MessageSquareQuote,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Download,
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import { authService } from '../services/authService';
import { githubPublishService } from '../services/githubPublishService';
import { useToast } from './Toast';

export default function AdminLayout({ children, title, subtitle, actions }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleLogout = () => {
    authService.logout();
    addToast('Logged out successfully.', 'info');
    navigate('/admin');
  };

  const handlePublishToGithub = async () => {
    setPublishing(true);
    try {
      const res = await githubPublishService.publishAllToGithub();
      if (res.success) {
        addToast(res.message, 'success', 6000);
      } else {
        addToast(res.message, 'error', 6000);
      }
    } catch (err) {
      addToast(err.message || 'Publishing failed.', 'error');
    } finally {
      setPublishing(false);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/admin/projects', icon: FolderGit2 },
    { name: 'Reviews', path: '/admin/reviews', icon: MessageSquareQuote },
    { name: 'Website Settings', path: '/admin/settings', icon: Settings },
  ];

  const githubConfig = githubPublishService.getConfig();

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#141414] border-r border-brand-border shrink-0 select-none">
        {/* Brand Header */}
        <div className="p-6 border-b border-brand-border/60">
          <BrandLogo size="md" showTagline={false} to="/admin/dashboard" />
          <div className="mt-2 text-[11px] font-mono uppercase tracking-wider text-brand-yellow font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Admin Portal
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-yellow text-black font-semibold shadow-glow-yellow-sm'
                    : 'text-brand-muted hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <IconComponent className={`w-5 h-5 ${isActive ? 'text-black' : 'text-brand-muted'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* GitHub Publish Status Widget */}
        <div className="p-4 mx-4 mb-4 rounded-2xl bg-[#1a1a1a] border border-brand-border/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-300">GitHub Sync</span>
            {githubConfig.configured ? (
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Ready
              </span>
            ) : (
              <span className="text-[10px] text-amber-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Not Configured
              </span>
            )}
          </div>
          <button
            onClick={handlePublishToGithub}
            disabled={publishing}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-brand-yellow/10 hover:bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/30 text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <UploadCloud className={`w-3.5 h-3.5 ${publishing ? 'animate-bounce' : ''}`} />
            <span>{publishing ? 'Publishing...' : 'Publish to GitHub'}</span>
          </button>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-brand-border/60 flex flex-col gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-medium text-brand-muted hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-[#141414] border-b border-brand-border flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-brand-muted hover:text-white rounded-lg"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white truncate">{title}</h1>
              {subtitle && <p className="text-xs text-brand-muted hidden sm:block">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {actions}

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#202020] text-xs font-medium text-gray-300 hover:text-white hover:bg-[#282828] border border-brand-border transition-colors"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#181818] border-b border-brand-border p-4 space-y-2 animate-in slide-in-from-top-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
                    isActive
                      ? 'bg-brand-yellow text-black font-semibold'
                      : 'text-brand-muted hover:text-white'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-brand-border flex flex-col gap-2">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-2 rounded-xl text-xs text-brand-muted hover:text-white"
              >
                <span>View Public Site</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-semibold text-rose-400"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
