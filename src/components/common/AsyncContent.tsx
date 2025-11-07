/**
 * Async Content Component
 * Handles loading, error, and empty states
 * Follows DRY principle - eliminates repetitive loading/error handling
 */

import React from 'react';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';

interface AsyncContentProps<T> {
  // Data
  data: T | null | undefined;
  
  // States
  isLoading: boolean;
  error: unknown;
  
  // Configuration
  loadingText?: string;
  errorTitle?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: {
    label: string;
    onClick: () => void;
  };
  
  // Custom renderers
  renderLoading?: () => React.ReactNode;
  renderError?: (error: unknown) => React.ReactNode;
  renderEmpty?: () => React.ReactNode;
  
  // Content renderer
  children: (data: T) => React.ReactNode;
  
  // Options
  showEmptyState?: boolean;
  isEmpty?: (data: T) => boolean;
  onRetry?: () => void;
}

export function AsyncContent<T>({
  data,
  isLoading,
  error,
  loadingText,
  errorTitle,
  emptyTitle,
  emptyDescription,
  emptyAction,
  renderLoading,
  renderError,
  renderEmpty,
  children,
  showEmptyState = true,
  isEmpty = (data: T) => {
    if (Array.isArray(data)) return data.length === 0;
    return !data;
  },
  onRetry,
}: AsyncContentProps<T>) {
  // Loading state
  if (isLoading) {
    if (renderLoading) return <>{renderLoading()}</>;
    return <LoadingState text={loadingText} />;
  }

  // Error state
  if (error) {
    if (renderError) return <>{renderError(error)}</>;
    return (
      <ErrorState
        error={error}
        title={errorTitle}
        onRetry={onRetry}
      />
    );
  }

  // Empty state
  if (showEmptyState && data !== null && data !== undefined && isEmpty(data)) {
    if (renderEmpty) return <>{renderEmpty()}</>;
    return (
      <EmptyState
        title={emptyTitle || 'No data found'}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  // Render content
  if (data === null || data === undefined) {
    return null;
  }

  return <>{children(data)}</>;
}

