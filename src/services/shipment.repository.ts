/**
 * Shipment Repository - Data Access Layer
 * Abstracts shipment API calls
 * Follows Repository Pattern
 */

import { shipmentsService } from './api/shipments.service';

export interface Shipment {
  id: number;
  tracking_number?: string;
  tracking_url?: string;
  status: string;
  shipping_provider?: string;
  estimated_delivery_date?: string;
  actual_delivery_date?: string;
}

export interface TrackingEvent {
  id: number;
  event_type: string;
  event_description?: string;
  location?: string;
  city?: string;
  state?: string;
  event_time: string;
}

export class ShipmentRepository {
  /**
   * Get shipments for an order
   */
  async getOrderShipments(orderId: number): Promise<Shipment[]> {
    const response = await shipmentsService.getOrderShipments(orderId);
    return Array.isArray(response) ? response : [];
  }

  /**
   * Get tracking events for a shipment
   */
  async getShipmentTracking(shipmentId: number): Promise<TrackingEvent[]> {
    const response = await shipmentsService.getShipmentTracking(shipmentId);
    return Array.isArray(response) ? response : [];
  }
}

