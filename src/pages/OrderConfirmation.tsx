import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { ordersAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get order ID from location state or URL params
  const orderId = location.state?.orderId || new URLSearchParams(location.search).get('orderId');

  useEffect(() => {
    if (orderId) {
      loadOrderDetails();
    } else {
      // If no order ID, redirect to orders page
      toast({
        title: 'No Order Found',
        description: 'Redirecting to orders page',
      });
      setTimeout(() => navigate('/orders'), 2000);
    }
  }, [orderId]);

  const loadOrderDetails = async () => {
    if (!orderId) return;
    
    setIsLoading(true);
    try {
      const response = await ordersAPI.getOrderDetails(orderId);
      setOrder(response as any);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to load order details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <Link to="/orders">
            <Button>View My Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  const estimatedDelivery = order.estimated_delivery_date 
    ? new Date(order.estimated_delivery_date)
    : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-lg text-gray-600">Thank you for your purchase. Your order has been successfully placed.</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Order Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="font-semibold">{order.order_number || orderId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-semibold">
                  {order.order_date ? new Date(order.order_date).toLocaleDateString() : new Date().toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estimated Delivery</p>
                <p className="font-semibold">{estimatedDelivery.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Status</p>
                <p className="font-semibold capitalize">{order.payment_status || 'Payment Pending'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="font-semibold">₹{order.total_amount?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Truck className="h-5 w-5" />
              <span>What's Next?</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-semibold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-semibold">Order Processing</h3>
                  <p className="text-gray-600">We're preparing your items for shipment.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-semibold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-semibold">In Transit</h3>
                  <p className="text-gray-600">Your order is on its way to you.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-semibold text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-semibold">Delivered</h3>
                  <p className="text-gray-600">Your order will be delivered to your address.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <p className="text-gray-600">
            We'll send you updates about your order via email and SMS.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={`/orders/${order.id || orderId}`}>
              <Button className="bg-amber-600 hover:bg-amber-700">
                View Order Details
              </Button>
            </Link>
            <Link to="/products">
              <Button variant="outline">
                Continue Shopping
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;