/**
 * Supplier Service - Business Logic Layer
 * Handles supplier operations and business rules
 * Follows Single Responsibility Principle
 */

import { SupplierRepository } from './supplier.repository';
import { SupplierMapper } from './supplier.mapper';
import { SupplierProfile, SupplierProduct, SupplierOrder, SupplierPayment, SupplierReturnRequest } from '@/components/supplier/types';

/**
 * Supplier Service - Business logic for supplier operations
 */
export class SupplierService {
  private repository: SupplierRepository;
  private mapper: SupplierMapper;

  constructor(repository?: SupplierRepository) {
    this.repository = repository || new SupplierRepository();
    this.mapper = new SupplierMapper();
  }

  /**
   * Check if user is supplier
   */
  private isSupplier(user: any): boolean {
    return user && user.role === 'supplier';
  }

  /**
   * Get supplier profile (for hooks - no user check)
   */
  async getProfile(): Promise<SupplierProfile | null> {
    try {
      const response = await this.repository.getProfile();
      return this.mapper.mapApiResponseToProfile(response);
    } catch (err: any) {
      // 404 is acceptable (profile not created yet)
      if (err?.status === 404) {
        return null;
      }
      throw err;
    }
  }

  /**
   * Create supplier profile (for hooks - no user check)
   */
  async createProfile(data: {
    company_name: string;
    gst_number: string;
    description: string;
    website_url: string;
  }): Promise<void> {
    await this.repository.createProfile(data);
  }

  /**
   * Update supplier profile (for hooks - no user check)
   */
  async updateProfile(data: {
    company_name: string;
    gst_number: string;
    description: string;
    website_url: string;
  }): Promise<void> {
    await this.repository.updateProfile(data);
  }

  /**
   * Get supplier products (for hooks - no user check)
   */
  async getProducts(): Promise<SupplierProduct[]> {
    try {
      const response = await this.repository.getProducts();
      const products = this.mapper.mapApiResponseToProducts(response);
      // Map variants for compatibility
      return products.map((product: any) => {
        const variants = product.variants || product.product_variants || [];
        return {
          ...product,
          variants: variants,
          product_variants: variants,
        };
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create product (for hooks - no user check)
   */
  async createProduct(data: {
    name: string;
    description: string;
    category_id: number;
    brand_id: number;
    attribute_value_ids?: number[];
  }): Promise<SupplierProduct> {
    try {
      const response = await this.repository.createProduct(data);
      return response as SupplierProduct;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update product (for hooks - no user check)
   */
  async updateProduct(id: number, data: Partial<{
    name: string;
    description: string;
    category_id: number;
    brand_id: number;
    attribute_value_ids?: number[];
  }>): Promise<void> {
    await this.repository.updateProduct(id, data);
  }

  /**
   * Delete product (for hooks - no user check)
   */
  async deleteProduct(id: number): Promise<void> {
    await this.repository.deleteProduct(id);
  }

  /**
   * Update variant (for hooks - no user check)
   */
  async updateVariant(productId: number, variantId: number, data: {
    price: number;
    discounted_price?: number;
    stock_quantity: number;
    weight_kg?: number;
    image_urls?: string[];
    attribute_value_ids?: number[];
  }): Promise<void> {
    await this.repository.updateVariant(productId, variantId, data);
  }

  /**
   * Delete variant (for hooks - no user check)
   */
  async deleteVariant(productId: number, variantId: number): Promise<void> {
    await this.repository.deleteVariant(productId, variantId);
  }

  /**
   * Get supplier payments (for hooks - no user check)
   */
  async getPayments(): Promise<SupplierPayment[]> {
    try {
      const response = await this.repository.getPayments();
      return Array.isArray(response) ? response : [];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get payment (for hooks - no user check)
   */
  async getPayment(paymentId: number): Promise<SupplierPayment | null> {
    try {
      const response = await this.repository.getPayment(paymentId);
      return response as SupplierPayment;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get supplier returns (for hooks - no user check)
   */
  async getReturns(): Promise<SupplierReturnRequest[]> {
    try {
      const response = await this.repository.getReturns();
      return Array.isArray(response) ? response : [];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Approve return (for hooks - no user check)
   */
  async approveReturn(returnId: number, notes?: string): Promise<void> {
    await this.repository.approveReturn(returnId, notes);
  }

  /**
   * Reject return (for hooks - no user check)
   */
  async rejectReturn(returnId: number, rejectionReason: string): Promise<void> {
    await this.repository.rejectReturn(returnId, rejectionReason);
  }

  /**
   * Get supplier orders (for hooks - no user check)
   */
  async getOrders(): Promise<SupplierOrder[]> {
    try {
      const response = await this.repository.getOrders();
      return this.mapper.mapApiResponseToOrders(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Confirm order item (for hooks - no user check)
   */
  async confirmOrderItem(orderItemId: number): Promise<void> {
    await this.repository.confirmOrderItem(orderItemId);
  }

  /**
   * Ship order item (for hooks - no user check)
   */
  async shipOrderItem(orderItemId: number, trackingNumber: string): Promise<void> {
    await this.repository.shipOrderItem(orderItemId, trackingNumber);
  }

  /**
   * Update tracking (for hooks - no user check)
   */
  async updateTracking(orderItemId: number, trackingNumber: string, trackingUrl?: string): Promise<void> {
    await this.repository.updateTracking(orderItemId, trackingNumber, trackingUrl);
  }

  /**
   * Extract error message
   */
  extractErrorMessage(error: any): string {
    return this.mapper.extractErrorMessage(error);
  }

  /**
   * Compute supplier status flags
   */
  computeStatusFlags(profile: SupplierProfile | null): {
    isSuspended: boolean;
    isVerified: boolean;
    supplierTier: SupplierProfile['supplier_tier'] | null;
  } {
    return {
      isSuspended: profile?.is_suspended || false,
      isVerified: profile?.verified || false,
      supplierTier: profile?.supplier_tier || null,
    };
  }

  /**
   * Export products to CSV
   */
  async exportProducts(): Promise<Blob> {
    try {
      return await this.repository.exportProducts();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Bulk upload products from CSV
   */
  async bulkUpload(formData: FormData): Promise<{
    total: number;
    successful: number;
    failed: number;
    products: Array<{ row: number; product_id: number; name: string; sku: string }>;
    errors: Array<{ row: number; errors: string[]; data: any }>;
  }> {
    try {
      return await this.repository.bulkUpload(formData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Download bulk upload template
   */
  async downloadTemplate(): Promise<Blob> {
    try {
      return await this.repository.downloadTemplate();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Download file helper
   */
  downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  /**
   * Generate export filename
   */
  generateExportFilename(prefix: string = 'products'): string {
    return `${prefix}_export_${new Date().toISOString().split('T')[0]}.csv`;
  }
}

export const supplierService = new SupplierService();

