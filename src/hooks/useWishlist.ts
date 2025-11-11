/**
 * useWishlist Hook - Simplified
 * Uses WishlistService for business logic
 * Removed unnecessary hooks (useCallback, useMemo) per YAGNI principle
 */

import { useState, useEffect } from 'react';
import { wishlistService } from '@/services/wishlist.service';

interface UseWishlistState {
  items: any[];
  loading: boolean;
  error: string | null;
}

export function useWishlist() {
  const [state, setState] = useState<UseWishlistState>({
    items: [],
    loading: false,
    error: null,
  });

  const load = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const items = await wishlistService.getWishlist();
      setState({ items, loading: false, error: null });
      return items;
    } catch (e: any) {
      const errorMessage = wishlistService.extractErrorMessage(e);
      setState({ items: [], loading: false, error: errorMessage });
      throw e;
    }
  };

  const add = async (productVariantId: number) => {
    await wishlistService.addToWishlist(productVariantId);
    await load();
  };

  const remove = async (wishlistItemId: number) => {
    await wishlistService.removeFromWishlist(wishlistItemId);
    await load();
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  return {
    ...state,
    reload: load,
    add,
    remove,
  };
}
