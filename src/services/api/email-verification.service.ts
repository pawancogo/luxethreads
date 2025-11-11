/**
 * Email Verification API Service
 */

import { api } from './base';

export const emailVerificationService = {
  /**
   * Verify email with token
   */
  verify: async (token: string) => {
    return api.get('/email/verify', { params: { token } });
  },

  /**
   * Resend verification email (public - no auth required)
   */
  resend: async (email: string) => {
    return api.post('/email/resend', { email });
  },

  /**
   * Resend verification email (authenticated)
   */
  resendAuthenticated: async () => {
    return api.post('/email/resend_authenticated');
  },

  /**
   * Get email verification status
   */
  getStatus: async () => {
    return api.get('/email/status');
  },
};

