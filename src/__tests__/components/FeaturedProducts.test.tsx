import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FeaturedProducts from '@/components/FeaturedProducts';
import { productsAPI } from '@/services/api';

vi.mock('@/services/api', () => ({
  productsAPI: {
    getPublicProducts: vi.fn(),
  },
}));

vi.mock('@/lib/productMapper', () => ({
  mapBackendProductToList: (product: any) => product,
}));

describe('FeaturedProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders heading', () => {
    vi.mocked(productsAPI.getPublicProducts).mockResolvedValue([]);
    render(
      <BrowserRouter>
        <FeaturedProducts />
      </BrowserRouter>
    );
    expect(screen.getByText(/featured products/i)).toBeInTheDocument();
  });

  it('shows loading skeletons initially', () => {
    vi.mocked(productsAPI.getPublicProducts).mockImplementation(() => new Promise(() => {}));
    render(
      <BrowserRouter>
        <FeaturedProducts />
      </BrowserRouter>
    );
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders products when loaded', async () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', price: 1000, image: 'img1.jpg', brand: 'Brand 1', category: 'Cat 1' },
      { id: '2', name: 'Product 2', price: 2000, image: 'img2.jpg', brand: 'Brand 2', category: 'Cat 2' },
    ];
    vi.mocked(productsAPI.getPublicProducts).mockResolvedValue({ products: mockProducts } as any);

    render(
      <BrowserRouter>
        <FeaturedProducts />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
    });
  });

  it('shows empty state when no products', async () => {
    vi.mocked(productsAPI.getPublicProducts).mockResolvedValue({ products: [] } as any);

    render(
      <BrowserRouter>
        <FeaturedProducts />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/no featured products/i)).toBeInTheDocument();
    });
  });

  it('renders View All Products button', () => {
    vi.mocked(productsAPI.getPublicProducts).mockResolvedValue([]);
    render(
      <BrowserRouter>
        <FeaturedProducts />
      </BrowserRouter>
    );
    expect(screen.getByRole('link', { name: /view all products/i })).toBeInTheDocument();
  });
});




