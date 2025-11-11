import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OrderDetail from '@/pages/OrderDetail';

vi.mock('@/services/api', () => ({
  ordersAPI: {
    getOrderDetails: vi.fn(),
  },
  shippingAPI: {
    getShipmentDetails: vi.fn(),
  },
  returnRequestsAPI: {
    createReturnRequest: vi.fn(),
  },
}));

vi.mock('@/contexts/UserContext', () => ({
  useUser: () => ({
    user: { id: 1, email: 'test@example.com' },
  }),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('OrderDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders order details when loaded', async () => {
    const mockOrder = {
      id: 1,
      order_number: 'ORD-001',
      total_amount: 1000,
      status: 'confirmed',
      items: [],
    };

    vi.mocked(require('@/services/api').ordersAPI.getOrderDetails).mockResolvedValue(mockOrder);

    render(
      <MemoryRouter initialEntries={['/orders/1']}>
        <OrderDetail />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/ORD-001/i)).toBeInTheDocument();
    });
  });
});





