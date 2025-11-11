/**
 * Return Mapper - Data Transformation Layer
 * Maps API responses to application models
 * Follows Single Responsibility Principle
 */

import { ReturnRequestData } from './api/returns.service';

export interface ReturnRequest {
  id: number;
  return_id: string;
  order_id: number;
  status: string;
  resolution_type: 'refund' | 'replacement';
  items: Array<{
    order_item_id: number;
    quantity: number;
    reason: string;
  }>;
  created_at: string;
  status_history?: Array<{
    status: string;
    timestamp: string;
    notes?: string;
  }>;
}

/**
 * Return Mapper - Transforms API responses to application models
 */
export class ReturnMapper {
  /**
   * Map API response to ReturnRequest array
   */
  mapApiResponseToReturns(response: any): ReturnRequest[] {
    return Array.isArray(response) ? response : [];
  }

  /**
   * Map API response to single ReturnRequest
   */
  mapApiResponseToReturn(response: any): ReturnRequest {
    return response as ReturnRequest;
  }

  /**
   * Extract error message from error object
   */
  extractErrorMessage(error: any): string {
    return error?.message || 'Failed to process return request';
  }
}

export const returnMapper = new ReturnMapper();

