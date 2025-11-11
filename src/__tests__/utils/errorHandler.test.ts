import { describe, it, expect } from 'vitest';
import {
  extractErrorMessage,
  extractErrorMessages,
  isAuthError,
  getStatusErrorMessage,
} from '@/utils/errorHandler';

describe('errorHandler utilities', () => {
  describe('extractErrorMessage', () => {
    it('extracts message from Error object', () => {
      const error = new Error('Test error');
      expect(extractErrorMessage(error)).toBe('Test error');
    });

    it('extracts message from API error with errors array', () => {
      const error = { errors: ['Error 1', 'Error 2'] };
      expect(extractErrorMessage(error)).toBe('Error 1, Error 2');
    });

    it('extracts message from string error', () => {
      expect(extractErrorMessage('String error')).toBe('String error');
    });

    it('returns default message for unknown error', () => {
      expect(extractErrorMessage(null)).toBe('An unexpected error occurred');
    });
  });

  describe('extractErrorMessages', () => {
    it('returns array of error messages', () => {
      const error = { errors: ['Error 1', 'Error 2'] };
      expect(extractErrorMessages(error)).toEqual(['Error 1', 'Error 2']);
    });
  });

  describe('isAuthError', () => {
    it('detects authentication error', () => {
      const error = { isAuthError: true };
      expect(isAuthError(error)).toBe(true);
    });

    it('detects 401 status as auth error', () => {
      const error = { status: 401 };
      expect(isAuthError(error)).toBe(true);
    });
  });

  describe('getStatusErrorMessage', () => {
    it('returns message for 400', () => {
      expect(getStatusErrorMessage(400)).toContain('Invalid request');
    });

    it('returns message for 401', () => {
      expect(getStatusErrorMessage(401)).toContain('authorized');
    });

    it('returns message for 404', () => {
      expect(getStatusErrorMessage(404)).toContain('not found');
    });

    it('returns default message for unknown status', () => {
      expect(getStatusErrorMessage(999)).toContain('error occurred');
    });
  });
});





