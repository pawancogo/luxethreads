/**
 * useSupplierOrders Hook - Clean Architecture Implementation
 * Uses SupplierService for business logic
 * Follows: UI → Logic (SupplierService) → Data (API Services)
 */

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supplierService } from '@/services/supplier.service';
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
  const location = useLocation();
  const { toast } = useToast();
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const ordersList = await supplierService.getOrders();
      setOrders(ordersList);
    } catch (err: any) {
      const errorMessage = supplierService.extractErrorMessage(err);
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
      await supplierService.confirmOrderItem(orderItemId);
      toast({
        title: 'Success',
        description: 'Order item confirmed successfully',
      });
      await loadOrders();
    } catch (err: any) {
      const errorMessage = supplierService.extractErrorMessage(err);
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
      await supplierService.shipOrderItem(orderItemId, trackingNumber);
      toast({
        title: 'Success',
        description: 'Order marked as shipped successfully',
      });
      await loadOrders();
    } catch (err: any) {
      const errorMessage = supplierService.extractErrorMessage(err);
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
      await supplierService.updateTracking(orderItemId, trackingNumber, trackingUrl);
      toast({
        title: 'Success',
        description: 'Tracking information updated successfully',
      });
      await loadOrders();
    } catch (err: any) {
      const errorMessage = supplierService.extractErrorMessage(err);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Only load orders when on supplier dashboard (not on signup)
  useEffect(() => {
    const isSupplierDashboard = location.pathname === '/supplier' || 
                                location.pathname.startsWith('/supplier/');
    
    if (isSupplierDashboard) {
      loadOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

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

