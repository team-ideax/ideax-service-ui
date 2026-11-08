import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Sparkles } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col items-center justify-center p-6 relative selection:bg-brand-yellow selection:text-black">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-yellow/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full text-center space-y-6">
        <div className="flex justify-center mb-2">
          <BrandLogo size="lg" showTagline={false} to="/" />
        </div>

        <div className="text-8xl font-black text-brand-yellow font-mono tracking-tighter">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">Page Not Found</h1>
          <p className="text-sm text-brand-muted leading-relaxed">
            The page you are looking for doesn't exist, has been removed, or has moved to a new route.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-brand-yellow text-black hover:bg-brand-yellowHover shadow-glow-yellow-sm transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            to="/admin"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-[#161616] text-white hover:bg-[#202020] border border-brand-border transition-colors"
          >
            <span>Admin Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
