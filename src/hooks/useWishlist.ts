import { useCallback, useEffect, useMemo, useState } from 'react';
import { wishlistAPI } from '@/services/api';

interface UseWishlistState {
  items: any[];
  loading: boolean;
  error: string | null;
}

export function useWishlist() {
  const [state, setState] = useState<UseWishlistState>({ items: [], loading: false, error: null });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await wishlistAPI.getWishlist();
      setState({ items: res?.items || res || [], loading: false, error: null });
      return res;
    } catch (e: any) {
      setState({ items: [], loading: false, error: e?.message || 'Failed to load wishlist' });
      throw e;
    }
  }, []);

  const add = useCallback(async (productVariantId: number) => {
    await wishlistAPI.addToWishlist(productVariantId);
    await load();
  }, [load]);

  const remove = useCallback(async (wishlistItemId: number) => {
    await wishlistAPI.removeFromWishlist(wishlistItemId);
    await load();
  }, [load]);

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  return useMemo(() => ({
    ...state,
    reload: load,
    add,
    remove,
  }), [state, load, add, remove]);
}
