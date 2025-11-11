/**
 * Product Service - Business Logic Layer
 * Handles product operations and business rules
 * Follows Single Responsibility Principle
 */

import { ProductRepository } from './product.repository';
import { mapBackendProductToList, mapBackendProductDetail } from '@/lib/productMapper';
import { Product } from '@/types/product';
import { ProductFilters } from './api/products.service';

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface Category {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  parent_id?: number;
  children?: Category[];
}

/**
 * Product Service - Business logic for product operations
 */
export class ProductService {
  private repository: ProductRepository;

  constructor(repository?: ProductRepository) {
    this.repository = repository || new ProductRepository();
  }

  /**
   * Get public products with filters
   */
  async getPublicProducts(filters?: ProductFilters): Promise<ProductListResponse> {
    try {
      const response = await this.repository.getPublicProducts(filters);
      
      // Handle different response formats
      const data = response?.data || response;
      const products = Array.isArray(data) 
        ? data.map(mapBackendProductToList)
        : (data?.products || data?.data || []).map(mapBackendProductToList);
      
      return {
        products,
        total: data?.total || data?.meta?.total || products.length,
        page: data?.page || data?.meta?.current_page || filters?.page || 1,
        per_page: data?.per_page || data?.meta?.per_page || filters?.per_page || 20,
        total_pages: data?.total_pages || data?.meta?.total_pages || Math.ceil((data?.total || products.length) / (data?.per_page || 20)),
      };
    } catch (error) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Error fetching products:', error);
      }
      throw error;
    }
  }

  /**
   * Get public product by ID or slug
   * Returns both mapped product and raw backend data for variant handling
   */
  async getPublicProduct(idOrSlug: string | number): Promise<{ product: Product; rawData: any } | null> {
    try {
      const response = await this.repository.getPublicProduct(idOrSlug);
      const data = response?.data || response;
      
      if (!data) return null;
      
      const product = mapBackendProductDetail(data);
      return { product, rawData: data };
    } catch (error) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Error fetching product:', error);
      }
      throw error;
    }
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<Category[]> {
    try {
      const response = await this.repository.getCategories();
      const data = response?.data || response;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Error fetching categories:', error);
      }
      return [];
    }
  }

  /**
   * Get category by slug or ID
   */
  async getCategory(slugOrId: string | number): Promise<Category | null> {
    try {
      const response = await this.repository.getCategory(slugOrId);
      const data = response?.data || response;
      return data || null;
    } catch (error) {
      console.error('Error fetching category:', error);
      return null;
    }
  }

  /**
   * Track product view
   */
  async trackProductView(productId: number, params?: {
    product_variant_id?: number;
    source?: 'search' | 'category' | 'brand' | 'direct' | 'recommendation';
    session_id?: string;
  }): Promise<void> {
    try {
      await this.repository.trackProductView(productId, params);
    } catch (error) {
      // Silently fail - view tracking is not critical
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Error tracking product view:', error);
      }
    }
  }

  /**
   * Find category by name (case-insensitive)
   */
  findCategoryByName(categories: Category[], name: string): Category | null {
    return categories.find(
      (cat) => cat.name?.toLowerCase() === name.toLowerCase()
    ) || null;
  }

  /**
   * Find category by ID or name (flexible matching)
   */
  findCategoryByIdOrName(categories: Category[], identifier: string): Category | null {
    return categories.find(
      (cat) => cat.id?.toString() === identifier || cat.name?.toLowerCase() === identifier.toLowerCase()
    ) || null;
  }

  /**
   * Get category ID from name
   */
  getCategoryId(categories: Category[], categoryName: string): number | null {
    const category = this.findCategoryByName(categories, categoryName);
    return category?.id || null;
  }
}

// Export singleton instance
export const productService = new ProductService();

