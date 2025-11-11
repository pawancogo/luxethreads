import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Cart from '@/pages/Cart';

// Mock CartContext
const mockCartContext = {
  state: {
    items: [
      {
        cart_item_id: 1,
        quantity: 2,
        product_variant: {
          variant_id: 1,
          product_id: 1,
          product_name: 'Product 1',
          image_url: 'img1.jpg',
          price: 1000,
        },
        subtotal: 2000,
      },
    ],
    totalItems: 2,
    totalPrice: 2000,
  },
  removeFromCart: vi.fn(),
  updateQuantity: vi.fn(),
  clearCart: vi.fn(),
  loadCart: vi.fn(),
};

vi.mock('@/contexts/CartContext', () => ({
  useCart: () => mockCartContext,
}));

vi.mock('@/contexts/UserContext', () => ({
  useUser: () => ({
    user: { id: 1, email: 'test@example.com' },
    isLoading: false,
  }),
}));

describe('Cart Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders cart items', () => {
    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    );
    expect(screen.getByText('Product 1')).toBeInTheDocument();
  });

  it('shows empty state when cart is empty', () => {
    mockCartContext.state.items = [];
    mockCartContext.state.totalItems = 0;
    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    );
    expect(screen.getByText(/your cart is empty/i) || screen.getByText(/cart is empty/i)).toBeInTheDocument();
  });

  it('displays total price', () => {
    mockCartContext.state.totalPrice = 2000;
    
    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    );
    expect(screen.getByText(/2000/i)).toBeInTheDocument();
  });
});

