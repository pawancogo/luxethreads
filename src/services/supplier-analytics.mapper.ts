/**
 * Supplier Analytics Mapper - Data Transformation Layer
 * Maps API responses to application models
 * Follows Single Responsibility Principle
 */

export interface SupplierAnalytics {
  summary: {
    total_revenue: number;
    total_orders: number;
    total_products: number;
    average_order_value: number;
  };
  daily_stats: Array<{
    date: string;
    revenue: number;
    orders_count: number;
  }>;
  top_products: Array<{
    product_id: number;
    product_name: string;
    total_sales: number;
    total_revenue: number;
  }>;
  sales_by_status: Record<string, number>;
  returns_summary: {
    total_return_requests: number;
    approved_returns: number;
    rejected_returns: number;
    completed_returns: number;
    total_returned_items: number;
    total_returned_value: number;
  };
}

/**
 * Supplier Analytics Mapper - Transforms API responses to application models
 */
export class SupplierAnalyticsMapper {
  /**
   * Map API response to SupplierAnalytics
   */
  mapApiResponseToAnalytics(response: any): SupplierAnalytics {
    return (response || {}) as SupplierAnalytics;
  }

  /**
   * Extract error message from error object
   */
  extractErrorMessage(error: any): string {
    return error?.errors?.[0] || error?.message || 'Failed to load analytics';
  }
}

export const supplierAnalyticsMapper = new SupplierAnalyticsMapper();

