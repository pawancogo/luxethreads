import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '@/components/common/StatusBadge';

describe('StatusBadge', () => {
  it('renders status text', () => {
    render(<StatusBadge status="Active" />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('auto-detects variant from status', () => {
    render(<StatusBadge status="completed" />);
    const badge = screen.getByText('completed');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('green');
  });

  it('uses provided variant', () => {
    render(<StatusBadge status="Test" variant="error" />);
    const badge = screen.getByText('Test');
    expect(badge.className).toContain('red');
  });

  it('detects pending status', () => {
    render(<StatusBadge status="pending" />);
    const badge = screen.getByText('pending');
    expect(badge.className).toContain('yellow');
  });

  it('detects error status', () => {
    render(<StatusBadge status="failed" />);
    const badge = screen.getByText('failed');
    expect(badge.className).toContain('red');
  });

  it('applies custom className', () => {
    render(<StatusBadge status="Test" className="custom-class" />);
    const badge = screen.getByText('Test');
    expect(badge.className).toContain('custom-class');
  });
});





