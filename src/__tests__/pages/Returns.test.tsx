import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Returns from '@/pages/Returns';

vi.mock('@/services/api', () => ({
  returnRequestsAPI: {
    getMyReturns: vi.fn(),
    createReturnRequest: vi.fn(),
  },
  ordersAPI: {
    getMyOrders: vi.fn(),
  },
}));

vi.mock('@/contexts/UserContext', () => ({
  useUser: () => ({
    user: { id: 1, email: 'test@example.com' },
    isLoading: false,
  }),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('Returns Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders return requests', async () => {
    const mockReturns = [
      {
        id: 1,
        return_id: 'RET-001',
        order_id: 1,
        status: 'pending',
        items: [],
      },
    ];

    vi.mocked(require('@/services/api').returnRequestsAPI.getMyReturns).mockResolvedValue(mockReturns);

    render(
      <BrowserRouter>
        <Returns />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/RET-001/i) || screen.getByText(/return/i)).toBeInTheDocument();
    });
  });
});




