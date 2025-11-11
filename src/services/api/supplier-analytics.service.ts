/**
 * Supplier Analytics API Service
 */

import { api } from './base';

export const supplierAnalyticsService = {
  /**
   * Get analytics
   */
  getAnalytics: async (params?: { start_date?: string; end_date?: string }) => {
    return api.get('/supplier/analytics', { params });
  },
};

