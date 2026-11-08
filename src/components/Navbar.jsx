import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { settingsService } from '../services/settingsService';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState(settingsService.getSettings());
  const location = useLocation();

  useEffect(() => {
    const unsub = settingsService.subscribe(() => {
      setSettings(settingsService.getSettings());
    });
    return unsub;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Projects', href: '#projects' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Process', href: '#process' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e, href) => {
    if (location.pathname !== '/') {
      // If not on home page, navigate to home with hash
      return;
    }
    e.preventDefault();
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', href);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-brand-bg/90 backdrop-blur-md border-b border-brand-border/80 shadow-lg shadow-black/40 py-3'
          : 'bg-transparent border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <BrandLogo size="md" showTagline={true} to="/" />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={location.pathname === '/' ? link.href : `/${link.href}`}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-3.5 py-1.5 text-sm font-medium text-brand-muted hover:text-brand-yellow hover:bg-white/[0.03] rounded-lg transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* CTA & Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/admin"
              className="p-2 text-brand-muted hover:text-brand-yellow hover:bg-white/[0.03] rounded-lg transition-colors"
              title="Admin Portal"
            >
              <ShieldCheck className="w-5 h-5" />
            </Link>

            <a
              href={settings.enquiryForm || 'https://forms.gle/8RsBqNQtjr6ToifQ7'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-brand-yellow text-black hover:bg-brand-yellowHover shadow-glow-yellow-sm hover:shadow-glow-yellow transition-all duration-200"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              <span>Start Your Project</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              to="/admin"
              className="p-2 text-brand-muted hover:text-brand-yellow"
              title="Admin Portal"
            >
              <ShieldCheck className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-300 hover:text-brand-yellow rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-brand-bg/95 backdrop-blur-xl border-b border-brand-border px-4 pt-3 pb-6 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={location.pathname === '/' ? link.href : `/${link.href}`}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-4 py-2.5 rounded-lg text-base font-medium text-brand-muted hover:text-brand-yellow hover:bg-white/[0.04] transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-3 border-t border-brand-border flex flex-col gap-2">
              <a
                href={settings.enquiryForm || 'https://forms.gle/8RsBqNQtjr6ToifQ7'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm bg-brand-yellow text-black hover:bg-brand-yellowHover transition-colors shadow-glow-yellow-sm"
              >
                <Sparkles className="w-4 h-4 fill-black" />
                <span>Start Your Project</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
