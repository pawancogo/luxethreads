import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorState } from '@/components/common/ErrorState';
import userEvent from '@testing-library/user-event';

describe('ErrorState', () => {
  it('renders error message', () => {
    render(<ErrorState error={new Error('Something went wrong')} />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders default title when none provided', () => {
    render(<ErrorState error={new Error('Test error')} />);
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('renders custom title when provided', () => {
    render(<ErrorState error={new Error('Test')} title="Custom Error Title" />);
    expect(screen.getByText('Custom Error Title')).toBeInTheDocument();
  });

  it('calls onRetry when retry button clicked', async () => {
    const onRetry = vi.fn();
    render(<ErrorState error={new Error('Test')} onRetry={onRetry} />);
    
    const retryButton = screen.getByRole('button', { name: /try again/i });
    await userEvent.click(retryButton);
    
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('does not show retry button when onRetry not provided', () => {
    render(<ErrorState error={new Error('Test')} />);
    const retryButton = screen.queryByRole('button', { name: /try again/i });
    expect(retryButton).not.toBeInTheDocument();
  });

  it('renders in card variant', () => {
    render(<ErrorState error={new Error('Test')} variant="card" />);
    expect(document.querySelector('.card')).toBeInTheDocument();
  });
});

