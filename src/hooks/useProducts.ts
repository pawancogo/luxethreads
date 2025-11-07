import { useCallback, useEffect, useMemo, useState } from 'react';
import { productsService, type ProductFilters } from '@/services/api';

interface UseProductsState<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useProducts(initialFilters?: ProductFilters) {
  const [filters, setFilters] = useState<ProductFilters>(initialFilters || {});
  const [state, setState] = useState<UseProductsState<any[]>>({ data: null, loading: false, error: null });

  const fetchProducts = useCallback(async (params?: ProductFilters) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await productsService.getPublicProducts(params || filters);
      setState({ data: res || [], loading: false, error: null });
      return res;
    } catch (e: any) {
      setState({ data: null, loading: false, error: e?.message || 'Failed to load products' });
      throw e;
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => ({
    ...state,
    filters,
    setFilters,
    refetch: fetchProducts,
  }), [state, filters, fetchProducts]);

  return value;
}

export function useProduct(idOrSlug: string | number | null | undefined) {
  const [state, setState] = useState<UseProductsState<any>>({ data: null, loading: false, error: null });

  const fetchProduct = useCallback(async () => {
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
  }, [idOrSlug]);

  useEffect(() => {
    fetchProduct().catch(() => {});
  }, [fetchProduct]);

  return useMemo(() => ({ ...state, refetch: fetchProduct }), [state, fetchProduct]);
}
