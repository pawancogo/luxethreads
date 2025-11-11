import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useContext } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AdminProvider, AdminContext } from '@/contexts/AdminContext';

vi.mock('@/services/api', () => ({
  adminAPI: {
    login: vi.fn(),
  },
}));

describe('AdminContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('provides admin context', () => {
    const TestComponent = () => {
      const { admin } = useContext(AdminContext);
      return <div>{admin ? admin.email : 'No admin'}</div>;
    };

    render(
      <BrowserRouter>
        <AdminProvider>
          <TestComponent />
        </AdminProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('No admin')).toBeInTheDocument();
  });
});





