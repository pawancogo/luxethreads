/**
 * useSupplierProducts Hook - Clean Architecture Implementation
 * Uses SupplierService for business logic
 * Follows: UI → Logic (SupplierService) → Data (API Services)
 */

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supplierService } from '@/services/supplier.service';
import { SupplierProduct } from '@/components/supplier/types';

interface UseSupplierProductsReturn {
  products: SupplierProduct[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createProduct: (data: {
    name: string;
    description: string;
    category_id: number;
    brand_id: number;
    attribute_value_ids?: number[];
  }) => Promise<number | null>;
  updateProduct: (id: number, data: Partial<{
    name: string;
    description: string;
    category_id: number;
    brand_id: number;
    attribute_value_ids?: number[];
  }>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  updateVariant: (productId: number, variantId: number, data: {
    price: number;
    discounted_price?: number;
    stock_quantity: number;
    weight_kg?: number;
    image_urls?: string[];
    attribute_value_ids?: number[];
  }) => Promise<void>;
  deleteVariant: (productId: number, variantId: number) => Promise<void>;
}

export const useSupplierProducts = (): UseSupplierProductsReturn => {
  const location = useLocation();
  const { toast } = useToast();
  const [products, setProducts] = useState<SupplierProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const productsList = await supplierService.getProducts();
      setProducts(productsList);
    } catch (err: any) {
      const errorMessage = supplierService.extractErrorMessage(err);
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createProduct = async (data: {
    name: string;
    description: string;
    category_id: number;
    brand_id: number;
    attribute_value_ids?: number[];
  }): Promise<number | null> => {
    try {
      const product = await supplierService.createProduct(data);
      await loadProducts();
      return product?.id || null;
    } catch (err: any) {
      const errorMessage = supplierService.extractErrorMessage(err);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateProduct = async (
    id: number,
    data: Partial<{
      name: string;
      description: string;
      category_id: number;
      brand_id: number;
      attribute_value_ids?: number[];
    }>
  ): Promise<void> => {
    try {
      await supplierService.updateProduct(id, data);
      toast({
        title: 'Success',
        description: 'Product updated successfully',
      });
      await loadProducts();
    } catch (err: any) {
      const errorMessage = supplierService.extractErrorMessage(err);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteProduct = async (id: number): Promise<void> => {
    try {
      await supplierService.deleteProduct(id);
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
      await loadProducts();
    } catch (err: any) {
      const errorMessage = supplierService.extractErrorMessage(err);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Only load products when on supplier dashboard (not on signup)
  useEffect(() => {
    const isSupplierDashboard = location.pathname === '/supplier' || 
                                location.pathname.startsWith('/supplier/');
    
    if (isSupplierDashboard) {
      loadProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const updateVariant = async (productId: number, variantId: number, data: {
    price: number;
    discounted_price?: number;
    stock_quantity: number;
    weight_kg?: number;
    image_urls?: string[];
    attribute_value_ids?: number[];
  }): Promise<void> => {
    try {
      await supplierService.updateVariant(productId, variantId, data);
      toast({
        title: 'Success',
        description: 'Variant updated successfully',
      });
      await loadProducts();
    } catch (err: any) {
      const errorMessage = supplierService.extractErrorMessage(err);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteVariant = async (productId: number, variantId: number): Promise<void> => {
    try {
      await supplierService.deleteVariant(productId, variantId);
      toast({
        title: 'Success',
        description: 'Variant deleted successfully',
      });
      await loadProducts();
    } catch (err: any) {
      const errorMessage = supplierService.extractErrorMessage(err);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  return {
    products,
    isLoading,
    error,
    refetch: loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    updateVariant,
    deleteVariant,
  };
};

