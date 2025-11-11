import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Products from '@/pages/Products';

// Mock ProductsContainer
vi.mock('@/components/products/ProductsContainer', () => ({
  default: () => <div data-testid="products-container">Products Container</div>,
}));

describe('Products Page', () => {
  it('renders ProductsContainer', () => {
    render(
      <BrowserRouter>
        <Products />
      </BrowserRouter>
    );
    expect(screen.getByTestId('products-container')).toBeInTheDocument();
  });
});

