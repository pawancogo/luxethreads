/**
 * Filter Auto-Load Hook
 * Handles automatic loading of filter results when filters change
 * Includes debouncing and route checking for performance
 */

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useFilterStore } from '@/stores/filterStore';
import { filterUtils } from '@/services/filter.utils';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to auto-load filter results when filters change
 * Debounced to prevent excessive API calls
 */
export const useFilterAutoLoad = () => {
  const location = useLocation();
  const { toast } = useToast();
  const {
    filters,
    isInitialMount,
    loadResults,
    setInitialMount,
    setError,
  } = useFilterStore();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Skip on initial mount
    if (isInitialMount) {
      setInitialMount(false);
      return;
    }

    // Only auto-load on products pages
    if (!filterUtils.isProductsPage(location.pathname)) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce filter changes
    timeoutRef.current = setTimeout(async () => {
      try {
        await loadResults();
      } catch (err: any) {
        const errorMessage = err?.errors?.[0] || err?.message || 'Failed to load products';
        setError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
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
    JSON.stringify(filters.attribute_values),
    location.pathname,
    isInitialMount,
    loadResults,
    setInitialMount,
    setError,
    toast,
  ]);
};

