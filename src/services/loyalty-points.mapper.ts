/**
 * Loyalty Points Mapper - Data Transformation Layer
 * Maps API responses to application models
 * Follows Single Responsibility Principle
 */

export interface LoyaltyTransaction {
  id: number;
  transaction_type: 'earned' | 'redeemed' | 'expired' | 'adjusted';
  points: number;
  balance_after: number;
  reference_type?: string;
  reference_id?: number;
  description?: string;
  expiry_date?: string;
  created_at: string;
}

export interface Balance {
  balance: number;
  pending_expiry: number;
  available_balance: number;
}

/**
 * Loyalty Points Mapper - Transforms API responses to application models
 */
export class LoyaltyPointsMapper {
  /**
   * Map API response to Balance
   */
  mapApiResponseToBalance(response: any): Balance | null {
    if (response?.data?.success && response?.data?.data) {
      return response.data.data as Balance;
    }
    return response as Balance | null;
  }

  /**
   * Map API response to LoyaltyTransaction array
   */
  mapApiResponseToTransactions(response: any): LoyaltyTransaction[] {
    if (response?.data?.success && response?.data?.data) {
      return response.data.data;
    }
    return Array.isArray(response) ? response : [];
  }

  /**
   * Extract error message from error object
   */
  extractErrorMessage(error: any): string {
    return error?.message || 'Failed to load loyalty points';
  }
}

export const loyaltyPointsMapper = new LoyaltyPointsMapper();

