/**
 * Coupon Service - Business Logic Layer
 * Handles coupon operations and business rules
 * Follows Single Responsibility Principle
 */

import { CouponRepository } from './coupon.repository';
import { CouponMapper, CouponValidation, CouponApplication } from './coupon.mapper';

/**
 * Coupon Service - Business logic for coupon operations
 */
export class CouponService {
  private repository: CouponRepository;
  private mapper: CouponMapper;

  constructor(repository?: CouponRepository) {
    this.repository = repository || new CouponRepository();
    this.mapper = new CouponMapper();
  }

  /**
   * Validate coupon code
   */
  async validateCoupon(code: string): Promise<CouponValidation> {
    try {
      const response = await this.repository.validateCoupon(code);
      return this.mapper.mapApiResponseToValidation(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Apply coupon to cart
   */
  async applyCoupon(code: string, cartTotal?: number): Promise<CouponApplication> {
    try {
      const response = await this.repository.applyCoupon(code);
      return this.mapper.mapApiResponseToApplication(response);
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

export const couponService = new CouponService();

