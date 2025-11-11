/**
 * Filter Utils - Utility Functions
 * Helper functions for filter operations
 * Follows DRY principle
 */

import { ProductFilters, AppliedFilter, FilterResult } from '@/types/filters';

/**
 * Filter Utils - Utility functions for filter operations
 */
export class FilterUtils {
  /**
   * Check if a filter value is active
   */
  isFilterValueActive(value: any): boolean {
    if (value === undefined || value === null) return false;
    if (typeof value === 'boolean') return value === true;
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'number') return value > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  }

  /**
   * Extract active filters for display
   */
  extractActiveFilters(filters: ProductFilters): AppliedFilter[] {
    const active: AppliedFilter[] = [];

    if (filters.min_price || filters.max_price) {
      active.push({
        type: 'price',
        label: 'Price',
        min: filters.min_price,
        max: filters.max_price,
      });
    }

    if (filters.category_id || filters.category_slug) {
      active.push({
        type: 'category',
        label: 'Category',
        value: filters.category_id || filters.category_slug,
      });
    }

    if (filters.brand_id || filters.brand_slug) {
      active.push({
        type: 'brand',
        label: 'Brand',
        value: filters.brand_id || filters.brand_slug,
      });
    }

    if (filters.featured) {
      active.push({ type: 'featured', label: 'Featured' });
    }
    if (filters.bestseller) {
      active.push({ type: 'bestseller', label: 'Bestseller' });
    }
    if (filters.new_arrival) {
      active.push({ type: 'new_arrival', label: 'New Arrival' });
    }
    if (filters.trending) {
      active.push({ type: 'trending', label: 'Trending' });
    }

    if (filters.in_stock !== undefined) {
      active.push({
        type: 'in_stock',
        label: filters.in_stock ? 'In Stock' : 'Out of Stock',
        value: filters.in_stock,
      });
    }

    if (filters.min_rating) {
      active.push({
        type: 'rating',
        label: 'Rating',
        value: filters.min_rating,
      });
    }

    if (filters.query) {
      active.push({
        type: 'query',
        label: 'Search',
        value: filters.query,
      });
    }

    if (filters.attribute_values && filters.attribute_values.length > 0) {
      active.push({
        type: 'attributes',
        label: 'Attributes',
        value: filters.attribute_values,
      });
    }

    return active;
  }

  /**
   * Check if more results can be loaded
   */
  canLoadMore(result: FilterResult | null): boolean {
    if (!result) return false;
    const { current_page, total_pages } = result.pagination;
    return current_page < total_pages;
  }

  /**
   * Check if we're on a products page
   */
  isProductsPage(pathname: string): boolean {
    return pathname === '/products' || pathname === '/products-filtered';
  }

  /**
   * Get default filters
   */
  getDefaultFilters(): ProductFilters {
    return {
      page: 1,
      per_page: 20,
      sort_by: 'recommended',
    };
  }
}

export const filterUtils = new FilterUtils();

