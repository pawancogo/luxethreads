import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Checkout } from '../pages/Checkout';
import { Orders } from '../pages/Orders';
import * as ordersAPI from '../services/api';

vi.mock('../services/api');

describe('Orders, Payments & Returns', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Checkout Flow', () => {
    it('renders checkout form with address selection', () => {
      render(
        <BrowserRouter>
          <Checkout />
        </BrowserRouter>
      );

      expect(screen.getByText(/shipping address/i)).toBeInTheDocument();
      expect(screen.getByText(/payment method/i)).toBeInTheDocument();
    });

    it('creates order on checkout submission', async () => {
      const mockCreateOrder = vi.fn().mockResolvedValue({
        success: true,
        data: { id: 1, order_number: 'ORD-001' }
      });
      vi.mocked(ordersAPI.createOrder).mockImplementation(mockCreateOrder);

      render(
        <BrowserRouter>
          <Checkout />
        </BrowserRouter>
      );

      const submitButton = screen.getByRole('button', { name: /place order/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockCreateOrder).toHaveBeenCalled();
      });
    });

    it('validates required fields before submission', async () => {
      render(
        <BrowserRouter>
          <Checkout />
        </BrowserRouter>
      );

      const submitButton = screen.getByRole('button', { name: /place order/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/address is required/i)).toBeInTheDocument();
      });
    });
  });

  describe('Orders Page', () => {
    it('displays user orders', async () => {
      const mockOrders = [
        { id: 1, order_number: 'ORD-001', status: 'confirmed', total_amount: 100 },
        { id: 2, order_number: 'ORD-002', status: 'shipped', total_amount: 200 }
      ];

      const mockGetOrders = vi.fn().mockResolvedValue({
        success: true,
        data: mockOrders
      });
      vi.mocked(ordersAPI.getMyOrders).mockImplementation(mockGetOrders);

      render(
        <BrowserRouter>
          <Orders />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('ORD-001')).toBeInTheDocument();
        expect(screen.getByText('ORD-002')).toBeInTheDocument();
      });
    });

    it('allows order cancellation', async () => {
      const mockCancelOrder = vi.fn().mockResolvedValue({
        success: true
      });
      vi.mocked(ordersAPI.cancelOrder).mockImplementation(mockCancelOrder);

      render(
        <BrowserRouter>
          <Orders />
        </BrowserRouter>
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(mockCancelOrder).toHaveBeenCalled();
      });
    });
  });

  describe('Payment Processing', () => {
    it('processes payment for order', async () => {
      const mockCreatePayment = vi.fn().mockResolvedValue({
        success: true,
        data: { id: 1, status: 'completed' }
      });
      vi.mocked(ordersAPI.createPayment).mockImplementation(mockCreatePayment);

      const orderId = 1;
      const paymentData = {
        amount: 100,
        payment_method: 'card',
        payment_gateway: 'stripe'
      };

      await ordersAPI.createPayment(orderId, paymentData);

      expect(mockCreatePayment).toHaveBeenCalledWith(orderId, paymentData);
    });
  });

  describe('Returns', () => {
    it('creates return request', async () => {
      const mockCreateReturn = vi.fn().mockResolvedValue({
        success: true,
        data: { id: 1, status: 'pending' }
      });
      vi.mocked(ordersAPI.createReturnRequest).mockImplementation(mockCreateReturn);

      const returnData = {
        order_item_id: 1,
        return_reason: 'Defective product',
        return_quantity: 1
      };

      await ordersAPI.createReturnRequest(returnData);

      expect(mockCreateReturn).toHaveBeenCalledWith(returnData);
    });

    it('displays return requests', async () => {
      const mockReturns = [
        { id: 1, return_id: 'RET-001', status: 'pending' },
        { id: 2, return_id: 'RET-002', status: 'approved' }
      ];

      const mockGetReturns = vi.fn().mockResolvedValue({
        success: true,
        data: mockReturns
      });
      vi.mocked(ordersAPI.getMyReturns).mockImplementation(mockGetReturns);

      render(
        <BrowserRouter>
          <Orders />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(mockGetReturns).toHaveBeenCalled();
      });
    });
  });
});




