/**
 * Product Repository - Data Access Layer
 * Abstracts product API calls
 * Follows Repository Pattern
 */

import { productsService, ProductFilters } from './api/products.service';
import { categoriesService } from './api/categories.service';
import { productViewsService } from './api/product-views.service';

export class ProductRepository {
  /**
   * Get public products
   */
  async getPublicProducts(filters?: ProductFilters) {
    return productsService.getPublicProducts(filters);
  }

  /**
   * Get public product by ID or slug
   */
  async getPublicProduct(idOrSlug: string | number) {
    return productsService.getPublicProduct(idOrSlug);
  }

  /**
   * Get all categories
   */
  async getCategories() {
    return categoriesService.getAll();
  }

  /**
   * Get category by slug or ID
   */
  async getCategory(slugOrId: string | number) {
    return categoriesService.getBySlugOrId(slugOrId);
  }

  /**
   * Track product view
   */
  async trackProductView(productId: number, params?: {
    product_variant_id?: number;
    source?: 'search' | 'category' | 'brand' | 'direct' | 'recommendation';
    session_id?: string;
  }) {
    return productViewsService.trackView(productId, params);
  }
}

