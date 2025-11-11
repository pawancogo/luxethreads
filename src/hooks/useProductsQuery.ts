/**
 * useProductsQuery Hook - Clean Architecture Implementation
 * Uses ProductService for business logic
 * Follows: UI → Logic (Services) → Data (API Services)
 */

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { productsService } from '@/services/api/products.service';

// Query keys for consistent caching
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...productKeys.details(), id] as const,
  featured: () => [...productKeys.all, 'featured'] as const,
  search: (query: string) => [...productKeys.all, 'search', query] as const,
};

// Hook for fetching products with filters
export function useProductsQuery(filters?: {
  page?: number;
  per_page?: number;
  featured?: boolean;
  bestseller?: boolean;
  new_arrival?: boolean;
  trending?: boolean;
  category_slug?: string;
  brand_slug?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: string;
}) {
  // Don't fetch if per_page is 0 (used to disable fetching)
  const enabled = filters?.per_page !== 0;
  
  return useQuery({
    queryKey: productKeys.list(filters || {}),
    queryFn: async () => {
      const response = await productsService.getPublicProducts({
        page: filters?.page || 1,
        per_page: filters?.per_page || 20,
        ...filters,
      });
      
      // Handle response format
      if (Array.isArray(response)) {
        return {
          products: response,
          pagination: {
            total_count: response.length,
            total_pages: 1,
            current_page: 1,
            per_page: filters?.per_page || 20,
          },
        };
      }
      
      return {
        products: response?.products || [],
        pagination: response?.pagination || null,
        filters_applied: response?.filters_applied || [],
        available_filters: response?.available_filters || {},
      };
    },
    enabled, // Only fetch if enabled is true
    staleTime: 2 * 60 * 1000, // 2 minutes for product lists
    cacheTime: 5 * 60 * 1000, // 5 minutes cache
  });
}

// Hook for fetching a single product
export function useProductQuery(idOrSlug: string | number | null | undefined) {
  return useQuery({
    queryKey: productKeys.detail(idOrSlug!),
    queryFn: () => productsService.getPublicProduct(idOrSlug!),
    enabled: !!idOrSlug, // Only fetch if idOrSlug exists
    staleTime: 5 * 60 * 1000, // 5 minutes for individual products
    cacheTime: 10 * 60 * 1000, // 10 minutes cache
  });
}

// Hook for featured products
export function useFeaturedProductsQuery(limit: number = 4) {
  return useQuery({
    queryKey: productKeys.featured(),
    queryFn: async () => {
      const response = await productsService.getPublicProducts({
        page: 1,
        per_page: limit,
        featured: true,
      });
      
      if (Array.isArray(response)) {
        return response;
      }
      return response?.products || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for infinite scroll products
export function useInfiniteProductsQuery(filters?: {
  per_page?: number;
  featured?: boolean;
  bestseller?: boolean;
  category_slug?: string;
  brand_slug?: string;
  search?: string;
}) {
  return useInfiniteQuery({
    queryKey: [...productKeys.lists(), 'infinite', filters || {}],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await productsService.getPublicProducts({
        page: pageParam,
        per_page: filters?.per_page || 20,
        ...filters,
      });
      
      if (Array.isArray(response)) {
        return {
          products: response,
          pagination: {
            total_count: response.length,
            total_pages: 1,
            current_page: pageParam,
            per_page: filters?.per_page || 20,
          },
        };
      }
      
      return {
        products: response?.products || [],
        pagination: response?.pagination || null,
      };
    },
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.pagination;
      if (!pagination) return undefined;
      if (pagination.current_page < pagination.total_pages) {
        return pagination.current_page + 1;
      }
      return undefined;
    },
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
  });
}

