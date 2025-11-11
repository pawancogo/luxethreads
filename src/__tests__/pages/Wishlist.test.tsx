import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Wishlist from '@/pages/Wishlist';

vi.mock('@/services/api', () => ({
  wishlistAPI: {
    getWishlist: vi.fn(),
    removeFromWishlist: vi.fn(),
  },
}));

vi.mock('@/contexts/UserContext', () => ({
  useUser: () => ({
    user: { id: 1, email: 'test@example.com', role: 'customer' },
    isLoading: false,
  }),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('Wishlist Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders wishlist items', async () => {
    const mockItems = [
      {
        wishlist_item_id: 1,
        product_variant: {
          variant_id: 1,
          product_id: 1,
          product_name: 'Product 1',
          price: 1000,
          image_url: 'img1.jpg',
        },
      },
    ];

    vi.mocked(require('@/services/api').wishlistAPI.getWishlist).mockResolvedValue(mockItems);

    render(
      <BrowserRouter>
        <Wishlist />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
    });
  });

  it('shows empty state when wishlist is empty', async () => {
    vi.mocked(require('@/services/api').wishlistAPI.getWishlist).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <Wishlist />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/wishlist is empty/i) || screen.getByText(/no items/i)).toBeInTheDocument();
    });
  });
});





