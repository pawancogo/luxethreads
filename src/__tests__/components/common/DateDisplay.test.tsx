import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DateDisplay } from '@/components/common/DateDisplay';

describe('DateDisplay', () => {
  it('renders date in default format', () => {
    const date = new Date('2024-01-15');
    render(<DateDisplay date={date} />);
    expect(screen.getByText(/2024/i)).toBeInTheDocument();
  });

  it('returns null when date is null', () => {
    const { container } = render(<DateDisplay date={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders relative time format', () => {
    const date = new Date();
    render(<DateDisplay date={date} format="relative" />);
    expect(screen.getByText(/ago|just now/i)).toBeInTheDocument();
  });

  it('renders datetime format', () => {
    const date = new Date('2024-01-15T10:30:00');
    render(<DateDisplay date={date} format="datetime" />);
    expect(screen.getByText(/2024/i)).toBeInTheDocument();
  });

  it('handles string date', () => {
    render(<DateDisplay date="2024-01-15" />);
    expect(screen.getByText(/2024/i)).toBeInTheDocument();
  });

  it('handles number timestamp', () => {
    const timestamp = new Date('2024-01-15').getTime();
    render(<DateDisplay date={timestamp} />);
    expect(screen.getByText(/2024/i)).toBeInTheDocument();
  });
});





