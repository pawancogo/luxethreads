import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { categoriesAPI, brandsAPI } from '@/services/api';
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
      const response = await categoriesAPI.getAll();
      // Handle both direct array and axios response structure
      const categories = Array.isArray(response) 
        ? response 
        : Array.isArray(response?.data) 
        ? response.data 
        : Array.isArray(response?.data?.data)
        ? response.data.data
        : [];
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
      const response = await brandsAPI.getAll();
      // Handle both direct array and axios response structure
      const brands = Array.isArray(response) 
        ? response 
        : Array.isArray(response?.data) 
        ? response.data 
        : Array.isArray(response?.data?.data)
        ? response.data.data
        : [];
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

