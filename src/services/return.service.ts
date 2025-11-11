/**
 * Return Service - Business Logic Layer
 * Handles return operations and business rules
 * Follows Single Responsibility Principle
 */

import { ReturnRepository } from './return.repository';
import { ReturnMapper, ReturnRequest } from './return.mapper';
import { ReturnRequestData } from './api/returns.service';

/**
 * Return Service - Business logic for return operations
 */
export class ReturnService {
  private repository: ReturnRepository;
  private mapper: ReturnMapper;

  constructor(repository?: ReturnRepository) {
    this.repository = repository || new ReturnRepository();
    this.mapper = new ReturnMapper();
  }

  /**
   * Get user returns
   */
  async getMyReturns(): Promise<ReturnRequest[]> {
    try {
      const response = await this.repository.getMyReturns();
      return this.mapper.mapApiResponseToReturns(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create return request
   */
  async createReturnRequest(returnData: ReturnRequestData): Promise<ReturnRequest> {
    try {
      const response = await this.repository.createReturnRequest(returnData);
      return this.mapper.mapApiResponseToReturn(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get return request details
   */
  async getReturnRequest(returnId: string | number): Promise<ReturnRequest> {
    try {
      const response = await this.repository.getReturnRequest(returnId);
      return this.mapper.mapApiResponseToReturn(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get return tracking
   */
  async getReturnTracking(returnId: string | number): Promise<any> {
    try {
      return await this.repository.getReturnTracking(returnId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Schedule pickup
   */
  async schedulePickup(returnId: string | number, pickupData: { pickup_date: string; pickup_time: string }): Promise<any> {
    try {
      return await this.repository.schedulePickup(returnId, pickupData);
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

export const returnService = new ReturnService();

