import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supplierOrdersAPI } from '@/services/api';
import { SupplierOrder } from '@/components/supplier/types';

interface UseSupplierOrdersReturn {
  orders: SupplierOrder[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  shipOrder: (orderId: number, trackingNumber: string) => Promise<void>;
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
      // Handle both direct array and axios response structure
      const orders = Array.isArray(response) 
        ? response 
        : Array.isArray(response?.data) 
        ? response.data 
        : Array.isArray(response?.data?.data)
        ? response.data.data
        : [];
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

  useEffect(() => {
    loadOrders();
  }, []);

  return {
    orders,
    isLoading,
    error,
    refetch: loadOrders,
    shipOrder,
  };
};

