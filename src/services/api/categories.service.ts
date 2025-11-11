/**
 * Categories API Service
 */

import { api } from './base';

export const categoriesService = {
  /**
   * Get all categories
   */
  getAll: async () => {
    return api.get('/categories');
  },

  /**
   * Get category by slug or ID
   */
  getBySlugOrId: async (slugOrId: string | number) => {
    return api.get(`/categories/${slugOrId}`);
  },

  /**
   * Get navigation structure
   */
  getNavigation: async () => {
    return api.get('/categories/navigation');
  },
};

