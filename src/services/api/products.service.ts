/**
 * Products API Service
 * Handles all product-related API calls
 */

import { api } from './base';

export interface ProductFilters {
  page?: number;
  per_page?: number;
  min_price?: number;
  max_price?: number;
  category_id?: number;
  category_slug?: string;
  category_ids?: number[];
  brand_id?: number;
  brand_slug?: string;
  brand_ids?: number[];
  featured?: boolean;
  bestseller?: boolean;
  new_arrival?: boolean;
  trending?: boolean;
  in_stock?: boolean;
  min_rating?: number;
  attribute_values?: number[];
  query?: string;
  search?: string;
  sort_by?: 'recommended' | 'price_low_high' | 'price_high_low' | 'newest' | 'oldest' | 'rating' | 'popular' | 'name_asc' | 'name_desc';
  status?: string;
}

export interface ProductData {
  name: string;
  description: string;
  short_description?: string;
  category_id: number;
  brand_id: number;
  product_type?: string;
  highlights?: string[];
  search_keywords?: string[];
  tags?: string[];
  base_price?: number;
  base_discounted_price?: number;
  base_mrp?: number;
  length_cm?: number;
  width_cm?: number;
  height_cm?: number;
  weight_kg?: number;
  is_featured?: boolean;
  is_bestseller?: boolean;
  is_new_arrival?: boolean;
  is_trending?: boolean;
  published_at?: string;
  attribute_value_ids?: number[];
}

export interface VariantData {
  sku?: string;
  price: number;
  discounted_price?: number;
  mrp?: number;
  cost_price?: number;
  stock_quantity: number;
  reserved_quantity?: number;
  low_stock_threshold?: number;
  weight_kg?: number;
  currency?: string;
  barcode?: string;
  ean_code?: string;
  isbn?: string;
  image_urls?: string[];
  attribute_value_ids?: number[];
}

export const productsService = {
  /**
   * Get public products (for customers)
   */
  getPublicProducts: async (params?: ProductFilters) => {
    return api.get('/public/products', { params: params || {} });
  },

  /**
   * Get public product by ID or slug
   */
  getPublicProduct: async (idOrSlug: string | number) => {
    return api.get(`/public/products/${idOrSlug}`);
  },

  /**
   * Get supplier products
   */
  getSupplierProducts: async () => {
    return api.get('/products');
  },

  /**
   * Get supplier product by ID
   */
  getSupplierProduct: async (id: string | number) => {
    return api.get(`/products/${id}`);
  },

  /**
   * Create product (supplier)
   */
  createProduct: async (productData: ProductData) => {
    return api.post('/products', { product: productData });
  },

  /**
   * Update product (supplier)
   */
  updateProduct: async (id: string | number, productData: Partial<ProductData>) => {
    return api.put(`/products/${id}`, { product: productData });
  },

  /**
   * Delete product (supplier)
   */
  deleteProduct: async (id: string | number) => {
    return api.delete(`/products/${id}`);
  },

  /**
   * Create product variant
   */
  createVariant: async (productId: string | number, variantData: VariantData) => {
    return api.post(`/products/${productId}/product_variants`, { product_variant: variantData });
  },

  /**
   * Update product variant
   */
  updateVariant: async (productId: string | number, variantId: string | number, variantData: Partial<VariantData>) => {
    return api.put(`/products/${productId}/product_variants/${variantId}`, { product_variant: variantData });
  },

  /**
   * Delete product variant
   */
  deleteVariant: async (productId: string | number, variantId: string | number) => {
    return api.delete(`/products/${productId}/product_variants/${variantId}`);
  },

  /**
   * Bulk upload products
   */
  bulkUpload: async (formData: FormData) => {
    return api.post('/products/bulk_upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Export products
   */
  exportProducts: async () => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/v1/products/export`, {
      method: 'GET',
      headers: {
        // Cookies are automatically sent with requests (withCredentials: true)
      },
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Export failed' }));
      throw error;
    }
    return await response.blob();
  },

  /**
   * Download export template
   */
  downloadTemplate: async () => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/v1/products/export_template`, {
      method: 'GET',
      headers: {
        // Cookies are automatically sent with requests (withCredentials: true)
      },
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Download failed' }));
      throw error;
    }
    return await response.blob();
  },

  /**
   * Search products
   */
  searchProducts: async (params: {
    query?: string;
    category_id?: number | string;
    brand_id?: number | string;
    featured?: boolean;
    bestseller?: boolean;
    new_arrival?: boolean;
    trending?: boolean;
    min_price?: number;
    max_price?: number;
    page?: number;
    per_page?: number;
  }) => {
    return api.get('/search', { params });
  },
};

