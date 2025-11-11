import { describe, it, expect, vi, beforeEach } from 'vitest';
import { productsService } from '@/services/api/products.service';

// Mock base API
vi.mock('@/services/api/base', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('productsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches public products', async () => {
    const mockProducts = [{ id: 1, name: 'Product 1' }];
    vi.mocked(require('@/services/api/base').api.get).mockResolvedValue({ data: mockProducts });

    const result = await productsService.getPublicProducts({ page: 1 });

    expect(require('@/services/api/base').api.get).toHaveBeenCalledWith('/public/products', { params: { page: 1 } });
  });

  it('fetches single product', async () => {
    const mockProduct = { id: 1, name: 'Product 1' };
    vi.mocked(require('@/services/api/base').api.get).mockResolvedValue({ data: mockProduct });

    const result = await productsService.getPublicProduct('1');

    expect(require('@/services/api/base').api.get).toHaveBeenCalledWith('/public/products/1');
  });
});




