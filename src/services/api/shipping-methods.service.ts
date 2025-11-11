/**
 * Shipping Methods API Service
 */

import { api } from './base';

export const shippingMethodsService = {
  /**
   * Get shipping methods
   */
  getShippingMethods: async () => {
    return api.get('/shipping_methods');
  },
};

