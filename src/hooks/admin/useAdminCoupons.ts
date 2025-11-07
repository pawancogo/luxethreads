import { useState, useEffect } from 'react';
import { couponsAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface Coupon {
  id: number;
  code: string;
  name: string;
  description?: string;
  coupon_type: string;
  discount_value: number;
  max_discount_amount?: number;
  min_order_amount: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  max_uses?: number;
  max_uses_per_user?: number;
  is_new_user_only: boolean;
  is_first_order_only: boolean;
  usage_count?: number;
  created_at: string;
}

interface UseAdminCouponsReturn {
  coupons: Coupon[];
  loading: boolean;
  error: Error | null;
  fetchCoupons: (params?: {
    is_active?: boolean;
    coupon_type?: string;
  }) => Promise<void>;
  createCoupon: (couponData: any) => Promise<boolean>;
  updateCoupon: (couponId: number, couponData: Partial<Coupon>) => Promise<boolean>;
  deleteCoupon: (couponId: number) => Promise<boolean>;
}

export const useAdminCoupons = (): UseAdminCouponsReturn => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchCoupons = async (params?: {
    is_active?: boolean;
    coupon_type?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await couponsAPI.getAllCoupons(params);
      setCoupons(response || []);
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch coupons',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createCoupon = async (couponData: any): Promise<boolean> => {
    try {
      await couponsAPI.createCoupon(couponData);
      await fetchCoupons();
      toast({
        title: 'Success',
        description: 'Coupon created successfully',
      });
      return true;
    } catch (err) {
      const error = err as Error;
      toast({
        title: 'Error',
        description: error.message || 'Failed to create coupon',
        variant: 'destructive',
      });
      return false;
    }
  };

  const updateCoupon = async (couponId: number, couponData: Partial<Coupon>): Promise<boolean> => {
    try {
      await couponsAPI.updateCoupon(couponId, couponData);
      await fetchCoupons();
      toast({
        title: 'Success',
        description: 'Coupon updated successfully',
      });
      return true;
    } catch (err) {
      const error = err as Error;
      toast({
        title: 'Error',
        description: error.message || 'Failed to update coupon',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteCoupon = async (couponId: number): Promise<boolean> => {
    try {
      await couponsAPI.deleteCoupon(couponId);
      await fetchCoupons();
      toast({
        title: 'Success',
        description: 'Coupon deleted successfully',
      });
      return true;
    } catch (err) {
      const error = err as Error;
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete coupon',
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return {
    coupons,
    loading,
    error,
    fetchCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
  };
};

