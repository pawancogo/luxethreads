/**
 * Review Service - Business Logic Layer
 * Handles review operations and business rules
 * Follows Single Responsibility Principle
 */

import { ReviewRepository, GetReviewsParams, ReviewData } from './review.repository';
import { ReviewMapper, Review } from './review.mapper';

/**
 * Review Service - Business logic for review operations
 */
export class ReviewService {
  private repository: ReviewRepository;
  private mapper: ReviewMapper;

  constructor(repository?: ReviewRepository) {
    this.repository = repository || new ReviewRepository();
    this.mapper = new ReviewMapper();
  }

  /**
   * Get product reviews
   */
  async getProductReviews(productId: number, params?: GetReviewsParams): Promise<Review[]> {
    try {
      const response = await this.repository.getProductReviews(productId, params);
      return this.mapper.mapApiResponseToReviews(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create review
   */
  async createReview(productId: number, reviewData: ReviewData): Promise<void> {
    try {
      await this.repository.createReview(productId, reviewData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Vote on review
   */
  async voteOnReview(productId: number, reviewId: number, voteType: 'helpful' | 'not_helpful'): Promise<void> {
    try {
      await this.repository.voteOnReview(productId, reviewId, voteType);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Extract error message
   */
  extractErrorMessage(error: any): string {
    return this.mapper.extractErrorMessage(error);
  }
}

export const reviewService = new ReviewService();

