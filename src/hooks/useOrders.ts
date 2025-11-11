/**
 * useOrders Hook - Simplified
 * Uses OrderService for business logic
 * Removed unnecessary hooks (useCallback, useMemo) per YAGNI principle
 */

import { useState, useEffect } from 'react';
import { orderService } from '@/services/order.service';
import { OrderData } from '@/services/api/orders.service';

interface UseOrdersState {
  orders: any[];
  loading: boolean;
  error: string | null;
}

export function useOrders() {
  const [state, setState] = useState<UseOrdersState>({
    orders: [],
    loading: false,
    error: null,
  });

  const load = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const orders = await orderService.getMyOrders();
      setState({ orders, loading: false, error: null });
      return orders;
    } catch (e: any) {
      const errorMessage = orderService.extractErrorMessage(e);
      setState({ orders: [], loading: false, error: errorMessage });
      throw e;
    }
  };

  const create = async (orderData: OrderData) => {
    const res = await orderService.createOrder(orderData);
    await load();
    return res;
  };

  const cancel = async (orderId: string | number, reason: string) => {
    const res = await orderService.cancelOrder(orderId, reason);
    await load();
    return res;
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  return {
    ...state,
    reload: load,
    create,
    cancel,
  };
}
