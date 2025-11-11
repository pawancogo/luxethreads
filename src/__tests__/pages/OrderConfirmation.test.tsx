import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OrderConfirmation from '@/pages/OrderConfirmation';

vi.mock('@/services/api', () => ({
  ordersAPI: {
    getOrderDetails: vi.fn(),
  },
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('OrderConfirmation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    vi.mocked(require('@/services/api').ordersAPI.getOrderDetails).mockImplementation(
      () => new Promise(() => {})
    );

    render(
      <MemoryRouter initialEntries={['/order-confirmation?orderId=1']}>
        <OrderConfirmation />
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i) || document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders order confirmation when order loaded', async () => {
    const mockOrder = {
      id: 1,
      order_number: 'ORD-00000001',
      total_amount: 1000,
      status: 'confirmed',
    };

    vi.mocked(require('@/services/api').ordersAPI.getOrderDetails).mockResolvedValue(mockOrder);

    render(
      <MemoryRouter initialEntries={['/order-confirmation?orderId=1']}>
        <OrderConfirmation />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/order confirmed/i) || screen.getByText(/ORD-00000001/i)).toBeInTheDocument();
    });
  });
});





