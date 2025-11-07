import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Package, User, Calendar, DollarSign } from 'lucide-react';

interface Order {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  total_amount: number;
  currency: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  items_count: number;
  created_at: string;
  updated_at: string;
}

interface OrderCardProps {
  order: Order;
  onCancel?: (orderId: number) => void;
  onUpdateStatus?: (orderId: number) => void;
  onRefund?: (orderId: number) => void;
  onDelete?: (orderId: number) => void;
  onViewDetails?: (orderId: number) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onCancel,
  onUpdateStatus,
  onRefund,
  onDelete,
  onViewDetails,
}) => {
  const getStatusBadge = () => {
    const statusColors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-blue-100 text-blue-800',
      packed: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    
    return (
      <Badge className={statusColors[order.status] || 'bg-gray-100 text-gray-800'}>
        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
      </Badge>
    );
  };

  const getPaymentStatusBadge = () => {
    const paymentColors: Record<string, string> = {
      payment_pending: 'bg-yellow-100 text-yellow-800',
      payment_complete: 'bg-green-100 text-green-800',
      payment_failed: 'bg-red-100 text-red-800',
    };
    
    return (
      <Badge variant="outline" className={paymentColors[order.payment_status] || 'bg-gray-100 text-gray-800'}>
        {order.payment_status.replace('payment_', '').charAt(0).toUpperCase() + order.payment_status.replace('payment_', '').slice(1)}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{order.order_number}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onViewDetails && (
              <DropdownMenuItem onClick={() => onViewDetails(order.id)}>
                View Details
              </DropdownMenuItem>
            )}
            {onUpdateStatus && (
              <DropdownMenuItem onClick={() => onUpdateStatus(order.id)}>
                Update Status
              </DropdownMenuItem>
            )}
            {order.status !== 'cancelled' && order.status !== 'delivered' && onCancel && (
              <DropdownMenuItem onClick={() => onCancel(order.id)}>
                Cancel Order
              </DropdownMenuItem>
            )}
            {order.payment_status === 'payment_complete' && onRefund && (
              <DropdownMenuItem onClick={() => onRefund(order.id)}>
                Process Refund
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(order.id)}
                className="text-red-600"
              >
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>{order.user.name} ({order.user.email})</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Package className="h-4 w-4" />
            <span>{order.items_count} item(s)</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium">
            <DollarSign className="h-4 w-4" />
            <span>{order.currency} {order.total_amount.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {getStatusBadge()}
            {getPaymentStatusBadge()}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
            <Calendar className="h-3 w-3" />
            <span>{new Date(order.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;

