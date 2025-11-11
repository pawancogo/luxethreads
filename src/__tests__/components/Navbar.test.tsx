import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { UserContext } from '@/contexts/UserContext';
import { CartContext } from '@/contexts/CartContext';

// Mock API
vi.mock('@/services/api', () => ({
  categoriesAPI: {
    navigation: vi.fn().mockResolvedValue({
      data: {
        data: [
          { id: '1', name: 'Men', subcategories: [] },
          { id: '2', name: 'Women', subcategories: [] },
        ]
      }
    })
  }
}));

describe('Navbar', () => {
  const mockUser = { id: 1, email: 'test@example.com', role: 'customer' };
  const mockUserContext = {
    user: mockUser,
    isLoading: false,
    hasRole: vi.fn(() => true),
    login: vi.fn(),
    signup: vi.fn(),
    logout: vi.fn(),
  };

  const mockCartContext = {
    items: [],
    addItem: vi.fn(),
    removeItem: vi.fn(),
    updateQuantity: vi.fn(),
    clearCart: vi.fn(),
    totalItems: 0,
    totalPrice: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders navbar with logo', () => {
    render(
      <BrowserRouter>
        <UserContext.Provider value={mockUserContext}>
          <CartContext.Provider value={mockCartContext}>
            <Navbar />
          </CartContext.Provider>
        </UserContext.Provider>
      </BrowserRouter>
    );

    // Check if navbar is rendered (logo or navigation items)
    expect(document.querySelector('nav') || document.querySelector('header')).toBeInTheDocument();
  });

  it('displays search bar', () => {
    render(
      <BrowserRouter>
        <UserContext.Provider value={mockUserContext}>
          <CartContext.Provider value={mockCartContext}>
            <Navbar />
          </CartContext.Provider>
        </UserContext.Provider>
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText(/search/i) || screen.getByRole('searchbox');
    expect(searchInput).toBeInTheDocument();
  });

  it('handles search submission', async () => {
    const mockNavigate = vi.fn();
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => mockNavigate,
      };
    });

    render(
      <BrowserRouter>
        <UserContext.Provider value={mockUserContext}>
          <CartContext.Provider value={mockCartContext}>
            <Navbar />
          </CartContext.Provider>
        </UserContext.Provider>
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText(/search/i) || screen.getByRole('searchbox');
    fireEvent.change(searchInput, { target: { value: 'shirt' } });
    fireEvent.submit(searchInput.closest('form') || searchInput);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });
  });
});




