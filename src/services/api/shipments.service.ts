/**
 * Shipments API Service (Customer)
 */

import { api } from './base';

export const shipmentsService = {
  /**
   * Get order shipments
   */
  getOrderShipments: async (orderId: number) => {
    return api.get(`/orders/${orderId}/shipments`);
  },

  /**
   * Get shipment
   */
  getShipment: async (shipmentId: string | number) => {
    return api.get(`/shipments/${shipmentId}`);
  },

  /**
   * Get shipment tracking
   */
  getShipmentTracking: async (shipmentId: string | number) => {
    return api.get(`/shipments/${shipmentId}/tracking`);
  },
};

