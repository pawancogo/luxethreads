/**
 * useCart Hook - Clean Architecture Implementation
 * Uses CartService for business logic
 * Removed unnecessary hooks (useCallback, useMemo) per YAGNI principle
 * Note: CartContext already handles cart state, this hook is for backward compatibility
 * Follows: UI → Logic (Services) → Data (API Services)
 */

import { useState, useEffect } from 'react';
import { cartService } from '@/services/api/cart.service';

interface UseCartState {
  items: any[];
  loading: boolean;
  error: string | null;
}

export function useCart() {
  const [state, setState] = useState<UseCartState>({
    items: [],
    loading: false,
    error: null,
  });

  const load = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const res = await cartService.getCart();
      setState({ items: res?.items || res || [], loading: false, error: null });
      return res;
    } catch (e: any) {
      setState({ items: [], loading: false, error: e?.message || 'Failed to load cart' });
      throw e;
    }
  };

  const add = async (productVariantId: number, quantity = 1) => {
    await cartService.addToCart({ product_variant_id: productVariantId, quantity });
    await load();
  };

  const update = async (cartItemId: number, quantity: number) => {
    await cartService.updateCartItem(cartItemId, quantity);
    await load();
  };

  const remove = async (cartItemId: number) => {
    await cartService.removeCartItem(cartItemId);
    await load();
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  return {
    ...state,
    reload: load,
    add,
    update,
    remove,
  };
}
