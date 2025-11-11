/**
 * Wishlist Service - Business Logic Layer
 * Handles wishlist operations and business rules
 * Follows Single Responsibility Principle
 */

import { WishlistRepository } from './wishlist.repository';
import { WishlistMapper } from './wishlist.mapper';

/**
 * Wishlist Service - Business logic for wishlist operations
 */
export class WishlistService {
  private repository: WishlistRepository;
  private mapper: WishlistMapper;

  constructor(repository?: WishlistRepository) {
    this.repository = repository || new WishlistRepository();
    this.mapper = new WishlistMapper();
  }

  /**
   * Get wishlist items
   */
  async getWishlist(): Promise<any[]> {
    try {
      const response = await this.repository.getWishlist();
      return this.mapper.mapApiResponseToItems(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Add to wishlist
   */
  async addToWishlist(productVariantId: number): Promise<any> {
    try {
      return await this.repository.addToWishlist(productVariantId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove from wishlist
   */
  async removeFromWishlist(wishlistItemId: number): Promise<void> {
    try {
      await this.repository.removeFromWishlist(wishlistItemId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Extract error message
   */
  extractErrorMessage(error: any): string {
    return this.mapper.extractErrorMessage(error);
  }
}

export const wishlistService = new WishlistService();

