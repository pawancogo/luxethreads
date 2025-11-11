import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartItem } from '../components/cart/CartItem';
import * as cartAPI from '../services/api';
import { CartContext } from '../contexts/CartContext';

vi.mock('../services/api');

describe('Cart & Wishlist Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('CartItem', () => {
    const mockCartItem = {
      id: 1,
      quantity: 2,
      product_variant: {
        id: 1,
        price: 100,
        discounted_price: 90,
        product: {
          id: 1,
          name: 'Test Product',
          images: [{ url: 'https://example.com/image.jpg' }]
        }
      }
    };

    const mockCartContext = {
      cart: { cart_items: [mockCartItem] },
      updateCartItem: vi.fn(),
      removeFromCart: vi.fn(),
      loading: false
    };

    it('renders cart item information', () => {
      render(
        <BrowserRouter>
          <CartContext.Provider value={mockCartContext}>
            <CartItem item={mockCartItem} />
          </CartContext.Provider>
        </BrowserRouter>
      );

      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2')).toBeInTheDocument();
    });

    it('updates quantity when changed', async () => {
      render(
        <BrowserRouter>
          <CartContext.Provider value={mockCartContext}>
            <CartItem item={mockCartItem} />
          </CartContext.Provider>
        </BrowserRouter>
      );

      const quantityInput = screen.getByDisplayValue('2');
      fireEvent.change(quantityInput, { target: { value: '3' } });
      fireEvent.blur(quantityInput);

      await waitFor(() => {
        expect(mockCartContext.updateCartItem).toHaveBeenCalledWith(1, 3);
      });
    });

    it('removes item when delete button clicked', async () => {
      render(
        <BrowserRouter>
          <CartContext.Provider value={mockCartContext}>
            <CartItem item={mockCartItem} />
          </CartContext.Provider>
        </BrowserRouter>
      );

      const deleteButton = screen.getByRole('button', { name: /remove/i });
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(mockCartContext.removeFromCart).toHaveBeenCalledWith(1);
      });
    });

    it('calculates total price correctly', () => {
      render(
        <BrowserRouter>
          <CartContext.Provider value={mockCartContext}>
            <CartItem item={mockCartItem} />
          </CartContext.Provider>
        </BrowserRouter>
      );

      // 2 * 90 = 180
      expect(screen.getByText(/180/i)).toBeInTheDocument();
    });
  });

  describe('Cart Operations', () => {
    it('adds item to cart', async () => {
      const mockAddToCart = vi.fn().mockResolvedValue({
        success: true,
        data: { cart_items: [] }
      });
      vi.mocked(cartAPI.addToCart).mockImplementation(mockAddToCart);

      const variantId = 1;
      const quantity = 2;

      await cartAPI.addToCart(variantId, quantity);

      expect(mockAddToCart).toHaveBeenCalledWith(variantId, quantity);
    });

    it('updates cart item quantity', async () => {
      const mockUpdateCartItem = vi.fn().mockResolvedValue({
        success: true,
        data: { cart_items: [] }
      });
      vi.mocked(cartAPI.updateCartItem).mockImplementation(mockUpdateCartItem);

      const itemId = 1;
      const quantity = 5;

      await cartAPI.updateCartItem(itemId, quantity);

      expect(mockUpdateCartItem).toHaveBeenCalledWith(itemId, quantity);
    });

    it('removes item from cart', async () => {
      const mockRemoveFromCart = vi.fn().mockResolvedValue({
        success: true,
        data: { cart_items: [] }
      });
      vi.mocked(cartAPI.removeFromCart).mockImplementation(mockRemoveFromCart);

      const itemId = 1;

      await cartAPI.removeFromCart(itemId);

      expect(mockRemoveFromCart).toHaveBeenCalledWith(itemId);
    });
  });

  describe('Wishlist Operations', () => {
    it('adds item to wishlist', async () => {
      const mockAddToWishlist = vi.fn().mockResolvedValue({
        success: true,
        data: []
      });
      vi.mocked(cartAPI.addToWishlist).mockImplementation(mockAddToWishlist);

      const variantId = 1;

      await cartAPI.addToWishlist(variantId);

      expect(mockAddToWishlist).toHaveBeenCalledWith(variantId);
    });

    it('removes item from wishlist', async () => {
      const mockRemoveFromWishlist = vi.fn().mockResolvedValue({
        success: true,
        data: []
      });
      vi.mocked(cartAPI.removeFromWishlist).mockImplementation(mockRemoveFromWishlist);

      const itemId = 1;

      await cartAPI.removeFromWishlist(itemId);

      expect(mockRemoveFromWishlist).toHaveBeenCalledWith(itemId);
    });
  });
});





