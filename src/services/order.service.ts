/**
 * Order Service - Business Logic Layer
 * Handles order operations and business rules
 * Follows Single Responsibility Principle
 */

import { OrderRepository } from './order.repository';
import { OrderMapper } from './order.mapper';
import { OrderData } from './api/orders.service';

/**
 * Order Service - Business logic for order operations
 */
export class OrderService {
  private repository: OrderRepository;
  private mapper: OrderMapper;

  constructor(repository?: OrderRepository) {
    this.repository = repository || new OrderRepository();
    this.mapper = new OrderMapper();
  }

  /**
   * Get user orders
   */
  async getMyOrders(): Promise<any[]> {
    try {
      const response = await this.repository.getMyOrders();
      return this.mapper.mapApiResponseToOrders(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create order
   */
  async createOrder(orderData: OrderData): Promise<any> {
    try {
      return await this.repository.createOrder(orderData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string | number, reason: string): Promise<any> {
    try {
      return await this.repository.cancelOrder(orderId, reason);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get order details
   */
  async getOrderDetails(orderId: string | number): Promise<any> {
    try {
      return await this.repository.getOrderDetails(orderId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get order invoice
   */
  async getOrderInvoice(orderId: string | number): Promise<any> {
    try {
      return await this.repository.getOrderInvoice(orderId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Download invoice as blob
   */
  async downloadInvoice(orderId: string | number, orderNumber?: string): Promise<void> {
    try {
      const response = await this.getOrderInvoice(orderId);
      const blob = response.data instanceof Blob ? response.data : new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${orderNumber || orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Extract error message
   */
  extractErrorMessage(error: any): string {
    return this.mapper.extractErrorMessage(error);
  }
}

export const orderService = new OrderService();

