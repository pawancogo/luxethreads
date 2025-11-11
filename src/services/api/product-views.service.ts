/**
 * Product Views API Service
 */

import { api } from './base';

export const productViewsService = {
  /**
   * Track product view
   */
  trackView: async (productId: number, params?: {
    product_variant_id?: number;
    source?: 'search' | 'category' | 'brand' | 'direct' | 'recommendation';
    session_id?: string;
  }) => {
    return api.post(`/products/${productId}/views`, params || {});
  },
};

