/**
 * Promotions API Service
 */

import { api } from './base';

export const promotionsService = {
  /**
   * Get promotions
   */
  getPromotions: async (params?: {
    promotion_type?: string;
    featured?: boolean;
  }) => {
    return api.get('/promotions', { params });
  },

  /**
   * Get promotion
   */
  getPromotion: async (promotionId: string | number) => {
    return api.get(`/promotions/${promotionId}`);
  },
};

