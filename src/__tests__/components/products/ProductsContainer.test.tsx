import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductsContainer from '@/components/products/ProductsContainer';

vi.mock('@/contexts/ProductContext', () => ({
  useProducts: () => ({
    products: [],
    isLoading: false,
  }),
}));

vi.mock('@/contexts/FilterContext', () => ({
  useFilters: () => ({
    filters: {},
    setFilters: vi.fn(),
  }),
}));

describe('ProductsContainer', () => {
  it('renders products container', () => {
    render(
      <BrowserRouter>
        <ProductsContainer />
      </BrowserRouter>
    );
    expect(screen.getByTestId('products-container') || document.querySelector('.products-container')).toBeInTheDocument();
  });
});




