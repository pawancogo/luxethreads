/**
 * Supplier Reviews API Service
 */

import { api } from './base';

export const supplierReviewsService = {
  /**
   * Respond to review
   */
  respondToReview: async (reviewId: number, response: string) => {
    return api.patch(`/supplier/reviews/${reviewId}/respond`, { response });
  },
};

