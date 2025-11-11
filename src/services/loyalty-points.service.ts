/**
 * Loyalty Points Service - Business Logic Layer
 * Handles loyalty points operations and business rules
 * Follows Single Responsibility Principle
 */

import { LoyaltyPointsRepository, GetTransactionsParams } from './loyalty-points.repository';
import { LoyaltyPointsMapper, Balance, LoyaltyTransaction } from './loyalty-points.mapper';

/**
 * Loyalty Points Service - Business logic for loyalty points operations
 */
export class LoyaltyPointsService {
  private repository: LoyaltyPointsRepository;
  private mapper: LoyaltyPointsMapper;

  constructor(repository?: LoyaltyPointsRepository) {
    this.repository = repository || new LoyaltyPointsRepository();
    this.mapper = new LoyaltyPointsMapper();
  }

  /**
   * Get balance
   */
  async getBalance(): Promise<Balance | null> {
    try {
      const response = await this.repository.getBalance();
      return this.mapper.mapApiResponseToBalance(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get transactions
   */
  async getTransactions(params?: GetTransactionsParams): Promise<LoyaltyTransaction[]> {
    try {
      const response = await this.repository.getTransactions(params);
      return this.mapper.mapApiResponseToTransactions(response);
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

export const loyaltyPointsService = new LoyaltyPointsService();

