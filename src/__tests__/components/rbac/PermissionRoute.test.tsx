import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PermissionRoute from '@/components/rbac/PermissionRoute';

vi.mock('@/contexts/RbacContext', () => ({
  useRbac: () => ({
    hasPermission: vi.fn(() => true),
  }),
}));

describe('PermissionRoute', () => {
  it('renders children when permission granted', () => {
    render(
      <MemoryRouter>
        <PermissionRoute permission="view_products">
          <div>Protected Content</div>
        </PermissionRoute>
      </MemoryRouter>
    );
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('shows access denied when permission denied', () => {
    vi.mocked(require('@/contexts/RbacContext').useRbac).mockReturnValue({
      hasPermission: () => false,
    });

    render(
      <MemoryRouter>
        <PermissionRoute permission="view_products">
          <div>Protected Content</div>
        </PermissionRoute>
      </MemoryRouter>
    );
    expect(screen.getByText(/access denied/i) || screen.getByText(/permission/i)).toBeInTheDocument();
  });
});





