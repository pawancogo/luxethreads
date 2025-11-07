import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { productsAPI, categoriesAPI, brandsAPI } from '@/services/api';
import { SupplierProduct, Category, Brand } from '@/components/supplier/types';
import { useToast } from '@/hooks/use-toast';

// Phase 2: Public product interface
export interface PublicProduct {
  id: number;
  slug?: string;
  name: string;
  description: string;
  short_description?: string;
  brand_name: string;
  category_name: string;
  supplier_name: string;
  price: number;
  discounted_price?: number;
  base_price?: number;
  base_discounted_price?: number;
  image_url?: string;
  stock_available: boolean;
  is_featured?: boolean;
  is_bestseller?: boolean;
  is_new_arrival?: boolean;
  is_trending?: boolean;
  average_rating?: number;
}

interface ProductContextType {
  // Products
  products: PublicProduct[];
  isLoadingProducts: boolean;
  productsError: string | null;
  hasMore: boolean;
  currentPage: number;
  totalCount: number;
  
  // Categories
  categories: Category[];
  isLoadingCategories: boolean;
  categoriesError: string | null;
  
  // Brands
  brands: Brand[];
  isLoadingBrands: boolean;
  brandsError: string | null;
  
  // Filters
  filters: {
    featured?: boolean;
    bestseller?: boolean;
    new_arrival?: boolean;
    trending?: boolean;
    category_slug?: string;
    brand_slug?: string;
    search?: string;
  };
  
  // Actions
  loadProducts: (params?: {
    page?: number;
    featured?: boolean;
    bestseller?: boolean;
    new_arrival?: boolean;
    trending?: boolean;
    category_slug?: string;
    brand_slug?: string;
  }) => Promise<void>;
  loadMoreProducts: () => Promise<void>;
  setFilters: (filters: Partial<ProductContextType['filters']>) => void;
  clearFilters: () => void;
  refreshProducts: () => Promise<void>;
  
  // Categories & Brands
  loadCategories: () => Promise<void>;
  loadBrands: () => Promise<void>;
  getCategoryBySlug: (slug: string) => Category | undefined;
  getBrandBySlug: (slug: string) => Brand | undefined;
}

