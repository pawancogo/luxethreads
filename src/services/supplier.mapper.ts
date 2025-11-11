/**
 * Supplier Mapper - Data Transformation Layer
 * Maps API responses to application models
 * Follows Single Responsibility Principle
 */

import { SupplierProfile, SupplierProduct, SupplierOrder } from '@/components/supplier/types';

/**
 * Supplier Mapper - Transforms API responses to application models
 */
export class SupplierMapper {
  /**
   * Map API response to SupplierProfile
   */
  mapApiResponseToProfile(response: any): SupplierProfile {
    return (response || {}) as SupplierProfile;
  }

  /**
   * Map API response to SupplierProduct array
   */
  mapApiResponseToProducts(response: any): SupplierProduct[] {
    let productsData = Array.isArray(response) ? response : [];

    // Normalize product variants
    productsData = productsData.map((product: any) => {
      const variants = product.variants || product.product_variants || [];
      return {
        ...product,
        variants: variants,
        product_variants: variants,
      };
    });

    return productsData;
  }

  /**
   * Map API response to SupplierOrder array
   */
  mapApiResponseToOrders(response: any): SupplierOrder[] {
    return Array.isArray(response) ? response : [];
  }

  /**
   * Extract error message from error object
   */
  extractErrorMessage(error: any): string {
    return error?.errors?.[0] || error?.message || 'An error occurred';
  }
}

export const supplierMapper = new SupplierMapper();

