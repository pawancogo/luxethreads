/**
 * Orders Page - Clean Architecture Implementation
 * Uses OrderService for business logic
 * Follows: UI → Logic (OrderService) → Data (API Services)
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Package, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '@/stores/userStore';
import { useToast } from '@/hooks/use-toast';
import { orderService } from '@/services/order.service';

interface Order {
  id: number;
  order_number: string;
  order_date: string;
  status: string;
  payment_status: string;
  total_amount: number;
  items: OrderItem[];
}

interface OrderItem {
  product_name: string;
  quantity: number;
  price_at_purchase: number;
}

const Orders = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const ordersList = await orderService.getMyOrders();
      setOrders(ordersList);
    } catch (error: any) {
      const errorMessage = orderService.extractErrorMessage(error);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-blue-100 text-blue-800',
      packed: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">Please log in to view your orders</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
          <CardDescription>View all your orders</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500">You haven't placed any orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Order #{order.order_number || order.id}</CardTitle>
                        <CardDescription>
                          {new Date(order.order_date).toLocaleDateString()} - ₹{order.total_amount.toLocaleString()}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusBadge(order.status)}>
                          {order.status}
                        </Badge>
                        <Badge variant="secondary">
                          {order.payment_status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {order.items?.map((item, index) => (
                        <div key={index} className="flex justify-between py-2 border-b">
                          <div>
                            <p className="font-medium">{item.product_name}</p>
                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-medium">₹{(item.price_at_purchase * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <Link to={`/orders/${order.id}`}>
                        <Button variant="outline" className="w-full">
                          <Eye className="h-4 w-4 mr-2" />
                          View Order Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;

