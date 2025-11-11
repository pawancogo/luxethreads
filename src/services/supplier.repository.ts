/**
 * Supplier Repository - Data Access Layer
 * Abstracts API calls for supplier operations
 * Follows Repository Pattern
 */

import { productsService } from './api/products.service';
import { supplierProfileService } from './api/supplier-profile.service';
import { supplierOrdersService } from './api/supplier-orders.service';
import { supplierPaymentsService } from './api/supplier-payments.service';
import { supplierReturnsService } from './api/supplier-returns.service';
import { SupplierProfile, SupplierProduct, SupplierOrder, SupplierPayment, SupplierReturnRequest } from '@/components/supplier/types';

/**
 * Supplier Repository - Handles data access for supplier operations
 */
export class SupplierRepository {
  /**
   * Get supplier profile
   */
  async getProfile(): Promise<SupplierProfile> {
    try {
      return await supplierProfileService.getProfile();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create supplier profile
   */
  async createProfile(data: any): Promise<void> {
    try {
      await supplierProfileService.createProfile(data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update supplier profile
   */
  async updateProfile(data: Partial<SupplierProfile>): Promise<void> {
    try {
      await supplierProfileService.updateProfile(data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get supplier products
   */
  async getProducts(): Promise<any> {
    try {
      return await productsService.getSupplierProducts();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create product
   */
  async createProduct(data: any): Promise<any> {
    try {
      return await productsService.createProduct(data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update product
   */
  async updateProduct(id: number, data: any): Promise<void> {
    try {
      await productsService.updateProduct(id, data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete product
   */
  async deleteProduct(id: number): Promise<void> {
    try {
      await productsService.deleteProduct(id, data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Export products
   */
  async exportProducts(): Promise<Blob> {
    try {
      return await productsService.exportProducts();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Bulk upload products
   */
  async bulkUpload(formData: FormData): Promise<any> {
    try {
      return await productsService.bulkUpload(formData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Download bulk upload template
   */
  async downloadTemplate(): Promise<any> {
    try {
      return await productsService.downloadTemplate();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get supplier orders
   */
  async getOrders(): Promise<any> {
    try {
      return await supplierOrdersService.getSupplierOrders();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Confirm order item
   */
  async confirmOrderItem(orderItemId: number): Promise<void> {
    try {
      await supplierOrdersService.confirmOrder(orderItemId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Ship order item
   */
  async shipOrderItem(orderItemId: number, trackingNumber: string): Promise<void> {
    try {
      await supplierOrdersService.shipOrder(orderItemId, { tracking_number: trackingNumber });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update tracking
   */
  async updateTracking(orderItemId: number, trackingNumber: string, trackingUrl?: string): Promise<void> {
    try {
      await supplierOrdersService.updateTracking(orderItemId, { tracking_number: trackingNumber, tracking_url: trackingUrl });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get supplier payments
   */
  async getPayments(): Promise<any> {
    try {
      return await supplierPaymentsService.getSupplierPayments();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get payment
   */
  async getPayment(paymentId: number): Promise<any> {
    try {
      return await supplierPaymentsService.getPayment(paymentId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get supplier returns
   */
  async getReturns(): Promise<any> {
    try {
      return await supplierReturnsService.getSupplierReturns();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Approve return
   */
  async approveReturn(returnId: number, notes?: string): Promise<void> {
    try {
      await supplierReturnsService.approveReturn(returnId, notes);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reject return
   */
  async rejectReturn(returnId: number, rejectionReason: string): Promise<void> {
    try {
      await supplierReturnsService.rejectReturn(returnId, rejectionReason);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update variant
   */
  async updateVariant(productId: number, variantId: number, data: any): Promise<void> {
    try {
      await productsService.updateVariant(productId, variantId, data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete variant
   */
  async deleteVariant(productId: number, variantId: number): Promise<void> {
    try {
      await productsService.deleteVariant(productId, variantId);
    } catch (error) {
      throw error;
    }
  }
}

export const supplierRepository = new SupplierRepository();

