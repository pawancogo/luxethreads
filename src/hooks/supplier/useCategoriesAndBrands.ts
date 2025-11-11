/**
 * useCategoriesAndBrands Hook - Clean Architecture Implementation
 * Removed unnecessary useCallback hooks
 * Uses services instead of direct API calls
 * Follows: UI → Logic (Services) → Data (API Services)
 */

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { categoriesService } from '@/services/api/categories.service';
import { brandsService } from '@/services/api/brands.service';
import { Category, Brand } from '@/components/supplier/types';

interface UseCategoriesAndBrandsReturn {
  categories: Category[];
  brands: Brand[];
  isLoadingCategories: boolean;
  isLoadingBrands: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCategoriesAndBrands = (): UseCategoriesAndBrandsReturn => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const response = await categoriesService.getAll();
      const categories = Array.isArray(response) ? response : [];
      setCategories(categories);
    } catch (err: any) {
      const errorMessage = err?.errors?.[0] || err?.message || 'Failed to load categories';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const loadBrands = async () => {
    try {
      setIsLoadingBrands(true);
      const response = await brandsService.getAll();
      const brands = Array.isArray(response) ? response : [];
      setBrands(brands);
    } catch (err: any) {
      const errorMessage = err?.errors?.[0] || err?.message || 'Failed to load brands';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoadingBrands(false);
    }
  };

  const refetch = async () => {
    await Promise.all([loadCategories(), loadBrands()]);
  };

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    categories,
    brands,
    isLoadingCategories,
    isLoadingBrands,
    error,
    refetch,
  };
};

