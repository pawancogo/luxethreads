import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CurrencyDisplay } from '@/components/common/CurrencyDisplay';

describe('CurrencyDisplay', () => {
  it('renders amount with default currency', () => {
    render(<CurrencyDisplay amount={1000} />);
    expect(screen.getByText(/1000/i)).toBeInTheDocument();
  });

  it('handles null amount', () => {
    const { container } = render(<CurrencyDisplay amount={null} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<CurrencyDisplay amount={1000} size="sm" />);
    expect(document.querySelector('.text-sm')).toBeInTheDocument();

    rerender(<CurrencyDisplay amount={1000} size="lg" />);
    expect(document.querySelector('.text-lg')).toBeInTheDocument();
  });

  it('renders custom currency', () => {
    render(<CurrencyDisplay amount={1000} currency="USD" />);
    expect(screen.getByText(/1000/i)).toBeInTheDocument();
  });

  it('handles string amount', () => {
    render(<CurrencyDisplay amount="1000" />);
    expect(screen.getByText(/1000/i)).toBeInTheDocument();
  });
});





