import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { SupplierOrder } from './types';
import OrderCard from './orders/OrderCard';

interface OrdersTabProps {
  orders: SupplierOrder[];
  isLoadingOrders: boolean;
  onConfirmOrderItem: (orderItemId: number) => Promise<void>;
  onShipOrder: (orderItemId: number, trackingNumber: string) => Promise<void>;
  onUpdateTracking: (orderItemId: number, trackingNumber: string, trackingUrl?: string) => Promise<void>;
  getStatusBadge: (status: string) => React.ReactNode;
}

const OrdersTab: React.FC<OrdersTabProps> = ({
  orders,
  isLoadingOrders,
  onConfirmOrderItem,
  onShipOrder,
  onUpdateTracking,
  getStatusBadge,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Management</CardTitle>
        <CardDescription>Track and manage your orders</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingOrders ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No orders found.</div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard
                key={order.order_id}
                order={order}
                onConfirmOrderItem={onConfirmOrderItem}
                onShipOrder={onShipOrder}
                onUpdateTracking={onUpdateTracking}
                getStatusBadge={getStatusBadge}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrdersTab;

