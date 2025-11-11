import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cartAPI } from '@/services/api/cart.service';

vi.mock('@/services/api/base', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('cartAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches cart', async () => {
    const mockCart = { items: [] };
    vi.mocked(require('@/services/api/base').api.get).mockResolvedValue({ data: mockCart });

    await cartAPI.getCart();
    expect(require('@/services/api/base').api.get).toHaveBeenCalledWith('/cart');
  });

  it('adds item to cart', async () => {
    vi.mocked(require('@/services/api/base').api.post).mockResolvedValue({ data: {} });

    await cartAPI.addToCart(1, 2);
    expect(require('@/services/api/base').api.post).toHaveBeenCalledWith('/cart/items', {
      product_variant_id: 1,
      quantity: 2,
    });
  });

  it('updates cart item', async () => {
    vi.mocked(require('@/services/api/base').api.put).mockResolvedValue({ data: {} });

    await cartAPI.updateCartItem(1, 3);
    expect(require('@/services/api/base').api.put).toHaveBeenCalledWith('/cart/items/1', { quantity: 3 });
  });

  it('removes item from cart', async () => {
    vi.mocked(require('@/services/api/base').api.delete).mockResolvedValue({ data: {} });

    await cartAPI.removeFromCart(1);
    expect(require('@/services/api/base').api.delete).toHaveBeenCalledWith('/cart/items/1');
  });
});

