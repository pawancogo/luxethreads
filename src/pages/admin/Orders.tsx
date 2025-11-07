import React, { useState } from 'react';
import { useAdminOrders } from '@/hooks/admin/useAdminOrders';
import OrderCard from '@/components/admin/orders/OrderCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Search, Filter, Calendar } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';

const Orders: React.FC = () => {
  const {
    orders,
    loading,
    fetchOrders,
    cancelOrder,
    updateOrderStatus,
    refundOrder,
    deleteOrder,
  } = useAdminOrders();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToAction, setOrderToAction] = useState<number | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');

  const handleSearch = () => {
    fetchOrders({
      order_number: searchQuery || undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      payment_status: paymentStatusFilter !== 'all' ? paymentStatusFilter : undefined,
    });
  };

  const handleCancel = (orderId: number) => {
    setOrderToAction(orderId);
    setCancelDialogOpen(true);
  };

  const confirmCancel = async () => {
    if (orderToAction && cancellationReason.trim()) {
      await cancelOrder(orderToAction, cancellationReason);
      setCancelDialogOpen(false);
      setOrderToAction(null);
      setCancellationReason('');
    }
  };

  const handleUpdateStatus = (orderId: number) => {
    setOrderToAction(orderId);
    setStatusDialogOpen(true);
  };

  const confirmStatusUpdate = async () => {
    if (orderToAction && newStatus) {
      await updateOrderStatus(orderToAction, newStatus);
      setStatusDialogOpen(false);
      setOrderToAction(null);
      setNewStatus('');
    }
  };

  const handleRefund = (orderId: number) => {
    setOrderToAction(orderId);
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setRefundAmount(order.total_amount.toString());
    }
    setRefundDialogOpen(true);
  };

  const confirmRefund = async () => {
    if (orderToAction && refundAmount) {
      await refundOrder(orderToAction, parseFloat(refundAmount), refundReason);
      setRefundDialogOpen(false);
      setOrderToAction(null);
      setRefundAmount('');
      setRefundReason('');
    }
  };

  const handleDelete = (orderId: number) => {
    setOrderToAction(orderId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (orderToAction) {
      await deleteOrder(orderToAction);
      setDeleteDialogOpen(false);
      setOrderToAction(null);
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Order Management</h1>
        <p className="text-gray-600">Manage and track customer orders</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by order number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="packed">Packed</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payment Status</SelectItem>
                <SelectItem value="payment_pending">Pending</SelectItem>
                <SelectItem value="payment_complete">Complete</SelectItem>
                <SelectItem value="payment_failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch}>
              <Filter className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onCancel={handleCancel}
            onUpdateStatus={handleUpdateStatus}
            onRefund={handleRefund}
            onDelete={handleDelete}
            onViewDetails={(id) => {
              window.location.href = `/admin/orders/${id}`;
            }}
          />
        ))}
      </div>

      {orders.length === 0 && !loading && (
        <Card className="text-center p-8">
          <p className="text-gray-500">No orders found</p>
        </Card>
      )}

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Please provide a reason for cancelling this order.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cancellation-reason">Cancellation Reason</Label>
              <Textarea
                id="cancellation-reason"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Enter cancellation reason..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setCancelDialogOpen(false);
              setCancellationReason('');
            }}>
              Cancel
            </Button>
            <Button onClick={confirmCancel} disabled={!cancellationReason.trim()}>
              Cancel Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Select the new status for this order.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-status">Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="packed">Packed</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setStatusDialogOpen(false);
              setNewStatus('');
            }}>
              Cancel
            </Button>
            <Button onClick={confirmStatusUpdate} disabled={!newStatus}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refund Dialog */}
      <Dialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Refund</DialogTitle>
            <DialogDescription>
              Enter refund details for this order.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="refund-amount">Refund Amount</Label>
              <Input
                id="refund-amount"
                type="number"
                step="0.01"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="refund-reason">Refund Reason (Optional)</Label>
              <Textarea
                id="refund-reason"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Enter refund reason..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setRefundDialogOpen(false);
              setRefundAmount('');
              setRefundReason('');
            }}>
              Cancel
            </Button>
            <Button onClick={confirmRefund} disabled={!refundAmount || parseFloat(refundAmount) <= 0}>
              Process Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this order? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Orders;

