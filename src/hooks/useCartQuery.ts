/**
 * useCartQuery Hook - Clean Architecture Implementation
 * Uses CartService for business logic
 * Follows: UI → Logic (Services) → Data (API Services)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/services/api/cart.service';

// Query keys for cart
export const cartKeys = {
  all: ['cart'] as const,
  detail: () => [...cartKeys.all, 'detail'] as const,
};

// Map backend cart response to CartItem[]
const mapBackendCartItems = (backendCart: any) => {
  const cartItems = backendCart.cart_items || [];
  const items = cartItems.map((item: any) => {
    const variant = item.product_variant || {};
    return {
      cartItemId: item.cart_item_id,
      productVariantId: variant.variant_id || variant.id,
      productId: variant.product_id?.toString() || '',
      name: variant.product_name || '',
      price: variant.discounted_price || variant.price || 0,
      originalPrice: variant.discounted_price ? variant.price : undefined,
      image: variant.image_url || '',
      quantity: item.quantity,
      selectedColor: 'Default',
      selectedSize: 'Default',
      brandName: variant.brand_name,
      categoryName: variant.category_name,
    };
  });

  return {
    items,
    total: backendCart.total_price || 0,
    itemCount: backendCart.item_count || 0,
  };
};

// Hook for fetching cart
export function useCartQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: cartKeys.detail(),
    queryFn: async () => {
      const response = await cartService.getCart();
      return mapBackendCartItems(response);
    },
    enabled, // Only fetch if enabled (user is logged in and is a customer)
    staleTime: 1 * 60 * 1000, // 1 minute - cart changes frequently
    cacheTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnMount: true, // Always refetch cart on mount to get latest
    retry: (failureCount, error: any) => {
      // Don't retry on 403 (forbidden - suppliers can't access cart) or 401 (unauthorized)
      if (error?.status === 403 || error?.status === 401) {
        return false;
      }
      // Retry other errors up to 2 times
      return failureCount < 2;
    },
  });
}

// Hook for adding to cart
export function useAddToCartMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productVariantId, quantity = 1 }: { productVariantId: number; quantity?: number }) => {
      return cartService.addToCart({ product_variant_id: productVariantId, quantity });
    },
    onSuccess: () => {
      // Invalidate and refetch cart
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
    },
  });
}

// Hook for updating cart item
export function useUpdateCartItemMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ cartItemId, quantity }: { cartItemId: number; quantity: number }) => {
      return cartService.updateCartItem(cartItemId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
    },
  });
}

// Hook for removing from cart
export function useRemoveFromCartMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (cartItemId: number) => {
      return cartService.removeCartItem(cartItemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
    },
  });
}

