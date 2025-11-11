import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ordersAPI } from '@/services/api/orders.service';

vi.mock('@/services/api/base', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('ordersAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches user orders', async () => {
    const mockOrders = [{ id: 1, order_number: 'ORD-001' }];
    vi.mocked(require('@/services/api/base').api.get).mockResolvedValue({ data: mockOrders });

    const result = await ordersAPI.getMyOrders();
    expect(require('@/services/api/base').api.get).toHaveBeenCalledWith('/orders');
  });

  it('fetches order details', async () => {
    const mockOrder = { id: 1, order_number: 'ORD-001' };
    vi.mocked(require('@/services/api/base').api.get).mockResolvedValue({ data: mockOrder });

    await ordersAPI.getOrderDetails(1);
    expect(require('@/services/api/base').api.get).toHaveBeenCalledWith('/orders/1');
  });

  it('creates order', async () => {
    const orderData = { items: [] };
    vi.mocked(require('@/services/api/base').api.post).mockResolvedValue({ data: { id: 1 } });

    await ordersAPI.createOrder(orderData);
    expect(require('@/services/api/base').api.post).toHaveBeenCalledWith('/orders', orderData);
  });

  it('cancels order', async () => {
    vi.mocked(require('@/services/api/base').api.put).mockResolvedValue({ data: {} });

    await ordersAPI.cancelOrder(1, 'Changed mind');
    expect(require('@/services/api/base').api.put).toHaveBeenCalledWith('/orders/1/cancel', { reason: 'Changed mind' });
  });
});

