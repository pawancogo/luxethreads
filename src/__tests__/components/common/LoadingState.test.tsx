import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingState } from '@/components/common/LoadingState';

describe('LoadingState', () => {
  it('renders loading spinner', () => {
    render(<LoadingState />);
    const spinner = screen.getByRole('status', { hidden: true }) || document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('displays custom text when provided', () => {
    render(<LoadingState text="Loading products..." />);
    expect(screen.getByText('Loading products...')).toBeInTheDocument();
  });

  it('renders in full screen mode', () => {
    const { container } = render(<LoadingState fullScreen={true} />);
    expect(container.querySelector('.fixed')).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<LoadingState size="sm" />);
    let spinner = document.querySelector('.h-4');
    expect(spinner).toBeInTheDocument();

    rerender(<LoadingState size="md" />);
    spinner = document.querySelector('.h-6');
    expect(spinner).toBeInTheDocument();

    rerender(<LoadingState size="lg" />);
    spinner = document.querySelector('.h-8');
    expect(spinner).toBeInTheDocument();
  });
});




