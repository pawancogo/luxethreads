import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Orders from '@/pages/Orders';

vi.mock('@/services/api', () => ({
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

describe('Orders Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders orders list', async () => {
    const mockOrders = [
      {
        id: 1,
        order_number: 'ORD-001',
        order_date: '2024-01-01',
        status: 'confirmed',
        payment_status: 'paid',
        total_amount: 1000,
        items: [],
      },
    ];

    vi.mocked(require('@/services/api').ordersAPI.getMyOrders).mockResolvedValue(mockOrders);

    render(
      <BrowserRouter>
        <Orders />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/ORD-001/i)).toBeInTheDocument();
    });
  });

  it('shows empty state when no orders', async () => {
    vi.mocked(require('@/services/api').ordersAPI.getMyOrders).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <Orders />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/no orders/i) || screen.getByText(/you haven't placed/i)).toBeInTheDocument();
    });
  });
});





