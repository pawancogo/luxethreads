/**
 * Supplier Payments API Service
 */

import { api } from './base';

export const supplierPaymentsService = {
  /**
   * List supplier payments
   */
  getSupplierPayments: async (params?: { status?: string; page?: number; per_page?: number }) => {
    return api.get('/supplier/payments', { params });
  },

  /**
   * Get payment
   */
  getPayment: async (paymentId: string | number) => {
    return api.get(`/supplier/payments/${paymentId}`);
  },
};

