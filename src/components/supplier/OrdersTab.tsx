import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { SupplierOrder } from './types';
import OrderCard from './orders/OrderCard';

interface OrdersTabProps {
  orders: SupplierOrder[];
  isLoadingOrders: boolean;
  isShipOrderOpen: boolean;
  selectedOrderItemId: number | null;
  selectedOrderId: number | null;
  trackingNumber: string;
  onShipOrder: () => void;
  onTrackingNumberChange: (value: string) => void;
  onShipOrderDialogChange: (open: boolean, orderItemId?: number, orderId?: number) => void;
  getStatusBadge: (status: string) => React.ReactNode;
}

const OrdersTab: React.FC<OrdersTabProps> = ({
  orders,
  isLoadingOrders,
  isShipOrderOpen,
  selectedOrderItemId,
  selectedOrderId,
  trackingNumber,
  onShipOrder,
  onTrackingNumberChange,
  onShipOrderDialogChange,
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
                isShipOrderOpen={isShipOrderOpen}
                selectedOrderItemId={selectedOrderItemId}
                selectedOrderId={selectedOrderId}
                trackingNumber={trackingNumber}
                onShipOrder={onShipOrder}
                onTrackingNumberChange={onTrackingNumberChange}
                onShipOrderDialogChange={onShipOrderDialogChange}
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

