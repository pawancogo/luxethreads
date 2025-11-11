/**
 * Review Mapper - Data Transformation Layer
 * Maps API responses to application models
 * Follows Single Responsibility Principle
 */

export interface Review {
  id: number;
  user: {
    id: number;
    name: string;
    email?: string;
  };
  rating: number;
  title?: string;
  comment: string;
  is_verified_purchase?: boolean;
  is_featured?: boolean;
  helpful_count?: number;
  not_helpful_count?: number;
  review_images?: string[];
  created_at: string;
  supplier_response?: string;
}

/**
 * Review Mapper - Transforms API responses to application models
 */
export class ReviewMapper {
  /**
   * Map API response to Review array
   */
  mapApiResponseToReviews(response: any): Review[] {
    return Array.isArray(response) ? response : [];
  }

  /**
   * Extract error message from error object
   */
  extractErrorMessage(error: any): string {
    return error?.message || 'Failed to process review';
  }
}

export const reviewMapper = new ReviewMapper();

