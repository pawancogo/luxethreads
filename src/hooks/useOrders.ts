import { useCallback, useEffect, useMemo, useState } from 'react';
import { ordersAPI } from '@/services/api';

interface UseOrdersState {
  orders: any[];
  loading: boolean;
  error: string | null;
}

export function useOrders() {
  const [state, setState] = useState<UseOrdersState>({ orders: [], loading: false, error: null });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await ordersAPI.getMyOrders();
      setState({ orders: res || [], loading: false, error: null });
      return res;
    } catch (e: any) {
      setState({ orders: [], loading: false, error: e?.message || 'Failed to load orders' });
      throw e;
    }
  }, []);

  const create = useCallback(async (orderData: any) => {
    const res = await ordersAPI.createOrder(orderData);
    await load();
    return res;
  }, [load]);

  const cancel = useCallback(async (orderId: string | number, reason: string) => {
    const res = await ordersAPI.cancelOrder(orderId, reason);
    await load();
    return res;
  }, [load]);

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  return useMemo(() => ({
    ...state,
    reload: load,
    create,
    cancel,
  }), [state, load, create, cancel]);
}
