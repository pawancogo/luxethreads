import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProductReviews from '@/components/products/ProductReviews';

const mockReviews = [
  {
    id: 1,
    user_name: 'Test User',
    rating: 5,
    comment: 'Great product!',
    created_at: '2024-01-01',
  },
];

const defaultProps = {
  productId: '1',
  reviews: mockReviews,
  averageRating: 5,
  totalReviews: 1,
  onReviewSubmit: vi.fn(),
};

describe('ProductReviews', () => {
  it('renders reviews list', () => {
    render(<ProductReviews {...defaultProps} />);
    expect(screen.getByText('Test User') || screen.getByText('Great product!')).toBeInTheDocument();
  });

  it('displays average rating', () => {
    render(<ProductReviews {...defaultProps} />);
    expect(screen.getByText(/5/i) || screen.getByText(/rating/i)).toBeInTheDocument();
  });

  it('shows empty state when no reviews', () => {
    render(<ProductReviews {...defaultProps} reviews={[]} totalReviews={0} />);
    expect(screen.getByText(/no reviews/i) || screen.getByText(/be the first/i)).toBeInTheDocument();
  });
});




