/**
 * Supplier Analytics Service - Business Logic Layer
 * Handles supplier analytics operations and business rules
 * Follows Single Responsibility Principle
 */

import { SupplierAnalyticsRepository, AnalyticsParams } from './supplier-analytics.repository';
import { SupplierAnalyticsMapper, SupplierAnalytics } from './supplier-analytics.mapper';

/**
 * Supplier Analytics Service - Business logic for analytics operations
 */
export class SupplierAnalyticsService {
  private repository: SupplierAnalyticsRepository;
  private mapper: SupplierAnalyticsMapper;

  constructor(repository?: SupplierAnalyticsRepository) {
    this.repository = repository || new SupplierAnalyticsRepository();
    this.mapper = new SupplierAnalyticsMapper();
  }

  /**
   * Get analytics data
   */
  async getAnalytics(params?: AnalyticsParams): Promise<SupplierAnalytics> {
    try {
      const response = await this.repository.getAnalytics(params);
      return this.mapper.mapApiResponseToAnalytics(response);
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

export const supplierAnalyticsService = new SupplierAnalyticsService();

