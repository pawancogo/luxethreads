import { useState, useEffect } from 'react';
import { adminOrdersAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  total_amount: number;
  currency: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  items_count: number;
  created_at: string;
  updated_at: string;
}

interface OrderDetail extends Order {
  shipping_address: any;
  billing_address: any;
  items: Array<{
    id: number;
    product_name: string;
    variant_sku: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  payments: Array<{
    id: number;
    amount: number;
    status: string;
    method: string;
    created_at: string;
  }>;
  refunds: Array<{
    id: number;
    amount: number;
    status: string;
    reason: string;
    created_at: string;
  }>;
  status_history: Array<{
    status: string;
    timestamp: string;
    note: string;
  }>;
  internal_notes?: string;
  customer_notes?: string;
  tracking_number?: string;
  tracking_url?: string;
  cancellation_reason?: string;
  cancelled_at?: string;
  cancelled_by?: string;
}

interface UseAdminOrdersReturn {
  orders: Order[];
  loading: boolean;
  error: Error | null;
  totalPages: number;
  currentPage: number;
  fetchOrders: (params?: {
    page?: number;
    per_page?: number;
    status?: string;
    payment_status?: string;
    user_id?: number;
    order_number?: string;
    created_from?: string;
    created_to?: string;
    min_amount?: number;
    max_amount?: number;
  }) => Promise<void>;
  getOrder: (orderId: number) => Promise<OrderDetail | null>;
  cancelOrder: (orderId: number, reason: string) => Promise<boolean>;
  updateOrderStatus: (orderId: number, status: string) => Promise<boolean>;
  addOrderNote: (orderId: number, note: string) => Promise<boolean>;
  getAuditLog: (orderId: number) => Promise<any[] | null>;
  refundOrder: (orderId: number, amount: number, reason?: string) => Promise<boolean>;
  deleteOrder: (orderId: number) => Promise<boolean>;
}

export const useAdminOrders = (): UseAdminOrdersReturn => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const fetchOrders = async (params?: {
    page?: number;
    per_page?: number;
    status?: string;
    payment_status?: string;
    user_id?: number;
    order_number?: string;
    created_from?: string;
    created_to?: string;
    min_amount?: number;
    max_amount?: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      // API interceptor already extracts data, so response is the data directly
      const response = await adminOrdersAPI.getOrders(params);
      const ordersData = Array.isArray(response) ? response : [];
      setOrders(ordersData as Order[]);
      if (params?.page) {
        setCurrentPage(params.page);
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch orders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getOrder = async (orderId: number): Promise<OrderDetail | null> => {
    try {
      // API interceptor already extracts data, so response is the data directly
      const response = await adminOrdersAPI.getOrder(orderId);
      return (response as unknown) as OrderDetail;
    } catch (err) {
      const error = err as Error;
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch order details',
        variant: 'destructive',
      });
      return null;
    }
  };

  const cancelOrder = async (orderId: number, reason: string): Promise<boolean> => {
    try {
      await adminOrdersAPI.cancelOrder(orderId, reason);
      await fetchOrders({ page: currentPage });
      toast({
        title: 'Success',
        description: 'Order cancelled successfully',
      });
      return true;
    } catch (err) {
      const error = err as Error;
      toast({
        title: 'Error',
        description: error.message || 'Failed to cancel order',
        variant: 'destructive',
      });
      return false;
    }
  };

  const updateOrderStatus = async (orderId: number, status: string): Promise<boolean> => {
    try {
      await adminOrdersAPI.updateOrderStatus(orderId, status);
      await fetchOrders({ page: currentPage });
      toast({
        title: 'Success',
        description: 'Order status updated successfully',
      });
      return true;
    } catch (err) {
      const error = err as Error;
      toast({
        title: 'Error',
        description: error.message || 'Failed to update order status',
        variant: 'destructive',
      });
      return false;
    }
  };

  const addOrderNote = async (orderId: number, note: string): Promise<boolean> => {
    try {
      await adminOrdersAPI.addOrderNote(orderId, note);
      toast({
        title: 'Success',
        description: 'Note added successfully',
      });
      return true;
    } catch (err) {
      const error = err as Error;
      toast({
        title: 'Error',
        description: error.message || 'Failed to add note',
        variant: 'destructive',
      });
      return false;
    }
  };

  const getAuditLog = async (orderId: number): Promise<any[] | null> => {
    try {
      // API interceptor already extracts data, so response is the data directly
      const response = await adminOrdersAPI.getOrderAuditLog(orderId);
      return Array.isArray(response) ? response : [];
    } catch (err) {
      const error = err as Error;
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch audit log',
        variant: 'destructive',
      });
      return null;
    }
  };

  const refundOrder = async (orderId: number, amount: number, reason?: string): Promise<boolean> => {
    try {
      await adminOrdersAPI.refundOrder(orderId, {
        refund_amount: amount,
        refund_reason: reason,
      });
      await fetchOrders({ page: currentPage });
      toast({
        title: 'Success',
        description: 'Refund processed successfully',
      });
      return true;
    } catch (err) {
      const error = err as Error;
      toast({
        title: 'Error',
        description: error.message || 'Failed to process refund',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteOrder = async (orderId: number): Promise<boolean> => {
    try {
      await adminOrdersAPI.deleteOrder(orderId);
      await fetchOrders({ page: currentPage });
      toast({
        title: 'Success',
        description: 'Order deleted successfully',
      });
      return true;
    } catch (err) {
      const error = err as Error;
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete order',
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    orders,
    loading,
    error,
    totalPages,
    currentPage,
    fetchOrders,
    getOrder,
    cancelOrder,
    updateOrderStatus,
    addOrderNote,
    getAuditLog,
    refundOrder,
    deleteOrder,
  };
};

