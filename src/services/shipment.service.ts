/**
 * Shipment Service - Business Logic Layer
 * Handles shipment operations and business rules
 * Follows Single Responsibility Principle
 */

import { ShipmentRepository, Shipment, TrackingEvent } from './shipment.repository';

/**
 * Shipment Service - Business logic for shipment operations
 */
export class ShipmentService {
  private repository: ShipmentRepository;

  constructor(repository?: ShipmentRepository) {
    this.repository = repository || new ShipmentRepository();
  }

  /**
   * Get shipments for an order
   */
  async getOrderShipments(orderId: number): Promise<Shipment[]> {
    try {
      return await this.repository.getOrderShipments(orderId);
    } catch (error) {
      // Silently fail - shipments might not exist for all orders
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Error fetching shipments:', error);
      }
      return [];
    }
  }

  /**
   * Get tracking events for a shipment
   */
  async getShipmentTracking(shipmentId: number): Promise<TrackingEvent[]> {
    try {
      return await this.repository.getShipmentTracking(shipmentId);
    } catch (error) {
      // Silently fail - tracking might not be available
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Error fetching tracking events:', error);
      }
      return [];
    }
  }

  /**
   * Get default shipment (first shipment if available)
   */
  getDefaultShipment(shipments: Shipment[]): Shipment | null {
    return shipments.length > 0 ? shipments[0] : null;
  }

  /**
   * Check if shipment has tracking
   */
  hasTracking(shipment: Shipment): boolean {
    return !!(shipment.tracking_number || shipment.tracking_url);
  }

  /**
   * Get tracking URL (prefer tracking_url, fallback to tracking_number)
   */
  getTrackingUrl(shipment: Shipment): string | null {
    return shipment.tracking_url || 
           (shipment.tracking_number ? `https://tracking.example.com/${shipment.tracking_number}` : null);
  }
}

// Export singleton instance
export const shipmentService = new ShipmentService();

