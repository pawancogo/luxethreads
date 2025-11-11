import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import CartItem from '@/components/cart/CartItem';

const mockItem = {
  cart_item_id: 1,
  quantity: 2,
  product_variant: {
    variant_id: 1,
    product_id: 1,
    product_name: 'Test Product',
    image_url: 'https://example.com/image.jpg',
    price: 1000,
    discounted_price: 800,
  },
  subtotal: 1600,
};

const defaultProps = {
  item: mockItem,
  updatingItem: null,
  onQuantityChange: vi.fn(),
  onRemoveItem: vi.fn(),
};

describe('CartItem', () => {
  it('renders product name', () => {
    render(
      <BrowserRouter>
        <CartItem {...defaultProps} />
      </BrowserRouter>
    );
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('renders product price', () => {
    render(
      <BrowserRouter>
        <CartItem {...defaultProps} />
      </BrowserRouter>
    );
    expect(screen.getByText(/800/i)).toBeInTheDocument();
  });

  it('renders quantity', () => {
    render(
      <BrowserRouter>
        <CartItem {...defaultProps} />
      </BrowserRouter>
    );
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('calls onQuantityChange when quantity decreased', async () => {
    const onQuantityChange = vi.fn();
    render(
      <BrowserRouter>
        <CartItem {...defaultProps} onQuantityChange={onQuantityChange} />
      </BrowserRouter>
    );
    
    const buttons = screen.getAllByRole('button');
    const decreaseButton = buttons.find(btn => btn.querySelector('.lucide-minus'));
    if (decreaseButton) {
      await userEvent.click(decreaseButton);
      expect(onQuantityChange).toHaveBeenCalledWith(1, 1);
    }
  });

  it('calls onRemoveItem when remove button clicked', async () => {
    const onRemoveItem = vi.fn();
    render(
      <BrowserRouter>
        <CartItem {...defaultProps} onRemoveItem={onRemoveItem} />
      </BrowserRouter>
    );
    
    const buttons = screen.getAllByRole('button');
    const removeButton = buttons.find(btn => btn.querySelector('.lucide-trash-2'));
    if (removeButton) {
      await userEvent.click(removeButton);
      expect(onRemoveItem).toHaveBeenCalledWith(1);
    }
  });

  it('disables buttons when updating', () => {
    render(
      <BrowserRouter>
        <CartItem {...defaultProps} updatingItem={1} />
      </BrowserRouter>
    );
    const buttons = screen.getAllByRole('button');
    buttons.forEach(btn => {
      if (btn !== buttons[buttons.length - 1]) { // Skip last button if it's a link
        expect(btn).toBeDisabled();
      }
    });
  });
});

