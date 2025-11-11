/**
 * Loyalty Points Repository - Data Access Layer
 * Abstracts API calls for loyalty points operations
 * Follows Repository Pattern
 */

import { loyaltyPointsService } from './api/loyalty-points.service';

export interface GetTransactionsParams {
  transaction_type?: 'earned' | 'redeemed' | 'expired' | 'adjusted';
}

/**
 * Loyalty Points Repository - Handles data access for loyalty points operations
 */
export class LoyaltyPointsRepository {
  /**
   * Get balance
   */
  async getBalance(): Promise<any> {
    try {
      return await loyaltyPointsService.getBalance();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get transactions
   */
  async getTransactions(params?: GetTransactionsParams): Promise<any> {
    try {
      return await loyaltyPointsService.getLoyaltyPoints(params);
    } catch (error) {
      throw error;
    }
  }
}

export const loyaltyPointsRepository = new LoyaltyPointsRepository();

