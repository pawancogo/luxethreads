import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useOrders } from '@/hooks/useOrders';

vi.mock('@/services/api', () => ({
  ordersAPI: {
    getMyOrders: vi.fn(),
    createOrder: vi.fn(),
    cancelOrder: vi.fn(),
  },
}));

describe('useOrders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads orders on mount', async () => {
    const mockOrders = [{ id: 1, order_number: 'ORD-001' }];
    vi.mocked(require('@/services/api').ordersAPI.getMyOrders).mockResolvedValue(mockOrders);

    const { result } = renderHook(() => useOrders());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.orders).toEqual(mockOrders);
  });

  it('creates order', async () => {
    vi.mocked(require('@/services/api').ordersAPI.getMyOrders).mockResolvedValue([]);
    vi.mocked(require('@/services/api').ordersAPI.createOrder).mockResolvedValue({ id: 1 });

    const { result } = renderHook(() => useOrders());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const orderData = { items: [] };
    await act(async () => {
      await result.current.create(orderData);
    });

    expect(require('@/services/api').ordersAPI.createOrder).toHaveBeenCalledWith(orderData);
  });

  it('cancels order', async () => {
    vi.mocked(require('@/services/api').ordersAPI.getMyOrders).mockResolvedValue([]);
    vi.mocked(require('@/services/api').ordersAPI.cancelOrder).mockResolvedValue({});

    const { result } = renderHook(() => useOrders());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.cancel(1, 'Changed mind');
    });

    expect(require('@/services/api').ordersAPI.cancelOrder).toHaveBeenCalledWith(1, 'Changed mind');
  });
});





