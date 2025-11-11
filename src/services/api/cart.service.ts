/**
 * Cart API Service
 */

import { api } from './base';

export interface CartItemData {
  product_variant_id: number;
  quantity: number;
}

export const cartService = {
  /**
   * Get cart
   */
  getCart: async () => {
    return api.get('/cart');
  },

  /**
   * Add item to cart
   */
  addToCart: async (data: CartItemData) => {
    return api.post('/cart_items', data);
  },

  /**
   * Update cart item
   */
  updateCartItem: async (cartItemId: number, quantity: number) => {
    return api.patch(`/cart_items/${cartItemId}`, { quantity });
  },

  /**
   * Remove cart item
   */
  removeCartItem: async (cartItemId: number) => {
    return api.delete(`/cart_items/${cartItemId}`);
  },
};

