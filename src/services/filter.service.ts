/**
 * Filter Service - Business Logic Layer
 * Handles filter operations, transformations, and business rules
 * Follows Single Responsibility Principle
 */

import { ProductFilters, FilterResult, AppliedFilter, AvailableFilters } from '@/types/filters';
import { FilterRepository } from './filter.repository';
import { FilterMapper } from './filter.mapper';
import { FilterUtils } from './filter.utils';

export interface FilterServiceOptions {
  debounceMs?: number;
  autoLoadOnFilterChange?: boolean;
}

/**
 * Filter Service - Business logic for filter operations
 */
export class FilterService {
  private repository: FilterRepository;
  private mapper: FilterMapper;
  private utils: FilterUtils;

  constructor(repository?: FilterRepository) {
    this.repository = repository || new FilterRepository();
    this.mapper = new FilterMapper();
    this.utils = new FilterUtils();
  }

  /**
   * Load filtered products
   */
  async loadFilteredProducts(
    filters: ProductFilters,
    page?: number
  ): Promise<FilterResult> {
    const filtersToApply = { ...filters };
    if (page !== undefined) {
      filtersToApply.page = page;
    }

    const response = await this.repository.getFilteredProducts(filtersToApply);
    return this.mapper.mapApiResponseToFilterResult(response, filtersToApply);
  }

  /**
   * Load more products (next page)
   */
  async loadMoreProducts(
    currentResult: FilterResult,
    filters: ProductFilters
  ): Promise<FilterResult | null> {
    if (!this.utils.canLoadMore(currentResult)) {
      return null;
    }

    const nextPage = currentResult.pagination.current_page + 1;
    const newResult = await this.loadFilteredProducts(filters, nextPage);

    // Merge products
    return {
      ...newResult,
      products: [...currentResult.products, ...newResult.products],
    };
  }

  /**
   * Get active filters for display
   */
  getActiveFilters(filters: ProductFilters): AppliedFilter[] {
    return this.utils.extractActiveFilters(filters);
  }

  /**
   * Check if a filter is active
   */
  isFilterActive(filters: ProductFilters, key: keyof ProductFilters): boolean {
    return this.utils.isFilterValueActive(filters[key]);
  }

  /**
   * Apply filter changes and reset pagination if needed
   */
  applyFilterChange(
    currentFilters: ProductFilters,
    key: keyof ProductFilters,
    value: ProductFilters[keyof ProductFilters]
  ): ProductFilters {
    const newFilters = { ...currentFilters, [key]: value };
    
    // Reset to page 1 when filters change (except page/per_page)
    if (key !== 'page' && key !== 'per_page') {
      newFilters.page = 1;
    }
    
    return newFilters;
  }

  /**
   * Apply multiple filter changes
   */
  applyMultipleFilterChanges(
    currentFilters: ProductFilters,
    newFilters: Partial<ProductFilters>
  ): ProductFilters {
    const updated = { ...currentFilters, ...newFilters };
    
    // Reset to page 1 if any non-pagination filter changed
    const hasNonPaginationChange = Object.keys(newFilters).some(
      k => k !== 'page' && k !== 'per_page'
    );
    
    if (hasNonPaginationChange) {
      updated.page = 1;
    }
    
    return updated;
  }

  /**
   * Clear a single filter
   */
  clearFilter(
    currentFilters: ProductFilters,
    key: keyof ProductFilters
  ): ProductFilters {
    const newFilters = { ...currentFilters };
    delete newFilters[key];
    newFilters.page = 1;
    return newFilters;
  }

  /**
   * Clear all filters (reset to defaults)
   */
  clearAllFilters(defaultFilters: ProductFilters): ProductFilters {
    return { ...defaultFilters };
  }

  /**
   * Update pagination in filters
   */
  updatePagination(
    filters: ProductFilters,
    currentPage: number
  ): ProductFilters {
    if (filters.page === currentPage) {
      return filters;
    }
    return { ...filters, page: currentPage };
  }
}

export const filterService = new FilterService();

