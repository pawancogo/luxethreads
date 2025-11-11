import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductsHeader from '@/components/products/ProductsHeader';

// Mock ProductContext
vi.mock('@/contexts/ProductContext', () => ({
  useProduct: () => ({
    categories: [
      { id: 1, name: 'Sarees', slug: 'sarees' },
      { id: 2, name: 'Kurtas', slug: 'kurtas' },
    ],
  }),
}));

describe('ProductsHeader', () => {
  const defaultProps = {
    selectedCategory: 'all',
    filteredProductsCount: 10,
    showFilters: false,
    setShowFilters: vi.fn(),
    activeFiltersCount: 0,
    onSortChange: vi.fn(),
    onViewModeChange: vi.fn(),
  };

  it('renders product count', () => {
    render(<ProductsHeader {...defaultProps} />);
    expect(screen.getByText(/10 items/i)).toBeInTheDocument();
  });

  it('renders category name when selected', () => {
    render(<ProductsHeader {...defaultProps} selectedCategory="sarees" />);
    expect(screen.getByText(/sarees/i)).toBeInTheDocument();
  });

  it('renders view mode toggle buttons', () => {
    render(<ProductsHeader {...defaultProps} />);
    const gridButton = document.querySelector('button[class*="grid"]');
    expect(gridButton).toBeInTheDocument();
  });

  it('calls onViewModeChange when view mode changed', async () => {
    const onViewModeChange = vi.fn();
    render(<ProductsHeader {...defaultProps} onViewModeChange={onViewModeChange} />);
    
    const listButton = document.querySelectorAll('button')[1];
    if (listButton) {
      await userEvent.click(listButton);
      expect(onViewModeChange).toHaveBeenCalled();
    }
  });

  it('shows active filters count', () => {
    render(<ProductsHeader {...defaultProps} activeFiltersCount={3} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('calls onSortChange when sort changed', async () => {
    const onSortChange = vi.fn();
    render(<ProductsHeader {...defaultProps} onSortChange={onSortChange} />);
    
    const select = screen.getByRole('combobox');
    await userEvent.click(select);
    
    const option = screen.getByText(/newest/i);
    await userEvent.click(option);
    
    expect(onSortChange).toHaveBeenCalled();
  });
});




