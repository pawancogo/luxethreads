/**
 * Order Mapper - Data Transformation Layer
 * Maps API responses to application models
 * Follows Single Responsibility Principle
 */

/**
 * Order Mapper - Transforms API responses to application models
 */
export class OrderMapper {
  /**
   * Map API response to orders array
   */
  mapApiResponseToOrders(response: any): any[] {
    return response || [];
  }

  /**
   * Extract error message from error object
   */
  extractErrorMessage(error: any): string {
    return error?.message || 'Failed to load orders';
  }
}

export const orderMapper = new OrderMapper();

