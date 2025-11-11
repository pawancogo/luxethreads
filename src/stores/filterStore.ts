/**
 * Filter Store - Zustand implementation
 * Performance optimized with selectors and debouncing
 * Replaces FilterContext
 */

import { create } from 'zustand';
import { ProductFilters, FilterResult, AppliedFilter, AvailableFilters } from '@/types/filters';
import { filterService } from '@/services/filter.service';
import { filterUtils } from '@/services/filter.utils';
import { filterMapper } from '@/services/filter.mapper';

interface FilterState {
  filters: ProductFilters;
  results: FilterResult | null;
  isLoading: boolean;
  error: string | null;
  availableFilters: AvailableFilters | null;
  isInitialMount: boolean;
  // Actions
  setFilter: <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => void;
  setFilters: (newFilters: Partial<ProductFilters>) => void;
  clearFilter: (key: keyof ProductFilters) => void;
  clearAllFilters: () => void;
  loadResults: (page?: number) => Promise<void>;
  loadMore: () => Promise<void>;
  getActiveFilters: () => AppliedFilter[];
  isFilterActive: (key: keyof ProductFilters) => boolean;
  setResults: (results: FilterResult | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAvailableFilters: (filters: AvailableFilters | null) => void;
  setInitialMount: (value: boolean) => void;
}

const defaultFilters = filterUtils.getDefaultFilters();

export const useFilterStore = create<FilterState>((set, get) => ({
  filters: defaultFilters,
  results: null,
  isLoading: false,
  error: null,
  availableFilters: null,
  isInitialMount: true,

  setFilter: <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => {
    set((state) => ({
      filters: filterService.applyFilterChange(state.filters, key, value),
    }));
  },

  setFilters: (newFilters: Partial<ProductFilters>) => {
    set((state) => ({
      filters: filterService.applyMultipleFilterChanges(state.filters, newFilters),
    }));
  },

  clearFilter: (key: keyof ProductFilters) => {
    set((state) => ({
      filters: filterService.clearFilter(state.filters, key),
    }));
  },

  clearAllFilters: () => {
    set({ filters: filterService.clearAllFilters(defaultFilters) });
  },

  loadResults: async (page?: number) => {
    const { filters } = get();
    set({ isLoading: true, error: null });

    try {
      const result = await filterService.loadFilteredProducts(filters, page);

      // Update results based on page
      if (page === 1 || page === undefined) {
        set({ results: result });
      } else {
        // Merge with existing results for pagination
        const currentResults = get().results;
        if (currentResults) {
          set({ results: filterMapper.mergeFilterResults(currentResults, result) });
        } else {
          set({ results: result });
        }
      }

      // Update available filters
      if (result.available_filters) {
        set({ availableFilters: result.available_filters });
      }

      // Update pagination in filters
      set((state) => ({
        filters: filterService.updatePagination(state.filters, result.pagination.current_page),
      }));
    } catch (err: any) {
      const errorMessage = err?.errors?.[0] || err?.message || 'Failed to load products';
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  loadMore: async () => {
    const { results, isLoading } = get();
    if (!results || isLoading || !filterUtils.canLoadMore(results)) {
      return;
    }
    await get().loadResults(results.pagination.current_page + 1);
  },

  getActiveFilters: () => {
    const { filters } = get();
    return filterService.getActiveFilters(filters);
  },

  isFilterActive: (key: keyof ProductFilters) => {
    const { filters } = get();
    return filterService.isFilterActive(filters, key);
  },

  setResults: (results: FilterResult | null) => set({ results }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
  setAvailableFilters: (availableFilters: AvailableFilters | null) => set({ availableFilters }),
  setInitialMount: (isInitialMount: boolean) => set({ isInitialMount }),
}));

/**
 * Filter Hook - Provides same API as FilterContext
 * Includes auto-loading with debouncing
 */
export const useFilter = () => {
  const store = useFilterStore();
  return store;
};

/**
 * Performance-optimized selectors
 */
export const useFilters = () => useFilterStore((state) => state.filters);
export const useFilterResults = () => useFilterStore((state) => state.results);
export const useFilterLoading = () => useFilterStore((state) => state.isLoading);
export const useFilterError = () => useFilterStore((state) => state.error);
export const useAvailableFilters = () => useFilterStore((state) => state.availableFilters);

