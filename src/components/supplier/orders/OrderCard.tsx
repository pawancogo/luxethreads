import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { SupplierOrder } from '../types';
import ShipOrderDialog from './ShipOrderDialog';

interface OrderCardProps {
  order: SupplierOrder;
  isShipOrderOpen: boolean;
  selectedOrderItemId: number | null;
  selectedOrderId: number | null;
  trackingNumber: string;
  onShipOrder: () => void;
  onTrackingNumberChange: (value: string) => void;
  onShipOrderDialogChange: (open: boolean, orderItemId?: number, orderId?: number) => void;
  getStatusBadge: (status: string) => React.ReactNode;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
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
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Order #{order.order_number}</CardTitle>
            <CardDescription>
              {new Date(order.order_date).toLocaleDateString()} - {order.customer_name} (
              {order.customer_email})
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="font-semibold">${order.total_amount.toFixed(2)}</div>
            <div className="text-sm text-gray-500">{getStatusBadge(order.status)}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Subtotal</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.items.map((item) => (
              <TableRow key={item.order_item_id}>
                <TableCell className="font-medium">{item.product_name}</TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>${item.price_at_purchase.toFixed(2)}</TableCell>
                <TableCell>${item.subtotal.toFixed(2)}</TableCell>
                <TableCell>
                  {order.status === 'paid' && (
                    <ShipOrderDialog
                      orderItemId={item.order_item_id}
                      orderId={order.order_id}
                      isOpen={
                        isShipOrderOpen &&
                        selectedOrderItemId === item.order_item_id &&
                        selectedOrderId === order.order_id
                      }
                      trackingNumber={trackingNumber}
                      onOpenChange={(open) =>
                        onShipOrderDialogChange(
                          open,
                          open ? item.order_item_id : undefined,
                          open ? order.order_id : undefined
                        )
                      }
                      onTrackingNumberChange={onTrackingNumberChange}
                      onShipOrder={onShipOrder}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default OrderCard;

