/**
 * Order Repository - Data Access Layer
 * Abstracts API calls for order operations
 * Follows Repository Pattern
 */

import { ordersService, OrderData } from './api/orders.service';

/**
 * Order Repository - Handles data access for orders
 */
export class OrderRepository {
  /**
   * Get user orders
   */
  async getMyOrders(): Promise<any> {
    try {
      return await ordersService.getMyOrders();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create order
   */
  async createOrder(orderData: OrderData): Promise<any> {
    try {
      return await ordersService.createOrder(orderData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string | number, reason: string): Promise<any> {
    try {
      return await ordersService.cancelOrder(orderId, reason);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get order details
   */
  async getOrderDetails(orderId: string | number): Promise<any> {
    try {
      return await ordersService.getOrderDetails(orderId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get order invoice
   */
  async getOrderInvoice(orderId: string | number): Promise<any> {
    try {
      return await ordersService.getOrderInvoice(orderId);
    } catch (error) {
      throw error;
    }
  }
}

export const orderRepository = new OrderRepository();

