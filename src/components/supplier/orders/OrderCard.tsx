import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Clock } from 'lucide-react';
import { SupplierOrder, OrderItem } from '../types';
import OrderActions from './OrderActions';

interface OrderCardProps {
  order: SupplierOrder;
  onConfirmOrderItem: (orderItemId: number) => Promise<void>;
  onShipOrder: (orderItemId: number, trackingNumber: string) => Promise<void>;
  onUpdateTracking: (orderItemId: number, trackingNumber: string, trackingUrl?: string) => Promise<void>;
  getStatusBadge: (status: string) => React.ReactNode;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onConfirmOrderItem,
  onShipOrder,
  onUpdateTracking,
  getStatusBadge,
}) => {
  const [isStatusHistoryOpen, setIsStatusHistoryOpen] = React.useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Order #{order.order_number}</CardTitle>
            <CardDescription>
              {formatDate(order.order_date)} - {order.customer_name} ({order.customer_email})
            </CardDescription>
            {order.tracking_number && (
              <div className="mt-2 text-sm">
                <span className="text-gray-500">Tracking: </span>
                {order.tracking_url ? (
                  <a
                    href={order.tracking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {order.tracking_number}
                  </a>
                ) : (
                  <span className="font-medium">{order.tracking_number}</span>
                )}
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="font-semibold">${order.total_amount.toFixed(2)}</div>
            <div className="text-sm text-gray-500">{getStatusBadge(order.status)}</div>
          </div>
        </div>
        {order.status_history && order.status_history.length > 0 && (
          <Collapsible open={isStatusHistoryOpen} onOpenChange={setIsStatusHistoryOpen}>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mt-2">
              <Clock className="h-4 w-4" />
              <span>Status History</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isStatusHistoryOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="space-y-1 text-sm">
                {order.status_history.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-600">
                    <span className="font-medium capitalize">{entry.status}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-xs">{formatDate(entry.timestamp)}</span>
                    {entry.note && <span className="text-gray-500">- {entry.note}</span>}
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
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
              <TableHead>Status</TableHead>
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
                  <Badge variant="outline" className="capitalize">
                    {item.fulfillment_status || 'pending'}
                  </Badge>
                  {item.tracking_number && (
                    <div className="text-xs text-gray-500 mt-1">
                      {item.tracking_url ? (
                        <a
                          href={item.tracking_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {item.tracking_number}
                        </a>
                      ) : (
                        item.tracking_number
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <OrderActions
                    orderItem={item}
                    orderStatus={order.status}
                    onConfirm={onConfirmOrderItem}
                    onShip={onShipOrder}
                    onUpdateTracking={onUpdateTracking}
                  />
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

