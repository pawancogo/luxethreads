import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import ProductDetail from '@/pages/ProductDetail';

// Mock all API services
vi.mock('@/services/api', () => ({
  productsAPI: {
    getProductDetail: vi.fn(),
  },
  cartAPI: {
    addItem: vi.fn(),
  },
  productViewsAPI: {
    trackView: vi.fn(),
  },
  wishlistAPI: {
    checkItem: vi.fn(),
    addItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

vi.mock('@/lib/productMapper', () => ({
  mapBackendProductDetail: (product: any) => product,
  findVariantByAttributes: vi.fn(),
}));

vi.mock('@/contexts/CartContext', () => ({
  useCart: () => ({
    loadCart: vi.fn(),
  }),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('ProductDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading skeleton initially', () => {
    vi.mocked(require('@/services/api').productsAPI.getProductDetail).mockImplementation(
      () => new Promise(() => {})
    );

    render(
      <MemoryRouter initialEntries={['/product/1']}>
        <ProductDetail />
      </MemoryRouter>
    );

    const skeleton = document.querySelector('.animate-pulse');
    expect(skeleton).toBeInTheDocument();
  });

  it('renders product details when loaded', async () => {
    const mockProduct = {
      id: 1,
      name: 'Test Product',
      description: 'Test Description',
      brand: { id: 1, name: 'Test Brand' },
      category: { id: 1, name: 'Test Category' },
      variants: [{
        id: 1,
        sku: 'SKU001',
        price: 1000,
        stock_quantity: 10,
        images: [{ id: 1, url: 'img.jpg' }],
        attributes: [],
      }],
      reviews: [],
      total_reviews: 0,
    };

    vi.mocked(require('@/services/api').productsAPI.getProductDetail).mockResolvedValue(mockProduct);

    render(
      <MemoryRouter initialEntries={['/product/1']}>
        <ProductDetail />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
  });
});





