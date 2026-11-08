import React, { useState } from 'react';
import { ExternalLink, Github, Sparkles, Layers, ArrowRight, Code } from 'lucide-react';

export default function ProjectCard({ project, onSelect }) {
  const [imgError, setImgError] = useState(false);

  // Fallback placeholder image with SVG code graphic
  const fallbackImage =
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop';

  return (
    <div
      onClick={() => onSelect && onSelect(project)}
      className="group relative flex flex-col bg-brand-card rounded-2xl border border-brand-border hover:border-brand-yellow/60 transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-glow-yellow-sm"
    >
      {/* Featured Badge */}
      {project.featured && (
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-yellow text-black font-semibold text-xs shadow-md">
          <Sparkles className="w-3.5 h-3.5 fill-black" />
          <span>Featured</span>
        </div>
      )}

      {/* Category Pill */}
      <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-white/90 text-xs font-medium">
        {project.category}
      </div>

      {/* Thumbnail Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0d0d0d]">
        <img
          src={imgError ? fallbackImage : project.imageUrl || fallbackImage}
          alt={project.title}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-card via-brand-card/40 to-transparent" />
      </div>

      {/* Card Content */}
      <div className="flex-1 flex flex-col p-5 sm:p-6 justify-between">
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-brand-yellow transition-colors line-clamp-1 mb-2">
            {project.title}
          </h3>
          <p className="text-brand-muted text-sm line-clamp-2 leading-relaxed mb-4">
            {project.description}
          </p>
        </div>

        <div>
          {/* Tech stack tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {(project.technologies || []).slice(0, 4).map((tech, i) => (
              <span
                key={i}
                className="inline-flex items-center text-xs px-2.5 py-1 rounded-md bg-[#222222] text-gray-300 border border-[#333333] group-hover:border-[#444444]"
              >
                {tech}
              </span>
            ))}
            {(project.technologies || []).length > 4 && (
              <span className="text-xs px-2 py-1 rounded-md bg-[#1a1a1a] text-brand-yellow font-medium">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-3 border-t border-brand-border/60">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-yellow group-hover:underline">
              <span>View Case Study</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>

            {/* Quick Demo & Repo Links (stop propagation so card click doesn't clash) */}
            <div className="flex items-center gap-2">
              {project.repositoryUrl && (
                <a
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 rounded-lg bg-[#202020] text-gray-300 hover:text-white hover:bg-[#2c2c2c] transition-colors"
                  title="Source Code"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 rounded-lg bg-[#202020] text-brand-yellow hover:bg-[#2c2c2c] transition-colors"
                  title="Live Demo"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
