/**
 * Wishlist API Service
 */

import { api } from './base';

export const wishlistService = {
  /**
   * Get wishlist items
   */
  getWishlist: async () => {
    return api.get('/wishlist/items');
  },

  /**
   * Add to wishlist
   */
  addToWishlist: async (productVariantId: number) => {
    return api.post('/wishlist/items', {
      product_variant_id: productVariantId,
    });
  },

  /**
   * Remove from wishlist
   */
  removeFromWishlist: async (wishlistItemId: number) => {
    return api.delete(`/wishlist/items/${wishlistItemId}`);
  },
};

