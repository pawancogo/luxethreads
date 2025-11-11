/**
 * useCategoriesQuery Hook - Clean Architecture Implementation
 * Uses services instead of direct API calls
 * Follows: UI → Logic (Services) → Data (API Services)
 */

import { useQuery } from '@tanstack/react-query';
import { categoriesService } from '@/services/api/categories.service';

// Query keys for categories
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  detail: (idOrSlug: string | number) => [...categoryKeys.all, 'detail', idOrSlug] as const,
  navigation: () => [...categoryKeys.all, 'navigation'] as const,
};

// Hook for fetching all categories
export function useCategoriesQuery(disabled: boolean = false) {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: async () => {
      const response = await categoriesService.getAll();
      return Array.isArray(response) ? response : [];
    },
    enabled: !disabled,
    staleTime: 10 * 60 * 1000, // 10 minutes - categories don't change often
    cacheTime: 30 * 60 * 1000, // 30 minutes cache
  });
}

// Hook for fetching navigation structure
export function useCategoriesNavigationQuery(disabled: boolean = false) {
  return useQuery({
    queryKey: categoryKeys.navigation(),
    queryFn: async () => {
      const response = await categoriesService.getNavigation();
      return Array.isArray(response) ? response : [];
    },
    enabled: !disabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes cache
  });
}

// Hook for fetching a single category
export function useCategoryQuery(idOrSlug: string | number | null | undefined) {
  return useQuery({
    queryKey: categoryKeys.detail(idOrSlug!),
    queryFn: () => categoriesService.getBySlugOrId(idOrSlug!),
    enabled: !!idOrSlug,
    staleTime: 10 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });
}

