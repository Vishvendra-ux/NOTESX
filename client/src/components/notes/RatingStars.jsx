import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ 
  value = 0, 
  max = 5, 
  size = 14, 
  interactive = false, 
  onChange, 
  className = '' 
}) {
  const [hoverValue, setHoverValue] = useState(0);

  const displayValue = interactive && hoverValue > 0 ? hoverValue : value;

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      {Array.from({ length: max }, (_, i) => {
        const starIndex = i + 1;
        const isFilled = starIndex <= Math.round(displayValue);

        return (
          <button
            key={starIndex}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange && onChange(starIndex)}
            onMouseEnter={() => interactive && setHoverValue(starIndex)}
            onMouseLeave={() => interactive && setHoverValue(0)}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} p-0.5 focus:outline-none`}
            aria-label={`${starIndex} star`}
          >
            <Star
              size={size}
              className={`${
                isFilled
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-slate-300 stroke-slate-300 fill-transparent'
              } transition-colors`}
            />
          </button>
        );
      })}
    </div>
  );
}
