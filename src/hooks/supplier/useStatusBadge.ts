import { Badge } from '@/components/ui/badge';
import React from 'react';

interface StatusVariant {
  [key: string]: 'default' | 'secondary' | 'destructive' | 'outline';
}

export const useStatusBadge = () => {
  const statusVariants: StatusVariant = {
    pending: 'secondary',
    active: 'default',
    rejected: 'destructive',
    archived: 'outline',
    paid: 'default',
    shipped: 'default',
    delivered: 'default',
  };

  const getStatusBadge = (status: string | null | undefined): React.ReactNode => {
    if (!status) {
      return React.createElement(Badge, { variant: 'secondary' }, 'Unknown');
    }
    const variant = statusVariants[status] || 'secondary';
    const displayText = status.replace('_', ' ');
    return React.createElement(Badge, { variant }, displayText);
  };

  return { getStatusBadge };
};

