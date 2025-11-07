/**
 * Status Badge Component
 * Standardized status badge with color coding
 * Follows DRY principle
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type StatusVariant =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'default'
  | 'pending'
  | 'completed'
  | 'cancelled'
  | 'active'
  | 'inactive';

interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  className?: string;
}

const statusConfig: Record<StatusVariant, { label: string; className: string }> = {
  success: {
    label: 'Success',
    className: 'bg-green-100 text-green-800 hover:bg-green-200',
  },
  warning: {
    label: 'Warning',
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  },
  error: {
    label: 'Error',
    className: 'bg-red-100 text-red-800 hover:bg-red-200',
  },
  info: {
    label: 'Info',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  },
  default: {
    label: 'Default',
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  },
  pending: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  },
  completed: {
    label: 'Completed',
    className: 'bg-green-100 text-green-800 hover:bg-green-200',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-red-100 text-red-800 hover:bg-red-200',
  },
  active: {
    label: 'Active',
    className: 'bg-green-100 text-green-800 hover:bg-green-200',
  },
  inactive: {
    label: 'Inactive',
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  },
};

// Auto-detect variant from status string
function detectVariant(status: string): StatusVariant {
  const lowerStatus = status.toLowerCase();
  
  if (lowerStatus.includes('success') || lowerStatus.includes('completed') || lowerStatus.includes('active')) {
    return 'success';
  }
  if (lowerStatus.includes('pending') || lowerStatus.includes('processing')) {
    return 'pending';
  }
  if (lowerStatus.includes('cancelled') || lowerStatus.includes('failed') || lowerStatus.includes('error')) {
    return 'error';
  }
  if (lowerStatus.includes('warning')) {
    return 'warning';
  }
  if (lowerStatus.includes('inactive') || lowerStatus.includes('disabled')) {
    return 'inactive';
  }
  
  return 'default';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant,
  className,
}) => {
  const detectedVariant = variant || detectVariant(status);
  const config = statusConfig[detectedVariant] || statusConfig.default;

  return (
    <Badge className={cn(config.className, className)}>
      {status}
    </Badge>
  );
};

