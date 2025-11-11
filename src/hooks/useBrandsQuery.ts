/**
 * useBrandsQuery Hook - Clean Architecture Implementation
 * Uses services instead of direct API calls
 * Follows: UI → Logic (Services) → Data (API Services)
 */

import { useQuery } from '@tanstack/react-query';
import { brandsService } from '@/services/api/brands.service';

// Query keys for brands
export const brandKeys = {
  all: ['brands'] as const,
  lists: () => [...brandKeys.all, 'list'] as const,
  detail: (idOrSlug: string | number) => [...brandKeys.all, 'detail', idOrSlug] as const,
};

// Hook for fetching all brands
export function useBrandsQuery(disabled: boolean = false) {
  return useQuery({
    queryKey: brandKeys.lists(),
    queryFn: async () => {
      const response = await brandsService.getAll();
      return Array.isArray(response) ? response : [];
    },
    enabled: !disabled,
    staleTime: 10 * 60 * 1000, // 10 minutes - brands don't change often
    cacheTime: 30 * 60 * 1000, // 30 minutes cache
  });
}

// Hook for fetching a single brand
export function useBrandQuery(idOrSlug: string | number | null | undefined) {
  return useQuery({
    queryKey: brandKeys.detail(idOrSlug!),
    queryFn: () => brandsService.getBySlugOrId(idOrSlug!),
    enabled: !!idOrSlug,
    staleTime: 10 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });
}

