import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useProducts, useProduct } from '@/hooks/useProducts';

vi.mock('@/services/api', () => ({
  productsService: {
    getPublicProducts: vi.fn(),
    getPublicProduct: vi.fn(),
  },
}));

describe('useProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches products on mount', async () => {
    const mockProducts = [{ id: 1, name: 'Product 1' }];
    vi.mocked(require('@/services/api').productsService.getPublicProducts).mockResolvedValue(mockProducts);

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockProducts);
  });

  it('refetches products with new filters', async () => {
    const mockProducts = [{ id: 1, name: 'Product 1' }];
    vi.mocked(require('@/services/api').productsService.getPublicProducts).mockResolvedValue(mockProducts);

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      result.current.setFilters({ category_id: 1 });
      await result.current.refetch();
    });

    expect(require('@/services/api').productsService.getPublicProducts).toHaveBeenCalledWith({ category_id: 1 });
  });
});

describe('useProduct', () => {
  it('fetches single product', async () => {
    const mockProduct = { id: 1, name: 'Product 1' };
    vi.mocked(require('@/services/api').productsService.getPublicProduct).mockResolvedValue(mockProduct);

    const { result } = renderHook(() => useProduct('1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockProduct);
  });
});




