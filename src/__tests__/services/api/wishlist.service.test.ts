import { describe, it, expect, vi, beforeEach } from 'vitest';
import { wishlistAPI } from '@/services/api/wishlist.service';

vi.mock('@/services/api/base', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('wishlistAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches wishlist', async () => {
    const mockWishlist = { items: [] };
    vi.mocked(require('@/services/api/base').api.get).mockResolvedValue({ data: mockWishlist });

    await wishlistAPI.getWishlist();
    expect(require('@/services/api/base').api.get).toHaveBeenCalledWith('/wishlist');
  });

  it('adds item to wishlist', async () => {
    vi.mocked(require('@/services/api/base').api.post).mockResolvedValue({ data: {} });

    await wishlistAPI.addToWishlist(1);
    expect(require('@/services/api/base').api.post).toHaveBeenCalledWith('/wishlist/items', {
      product_variant_id: 1,
    });
  });

  it('removes item from wishlist', async () => {
    vi.mocked(require('@/services/api/base').api.delete).mockResolvedValue({ data: {} });

    await wishlistAPI.removeFromWishlist(1);
    expect(require('@/services/api/base').api.delete).toHaveBeenCalledWith('/wishlist/items/1');
  });
});

