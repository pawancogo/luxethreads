/**
 * Wishlist Mapper - Data Transformation Layer
 * Maps API responses to application models
 * Follows Single Responsibility Principle
 */

/**
 * Wishlist Mapper - Transforms API responses to application models
 */
export class WishlistMapper {
  /**
   * Map API response to wishlist items array
   */
  mapApiResponseToItems(response: any): any[] {
    if (response?.items) {
      return response.items;
    }
    return Array.isArray(response) ? response : [];
  }

  /**
   * Extract error message from error object
   */
  extractErrorMessage(error: any): string {
    return error?.message || 'Failed to load wishlist';
  }
}

export const wishlistMapper = new WishlistMapper();

