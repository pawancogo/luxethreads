import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from '@/components/common/EmptyState';
import userEvent from '@testing-library/user-event';

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="No items found" />);
    expect(screen.getByText('No items found')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <EmptyState 
        title="No items" 
        description="Try adding some items to get started" 
      />
    );
    expect(screen.getByText('Try adding some items to get started')).toBeInTheDocument();
  });

  it('renders action button when provided', async () => {
    const handleClick = vi.fn();
    render(
      <EmptyState 
        title="No items" 
        action={{ label: 'Add Item', onClick: handleClick }}
      />
    );
    
    const button = screen.getByRole('button', { name: /add item/i });
    expect(button).toBeInTheDocument();
    
    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders custom icon when provided', () => {
    const customIcon = <div data-testid="custom-icon">Custom Icon</div>;
    render(<EmptyState title="No items" icon={customIcon} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders default icon when no icon provided', () => {
    render(<EmptyState title="No items" />);
    const icon = document.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });
});





