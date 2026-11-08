import React, { useEffect, useState } from 'react';
import { X, ExternalLink, Github, Sparkles, Tag, Layers, CheckCircle2, Send } from 'lucide-react';
import { settingsService } from '../services/settingsService';

export default function ProjectModal({ project, onClose }) {
  const [imgError, setImgError] = useState(false);
  const settings = settingsService.getSettings();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  if (!project) return null;

  const fallbackImage =
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-3xl bg-[#121212] border border-brand-border rounded-3xl shadow-2xl overflow-hidden z-10 my-8">
        {/* Header Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/70 hover:bg-black text-gray-400 hover:text-white border border-white/10 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image Section */}
        <div className="relative w-full aspect-[21/9] sm:aspect-[16/7] bg-[#080808] overflow-hidden">
          <img
            src={imgError ? fallbackImage : project.imageUrl || fallbackImage}
            alt={project.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/30 to-transparent" />

          {/* Badges on image */}
          <div className="absolute bottom-4 left-6 flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-yellow text-black shadow-md">
              {project.category}
            </span>
            {project.featured && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-black/80 backdrop-blur-md text-brand-yellow border border-brand-yellow/30">
                <Sparkles className="w-3.5 h-3.5 fill-brand-yellow" />
                Featured Project
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              {project.title}
            </h2>
            <p className="text-brand-yellow text-sm font-medium">
              Project ID: <span className="font-mono text-gray-300">{project.id}</span>
            </p>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider text-brand-muted font-semibold">
              Overview
            </h3>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              {project.detailedDescription || project.description}
            </p>
          </div>

          {/* Technologies Used */}
          <div>
            <h3 className="text-xs uppercase tracking-wider text-brand-muted font-semibold mb-3">
              Technologies & Frameworks
            </h3>
            <div className="flex flex-wrap gap-2">
              {(project.technologies || []).map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-[#1c1c1c] text-white border border-[#333333]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {project.demoUrl ? (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-brand-yellow text-black hover:bg-brand-yellowHover shadow-glow-yellow-sm transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Live Demo</span>
                </a>
              ) : null}

              {project.repositoryUrl ? (
                <a
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#222222] text-white hover:bg-[#2c2c2c] border border-brand-border transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub Repository</span>
                </a>
              ) : null}
            </div>

            <a
              href={`${settings.enquiryForm || 'https://forms.gle/8RsBqNQtjr6ToifQ7'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#1a1a1a] text-brand-yellow hover:text-white border border-brand-yellow/30 hover:border-brand-yellow transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Request Similar Project</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
