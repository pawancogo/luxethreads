/**
 * Coupon Mapper - Data Transformation Layer
 * Maps API responses to application models
 * Follows Single Responsibility Principle
 */

export interface CouponValidation {
  is_valid: boolean;
  code?: string;
  message?: string;
  coupon_type?: 'percentage' | 'fixed';
  discount_value?: number;
}

export interface CouponApplication {
  code: string;
  discount_amount: number;
  coupon_type?: 'percentage' | 'fixed';
  discount_value?: number;
}

/**
 * Coupon Mapper - Transforms API responses to application models
 */
export class CouponMapper {
  /**
   * Map API response to CouponValidation
   */
  mapApiResponseToValidation(response: any): CouponValidation {
    return {
      is_valid: response?.is_valid !== false,
      code: response?.code,
      message: response?.message,
      coupon_type: response?.coupon_type,
      discount_value: response?.discount_value,
    };
  }

  /**
   * Map API response to CouponApplication
   */
  mapApiResponseToApplication(response: any): CouponApplication {
    return {
      code: response?.code || response?.coupon?.code || '',
      discount_amount: response?.discount_amount || 0,
      coupon_type: response?.coupon_type || response?.coupon?.coupon_type,
      discount_value: response?.discount_value || response?.coupon?.discount_value,
    };
  }

  /**
   * Extract error message from error object
   */
  extractErrorMessage(error: any): string {
    return error?.message || 'Failed to apply coupon';
  }
}

export const couponMapper = new CouponMapper();

