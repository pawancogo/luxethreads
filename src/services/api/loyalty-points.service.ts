/**
 * Loyalty Points API Service
 */

import { api } from './base';

export const loyaltyPointsService = {
  /**
   * Get loyalty points
   */
  getLoyaltyPoints: async (params?: {
    transaction_type?: 'earned' | 'redeemed' | 'expired' | 'adjusted';
  }) => {
    return api.get('/loyalty_points', { params });
  },

  /**
   * Get loyalty points balance
   */
  getBalance: async () => {
    return api.get('/loyalty_points/balance');
  },
};

