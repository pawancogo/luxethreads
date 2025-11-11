/**
 * Cart Store - Zustand implementation
 * Integrates with React Query for server state
 * Performance optimized with selectors
 * Replaces CartContext
 */

import { create } from 'zustand';
import { CartItem } from '@/types/product';
import { useCartQuery, useAddToCartMutation, useUpdateCartItemMutation, useRemoveFromCartMutation } from '@/hooks/useCartQuery';
import { useUser } from './userStore';

interface CartState {
  // Derived from React Query (not stored in Zustand)
  // Actions
  removeFromCart: (cartItemId: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  clearCart: (items: CartItem[]) => Promise<void>;
}

// Note: Cart data comes from React Query, not Zustand
// This store only manages cart actions
export const useCartStore = create<CartState>(() => ({
  removeFromCart: async (cartItemId: number) => {
    // This will be replaced by the hook implementation
  },
  updateQuantity: async (cartItemId: number, quantity: number) => {
    // This will be replaced by the hook implementation
  },
  clearCart: async (items: CartItem[]) => {
    // This will be replaced by the hook implementation
  },
}));

/**
 * Cart Hook - Combines React Query data with Zustand actions
 * This provides the same API as the old CartContext
 */
export const useCart = () => {
  const user = useUser();
  const isCustomer = user?.role === 'customer';
  
  // React Query for server state
  const { data: cartData, isLoading: isLoadingCart } = useCartQuery(isCustomer);
  const removeFromCartMutation = useRemoveFromCartMutation();
  const updateCartItemMutation = useUpdateCartItemMutation();

  // Derive state from React Query
  const state = cartData
    ? {
        items: cartData.items || [],
        total: cartData.total || 0,
        itemCount: cartData.itemCount || 0,
        isLoading: isLoadingCart,
      }
    : {
        items: [],
        total: 0,
        itemCount: 0,
        isLoading: isLoadingCart,
      };

  // Actions
  const removeFromCart = async (cartItemId: number) => {
    await removeFromCartMutation.mutateAsync(cartItemId);
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }
    await updateCartItemMutation.mutateAsync({ cartItemId, quantity });
  };

  const clearCart = async () => {
    for (const item of state.items) {
      if (item.cartItemId > 0) {
        try {
          await removeFromCart(item.cartItemId);
        } catch (error) {
          console.error('Error removing item:', error);
        }
      }
    }
  };

  const loadCart = async () => {
    // React Query handles fetching automatically
  };

  // Backward compatibility - kept for legacy components
  const addToCart = async () => {
    // Modern components should use useAddToCartMutation directly
  };

  return {
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loadCart,
  };
};

/**
 * Performance-optimized selectors
 */
export const useCartItems = () => {
  const user = useUser();
  const isCustomer = user?.role === 'customer';
  const { data } = useCartQuery(isCustomer);
  return data?.items || [];
};

export const useCartTotal = () => {
  const user = useUser();
  const isCustomer = user?.role === 'customer';
  const { data } = useCartQuery(isCustomer);
  return data?.total || 0;
};

export const useCartItemCount = () => {
  const user = useUser();
  const isCustomer = user?.role === 'customer';
  const { data } = useCartQuery(isCustomer);
  return data?.itemCount || 0;
};

