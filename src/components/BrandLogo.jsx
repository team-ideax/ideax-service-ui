import React from 'react';
import { Link } from 'react-router-dom';
import logoTransparent from '../assets/images/ideax-logo-transparent.png';
import logoCropped from '../assets/images/ideax-logo-cropped.png';
import iconImg from '../assets/images/ideax-x-icon.png';

export default function BrandLogo({ size = 'md', showTagline = false, to = '/', variant = 'full' }) {
  const logoHeights = {
    sm: 'h-7',
    md: 'h-8 sm:h-9',
    lg: 'h-11 sm:h-12',
    xl: 'h-16',
  };

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  // If icon-only variant is requested
  if (variant === 'icon') {
    const iconContent = (
      <div className={`relative flex items-center justify-center rounded-xl bg-[#141414] border border-brand-border hover:border-brand-yellow/60 transition-all p-1.5 shadow-md ${iconSizes[size] || iconSizes.md}`}>
        <img
          src={iconImg}
          alt="ideaX"
          className="w-full h-full object-contain"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full hidden">
          <path d="M 20 80 L 38 80 L 68 50 L 38 20 L 20 20 L 44 50 Z" fill="#FFC000" />
          <path d="M 64 20 L 82 20 L 64 50 L 53 35 Z" fill="#FFFFFF" />
          <path d="M 64 80 L 82 80 L 64 50 L 53 65 Z" fill="#FFFFFF" />
        </svg>
      </div>
    );

    return to ? <Link to={to} className="inline-block">{iconContent}</Link> : iconContent;
  }

  // Full Wordmark with exact official logo from user specification:
  // - lowercase 'idea' with yellow dot on 'i'
  // - stylized 'x' with yellow left chevron '>' and white right arms
  const content = (
    <div className="flex flex-col group select-none">
      <div className="flex items-center">
        <img
          src={logoTransparent}
          alt="ideaX - Turning Ideas Into Software"
          className={`${logoHeights[size] || logoHeights.md} w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]`}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = logoCropped;
          }}
        />
      </div>
      {showTagline && (
        <span className="text-[10px] tracking-wider uppercase text-brand-muted font-medium -mt-0.5">
          Turning Ideas Into Software
        </span>
      )}
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
