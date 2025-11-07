/**
 * Error Handling Utilities
 * Centralized error handling following DRY principle
 */

export interface ApiError {
  message: string;
  errors?: string[];
  status?: number;
  isAuthError?: boolean;
}

/**
 * Extract error message from various error types
 */
export function extractErrorMessage(error: unknown): string {
  if (!error) return 'An unexpected error occurred';
  
  // Error object with message
  if (error instanceof Error) {
    return error.message || 'An error occurred';
  }
  
  // API error with errors array
  if (typeof error === 'object' && 'errors' in error) {
    const apiError = error as ApiError;
    if (apiError.errors && apiError.errors.length > 0) {
      return apiError.errors.join(', ');
    }
    return apiError.message || 'An error occurred';
  }
  
  // String error
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred';
}

/**
 * Extract error messages array
 */
export function extractErrorMessages(error: unknown): string[] {
  if (!error) return ['An unexpected error occurred'];
  
  // API error with errors array
  if (typeof error === 'object' && 'errors' in error) {
    const apiError = error as ApiError;
    if (apiError.errors && apiError.errors.length > 0) {
      return apiError.errors;
    }
    return [apiError.message || 'An error occurred'];
  }
  
  // Error object with message
  if (error instanceof Error) {
    return [error.message || 'An error occurred'];
  }
  
  // String error
  if (typeof error === 'string') {
    return [error];
  }
  
  return ['An unexpected error occurred'];
}

/**
 * Check if error is authentication error
 */
export function isAuthError(error: unknown): boolean {
  if (typeof error === 'object' && error !== null) {
    const apiError = error as ApiError;
    return apiError.isAuthError === true || apiError.status === 401;
  }
  return false;
}

/**
 * Get user-friendly error message based on status code
 */
export function getStatusErrorMessage(status?: number): string {
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input and try again.';
    case 401:
      return 'You are not authorized to perform this action. Please log in.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 422:
      return 'Validation failed. Please check your input.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'Server error. Please try again later.';
    case 503:
      return 'Service temporarily unavailable. Please try again later.';
    default:
      return 'An error occurred. Please try again.';
  }
}
