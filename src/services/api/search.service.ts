/**
 * Search API Service
 */

import { api } from './base';

export interface SearchParams {
  query?: string;
  category_id?: number | string;
  brand_id?: number | string;
  min_price?: number;
  max_price?: number;
  featured?: boolean;
  bestseller?: boolean;
  new_arrival?: boolean;
  trending?: boolean;
  page?: number;
  per_page?: number;
}

export const searchService = {
  /**
   * Search products
   */
  search: async (params: SearchParams) => {
    return api.get('/search', { params });
  },
};

