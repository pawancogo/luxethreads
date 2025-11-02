/**
 * Utility functions for handling errors consistently across the application
 */

export interface ApiError {
  errors?: string[];
  message?: string;
  status?: number;
}

export const extractErrorMessage = (error: any): string => {
  if (error?.errors && Array.isArray(error.errors) && error.errors.length > 0) {
    return error.errors[0];
  }
  if (error?.message) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
};

export const isApiError = (error: any): error is ApiError => {
  return error && (error.errors || error.message || error.status);
};

