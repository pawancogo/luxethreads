/**
 * Currency Display Component
 * Standardized currency display
 * Follows DRY principle
 */

import React from 'react';
import { formatCurrency } from '@/utils/format';
import { cn } from '@/lib/utils';

interface CurrencyDisplayProps {
  amount: number | string | null | undefined;
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  showSymbol?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  amount,
  currency = 'INR',
  locale,
  minimumFractionDigits,
  maximumFractionDigits,
  showSymbol = true,
  size = 'md',
  className,
}) => {
  const formatted = formatCurrency(amount, {
    currency,
    locale,
    minimumFractionDigits,
    maximumFractionDigits,
    showSymbol,
  });

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <span className={cn('font-semibold', sizeClasses[size], className)}>
      {formatted}
    </span>
  );
};

