import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useContext } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ProductProvider, ProductContext } from '@/contexts/ProductContext';

vi.mock('@/services/api', () => ({
  productsService: {
    getPublicProducts: vi.fn(),
  },
}));

describe('ProductContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('provides product context', () => {
    const TestComponent = () => {
      const { products } = useContext(ProductContext);
      return <div>{products?.length || 0} products</div>;
    };

    render(
      <BrowserRouter>
        <ProductProvider>
          <TestComponent />
        </ProductProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('0 products')).toBeInTheDocument();
  });
});





