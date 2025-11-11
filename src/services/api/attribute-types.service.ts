/**
 * Attribute Types API Service
 */

import { api } from './base';

export const attributeTypesService = {
  /**
   * Get all attribute types
   */
  getAll: async (params?: { level?: 'product' | 'variant'; category_id?: number }) => {
    return api.get('/attribute_types', { params });
  },
};

