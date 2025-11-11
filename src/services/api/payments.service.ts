/**
 * Payments API Service
 */

import { api } from './base';

export interface PaymentData {
  payment_method_id: string;
  amount: number;
  currency?: string;
  payment_method?: string;
  payment_gateway?: string;
  gateway_transaction_id?: string;
  gateway_payment_id?: string;
  card_last4?: string;
  card_brand?: string;
  upi_id?: string;
  wallet_type?: string;
}

export interface RefundData {
  amount?: number;
  reason: string;
  description?: string;
}

export const paymentsService = {
  /**
   * Create payment
   */
  createPayment: async (orderId: number, paymentData: PaymentData) => {
    return api.post(`/orders/${orderId}/payments`, { payment: paymentData });
  },

  /**
   * Get payment
   */
  getPayment: async (paymentId: string | number) => {
    return api.get(`/payments/${paymentId}`);
  },

  /**
   * Refund payment
   */
  refundPayment: async (paymentId: string | number, refundData: RefundData) => {
    return api.post(`/payments/${paymentId}/refund`, refundData);
  },

  /**
   * Get payment refunds
   */
  getPaymentRefunds: async (params?: { status?: string; order_id?: number }) => {
    return api.get('/payment_refunds', { params });
  },

  /**
   * Create payment refund
   */
  createPaymentRefund: async (paymentId: number, refundData: RefundData) => {
    return api.post('/payment_refunds', {
      payment_id: paymentId,
      ...refundData,
    });
  },
};

