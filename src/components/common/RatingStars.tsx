import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  reviewCount?: number;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  size = 'sm',
  showNumber = false,
  reviewCount
}) => {
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const stars = [];
  for (let i = 1; i <= maxRating; i++) {
    const fillPercentage = Math.max(0, Math.min(100, (rating - (i - 1)) * 100));
    
    stars.push(
      <div key={i} className="relative inline-block" aria-hidden="true">
        {/* Empty gray star background */}
        <Star className={`${iconSizes[size]} text-book-stone-300 stroke-1`} />
        {/* Filled star foreground clipped by percentage */}
        {fillPercentage > 0 && (
          <div
            className="absolute top-0 left-0 overflow-hidden"
            style={{ width: `${fillPercentage}%` }}
          >
            <Star className={`${iconSizes[size]} fill-book-amber text-book-amber stroke-1`} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5" aria-label={`Rating: ${rating.toFixed(1)} out of ${maxRating} stars${reviewCount ? ` across ${reviewCount} reviews` : ''}`}>
      <div className="flex items-center gap-0.5">{stars}</div>
      {showNumber && (
        <span className="text-xs font-semibold text-book-charcoal font-mono">
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className="text-xs text-book-stone-500 font-mono">
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
};
