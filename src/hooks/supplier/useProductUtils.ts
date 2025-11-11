/**
 * useProductUtils Hook - Clean Architecture Implementation
 * Wraps ProductUtils service for React components
 * Follows: UI → Logic (ProductUtils) → Pure Functions
 * 
 * Note: This hook is a thin wrapper around pure utility functions.
 * The actual logic is in the ProductUtils service layer.
 */

import { productUtils } from '@/services/product.utils';

/**
 * Hook wrapper for product utility functions
 * Provides React-friendly interface to ProductUtils service
 */
export const useProductUtils = () => {
  return {
    getProductMinPrice: productUtils.getProductMinPrice,
    getProductTotalStock: productUtils.getProductTotalStock,
  };
};

