import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { ProductsView } from '../components/products/ProductsView';
import * as productsAPI from '../services/api/products.service';

vi.mock('../services/api/products.service');

describe('Product Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ProductCard', () => {
    const mockProduct = {
      id: 1,
      name: 'Test Product',
      description: 'Test Description',
      base_price: 100,
      base_discounted_price: 90,
      images: [{ url: 'https://example.com/image.jpg' }],
      brand: { name: 'Test Brand' },
      category: { name: 'Test Category' }
    };

    it('renders product information', () => {
      render(
        <BrowserRouter>
          <ProductCard product={mockProduct} />
        </BrowserRouter>
      );

      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('Test Brand')).toBeInTheDocument();
    });

    it('displays discounted price when available', () => {
      render(
        <BrowserRouter>
          <ProductCard product={mockProduct} />
        </BrowserRouter>
      );

      expect(screen.getByText(/90/i)).toBeInTheDocument();
    });

    it('navigates to product detail on click', () => {
      render(
        <BrowserRouter>
          <ProductCard product={mockProduct} />
        </BrowserRouter>
      );

      const productLink = screen.getByRole('link');
      expect(productLink).toHaveAttribute('href', '/products/1');
    });
  });

  describe('ProductsView', () => {
    it('fetches and displays products', async () => {
      const mockProducts = [
        {
          id: 1,
          name: 'Product 1',
          base_price: 100,
          images: []
        },
        {
          id: 2,
          name: 'Product 2',
          base_price: 200,
          images: []
        }
      ];

      const mockGetProducts = vi.fn().mockResolvedValue({
        success: true,
        data: mockProducts
      });
      vi.mocked(productsAPI.getPublicProducts).mockImplementation(mockGetProducts);

      render(
        <BrowserRouter>
          <ProductsView />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(mockGetProducts).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(screen.getByText('Product 1')).toBeInTheDocument();
        expect(screen.getByText('Product 2')).toBeInTheDocument();
      });
    });

    it('handles loading state', () => {
      const mockGetProducts = vi.fn().mockImplementation(() => new Promise(() => {}));
      vi.mocked(productsAPI.getPublicProducts).mockImplementation(mockGetProducts);

      render(
        <BrowserRouter>
          <ProductsView />
        </BrowserRouter>
      );

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('handles error state', async () => {
      const mockGetProducts = vi.fn().mockRejectedValue(new Error('Failed to fetch'));
      vi.mocked(productsAPI.getPublicProducts).mockImplementation(mockGetProducts);

      render(
        <BrowserRouter>
          <ProductsView />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });

    it('filters products by category', async () => {
      const mockGetProducts = vi.fn().mockResolvedValue({
        success: true,
        data: []
      });
      vi.mocked(productsAPI.getPublicProducts).mockImplementation(mockGetProducts);

      render(
        <BrowserRouter>
          <ProductsView />
        </BrowserRouter>
      );

      const categoryFilter = screen.getByLabelText(/category/i);
      fireEvent.change(categoryFilter, { target: { value: '1' } });

      await waitFor(() => {
        expect(mockGetProducts).toHaveBeenCalledWith(
          expect.objectContaining({ category_id: '1' })
        );
      });
    });
  });
});




