import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const OrderConfirmation = () => {
  const orderId = `ORD-${Date.now()}`;
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

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
                <p className="font-semibold">{orderId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-semibold">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estimated Delivery</p>
                <p className="font-semibold">{estimatedDelivery.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="font-semibold">Cash on Delivery</p>
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
            <Link to="/products">
              <Button className="bg-amber-600 hover:bg-amber-700">
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