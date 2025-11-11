/**
 * Supplier Returns API Service
 */

import { api } from './base';

export const supplierReturnsService = {
  /**
   * List supplier returns
   */
  getSupplierReturns: async (params?: { status?: string; page?: number; per_page?: number }) => {
    return api.get('/supplier/returns', { params });
  },

  /**
   * Get return
   */
  getReturn: async (returnId: string | number) => {
    return api.get(`/supplier/returns/${returnId}`);
  },

  /**
   * Get return tracking
   */
  getReturnTracking: async (returnId: string | number) => {
    return api.get(`/supplier/returns/${returnId}/tracking`);
  },

  /**
   * Approve return
   */
  approveReturn: async (returnId: string | number, notes?: string) => {
    return api.post(`/supplier/returns/${returnId}/approve`, { notes });
  },

  /**
   * Reject return
   */
  rejectReturn: async (returnId: string | number, reason: string, notes?: string) => {
    return api.post(`/supplier/returns/${returnId}/reject`, {
      reason,
      notes,
    });
  },
};

