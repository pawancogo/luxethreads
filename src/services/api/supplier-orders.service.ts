/**
 * Supplier Orders API Service
 */

import { api } from './base';

export interface ShipOrderData {
  tracking_number: string;
  carrier?: string;
}

export interface UpdateTrackingData {
  tracking_number: string;
  carrier?: string;
  tracking_url?: string;
}

export const supplierOrdersService = {
  /**
   * List supplier orders
   */
  getSupplierOrders: async (params?: { status?: string; page?: number; per_page?: number }) => {
    return api.get('/supplier/orders', { params });
  },

  /**
   * Get order item
   */
  getOrderItem: async (itemId: string | number) => {
    return api.get(`/supplier/orders/${itemId}`);
  },

  /**
   * Confirm order
   */
  confirmOrder: async (itemId: string | number) => {
    return api.post(`/supplier/orders/${itemId}/confirm`);
  },

  /**
   * Ship order
   */
  shipOrder: async (itemId: string | number, shipData: ShipOrderData) => {
    return api.put(`/supplier/orders/${itemId}/ship`, shipData);
  },

  /**
   * Update tracking
   */
  updateTracking: async (itemId: string | number, trackingData: UpdateTrackingData) => {
    return api.put(`/supplier/orders/${itemId}/update_tracking`, trackingData);
  },
};

