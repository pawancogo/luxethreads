import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCart } from '@/hooks/useCart';

vi.mock('@/services/api', () => ({
  cartAPI: {
    getCart: vi.fn(),
    addToCart: vi.fn(),
    updateCartItem: vi.fn(),
    removeFromCart: vi.fn(),
  },
}));

describe('useCart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads cart on mount', async () => {
    const mockCart = { items: [] };
    vi.mocked(require('@/services/api').cartAPI.getCart).mockResolvedValue(mockCart);

    const { result } = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(require('@/services/api').cartAPI.getCart).toHaveBeenCalled();
  });

  it('adds item to cart', async () => {
    vi.mocked(require('@/services/api').cartAPI.getCart).mockResolvedValue({ items: [] });
    vi.mocked(require('@/services/api').cartAPI.addToCart).mockResolvedValue({});

    const { result } = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.add(1, 2);
    });

    expect(require('@/services/api').cartAPI.addToCart).toHaveBeenCalledWith(1, 2);
  });

  it('updates cart item quantity', async () => {
    vi.mocked(require('@/services/api').cartAPI.getCart).mockResolvedValue({ items: [] });
    vi.mocked(require('@/services/api').cartAPI.updateCartItem).mockResolvedValue({});

    const { result } = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.update(1, 3);
    });

    expect(require('@/services/api').cartAPI.updateCartItem).toHaveBeenCalledWith(1, 3);
  });

  it('removes item from cart', async () => {
    vi.mocked(require('@/services/api').cartAPI.getCart).mockResolvedValue({ items: [] });
    vi.mocked(require('@/services/api').cartAPI.removeFromCart).mockResolvedValue({});

    const { result } = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.remove(1);
    });

    expect(require('@/services/api').cartAPI.removeFromCart).toHaveBeenCalledWith(1);
  });
});




