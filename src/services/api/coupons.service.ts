/**
 * Coupons API Service
 */

import { api } from './base';

export const couponsService = {
  /**
   * Validate coupon
   */
  validateCoupon: async (code: string) => {
    return api.get('/coupons/validate', { params: { code } });
  },

  /**
   * Apply coupon
   */
  applyCoupon: async (code: string, cartId?: number) => {
    return api.post('/coupons/apply', { code, cart_id: cartId });
  },
};

