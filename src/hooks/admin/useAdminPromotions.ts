import { useState, useEffect } from 'react';
import { promotionsAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface Promotion {
  id: number;
  name: string;
  description?: string;
  promotion_type: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  is_featured: boolean;
  discount_percentage?: number;
  discount_amount?: number;
  min_order_amount?: number;
  max_discount_amount?: number;
  applicable_categories?: number[];
  applicable_products?: number[];
  applicable_brands?: number[];
  created_at: string;
}

interface UseAdminPromotionsReturn {
  promotions: Promotion[];
  loading: boolean;
  error: Error | null;
  fetchPromotions: (params?: {
    is_active?: boolean;
    promotion_type?: string;
  }) => Promise<void>;
  createPromotion: (promotionData: any) => Promise<boolean>;
  updatePromotion: (promotionId: number, promotionData: Partial<Promotion>) => Promise<boolean>;
  deletePromotion: (promotionId: number) => Promise<boolean>;
}

export const useAdminPromotions = (): UseAdminPromotionsReturn => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchPromotions = async (params?: {
    is_active?: boolean;
    promotion_type?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await promotionsAPI.getAllPromotions(params);
      setPromotions(response || []);
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch promotions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createPromotion = async (promotionData: any): Promise<boolean> => {
    try {
      await promotionsAPI.createPromotion(promotionData);
      await fetchPromotions();
      toast({
        title: 'Success',
        description: 'Promotion created successfully',
      });
      return true;
    } catch (err) {
      const error = err as Error;
      toast({
        title: 'Error',
        description: error.message || 'Failed to create promotion',
        variant: 'destructive',
      });
      return false;
    }
  };

  const updatePromotion = async (promotionId: number, promotionData: Partial<Promotion>): Promise<boolean> => {
    try {
      await promotionsAPI.updatePromotion(promotionId, promotionData);
      await fetchPromotions();
      toast({
        title: 'Success',
        description: 'Promotion updated successfully',
      });
      return true;
    } catch (err) {
      const error = err as Error;
      toast({
        title: 'Error',
        description: error.message || 'Failed to update promotion',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deletePromotion = async (promotionId: number): Promise<boolean> => {
    try {
      await promotionsAPI.deletePromotion(promotionId);
      await fetchPromotions();
      toast({
        title: 'Success',
        description: 'Promotion deleted successfully',
      });
      return true;
    } catch (err) {
      const error = err as Error;
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete promotion',
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  return {
    promotions,
    loading,
    error,
    fetchPromotions,
    createPromotion,
    updatePromotion,
    deletePromotion,
  };
};

