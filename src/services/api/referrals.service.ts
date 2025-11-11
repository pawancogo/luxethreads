/**
 * Referrals API Service
 */

import { api } from './base';

export const referralsService = {
  /**
   * Get referrals
   */
  getReferrals: async () => {
    return api.get('/referrals');
  },

  /**
   * Get referral code
   */
  getReferralCode: async () => {
    return api.get('/referrals/code');
  },

  /**
   * Get referral statistics
   */
  getReferralStats: async () => {
    return api.get('/referrals/stats');
  },
};

