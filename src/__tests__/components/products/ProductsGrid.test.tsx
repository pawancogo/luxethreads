import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductsGrid from '@/components/products/ProductsGrid';
import { Product } from '@/contexts/CartContext';

const mockProducts: Product[] = [
  { id: '1', name: 'Product 1', price: 1000, image: 'img1.jpg', brand: 'Brand 1', category: 'Cat 1' },
  { id: '2', name: 'Product 2', price: 2000, image: 'img2.jpg', brand: 'Brand 2', category: 'Cat 2' },
];

describe('ProductsGrid', () => {
  it('renders products', () => {
    render(
      <BrowserRouter>
        <ProductsGrid 
          filteredProducts={mockProducts}
          isLoading={false}
          hasMore={false}
          viewMode="grid"
          clearFilters={vi.fn()}
        />
      </BrowserRouter>
    );
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  it('shows empty state when no products', () => {
    render(
      <BrowserRouter>
        <ProductsGrid 
          filteredProducts={[]}
          isLoading={false}
          hasMore={false}
          viewMode="grid"
          clearFilters={vi.fn()}
        />
      </BrowserRouter>
    );
    expect(screen.getByText(/no products found/i)).toBeInTheDocument();
  });

  it('shows loading skeletons when loading', () => {
    render(
      <BrowserRouter>
        <ProductsGrid 
          filteredProducts={[]}
          isLoading={true}
          hasMore={false}
          viewMode="grid"
          clearFilters={vi.fn()}
        />
      </BrowserRouter>
    );
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows load more message when hasMore is true', () => {
    render(
      <BrowserRouter>
        <ProductsGrid 
          filteredProducts={mockProducts}
          isLoading={false}
          hasMore={true}
          viewMode="grid"
          clearFilters={vi.fn()}
        />
      </BrowserRouter>
    );
    expect(screen.getByText(/scroll down to load more/i)).toBeInTheDocument();
  });

  it('calls clearFilters when clear button clicked', async () => {
    const clearFilters = vi.fn();
    render(
      <BrowserRouter>
        <ProductsGrid 
          filteredProducts={[]}
          isLoading={false}
          hasMore={false}
          viewMode="grid"
          clearFilters={clearFilters}
        />
      </BrowserRouter>
    );
    
    const clearButton = screen.getByRole('button', { name: /clear all filters/i });
    await userEvent.click(clearButton);
    expect(clearFilters).toHaveBeenCalled();
  });
});




