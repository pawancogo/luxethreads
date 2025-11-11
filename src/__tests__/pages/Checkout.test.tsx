import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Checkout from '@/pages/Checkout';

// Mock dependencies
vi.mock('@/contexts/CartContext', () => ({
  useCart: () => ({
    items: [
      {
        id: '1',
        name: 'Product 1',
        price: 1000,
        image: 'img1.jpg',
        brand: 'Brand 1',
        category: 'Cat 1',
      },
    ],
    totalPrice: 1000,
    clearCart: vi.fn(),
  }),
}));

vi.mock('@/contexts/UserContext', () => ({
  useUser: () => ({
    user: { id: 1, email: 'test@example.com' },
    isLoading: false,
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('Checkout Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders checkout form', () => {
    render(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>
    );
    // Check for checkout-related elements
    expect(document.querySelector('form') || screen.getByText(/checkout/i)).toBeInTheDocument();
  });

  it('displays order summary', () => {
    render(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>
    );
    expect(screen.getByText(/order summary/i) || screen.getByText(/1000/i)).toBeInTheDocument();
  });
});




