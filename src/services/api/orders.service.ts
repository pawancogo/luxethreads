/**
 * Orders API Service
 */

import { api } from './base';

export interface OrderData {
  shipping_address_id: number;
  billing_address_id: number;
  shipping_method?: string;
  payment_method_id?: string;
  coupon_code?: string;
}

export const ordersService = {
  /**
   * Create order
   */
  createOrder: async (orderData: OrderData) => {
    return api.post('/orders', { order: orderData });
  },

  /**
   * Get my orders
   */
  getMyOrders: async () => {
    return api.get('/my-orders');
  },

  /**
   * Get order details
   */
  getOrderDetails: async (orderId: string | number) => {
    return api.get(`/my-orders/${orderId}`);
  },

  /**
   * Get order invoice
   */
  getOrderInvoice: async (orderId: string | number) => {
    const response = await api.get(`/my-orders/${orderId}/invoice`, {
      responseType: 'blob',
    });
    return response;
  },

  /**
   * Cancel order
   */
  cancelOrder: async (orderId: string | number, reason: string) => {
    return api.patch(`/my-orders/${orderId}/cancel`, { reason });
  },
};

