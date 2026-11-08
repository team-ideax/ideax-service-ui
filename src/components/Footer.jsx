import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MessageSquare, ArrowUpRight, Github, Linkedin, Twitter, Instagram, ShieldCheck, Heart } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { settingsService } from '../services/settingsService';

export default function Footer() {
  const [settings, setSettings] = useState(settingsService.getSettings());

  useEffect(() => {
    const unsub = settingsService.subscribe(() => {
      setSettings(settingsService.getSettings());
    });
    return unsub;
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-brand-border text-brand-muted relative overflow-hidden">
      {/* Subtle Yellow Gradient Glow at bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-brand-yellow/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-brand-border/60">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="lg" showTagline={false} to="/" />
            <p className="text-brand-yellow font-medium text-sm tracking-wide">
              {settings.tagline || 'Turning Ideas Into Software'}
            </p>
            <p className="text-sm text-brand-muted/90 max-w-sm leading-relaxed">
              {settings.about?.introduction ||
                'ideaX transforms ideas into practical software solutions through thoughtful planning, modern technologies and reliable development practices.'}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {settings.socialLinks?.github && (
                <a
                  href={settings.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-[#151515] border border-brand-border flex items-center justify-center text-gray-400 hover:text-brand-yellow hover:border-brand-yellow/50 transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks?.linkedin && (
                <a
                  href={settings.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-[#151515] border border-brand-border flex items-center justify-center text-gray-400 hover:text-brand-yellow hover:border-brand-yellow/50 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks?.twitter && (
                <a
                  href={settings.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-[#151515] border border-brand-border flex items-center justify-center text-gray-400 hover:text-brand-yellow hover:border-brand-yellow/50 transition-colors"
                  aria-label="Twitter / X"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks?.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-[#151515] border border-brand-border flex items-center justify-center text-gray-400 hover:text-brand-yellow hover:border-brand-yellow/50 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#about" className="hover:text-brand-yellow transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-brand-yellow transition-colors">
                  Our Services
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-brand-yellow transition-colors">
                  Featured Projects
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-brand-yellow transition-colors">
                  Customer Reviews
                </a>
              </li>
              <li>
                <a href="#process" className="hover:text-brand-yellow transition-colors">
                  Development Process
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-brand-yellow transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#services" className="hover:text-brand-yellow transition-colors">
                  Web Applications
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-brand-yellow transition-colors">
                  Mobile Apps (iOS/Android)
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-brand-yellow transition-colors">
                  Desktop Applications
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-brand-yellow transition-colors">
                  Backend & REST APIs
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-brand-yellow transition-colors">
                  AI & Machine Learning
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-brand-yellow transition-colors">
                  Custom Software Projects
                </a>
              </li>
            </ul>
          </div>

          {/* Direct Contact & Enquiry */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Get in Touch
            </h4>
            <a
              href={`mailto:${settings.email || 'team.ideax@gmail.com'}`}
              className="flex items-center gap-2.5 text-sm hover:text-brand-yellow transition-colors group"
            >
              <Mail className="w-4 h-4 text-brand-yellow shrink-0" />
              <span className="truncate">{settings.email || 'team.ideax@gmail.com'}</span>
            </a>
            <a
              href={`tel:${settings.phoneRaw || '+919345746981'}`}
              className="flex items-center gap-2.5 text-sm hover:text-brand-yellow transition-colors group"
            >
              <Phone className="w-4 h-4 text-brand-yellow shrink-0" />
              <span>{settings.phone || '+91 9345746981'}</span>
            </a>
            <a
              href={settings.whatsappUrl || 'https://wa.me/919345746981'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-sm hover:text-brand-yellow transition-colors group"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Chat on WhatsApp</span>
            </a>

            <div className="pt-2">
              <a
                href={settings.enquiryForm || 'https://forms.gle/8RsBqNQtjr6ToifQ7'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg bg-[#1a1a1a] border border-brand-border hover:border-brand-yellow text-white hover:text-brand-yellow transition-all"
              >
                <span>Online Enquiry Form</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-muted/80">
          <p>
            {settings.footerText || `© ${currentYear} ideaX. All rights reserved. Turning Ideas Into Software.`}
          </p>

          <div className="flex items-center gap-6">
            <a href="#about" className="hover:text-brand-yellow transition-colors">
              Privacy & Quality Standards
            </a>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-gray-500 hover:text-brand-yellow transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Management</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
