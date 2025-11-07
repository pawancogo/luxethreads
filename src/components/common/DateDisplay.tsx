/**
 * Date Display Component
 * Standardized date display with formatting options
 * Follows DRY principle
 */

import React from 'react';
import { formatDate, formatRelativeTime } from '@/utils/format';
import { cn } from '@/lib/utils';

interface DateDisplayProps {
  date: Date | string | number | null | undefined;
  format?: 'date' | 'datetime' | 'relative' | 'custom';
  customFormat?: string;
  locale?: string;
  className?: string;
}

export const DateDisplay: React.FC<DateDisplayProps> = ({
  date,
  format = 'date',
  customFormat,
  locale,
  className,
}) => {
  if (!date) {
    return null;
  }

  let formatted: string;

  switch (format) {
    case 'relative':
      formatted = formatRelativeTime(date);
      break;
    case 'datetime':
      formatted = formatDate(date, {
        locale,
        dateStyle: 'short',
        timeStyle: 'short',
      });
      break;
    case 'custom':
      formatted = formatDate(date, {
        locale,
        format: customFormat || 'YYYY-MM-DD',
      });
      break;
    case 'date':
    default:
      formatted = formatDate(date, {
        locale,
        dateStyle: 'medium',
      });
      break;
  }

  return (
    <span className={cn('text-gray-700', className)}>
      {formatted}
    </span>
  );
};

