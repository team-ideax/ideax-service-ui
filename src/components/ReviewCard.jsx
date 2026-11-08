import React, { useState } from 'react';
import { Star, Quote } from 'lucide-react';

export default function ReviewCard({ review }) {
  const [imgError, setImgError] = useState(false);

  // Generate initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return 'IX';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const rating = Number(review.rating) || 5;

  return (
    <div className="relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-brand-card border border-brand-border hover:border-brand-yellow/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-yellow-sm group">
      {/* Decorative Quote Icon */}
      <Quote className="absolute top-5 right-6 w-8 h-8 text-brand-yellow/10 group-hover:text-brand-yellow/20 transition-colors pointer-events-none" />

      <div>
        {/* Rating Stars */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < rating
                  ? 'text-brand-yellow fill-brand-yellow'
                  : 'text-gray-700 fill-gray-700'
              }`}
            />
          ))}
        </div>

        {/* Feedback Text */}
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 italic">
          "{review.feedback}"
        </p>
      </div>

      {/* Reviewer Details */}
      <div className="pt-4 border-t border-brand-border/60 flex items-center gap-3">
        {/* Avatar */}
        {review.imageUrl && !imgError ? (
          <img
            src={review.imageUrl}
            alt={review.customerName}
            onError={() => setImgError(true)}
            className="w-11 h-11 rounded-full object-cover border border-brand-yellow/40 shrink-0"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#2a2a2a] to-[#141414] border border-brand-border flex items-center justify-center font-bold text-sm text-brand-yellow shrink-0">
            {getInitials(review.customerName)}
          </div>
        )}

        {/* Name and Project */}
        <div className="min-w-0 flex-1">
          <h4 className="text-white font-semibold text-sm truncate">
            {review.customerName}
          </h4>
          {review.projectName && (
            <p className="text-brand-yellow text-xs truncate">
              {review.projectName}
            </p>
          )}
          {review.reviewDate && (
            <span className="text-[11px] text-brand-muted/70 block">
              {new Date(review.reviewDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
