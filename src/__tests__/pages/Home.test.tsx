import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '@/pages/Home';

// Mock FeaturedProducts
vi.mock('@/components/FeaturedProducts', () => ({
  default: () => <div data-testid="featured-products">Featured Products</div>,
}));

describe('Home Page', () => {
  it('renders hero section', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByText(/discover premium/i)).toBeInTheDocument();
  });

  it('renders featured products', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByTestId('featured-products')).toBeInTheDocument();
  });

  it('renders category sections', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByText(/shop by category/i)).toBeInTheDocument();
    expect(screen.getByText(/sarees/i)).toBeInTheDocument();
  });
});




