import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode, useEffect } from 'react';
import { ProductFilters, FilterResult, AppliedFilter, AvailableFilters } from '@/types/filters';
import { productsAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface FilterContextType {
  // Filters
  filters: ProductFilters;
  
  // Results
  results: FilterResult | null;
  isLoading: boolean;
  error: string | null;
  
  // Available filter options
  availableFilters: AvailableFilters | null;
  
  // Filter actions
  setFilter: <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => void;
  setFilters: (newFilters: Partial<ProductFilters>) => void;
  clearFilter: (key: keyof ProductFilters) => void;
  clearAllFilters: () => void;
  
  // Load results
  loadResults: (page?: number) => Promise<void>;
  loadMore: () => Promise<void>;
  
  // Get active filters for display
  getActiveFilters: () => AppliedFilter[];
  
  // Check if filter is active
  isFilterActive: (key: keyof ProductFilters) => boolean;
}

const FilterContext = createContext<FilterContextType | null>(null);

const defaultFilters: ProductFilters = {
  page: 1,
  per_page: 20,
  sort_by: 'recommended',
};

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  const [filters, setFiltersState] = useState<ProductFilters>(defaultFilters);
  const [results, setResults] = useState<FilterResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableFilters, setAvailableFilters] = useState<AvailableFilters | null>(null);
  
  // Load results with current filters
  const loadResults = useCallback(async (page?: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const filtersToApply = { ...filters };
      if (page !== undefined) {
        filtersToApply.page = page;
      }
      
      const response: any = await productsAPI.getPublicProducts(filtersToApply);
      
      // Handle response structure (API interceptor already extracts data)
      let products = [];
      let pagination = null;
      let filters_applied: AppliedFilter[] = [];
      let available_filters: AvailableFilters | null = null;
      
      if (Array.isArray(response)) {
        // Legacy format
        products = response;
        pagination = {
          total_count: response.length,
          total_pages: 1,
          current_page: filtersToApply.page || 1,
          per_page: filtersToApply.per_page || 20,
        };
      } else if (response && typeof response === 'object') {
        // New format with pagination and filters
        products = response.products || [];
        pagination = response.pagination || null;
        filters_applied = response.filters_applied || [];
        available_filters = response.available_filters || null;
      }
      
      if (page === 1 || page === undefined) {
        setResults({
          products,
          pagination: pagination || {
            total_count: products.length,
            total_pages: 1,
            current_page: filtersToApply.page || 1,
            per_page: filtersToApply.per_page || 20,
          },
          filters_applied,
          available_filters,
        });
      } else {
        // Append to existing results
        setResults(prev => {
          if (!prev) return null;
          return {
            ...prev,
            products: [...prev.products, ...products],
            pagination: pagination || prev.pagination,
            filters_applied,
          };
        });
      }
      
      // Update available filters if provided
      if (available_filters) {
        setAvailableFilters(available_filters);
      }
      
      // Update filters state with current page
      setFiltersState(prev => ({
        ...prev,
        page: pagination?.current_page || filtersToApply.page || 1,
      }));
    } catch (err: any) {
      const errorMessage = err?.errors?.[0] || err?.message || 'Failed to load products';
      setError(errorMessage);
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [filters, toast]);
  
  // Load more results (next page)
  const loadMore = useCallback(async () => {
    if (!results || isLoading) return;
    
    const currentPage = results.pagination.current_page;
    const totalPages = results.pagination.total_pages;
    
    if (currentPage >= totalPages) return;
    
    await loadResults(currentPage + 1);
  }, [results, isLoading, loadResults]);
  
  // Set single filter
  const setFilter = useCallback(<K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => {
    setFiltersState(prev => {
      const newFilters = { ...prev, [key]: value };
      
      // Reset to page 1 when filters change (except page itself)
      if (key !== 'page' && key !== 'per_page') {
        newFilters.page = 1;
      }
      
      return newFilters;
    });
  }, []);
  
  // Set multiple filters
  const setFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    setFiltersState(prev => {
      const updated = { ...prev, ...newFilters };
      
      // Reset to page 1 when filters change
      if (Object.keys(newFilters).some(k => k !== 'page' && k !== 'per_page')) {
        updated.page = 1;
      }
      
      return updated;
    });
  }, []);
  
  // Clear single filter
  const clearFilter = useCallback((key: keyof ProductFilters) => {
    setFiltersState(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      
      // Reset to page 1
      newFilters.page = 1;
      
      return newFilters;
    });
  }, []);
  
  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFiltersState(defaultFilters);
  }, []);
  
  // Get active filters for display
  const getActiveFilters = useCallback((): AppliedFilter[] => {
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
  }, [filters]);
  
  // Check if filter is active
  const isFilterActive = useCallback((key: keyof ProductFilters): boolean => {
    const value = filters[key];
    
    if (value === undefined || value === null) return false;
    if (typeof value === 'boolean') return value === true;
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'number') return value > 0;
    if (Array.isArray(value)) return value.length > 0;
    
    return true;
  }, [filters]);
  
  // Load results when filters change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadResults();
    }, 300); // Debounce filter changes
    
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.min_price,
    filters.max_price,
    filters.category_id,
    filters.category_slug,
    filters.brand_id,
    filters.brand_slug,
    filters.featured,
    filters.bestseller,
    filters.new_arrival,
    filters.trending,
    filters.in_stock,
    filters.min_rating,
    filters.query,
    filters.sort_by,
    // Note: attribute_values is an array, so we stringify it for comparison
    JSON.stringify(filters.attribute_values),
  ]);
  
  const value: FilterContextType = useMemo(() => ({
    filters,
    results,
    isLoading,
    error,
    availableFilters,
    setFilter,
    setFilters,
    clearFilter,
    clearAllFilters,
    loadResults,
    loadMore,
    getActiveFilters,
    isFilterActive,
  }), [
    filters,
    results,
    isLoading,
    error,
    availableFilters,
    setFilter,
    setFilters,
    clearFilter,
    clearAllFilters,
    loadResults,
    loadMore,
    getActiveFilters,
    isFilterActive,
  ]);
  
  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};

