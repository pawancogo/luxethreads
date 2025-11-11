import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProductsBreadcrumb from '@/components/products/ProductsBreadcrumb';

// Mock ProductContext
vi.mock('@/contexts/ProductContext', () => ({
  useProduct: () => ({
    categories: [
      { id: 1, name: 'Sarees', slug: 'sarees' },
      { id: 2, name: 'Kurtas', slug: 'kurtas' },
    ],
  }),
}));

describe('ProductsBreadcrumb', () => {
  it('renders home breadcrumb', () => {
    render(<ProductsBreadcrumb selectedCategory="all" searchQuery="" />);
    expect(screen.getByText(/home/i)).toBeInTheDocument();
  });

  it('renders category when selected', () => {
    render(<ProductsBreadcrumb selectedCategory="sarees" searchQuery="" />);
    expect(screen.getByText(/sarees/i)).toBeInTheDocument();
  });

  it('renders search query when provided', () => {
    render(<ProductsBreadcrumb selectedCategory="all" searchQuery="shirt" />);
    expect(screen.getByText(/search results for/i)).toBeInTheDocument();
    expect(screen.getByText(/shirt/i)).toBeInTheDocument();
  });

  it('does not show search query when empty', () => {
    render(<ProductsBreadcrumb selectedCategory="all" searchQuery="" />);
    expect(screen.queryByText(/search results for/i)).not.toBeInTheDocument();
  });
});





