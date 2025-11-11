/**
 * Product Filter Utils - Utility Functions
 * Centralized product filtering and sorting logic
 * Follows DRY principle - no duplicate filter/sort code
 */

import { Product } from '@/types/product';

export interface ProductFilterOptions {
  fabrics?: string[];
  colors?: string[];
  sizes?: string[];
  priceRange?: [number, number];
}

export type SortOption = 
  | 'recommended' 
  | 'price_low_high' 
  | 'price_high_low' 
  | 'newest' 
  | 'oldest'
  | 'price-low'
  | 'price-high';

/**
 * Product Filter Utils - Centralized filtering and sorting
 */
export class ProductFilterUtils {
  /**
   * Filter products by fabric, color, size
   */
  static filterProducts(
    products: Product[],
    options: ProductFilterOptions
  ): Product[] {
    let filtered = [...products];

    // Filter by fabric
    if (options.fabrics && options.fabrics.length > 0) {
      filtered = filtered.filter(p => {
        // Check if product has fabric property
        if (p.fabric) {
          return options.fabrics!.includes(p.fabric);
        }
        // Check attributes if fabric property doesn't exist
        if ((p as any).attributes) {
          return options.fabrics!.some(fabric =>
            (p as any).attributes.some(
              (attr: any) =>
                attr.attribute_type === 'Fabric' && attr.attribute_value === fabric
            )
          );
        }
        return false;
      });
    }

    // Filter by colors
    if (options.colors && options.colors.length > 0) {
      filtered = filtered.filter(p => {
        if (p.colors && p.colors.length > 0) {
          return options.colors!.some(color => p.colors.includes(color));
        }
        // Check attributes if colors array doesn't exist
        if ((p as any).attributes) {
          return options.colors!.some(color =>
            (p as any).attributes.some(
              (attr: any) =>
                attr.attribute_type === 'Color' && attr.attribute_value === color
            )
          );
        }
        return false;
      });
    }

    // Filter by sizes
    if (options.sizes && options.sizes.length > 0) {
      filtered = filtered.filter(p => {
        if (p.sizes && p.sizes.length > 0) {
          return options.sizes!.some(size => p.sizes.includes(size));
        }
        // Check attributes if sizes array doesn't exist
        if ((p as any).attributes) {
          return options.sizes!.some(size =>
            (p as any).attributes.some(
              (attr: any) =>
                (attr.attribute_type === 'Size' || attr.attribute_type === 'Sizes') &&
                attr.attribute_value === size
            )
          );
        }
        return false;
      });
    }

    // Filter by price range
    if (options.priceRange) {
      const [minPrice, maxPrice] = options.priceRange;
      filtered = filtered.filter(p => {
        const productPrice = (p as any).discountedPrice || p.price;
        return productPrice >= minPrice && productPrice <= maxPrice;
      });
    }

    return filtered;
  }

  /**
   * Sort products by various criteria
   */
  static sortProducts(products: Product[], sortBy: SortOption): Product[] {
    const sorted = [...products];

    switch (sortBy) {
      case 'price_low_high':
      case 'price-low':
        sorted.sort((a, b) => {
          const priceA = (a as any).discountedPrice || a.price;
          const priceB = (b as any).discountedPrice || b.price;
          return priceA - priceB;
        });
        break;

      case 'price_high_low':
      case 'price-high':
        sorted.sort((a, b) => {
          const priceA = (a as any).discountedPrice || a.price;
          const priceB = (b as any).discountedPrice || b.price;
          return priceB - priceA;
        });
        break;

      case 'newest':
        sorted.sort((a, b) => {
          const dateA = (a as any).createdAt 
            ? new Date((a as any).createdAt).getTime() 
            : 0;
          const dateB = (b as any).createdAt 
            ? new Date((b as any).createdAt).getTime() 
            : 0;
          return dateB - dateA;
        });
        break;

      case 'oldest':
        sorted.sort((a, b) => {
          const dateA = (a as any).createdAt 
            ? new Date((a as any).createdAt).getTime() 
            : 0;
          const dateB = (b as any).createdAt 
            ? new Date((b as any).createdAt).getTime() 
            : 0;
          return dateA - dateB;
        });
        break;

      case 'recommended':
      default:
        // Keep original order (recommended/default)
        break;
    }

    return sorted;
  }

  /**
   * Filter and sort products in one operation
   */
  static filterAndSort(
    products: Product[],
    filterOptions: ProductFilterOptions,
    sortBy: SortOption
  ): Product[] {
    const filtered = this.filterProducts(products, filterOptions);
    return this.sortProducts(filtered, sortBy);
  }
}

// Export singleton instance for convenience
export const productFilterUtils = ProductFilterUtils;

