/**
 * Review Repository - Data Access Layer
 * Abstracts API calls for review operations
 * Follows Repository Pattern
 */

import { reviewsService, ReviewData } from './api/reviews.service';

export interface GetReviewsParams {
  moderation_status?: string;
  featured?: boolean;
  verified?: boolean;
}

/**
 * Review Repository - Handles data access for review operations
 */
export class ReviewRepository {
  /**
   * Get product reviews
   */
  async getProductReviews(productId: number, params?: GetReviewsParams): Promise<any> {
    try {
      return await reviewsService.getProductReviews(productId, params);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create review
   */
  async createReview(productId: number, reviewData: ReviewData): Promise<any> {
    try {
      return await reviewsService.createReview(productId, reviewData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Vote on review
   */
  async voteOnReview(productId: number, reviewId: number, voteType: 'helpful' | 'not_helpful'): Promise<any> {
    try {
      return await reviewsService.voteOnReview(productId, reviewId, voteType);
    } catch (error) {
      throw error;
    }
  }
}

export const reviewRepository = new ReviewRepository();

