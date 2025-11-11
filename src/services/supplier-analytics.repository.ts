/**
 * Supplier Analytics Repository - Data Access Layer
 * Abstracts API calls for supplier analytics operations
 * Follows Repository Pattern
 */

import { supplierAnalyticsService } from './api/supplier-analytics.service';

export interface AnalyticsParams {
  start_date?: string;
  end_date?: string;
}

/**
 * Supplier Analytics Repository - Handles data access for analytics operations
 */
export class SupplierAnalyticsRepository {
  /**
   * Get analytics
   */
  async getAnalytics(params?: AnalyticsParams): Promise<any> {
    try {
      return await supplierAnalyticsService.getAnalytics(params);
    } catch (error) {
      throw error;
    }
  }
}

export const supplierAnalyticsRepository = new SupplierAnalyticsRepository();

