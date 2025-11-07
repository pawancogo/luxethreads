/**
 * Price Display Component
 * Standardized price display with discount support
 * Follows DRY principle
 */

import React from 'react';
import { formatPrice } from '@/utils/format';
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  price: number;
  originalPrice?: number | null;
  currency?: string;
  showDiscount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  originalPrice,
  currency = '₹',
  showDiscount = true,
  size = 'md',
  className,
}) => {
  const discountPercentage = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const sizeClasses = {
    sm: {
      price: 'text-sm',
      original: 'text-xs',
      discount: 'text-xs',
    },
    md: {
      price: 'text-base',
      original: 'text-sm',
      discount: 'text-sm',
    },
    lg: {
      price: 'text-xl',
      original: 'text-base',
      discount: 'text-base',
    },
  };

  const classes = sizeClasses[size];

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      <span className={cn('font-bold text-gray-900', classes.price)}>
        {currency}{formatPrice(price)}
      </span>
      {originalPrice && originalPrice > price && (
        <>
          <span className={cn('text-gray-500 line-through', classes.original)}>
            {currency}{formatPrice(originalPrice)}
          </span>
          {showDiscount && discountPercentage > 0 && (
            <span className={cn('text-orange-600 font-medium', classes.discount)}>
              ({discountPercentage}% OFF)
            </span>
          )}
        </>
      )}
    </div>
  );
};

