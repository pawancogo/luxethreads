import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PriceDisplay } from '@/components/common/PriceDisplay';

describe('PriceDisplay', () => {
  it('renders price with default currency', () => {
    render(<PriceDisplay price={1000} />);
    expect(screen.getByText(/₹/)).toBeInTheDocument();
    expect(screen.getByText(/1000/)).toBeInTheDocument();
  });

  it('renders original price when discounted', () => {
    render(<PriceDisplay price={800} originalPrice={1000} />);
    expect(screen.getByText(/1000/)).toBeInTheDocument();
    expect(screen.getByText(/800/)).toBeInTheDocument();
  });

  it('shows discount percentage when discounted', () => {
    render(<PriceDisplay price={800} originalPrice={1000} showDiscount={true} />);
    expect(screen.getByText(/20% OFF/i)).toBeInTheDocument();
  });

  it('hides discount percentage when showDiscount is false', () => {
    render(<PriceDisplay price={800} originalPrice={1000} showDiscount={false} />);
    expect(screen.queryByText(/OFF/i)).not.toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<PriceDisplay price={1000} size="sm" />);
    expect(document.querySelector('.text-sm')).toBeInTheDocument();

    rerender(<PriceDisplay price={1000} size="lg" />);
    expect(document.querySelector('.text-xl')).toBeInTheDocument();
  });

  it('renders custom currency', () => {
    render(<PriceDisplay price={1000} currency="$" />);
    expect(screen.getByText(/\$/)).toBeInTheDocument();
  });
});




