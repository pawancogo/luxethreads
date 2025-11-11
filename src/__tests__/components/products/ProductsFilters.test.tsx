import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductsFilters from '@/components/products/ProductsFilters';

describe('ProductsFilters', () => {
  const defaultProps = {
    showFilters: true,
    setShowFilters: vi.fn(),
    selectedCategory: 'all',
    selectedFabrics: [],
    selectedColors: [],
    selectedSizes: [],
    priceRange: [0, 10000],
    onFiltersChange: vi.fn(),
  };

  it('renders filter options', () => {
    render(<ProductsFilters {...defaultProps} />);
    expect(screen.getByText(/fabric/i)).toBeInTheDocument();
    expect(screen.getByText(/color/i)).toBeInTheDocument();
    expect(screen.getByText(/size/i)).toBeInTheDocument();
  });

  it('calls onFiltersChange when fabric selected', async () => {
    const onFiltersChange = vi.fn();
    render(<ProductsFilters {...defaultProps} onFiltersChange={onFiltersChange} />);
    
    const cottonCheckbox = screen.getByLabelText(/cotton/i);
    await userEvent.click(cottonCheckbox);
    
    expect(onFiltersChange).toHaveBeenCalled();
  });

  it('calls onFiltersChange when color selected', async () => {
    const onFiltersChange = vi.fn();
    render(<ProductsFilters {...defaultProps} onFiltersChange={onFiltersChange} />);
    
    const redCheckbox = screen.getByLabelText(/red/i);
    await userEvent.click(redCheckbox);
    
    expect(onFiltersChange).toHaveBeenCalled();
  });

  it('calls onFiltersChange when size selected', async () => {
    const onFiltersChange = vi.fn();
    render(<ProductsFilters {...defaultProps} onFiltersChange={onFiltersChange} />);
    
    const sizeCheckbox = screen.getByLabelText(/M/i);
    await userEvent.click(sizeCheckbox);
    
    expect(onFiltersChange).toHaveBeenCalled();
  });

  it('closes filters when close button clicked', async () => {
    const setShowFilters = vi.fn();
    render(<ProductsFilters {...defaultProps} setShowFilters={setShowFilters} />);
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeButton);
    
    expect(setShowFilters).toHaveBeenCalledWith(false);
  });

  it('shows selected filters', () => {
    render(
      <ProductsFilters 
        {...defaultProps} 
        selectedFabrics={['cotton']}
        selectedColors={['Red']}
      />
    );
    const cottonCheckbox = screen.getByLabelText(/cotton/i) as HTMLInputElement;
    expect(cottonCheckbox.checked).toBe(true);
  });
});




