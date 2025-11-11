import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useContext } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider, CartContext } from '@/contexts/CartContext';

vi.mock('@/services/api', () => ({
  cartAPI: {
    getCart: vi.fn(),
    addToCart: vi.fn(),
    updateCartItem: vi.fn(),
    removeFromCart: vi.fn(),
  },
}));

vi.mock('@/contexts/UserContext', () => ({
  useUser: () => ({
    user: { id: 1 },
  }),
}));

describe('CartContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('provides cart context', () => {
    const TestComponent = () => {
      const { state } = useContext(CartContext);
      return <div>{state.items.length} items</div>;
    };

    render(
      <BrowserRouter>
        <CartProvider>
          <TestComponent />
        </CartProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('0 items')).toBeInTheDocument();
  });
});

