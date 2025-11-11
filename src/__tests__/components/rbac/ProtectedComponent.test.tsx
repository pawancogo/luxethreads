import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProtectedComponent from '@/components/rbac/ProtectedComponent';

vi.mock('@/contexts/RbacContext', () => ({
  useRbac: () => ({
    hasPermission: vi.fn(() => true),
  }),
}));

describe('ProtectedComponent', () => {
  it('renders children when permission granted', () => {
    render(
      <ProtectedComponent permission="view_products">
        <div>Protected Content</div>
      </ProtectedComponent>
    );
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('returns null when permission denied', () => {
    vi.mocked(require('@/contexts/RbacContext').useRbac).mockReturnValue({
      hasPermission: () => false,
    });

    const { container } = render(
      <ProtectedComponent permission="view_products">
        <div>Protected Content</div>
      </ProtectedComponent>
    );
    expect(container.firstChild).toBeNull();
  });
});





