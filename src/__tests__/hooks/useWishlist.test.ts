import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useWishlist } from '@/hooks/useWishlist';

vi.mock('@/services/api', () => ({
  wishlistAPI: {
    getWishlist: vi.fn(),
    addToWishlist: vi.fn(),
    removeFromWishlist: vi.fn(),
  },
}));

describe('useWishlist', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads wishlist on mount', async () => {
    const mockItems = [{ id: 1, product_id: 1 }];
    vi.mocked(require('@/services/api').wishlistAPI.getWishlist).mockResolvedValue(mockItems);

    const { result } = renderHook(() => useWishlist());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.items).toEqual(mockItems);
  });

  it('adds item to wishlist', async () => {
    vi.mocked(require('@/services/api').wishlistAPI.getWishlist).mockResolvedValue([]);
    vi.mocked(require('@/services/api').wishlistAPI.addToWishlist).mockResolvedValue({});

    const { result } = renderHook(() => useWishlist());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.add(1);
    });

    expect(require('@/services/api').wishlistAPI.addToWishlist).toHaveBeenCalledWith(1);
  });

  it('removes item from wishlist', async () => {
    vi.mocked(require('@/services/api').wishlistAPI.getWishlist).mockResolvedValue([]);
    vi.mocked(require('@/services/api').wishlistAPI.removeFromWishlist).mockResolvedValue({});

    const { result } = renderHook(() => useWishlist());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.remove(1);
    });

    expect(require('@/services/api').wishlistAPI.removeFromWishlist).toHaveBeenCalledWith(1);
  });
});




