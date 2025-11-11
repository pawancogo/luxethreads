/**
 * Return Repository - Data Access Layer
 * Abstracts API calls for return operations
 * Follows Repository Pattern
 */

import { returnsService, ReturnRequestData, PickupScheduleData } from './api/returns.service';

/**
 * Return Repository - Handles data access for return operations
 */
export class ReturnRepository {
  /**
   * Get user returns
   */
  async getMyReturns(): Promise<any> {
    try {
      return await returnsService.getMyReturns();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create return request
   */
  async createReturnRequest(returnData: ReturnRequestData): Promise<any> {
    try {
      return await returnsService.createReturnRequest(returnData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get return request
   */
  async getReturnRequest(returnId: string | number): Promise<any> {
    try {
      return await returnsService.getReturnRequest(returnId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get return tracking
   */
  async getReturnTracking(returnId: string | number): Promise<any> {
    try {
      return await returnsService.getReturnTracking(returnId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Schedule pickup
   */
  async schedulePickup(returnId: string | number, pickupData: PickupScheduleData): Promise<any> {
    try {
      return await returnsService.schedulePickup(returnId, pickupData);
    } catch (error) {
      throw error;
    }
  }
}

export const returnRepository = new ReturnRepository();

