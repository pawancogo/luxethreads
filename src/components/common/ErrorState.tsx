/**
 * Error State Component
 * Standardized error display
 * Follows DRY principle
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { extractErrorMessage } from '@/utils/errorHandler';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  error: unknown;
  title?: string;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
  variant?: 'default' | 'card' | 'inline';
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  title = 'Something went wrong',
  onRetry,
  retryText = 'Try again',
  className,
  variant = 'default',
}) => {
  const message = extractErrorMessage(error);

  const content = (
    <div className={cn('flex flex-col items-center justify-center gap-4 text-center', className)}>
      <AlertCircle className="h-12 w-12 text-red-500" />
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{message}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          {retryText}
        </Button>
      )}
    </div>
  );

  if (variant === 'card') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>{content}</CardContent>
      </Card>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="py-4">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      {content}
    </div>
  );
};

