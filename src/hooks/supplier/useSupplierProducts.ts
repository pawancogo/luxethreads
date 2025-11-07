import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { productsAPI } from '@/services/api';
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
  const { toast } = useToast();
  const [products, setProducts] = useState<SupplierProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await productsAPI.getSupplierProducts();
      // API interceptor already extracts data, so response is the data directly
      let products = Array.isArray(response) ? response : [];
      
      // Map backend response to frontend format
      // Backend returns 'variants', ensure it's mapped to both variants and product_variants for compatibility
      products = products.map((product: any) => {
        const variants = product.variants || product.product_variants || [];
        // Debug: Log variants for troubleshooting
        if (variants.length > 0) {
          console.log(`Product ${product.name} has ${variants.length} variant(s):`, variants);
        }
        return {
          ...product,
          // Ensure variants are available under both keys for compatibility
          variants: variants,
          product_variants: variants,
        };
      });
      
      setProducts(products);
    } catch (err: any) {
      const errorMessage = err?.errors?.[0] || err?.message || 'Failed to load products';
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
      const response = await productsAPI.createProduct(data);
      // API interceptor already extracts data
      const productId = (response as any)?.id;
      if (productId) {
        await loadProducts();
        return productId;
      }
      throw new Error('Product ID not found in response');
    } catch (err: any) {
      const errorMessage = err?.errors?.[0] || err?.message || 'Failed to create product';
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
      await productsAPI.updateProduct(id, data);
      toast({
        title: 'Success',
        description: 'Product updated successfully',
      });
      await loadProducts();
    } catch (err: any) {
      const errorMessage = err?.errors?.[0] || err?.message || 'Failed to update product';
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
      await productsAPI.deleteProduct(id);
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
      await loadProducts();
    } catch (err: any) {
      const errorMessage = err?.errors?.[0] || err?.message || 'Failed to delete product';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const updateVariant = async (productId: number, variantId: number, data: {
    price: number;
    discounted_price?: number;
    stock_quantity: number;
    weight_kg?: number;
    image_urls?: string[];
    attribute_value_ids?: number[];
  }): Promise<void> => {
    try {
      await productsAPI.updateVariant(productId, variantId, data);
      toast({
        title: 'Success',
        description: 'Variant updated successfully',
      });
      await loadProducts();
    } catch (err: any) {
      const errorMessage = err?.errors?.[0] || err?.message || 'Failed to update variant';
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
      await productsAPI.deleteVariant(productId, variantId);
      toast({
        title: 'Success',
        description: 'Variant deleted successfully',
      });
      await loadProducts();
    } catch (err: any) {
      const errorMessage = err?.errors?.[0] || err?.message || 'Failed to delete variant';
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

