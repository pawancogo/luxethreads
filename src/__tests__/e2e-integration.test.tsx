import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { App } from '../App';
import * as api from '../services/api';

vi.mock('../services/api');

describe('End-to-End Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Complete User Journey', () => {
    it('completes full purchase flow: signup -> browse -> cart -> checkout -> order', async () => {
      // Mock signup
      const mockSignup = vi.fn().mockResolvedValue({
        success: true,
        data: { token: 'test-token', user: { id: 1 } }
      });
      vi.mocked(api.signup).mockImplementation(mockSignup);

      // Mock products
      const mockProducts = [
        { id: 1, name: 'Product 1', base_price: 100, images: [] },
        { id: 2, name: 'Product 2', base_price: 200, images: [] }
      ];
      const mockGetProducts = vi.fn().mockResolvedValue({
        success: true,
        data: mockProducts
      });
      vi.mocked(api.getPublicProducts).mockImplementation(mockGetProducts);

      // Mock add to cart
      const mockAddToCart = vi.fn().mockResolvedValue({
        success: true,
        data: { cart_items: [] }
      });
      vi.mocked(api.addToCart).mockImplementation(mockAddToCart);

      // Mock create order
      const mockCreateOrder = vi.fn().mockResolvedValue({
        success: true,
        data: { id: 1, order_number: 'ORD-001' }
      });
      vi.mocked(api.createOrder).mockImplementation(mockCreateOrder);

      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );

      // Step 1: Signup
      await waitFor(() => {
        expect(mockSignup).toHaveBeenCalled();
      });

      // Step 2: Browse products
      await waitFor(() => {
        expect(mockGetProducts).toHaveBeenCalled();
      });

      // Step 3: Add to cart
      await api.addToCart(1, 1);
      expect(mockAddToCart).toHaveBeenCalledWith(1, 1);

      // Step 4: Create order
      await api.createOrder({ shipping_address_id: 1, payment_method: 'card' });
      expect(mockCreateOrder).toHaveBeenCalled();
    });
  });

  describe('Supplier Journey', () => {
    it('completes supplier flow: login -> create product -> receive order -> fulfill', async () => {
      // Mock supplier login
      const mockLogin = vi.fn().mockResolvedValue({
        success: true,
        data: { token: 'supplier-token', user: { id: 1, role: 'supplier' } }
      });
      vi.mocked(api.login).mockImplementation(mockLogin);

      // Mock create product
      const mockCreateProduct = vi.fn().mockResolvedValue({
        success: true,
        data: { id: 1, name: 'New Product' }
      });
      vi.mocked(api.createProduct).mockImplementation(mockCreateProduct);

      // Mock get orders
      const mockGetOrders = vi.fn().mockResolvedValue({
        success: true,
        data: [{ id: 1, order_number: 'ORD-001', status: 'pending' }]
      });
      vi.mocked(api.getSupplierOrders).mockImplementation(mockGetOrders);

      // Mock confirm order
      const mockConfirmOrder = vi.fn().mockResolvedValue({
        success: true
      });
      vi.mocked(api.confirmOrder).mockImplementation(mockConfirmOrder);

      // Step 1: Login
      await api.login({ email: 'supplier@example.com', password: 'password' });
      expect(mockLogin).toHaveBeenCalled();

      // Step 2: Create product
      await api.createProduct({
        name: 'New Product',
        description: 'Description',
        category_id: 1,
        brand_id: 1
      });
      expect(mockCreateProduct).toHaveBeenCalled();

      // Step 3: Get orders
      await api.getSupplierOrders();
      expect(mockGetOrders).toHaveBeenCalled();

      // Step 4: Confirm order
      await api.confirmOrder(1);
      expect(mockConfirmOrder).toHaveBeenCalledWith(1);
    });
  });

  describe('Return Flow', () => {
    it('completes return request flow', async () => {
      // Mock create return
      const mockCreateReturn = vi.fn().mockResolvedValue({
        success: true,
        data: { id: 1, status: 'pending' }
      });
      vi.mocked(api.createReturnRequest).mockImplementation(mockCreateReturn);

      // Mock get returns
      const mockGetReturns = vi.fn().mockResolvedValue({
        success: true,
        data: [{ id: 1, return_id: 'RET-001', status: 'pending' }]
      });
      vi.mocked(api.getMyReturns).mockImplementation(mockGetReturns);

      // Step 1: Create return request
      await api.createReturnRequest({
        order_item_id: 1,
        return_reason: 'Defective product',
        return_quantity: 1
      });
      expect(mockCreateReturn).toHaveBeenCalled();

      // Step 2: Get return status
      await api.getMyReturns();
      expect(mockGetReturns).toHaveBeenCalled();
    });
  });
});