const ProductContext = createContext<ProductContextType | null>(null);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  // Products state
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  
  // Brands state
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);
  const [brandsError, setBrandsError] = useState<string | null>(null);
  
  // Filters state
  const [filters, setFiltersState] = useState<ProductContextType['filters']>({});
  
  // Load products with filters
  const loadProducts = useCallback(async (params?: {
    page?: number;
    featured?: boolean;
    bestseller?: boolean;
    new_arrival?: boolean;
    trending?: boolean;
    category_slug?: string;
    brand_slug?: string;
  }) => {
    setIsLoadingProducts(true);
    setProductsError(null);
    
    try {
      const page = params?.page || 1;
      const response = await productsAPI.getPublicProducts({
        page,
        per_page: 20,
        featured: params?.featured || filters.featured,
        bestseller: params?.bestseller || filters.bestseller,
        new_arrival: params?.new_arrival || filters.new_arrival,
        trending: params?.trending || filters.trending,
        category_slug: params?.category_slug || filters.category_slug,
        brand_slug: params?.brand_slug || filters.brand_slug,
      });
      
      // API interceptor extracts data, so response is the data object
      // Backend returns: { products: [...], pagination: {...}, filters_applied: [...], available_filters: {...} }
      let productsList: any[] = [];
      let paginationInfo: any = null;
      
      const responseData: any = response;
      
      if (Array.isArray(responseData)) {
        // Legacy format (array)
        productsList = responseData;
        paginationInfo = {
          total_count: responseData.length,
          total_pages: 1,
          current_page: page,
          per_page: 20,
        };
      } else if (responseData && typeof responseData === 'object') {
        // New format with pagination and filters
        productsList = responseData.products || [];
        paginationInfo = responseData.pagination || null;
      }
      
      if (page === 1) {
        setProducts(productsList);
      } else {
        setProducts(prev => [...prev, ...productsList]);
      }
      
      setCurrentPage(page);
      if (paginationInfo) {
        setHasMore(page < paginationInfo.total_pages);
        setTotalCount(paginationInfo.total_count || 0);
      } else {
        setHasMore(productsList.length === 20);
      }
      
      // Update filters if provided
      if (params) {
        setFiltersState(prev => ({ ...prev, ...params }));
      }
    } catch (err: any) {
      const errorMessage = err?.errors?.[0] || err?.message || 'Failed to load products';
      setProductsError(errorMessage);
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    } finally {
      setIsLoadingProducts(false);
    }
  }, [filters, toast]);
  
  // Load more products
  const loadMoreProducts = useCallback(async () => {
    if (!hasMore || isLoadingProducts) return;
    await loadProducts({ page: currentPage + 1 });
  }, [hasMore, isLoadingProducts, currentPage, loadProducts]);
  
  // Refresh products
  const refreshProducts = useCallback(async () => {
    setCurrentPage(1);
    await loadProducts({ page: 1 });
  }, [loadProducts]);
  
  // Set filters
  const setFilters = useCallback((newFilters: Partial<ProductContextType['filters']>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
    loadProducts({ page: 1, ...newFilters });
  }, [loadProducts]);
  
  // Clear filters
  const clearFilters = useCallback(() => {
    setFiltersState({});
    setCurrentPage(1);
    loadProducts({ page: 1 });
  }, [loadProducts]);
  
  // Load categories
  const loadCategories = useCallback(async () => {
    setIsLoadingCategories(true);
    setCategoriesError(null);
    try {
      const response = await categoriesAPI.getAll();
      // API interceptor already extracts data, so response is the data directly
      const categoriesList = Array.isArray(response) ? response : [];
      setCategories(categoriesList);
    } catch (err: any) {
      const errorMessage = err?.errors?.[0] || err?.message || 'Failed to load categories';
      setCategoriesError(errorMessage);
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);
  
  // Load brands
  const loadBrands = useCallback(async () => {
    setIsLoadingBrands(true);
    setBrandsError(null);
    try {
      const response = await brandsAPI.getAll();
      // API interceptor already extracts data, so response is the data directly
      const brandsList = Array.isArray(response) ? response : [];
      setBrands(brandsList);
    } catch (err: any) {
      const errorMessage = err?.errors?.[0] || err?.message || 'Failed to load brands';
      setBrandsError(errorMessage);
    } finally {
      setIsLoadingBrands(false);
    }
  }, []);
  
  // Get category by slug
  const getCategoryBySlug = useCallback((slug: string): Category | undefined => {
    return categories.find(c => c.slug === slug);
  }, [categories]);
  
  // Get brand by slug
  const getBrandBySlug = useCallback((slug: string): Brand | undefined => {
    return brands.find(b => b.slug === slug);
  }, [brands]);
  
  // Load initial data
  useEffect(() => {
    loadCategories();
    loadBrands();
    loadProducts({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const value: ProductContextType = useMemo(() => ({
    products,
    isLoadingProducts,
    productsError,
    hasMore,
    currentPage,
    totalCount,
    categories,
    isLoadingCategories,
    categoriesError,
    brands,
    isLoadingBrands,
    brandsError,
    filters,
    loadProducts,
    loadMoreProducts,
    setFilters,
    clearFilters,
    refreshProducts,
    loadCategories,
    loadBrands,
    getCategoryBySlug,
    getBrandBySlug,
  }), [
    products,
    isLoadingProducts,
    productsError,
    hasMore,
    currentPage,
    totalCount,
    categories,
    isLoadingCategories,
    categoriesError,
    brands,
    isLoadingBrands,
    brandsError,
    filters,
    loadProducts,
    loadMoreProducts,
    setFilters,
    clearFilters,
    refreshProducts,
    loadCategories,
    loadBrands,
    getCategoryBySlug,
    getBrandBySlug,
  ]);
  
  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};

