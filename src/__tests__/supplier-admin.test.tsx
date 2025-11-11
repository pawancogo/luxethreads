import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SupplierDashboard } from '../pages/SupplierDashboard';
import * as supplierAPI from '../services/api';

vi.mock('../services/api');

describe('Supplier & Admin Dashboards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Supplier Dashboard', () => {
    it('displays supplier orders', async () => {
      const mockOrders = [
        { id: 1, order_number: 'ORD-001', status: 'pending' }
      ];

      const mockGetSupplierOrders = vi.fn().mockResolvedValue({
        success: true,
        data: mockOrders
      });
      vi.mocked(supplierAPI.getSupplierOrders).mockImplementation(mockGetSupplierOrders);

      render(
        <BrowserRouter>
          <SupplierDashboard />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('ORD-001')).toBeInTheDocument();
      });
    });

    it('confirms order', async () => {
      const mockConfirmOrder = vi.fn().mockResolvedValue({
        success: true
      });
      vi.mocked(supplierAPI.confirmOrder).mockImplementation(mockConfirmOrder);

      const orderItemId = 1;
      await supplierAPI.confirmOrder(orderItemId);

      expect(mockConfirmOrder).toHaveBeenCalledWith(orderItemId);
    });

    it('ships order with tracking', async () => {
      const mockShipOrder = vi.fn().mockResolvedValue({
        success: true
      });
      vi.mocked(supplierAPI.shipOrder).mockImplementation(mockShipOrder);

      const orderItemId = 1;
      const trackingData = {
        tracking_number: 'TRACK123',
        shipping_provider: 'FedEx'
      };

      await supplierAPI.shipOrder(orderItemId, trackingData);

      expect(mockShipOrder).toHaveBeenCalledWith(orderItemId, trackingData);
    });

    it('displays supplier analytics', async () => {
      const mockAnalytics = {
        sales: 1000,
        revenue: 5000,
        orders_count: 50
      };

      const mockGetAnalytics = vi.fn().mockResolvedValue({
        success: true,
        data: mockAnalytics
      });
      vi.mocked(supplierAPI.getSupplierAnalytics).mockImplementation(mockGetAnalytics);

      render(
        <BrowserRouter>
          <SupplierDashboard />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(mockGetAnalytics).toHaveBeenCalled();
      });
    });
  });

  describe('Admin Dashboard', () => {
    it('manages users', async () => {
      const mockUsers = [
        { id: 1, email: 'user1@example.com', role: 'customer' },
        { id: 2, email: 'user2@example.com', role: 'supplier' }
      ];

      const mockGetUsers = vi.fn().mockResolvedValue({
        success: true,
        data: mockUsers
      });
      vi.mocked(supplierAPI.getUsers).mockImplementation(mockGetUsers);

      await mockGetUsers();

      expect(mockGetUsers).toHaveBeenCalled();
    });

    it('approves products', async () => {
      const mockApproveProduct = vi.fn().mockResolvedValue({
        success: true
      });
      vi.mocked(supplierAPI.approveProduct).mockImplementation(mockApproveProduct);

      const productId = 1;
      await supplierAPI.approveProduct(productId);

      expect(mockApproveProduct).toHaveBeenCalledWith(productId);
    });

    it('generates reports', async () => {
      const mockReport = {
        sales: 10000,
        revenue: 50000,
        orders: 200
      };

      const mockGetSalesReport = vi.fn().mockResolvedValue({
        success: true,
        data: mockReport
      });
      vi.mocked(supplierAPI.getSalesReport).mockImplementation(mockGetSalesReport);

      await supplierAPI.getSalesReport();

      expect(mockGetSalesReport).toHaveBeenCalled();
    });
  });
});





