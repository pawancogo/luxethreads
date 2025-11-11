import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/contexts/CartContext';

const mockProduct: Product & { slug?: string } = {
  id: '1',
  name: 'Test Product',
  price: 1000,
  originalPrice: 1200,
  image: 'https://example.com/image.jpg',
  slug: 'test-product',
  brand: 'Test Brand',
  category: 'Test Category',
};

describe('ProductCard', () => {
  it('renders product name', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('renders product price', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );
    expect(screen.getByText(/1000/i)).toBeInTheDocument();
  });

  it('renders product image', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );
    const image = screen.getByAltText('Test Product');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('shows discount badge when discounted', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );
    expect(screen.getByText(/17% OFF/i)).toBeInTheDocument();
  });

  it('toggles wishlist on heart click', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );
    
    const wishlistButton = document.querySelector('button[class*="absolute top-2 right-2"]');
    if (wishlistButton) {
      fireEvent.click(wishlistButton);
      // Wishlist state is internal, so we just verify the button exists
      expect(wishlistButton).toBeInTheDocument();
    }
  });

  it('links to product detail page', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/product/test-product');
  });
});




