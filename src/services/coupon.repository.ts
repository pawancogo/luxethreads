/**
 * Coupon Repository - Data Access Layer
 * Abstracts API calls for coupon operations
 * Follows Repository Pattern
 */

import { couponsService } from './api/coupons.service';

/**
 * Coupon Repository - Handles data access for coupon operations
 */
export class CouponRepository {
  /**
   * Validate coupon
   */
  async validateCoupon(code: string): Promise<any> {
    try {
      return await couponsService.validateCoupon(code);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Apply coupon
   */
  async applyCoupon(code: string, cartId?: number): Promise<any> {
    try {
      return await couponsService.applyCoupon(code, cartId);
    } catch (error) {
      throw error;
    }
  }
}

export const couponRepository = new CouponRepository();

