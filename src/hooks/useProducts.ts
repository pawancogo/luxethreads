/**
 * useProducts Hook - Clean Architecture Implementation
 * Removed unnecessary useCallback and useMemo hooks
 * Follows: UI → Logic (Services) → Data (API Services)
 */

import { useEffect, useState } from 'react';
import { productsService, type ProductFilters } from '@/services/api';

interface UseProductsState<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useProducts(initialFilters?: ProductFilters) {
  const [filters, setFilters] = useState<ProductFilters>(initialFilters || {});
  const [state, setState] = useState<UseProductsState<any[]>>({ data: null, loading: false, error: null });

  const fetchProducts = async (params?: ProductFilters) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await productsService.getPublicProducts(params || filters);
      setState({ data: res || [], loading: false, error: null });
      return res;
    } catch (e: any) {
      setState({ data: null, loading: false, error: e?.message || 'Failed to load products' });
      throw e;
    }
  };

  useEffect(() => {
    fetchProducts().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    ...state,
    filters,
    setFilters,
    refetch: fetchProducts,
  };
}

export function useProduct(idOrSlug: string | number | null | undefined) {
  const [state, setState] = useState<UseProductsState<any>>({ data: null, loading: false, error: null });

  const fetchProduct = async () => {
    if (!idOrSlug) return null;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await productsService.getPublicProduct(idOrSlug);
      setState({ data: res || null, loading: false, error: null });
      return res;
    } catch (e: any) {
      setState({ data: null, loading: false, error: e?.message || 'Failed to load product' });
      throw e;
    }
  };

  useEffect(() => {
    fetchProduct().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idOrSlug]);

  return {
    ...state,
    refetch: fetchProduct,
  };
}
