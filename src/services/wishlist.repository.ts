/**
 * Wishlist Repository - Data Access Layer
 * Abstracts API calls for wishlist operations
 * Follows Repository Pattern
 */

import { wishlistService } from './api/wishlist.service';

/**
 * Wishlist Repository - Handles data access for wishlist operations
 */
export class WishlistRepository {
  /**
   * Get wishlist items
   */
  async getWishlist(): Promise<any> {
    try {
      return await wishlistService.getWishlist();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Add to wishlist
   */
  async addToWishlist(productVariantId: number): Promise<any> {
    try {
      return await wishlistService.addToWishlist(productVariantId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove from wishlist
   */
  async removeFromWishlist(wishlistItemId: number): Promise<void> {
    try {
      await wishlistService.removeFromWishlist(wishlistItemId);
    } catch (error) {
      throw error;
    }
  }
}

export const wishlistRepository = new WishlistRepository();

