import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductsView from '@/components/products/ProductsView';
import { Product } from '@/contexts/CartContext';

const mockProducts: Product[] = [
  { id: '1', name: 'Product 1', price: 1000, image: 'img1.jpg', brand: 'Brand 1', category: 'Cat 1' },
];

const defaultProps = {
  products: mockProducts,
  categories: [],
  isLoading: false,
  isInitialLoading: false,
  hasMore: false,
  totalCount: 1,
  sortBy: 'recommended',
  viewMode: 'grid' as const,
  selectedCategory: 'all',
  selectedFabrics: [],
  selectedColors: [],
  selectedSizes: [],
  priceRange: [0, 10000] as [number, number],
  searchQuery: '',
  showFilters: false,
  loadMoreRef: { current: null },
  onSortChange: vi.fn(),
  onViewModeChange: vi.fn(),
  onCategoryChange: vi.fn(),
  onFilterChange: vi.fn(),
  onSearch: vi.fn(),
  onToggleFilters: vi.fn(),
};

describe('ProductsView', () => {
  it('renders products breadcrumb', () => {
    render(
      <BrowserRouter>
        <ProductsView {...defaultProps} />
      </BrowserRouter>
    );
    expect(screen.getByText(/home/i)).toBeInTheDocument();
  });

  it('renders products header', () => {
    render(
      <BrowserRouter>
        <ProductsView {...defaultProps} />
      </BrowserRouter>
    );
    expect(screen.getByText(/all products/i)).toBeInTheDocument();
  });

  it('renders products grid', () => {
    render(
      <BrowserRouter>
        <ProductsView {...defaultProps} />
      </BrowserRouter>
    );
    expect(screen.getByText('Product 1')).toBeInTheDocument();
  });

  it('shows loading state when initial loading', () => {
    render(
      <BrowserRouter>
        <ProductsView {...defaultProps} isInitialLoading={true} />
      </BrowserRouter>
    );
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});




