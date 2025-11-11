import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdvancedProductFilters from '@/components/products/AdvancedProductFilters';

const defaultProps = {
  categories: [],
  brands: [],
  fabrics: [],
  colors: [],
  sizes: [],
  priceRange: [0, 10000] as [number, number],
  selectedCategory: 'all',
  selectedFabrics: [],
  selectedColors: [],
  selectedSizes: [],
  onCategoryChange: vi.fn(),
  onFilterChange: vi.fn(),
  onPriceRangeChange: vi.fn(),
};

describe('AdvancedProductFilters', () => {
  it('renders filter options', () => {
    render(<AdvancedProductFilters {...defaultProps} />);
    expect(screen.getByText(/filter/i) || screen.getByText(/category/i)).toBeInTheDocument();
  });

  it('handles category selection', async () => {
    const onCategoryChange = vi.fn();
    render(<AdvancedProductFilters {...defaultProps} onCategoryChange={onCategoryChange} />);
    
    const categorySelect = screen.getByLabelText(/category/i) || screen.getByText(/all/i);
    if (categorySelect) {
      await userEvent.click(categorySelect);
      expect(onCategoryChange).toHaveBeenCalled();
    }
  });
});





