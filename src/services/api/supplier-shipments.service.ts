/**
 * Supplier Shipments API Service
 */

import { api } from './base';

export interface ShipmentData {
  order_id: number;
  tracking_number: string;
  carrier: string;
  shipped_at?: string;
}

export interface TrackingEventData {
  status: string;
  location?: string;
  timestamp?: string;
  description?: string;
}

export const supplierShipmentsService = {
  /**
   * List shipments
   */
  getShipments: async (params?: { page?: number; per_page?: number }) => {
    return api.get('/supplier/shipments', { params });
  },

  /**
   * Create shipment
   */
  createShipment: async (shipmentData: ShipmentData) => {
    return api.post('/supplier/shipments', { shipment: shipmentData });
  },

  /**
   * Get shipment
   */
  getShipment: async (shipmentId: string | number) => {
    return api.get(`/supplier/shipments/${shipmentId}`);
  },

  /**
   * Add tracking event
   */
  addTrackingEvent: async (shipmentId: string | number, eventData: TrackingEventData) => {
    return api.post(`/supplier/shipments/${shipmentId}/tracking_events`, {
      tracking_event: eventData,
    });
  },
};

