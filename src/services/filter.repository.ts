/**
 * Filter Repository - Data Access Layer
 * Abstracts API calls for filter operations
 * Follows Repository Pattern
 */

import { ProductFilters } from '@/types/filters';
import { productsService } from './api/products.service';

/**
 * Filter Repository - Handles data access for filters
 */
export class FilterRepository {
  /**
   * Get filtered products from API
   */
  async getFilteredProducts(filters: ProductFilters): Promise<any> {
    try {
      return await productsService.getPublicProducts(filters);
    } catch (error) {
      throw error;
    }
  }
}

export const filterRepository = new FilterRepository();

