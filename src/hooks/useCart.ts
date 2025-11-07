import { useCallback, useEffect, useMemo, useState } from 'react';
import { cartAPI } from '@/services/api';

interface UseCartState {
  items: any[];
  loading: boolean;
  error: string | null;
}

export function useCart() {
  const [state, setState] = useState<UseCartState>({ items: [], loading: false, error: null });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await cartAPI.getCart();
      setState({ items: res?.items || res || [], loading: false, error: null });
      return res;
    } catch (e: any) {
      setState({ items: [], loading: false, error: e?.message || 'Failed to load cart' });
      throw e;
    }
  }, []);

  const add = useCallback(async (productVariantId: number, quantity = 1) => {
    await cartAPI.addToCart(productVariantId, quantity);
    await load();
  }, [load]);

  const update = useCallback(async (cartItemId: number, quantity: number) => {
    await cartAPI.updateCartItem(cartItemId, quantity);
    await load();
  }, [load]);

  const remove = useCallback(async (cartItemId: number) => {
    await cartAPI.removeFromCart(cartItemId);
    await load();
  }, [load]);

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  return useMemo(() => ({
    ...state,
    reload: load,
    add,
    update,
    remove,
  }), [state, load, add, update, remove]);
}
