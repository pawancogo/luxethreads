import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supplierOrdersAPI } from '@/services/api';
import { SupplierOrder } from '@/components/supplier/types';

interface UseSupplierOrdersReturn {
  orders: SupplierOrder[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  confirmOrderItem: (orderItemId: number) => Promise<void>;
  shipOrder: (orderItemId: number, trackingNumber: string) => Promise<void>;
  updateTracking: (orderItemId: number, trackingNumber: string, trackingUrl?: string) => Promise<void>;
}

export const useSupplierOrders = (): UseSupplierOrdersReturn => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await supplierOrdersAPI.getSupplierOrders();
      // API interceptor already extracts data, so response is the data directly
      const orders = Array.isArray(response) ? response : [];
      setOrders(orders);
    } catch (err: any) {
      const errorMessage = err?.errors?.[0] || err?.message || 'Failed to load orders';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmOrderItem = async (orderItemId: number): Promise<void> => {
    try {
      await supplierOrdersAPI.confirmOrderItem(orderItemId);
      toast({
        title: 'Success',
        description: 'Order item confirmed successfully',
      });
      await loadOrders();
    } catch (err: any) {
      const errorMessage = err?.errors?.[0] || err?.message || 'Failed to confirm order';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const shipOrder = async (orderItemId: number, trackingNumber: string): Promise<void> => {
    try {
      await supplierOrdersAPI.shipOrderItem(orderItemId, trackingNumber);
      toast({
        title: 'Success',
        description: 'Order marked as shipped successfully',
      });
      await loadOrders();
    } catch (err: any) {
      const errorMessage = err?.errors?.[0] || err?.message || 'Failed to ship order';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateTracking = async (orderItemId: number, trackingNumber: string, trackingUrl?: string): Promise<void> => {
    try {
      await supplierOrdersAPI.updateTracking(orderItemId, trackingNumber, trackingUrl);
      toast({
        title: 'Success',
        description: 'Tracking information updated successfully',
      });
      await loadOrders();
    } catch (err: any) {
      const errorMessage = err?.errors?.[0] || err?.message || 'Failed to update tracking';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return {
    orders,
    isLoading,
    error,
    refetch: loadOrders,
    confirmOrderItem,
    shipOrder,
    updateTracking,
  };
};

