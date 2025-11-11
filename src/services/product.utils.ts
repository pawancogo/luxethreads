/**
 * Product Utils - Utility Functions
 * Pure utility functions for product calculations
 * Follows Single Responsibility Principle (SOLID)
 * No React dependencies - can be used anywhere
 */

import { SupplierProduct } from '@/components/supplier/types';

/**
 * Extract variants from product (supports both 'variants' and 'product_variants' fields)
 */
const getProductVariants = (product: SupplierProduct): any[] => {
  return product.variants || product.product_variants || [];
};

/**
 * Parse price value (handles both string and number types)
 */
const parsePrice = (price: string | number | null | undefined): number | null => {
  if (price === null || price === undefined) return null;
  const parsed = typeof price === 'string' ? parseFloat(price) : price;
  return isNaN(parsed) ? null : parsed;
};

/**
 * Parse stock quantity (handles both string and number types)
 */
const parseStockQuantity = (stock: string | number | null | undefined): number => {
  if (stock === null || stock === undefined) return 0;
  return typeof stock === 'string' ? parseInt(stock, 10) || 0 : stock || 0;
};

/**
 * Get minimum price from product variants
 * Returns formatted price string or 'N/A' if no valid prices found
 */
export const getProductMinPrice = (product: SupplierProduct): string => {
  const variants = getProductVariants(product);
  const prices = variants
    .map((v) => parsePrice(v.price))
    .filter((p): p is number => p !== null);

  if (prices.length === 0) {
    return 'N/A';
  }

  const minPrice = Math.min(...prices);
  return `$${minPrice.toFixed(2)}`;
};

/**
 * Get total stock quantity from all product variants
 * Returns sum of all variant stock quantities
 */
export const getProductTotalStock = (product: SupplierProduct): number => {
  const variants = getProductVariants(product);
  return variants.reduce((sum, variant) => {
    return sum + parseStockQuantity(variant.stock_quantity);
  }, 0);
};

/**
 * Product Utils - Collection of utility functions
 */
export const productUtils = {
  getProductMinPrice,
  getProductTotalStock,
  getProductVariants,
  parsePrice,
  parseStockQuantity,
};

