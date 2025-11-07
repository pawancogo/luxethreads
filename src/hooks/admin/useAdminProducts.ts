import { useState, useEffect } from 'react';
import { adminProductsAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  status: string;
  supplier: {
    id: number;
    company_name: string;
  };
  category: {
    id: number;
    name: string;
  };
  brand: {
    id: number;
    name: string;
  };
  base_price?: number;
  is_featured: boolean;
  is_bestseller: boolean;
  verified_at?: string;
  verified_by?: string;
  rejection_reason?: string;
  created_at: string;
  variants_count: number;
}

interface UseAdminProductsReturn {
  products: Product[];
  loading: boolean;
  error: Error | null;
  totalPages: number;
  currentPage: number;
  fetchProducts: (params?: {
    page?: number;
    per_page?: number;
    status?: string;
    supplier_id?: number;
    category_id?: number;
    brand_id?: number;
    search?: string;
    created_from?: string;
    created_to?: string;
  }) => Promise<void>;
  approveProduct: (productId: number) => Promise<boolean>;
  rejectProduct: (productId: number, reason: string) => Promise<boolean>;
  bulkApproveProducts: (productIds: number[]) => Promise<boolean>;
  bulkRejectProducts: (productIds: number[], reason: string) => Promise<boolean>;
  deleteProduct: (productId: number) => Promise<boolean>;
  updateProduct: (productId: number, productData: Partial<Product>) => Promise<boolean>;
  exportProducts: (params?: {
    status?: string;
    supplier_id?: number;
    category_id?: number;
  }) => Promise<void>;
}

export const useAdminProducts = (): UseAdminProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const fetchProducts = async (params?: {
    page?: number;
    per_page?: number;
    status?: string;
    supplier_id?: number;
    category_id?: number;
    brand_id?: number;
    search?: string;
    created_from?: string;
    created_to?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminProductsAPI.getProducts(params);
      setProducts(response || []);
      if (params?.page) {
        setCurrentPage(params.page);
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch products',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const approveProduct = async (productId: number): Promise<boolean> => {
    try {
      await adminProductsAPI.approveProduct(productId);
      await fetchProducts({ page: currentPage });
      toast({
        title: 'Success',
        description: 'Product approved successfully',
      });
      return true;
    } catch (err) {
      const error = err as Error;
      toast({
        title: 'Error',
        description: error.message || 'Failed to approve product',
        variant: 'destructive',
      });
      return false;
    }
  };

  const rejectProduct = async (productId: number, reason: string): Promise<boolean> => {
    try {
      await adminProductsAPI.rejectProduct(productId, reason);
      await fetchProducts({ page: currentPage });
      toast({
        title: 'Success',
        description: 'Product rejected successfully',
      });
      return true;
    } catch (err) {
      const error = err as Error;
      toast({
        title: 'Error',
        description: error.message || 'Failed to reject product',
        variant: 'destructive',
      });
      return false;
    }
  };

  const bulkApproveProducts = async (productIds: number[]): Promise<boolean> => {
    try {
      await adminProductsAPI.bulkApproveProducts(productIds);
      await fetchProducts({ page: currentPage });
      toast({
        title: 'Success',
        description: `Approved ${productIds.length} products successfully`,
      });
      return true;
    } catch (err) {
      const error = err as Error;
      toast({
        title: 'Error',
        description: error.message || 'Failed to approve products',
        variant: 'destructive',
      });
      return false;
    }
  };

  const bulkRejectProducts = async (productIds: number[], reason: string): Promise<boolean> => {
    try {
      await adminProductsAPI.bulkRejectProducts(productIds, reason);
      await fetchProducts({ page: currentPage });
      toast({
        title: 'Success',
        description: `Rejected ${productIds.length} products successfully`,
      });
      return true;
    } catch (err) {
      const error = err as Error;
      toast({
        title: 'Error',
        description: error.message || 'Failed to reject products',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteProduct = async (productId: number): Promise<boolean> => {
    try {
      await adminProductsAPI.deleteProduct(productId);
      await fetchProducts({ page: currentPage });
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
      return true;
    } catch (err) {
      const error = err as Error;
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete product',
        variant: 'destructive',
      });
      return false;
    }
  };

  const updateProduct = async (productId: number, productData: Partial<Product>): Promise<boolean> => {
    try {
      await adminProductsAPI.updateProduct(productId, {
        name: productData.name,
        description: productData.description,
        short_description: productData.short_description,
        category_id: productData.category?.id,
        brand_id: productData.brand?.id,
        is_featured: productData.is_featured,
        is_bestseller: productData.is_bestseller,
        status: productData.status,
      });
      await fetchProducts({ page: currentPage });
      toast({
        title: 'Success',
        description: 'Product updated successfully',
      });
      return true;
    } catch (err) {
      const error = err as Error;
      toast({
        title: 'Error',
        description: error.message || 'Failed to update product',
        variant: 'destructive',
      });
      return false;
    }
  };

  const exportProducts = async (params?: {
    status?: string;
    supplier_id?: number;
    category_id?: number;
  }): Promise<void> => {
    try {
      await adminProductsAPI.exportProducts(params);
      toast({
        title: 'Success',
        description: 'Products exported successfully',
      });
    } catch (err) {
      const error = err as Error;
      toast({
        title: 'Error',
        description: error.message || 'Failed to export products',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    totalPages,
    currentPage,
    fetchProducts,
    approveProduct,
    rejectProduct,
    bulkApproveProducts,
    bulkRejectProducts,
    deleteProduct,
    updateProduct,
    exportProducts,
  };
};

