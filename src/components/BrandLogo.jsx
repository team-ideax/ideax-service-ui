import React from 'react';
import { Link } from 'react-router-dom';

export default function BrandLogo({ size = 'md', showTagline = false, to = '/' }) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const content = (
    <div className="flex items-center gap-3 group select-none">
      {/* Brand Icon SVG */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-brand-border group-hover:border-brand-yellow/60 transition-all duration-300 shadow-lg ${iconSizes[size] || iconSizes.md}`}>
        <svg viewBox="0 0 100 100" fill="none" className="w-4/5 h-4/5">
          <circle cx="50" cy="50" r="32" fill="#FFD400" fillOpacity="0.15" />
          <path d="M28 28L44 48L28 72H38L49 54L60 72H72L55 48L70 28H59L49 42L39 28H28Z" fill="#FFD400" />
          <circle cx="50" cy="22" r="6" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <span className={`font-extrabold tracking-tight text-white flex items-center ${textSizes[size] || textSizes.md}`}>
          idea<span className="text-brand-yellow">X</span>
        </span>
        {showTagline && (
          <span className="text-[10px] tracking-wider uppercase text-brand-muted font-medium -mt-1">
            Turning Ideas Into Software
          </span>
        )}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-block hover:opacity-95 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
