import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductBadges } from '@/components/products/ProductBadges';

describe('ProductBadges', () => {
  it('renders featured badge', () => {
    render(<ProductBadges is_featured={true} />);
    expect(screen.getByText(/featured/i)).toBeInTheDocument();
  });

  it('renders bestseller badge', () => {
    render(<ProductBadges is_bestseller={true} />);
    expect(screen.getByText(/bestseller/i)).toBeInTheDocument();
  });

  it('renders new arrival badge', () => {
    render(<ProductBadges is_new_arrival={true} />);
    expect(screen.getByText(/new/i)).toBeInTheDocument();
  });

  it('renders trending badge', () => {
    render(<ProductBadges is_trending={true} />);
    expect(screen.getByText(/trending/i)).toBeInTheDocument();
  });

  it('renders low stock badge', () => {
    render(<ProductBadges stockStatus="low_stock" />);
    expect(screen.getByText(/low stock/i)).toBeInTheDocument();
  });

  it('renders out of stock badge', () => {
    render(<ProductBadges stockStatus="out_of_stock" />);
    expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
  });

  it('renders multiple badges', () => {
    render(
      <ProductBadges 
        is_featured={true}
        is_bestseller={true}
        is_new_arrival={true}
      />
    );
    expect(screen.getByText(/featured/i)).toBeInTheDocument();
    expect(screen.getByText(/bestseller/i)).toBeInTheDocument();
    expect(screen.getByText(/new/i)).toBeInTheDocument();
  });

  it('returns null when no badges', () => {
    const { container } = render(<ProductBadges />);
    expect(container.firstChild).toBeNull();
  });
});




