/**
 * Filter Mapper - Data Transformation Layer
 * Maps API responses to application models
 * Follows Single Responsibility Principle
 */

import { FilterResult, AppliedFilter, AvailableFilters, ProductFilters } from '@/types/filters';

export interface ApiProductResponse {
  products?: any[];
  pagination?: {
    total_count: number;
    total_pages: number;
    current_page: number;
    per_page: number;
  };
  filters_applied?: AppliedFilter[];
  available_filters?: AvailableFilters;
}

/**
 * Filter Mapper - Transforms API responses to application models
 */
export class FilterMapper {
  /**
   * Map API response to FilterResult
   */
  mapApiResponseToFilterResult(
    response: any,
    filters: ProductFilters
  ): FilterResult {
    let products: any[] = [];
    let pagination = null;
    let filters_applied: AppliedFilter[] = [];
    let available_filters: AvailableFilters | null = null;

    // Handle array response (legacy format)
    if (Array.isArray(response)) {
      products = response;
      pagination = {
        total_count: response.length,
        total_pages: 1,
        current_page: filters.page || 1,
        per_page: filters.per_page || 20,
      };
    }
    // Handle object response (new format)
    else if (response && typeof response === 'object') {
      products = response.products || [];
      pagination = response.pagination || null;
      filters_applied = response.filters_applied || [];
      available_filters = response.available_filters || null;
    }

    // Ensure pagination exists
    if (!pagination) {
      pagination = {
        total_count: products.length,
        total_pages: 1,
        current_page: filters.page || 1,
        per_page: filters.per_page || 20,
      };
    }

    return {
      products,
      pagination,
      filters_applied,
      available_filters,
    };
  }

  /**
   * Merge filter results (for pagination)
   */
  mergeFilterResults(
    existing: FilterResult,
    newResult: FilterResult
  ): FilterResult {
    return {
      ...newResult,
      products: [...existing.products, ...newResult.products],
      pagination: newResult.pagination || existing.pagination,
    };
  }
}

export const filterMapper = new FilterMapper();

