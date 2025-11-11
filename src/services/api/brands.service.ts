/**
 * Brands API Service
 */

import { api } from './base';

export const brandsService = {
  /**
   * Get all brands
   */
  getAll: async () => {
    return api.get('/brands');
  },

  /**
   * Get brand by slug or ID
   */
  getBySlugOrId: async (slugOrId: string | number) => {
    return api.get(`/brands/${slugOrId}`);
  },
};

