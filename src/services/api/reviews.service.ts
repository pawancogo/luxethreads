/**
 * Reviews API Service
 */

import { api } from './base';

export interface ReviewData {
  rating: number;
  comment: string;
  title?: string;
  review_images?: string[];
}

export const reviewsService = {
  /**
   * Get product reviews
   */
  getProductReviews: async (productId: number, params?: {
    moderation_status?: string;
    featured?: boolean;
    verified?: boolean;
  }) => {
    return api.get(`/products/${productId}/reviews`, { params });
  },

  /**
   * Create review
   */
  createReview: async (productId: number, reviewData: ReviewData) => {
    return api.post(`/products/${productId}/reviews`, { review: reviewData });
  },

  /**
   * Vote on review
   */
  voteOnReview: async (productId: number, reviewId: number, voteType: 'helpful' | 'not_helpful') => {
    return api.post(`/products/${productId}/reviews/${reviewId}/vote`, {
      vote_type: voteType,
    });
  },
};

