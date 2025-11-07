import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Package, Truck, MapPin, CreditCard, Download, X } from 'lucide-react';
import { ordersAPI, shippingAPI, returnRequestsAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { Loader2 } from 'lucide-react';

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price_at_purchase: number;
  image_url?: string;
  sku?: string;
}

interface Shipment {
  id: number;
  tracking_number?: string;
  tracking_url?: string;
  status: string;
  shipping_provider?: string;
  estimated_delivery_date?: string;
  actual_delivery_date?: string;
}

interface TrackingEvent {
  id: number;
  event_type: string;
  event_description?: string;
  location?: string;
  city?: string;
  state?: string;
  event_time: string;
}

interface OrderDetail {
  id: number;
  order_number: string;
  order_date: string;
  status: string;
  payment_status: string;
  total_amount: number;
  subtotal: number;
  tax_amount: number;
  shipping_charge: number;
  discount_amount: number;
  items: OrderItem[];
  shipping_address: {
    full_name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    phone_number: string;
  };
  billing_address: {
    full_name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
  };
  payment_method?: string;
  tracking_number?: string;
  estimated_delivery_date?: string;
}

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (id) {
      loadOrderDetails();
    }
  }, [id]);

  useEffect(() => {
    if (selectedShipment) {
      loadTrackingEvents(selectedShipment);
    }
  }, [selectedShipment]);

  const loadOrderDetails = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const orderData = await ordersAPI.getOrderDetails(id);
      setOrder(orderData as any);

      // Load shipments
      try {
        const shipmentsData = await shippingAPI.getOrderShipments(parseInt(id));
        const shipmentsList = Array.isArray(shipmentsData) ? shipmentsData : [];
        setShipments(shipmentsList);
        if (shipmentsList.length > 0) {
          setSelectedShipment(shipmentsList[0].id);
        }
      } catch (error) {
        // Silently fail - shipments might not exist
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to load order details',
        variant: 'destructive',
      });
      navigate('/orders');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrackingEvents = async (shipmentId: number) => {
    try {
      const events = await shippingAPI.getShipmentTracking(shipmentId);
      setTrackingEvents(Array.isArray(events) ? events : []);
    } catch (error) {
      // Silently fail
    }
  };

  const handleCancelOrder = async () => {
    if (!order || !id) return;

    if (!cancellationReason.trim()) {
      toast({
        title: 'Reason Required',
        description: 'Please provide a reason for cancellation',
        variant: 'destructive',
      });
      return;
    }

    setIsCancelling(true);
    try {
      await ordersAPI.cancelOrder(id, cancellationReason.trim());
      toast({
        title: 'Order Cancelled',
        description: 'Your order has been cancelled successfully. Refund will be processed if payment was made.',
      });
      setIsCancelDialogOpen(false);
      setCancellationReason('');
      // Reload order details
      loadOrderDetails();
    } catch (error: any) {
      toast({
        title: 'Cancellation Failed',
        description: error?.message || 'Failed to cancel order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const handleReturn = () => {
    navigate(`/returns?order_id=${order?.id}`);
  };

  const handleDownloadInvoice = async () => {
    if (!order || !id) return;

    try {
      const response = await ordersAPI.downloadInvoice(id);
      const blob = response.data instanceof Blob ? response.data : new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${order.order_number || order.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: 'Invoice Downloaded',
        description: 'Your invoice has been downloaded successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Download Failed',
        description: error?.message || 'Failed to download invoice. Please try again.',
        variant: 'destructive',
      });
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return '✅';
      case 'shipped':
        return '🚚';
      case 'packed':
        return '📦';
      case 'paid':
        return '💳';
      default:
        return '⏳';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order not found</h1>
          <Link to="/orders">
            <Button>Back to Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  const canCancel = order.status === 'pending' || order.status === 'paid';
  const canReturn = order.status === 'delivered';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link to="/orders" className="flex items-center text-amber-600 hover:text-amber-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Orders
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
              <p className="text-gray-600 mt-1">Order #{order.order_number || order.id}</p>
            </div>
            <div className="flex gap-2">
              {canCancel && (
                <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <X className="h-4 w-4 mr-2" />
                      Cancel Order
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cancel Order</DialogTitle>
                      <DialogDescription>
                        Please provide a reason for cancelling this order. This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cancellation_reason">Cancellation Reason *</Label>
                        <Textarea
                          id="cancellation_reason"
                          placeholder="e.g., Changed my mind, Found better price, Wrong item ordered..."
                          value={cancellationReason}
                          onChange={(e) => setCancellationReason(e.target.value)}
                          rows={4}
                          className="mt-1"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Minimum 10 characters required
                        </p>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsCancelDialogOpen(false);
                            setCancellationReason('');
                          }}
                          disabled={isCancelling}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleCancelOrder}
                          disabled={isCancelling || cancellationReason.trim().length < 10}
                          variant="destructive"
                        >
                          {isCancelling ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Cancelling...
                            </>
                          ) : (
                            'Confirm Cancellation'
                          )}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              {canReturn && (
                <Button variant="outline" onClick={handleReturn}>
                  Return Items
                </Button>
              )}
              <Button variant="outline" onClick={handleDownloadInvoice}>
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.product_name}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.product_name}</h3>
                        {item.sku && (
                          <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                        )}
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="font-medium mt-1">
                          ₹{(item.price_at_purchase * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tracking */}
            {shipments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipment Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {shipments.length > 1 && (
                    <div className="mb-4">
                      <label className="text-sm font-medium">Select Shipment:</label>
                      <select
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        value={selectedShipment || ''}
                        onChange={(e) => setSelectedShipment(parseInt(e.target.value))}
                      >
                        {shipments.map((shipment) => (
                          <option key={shipment.id} value={shipment.id}>
                            Shipment #{shipment.id} - {shipment.tracking_number || 'N/A'}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedShipment && trackingEvents.length > 0 && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-2">Tracking Number:</p>
                        <p className="text-lg font-mono">
                          {shipments.find(s => s.id === selectedShipment)?.tracking_number || 'N/A'}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-3">Tracking Timeline:</p>
                        <div className="space-y-3">
                          {trackingEvents.map((event, index) => (
                            <div key={event.id} className="flex gap-3">
                              <div className="flex flex-col items-center">
                                <div className={`w-3 h-3 rounded-full ${
                                  index === 0 ? 'bg-amber-600' : 'bg-gray-300'
                                }`} />
                                {index < trackingEvents.length - 1 && (
                                  <div className="w-0.5 h-12 bg-gray-300" />
                                )}
                              </div>
                              <div className="flex-1 pb-4">
                                <p className="font-medium">{event.event_type}</p>
                                {event.event_description && (
                                  <p className="text-sm text-gray-600">{event.event_description}</p>
                                )}
                                {event.location && (
                                  <p className="text-xs text-gray-500">
                                    {event.location}
                                    {event.city && `, ${event.city}`}
                                    {event.state && `, ${event.state}`}
                                  </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(event.event_time).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedShipment && trackingEvents.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      No tracking events available yet
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge className={getStatusBadge(order.status)}>
                    {getStatusIcon(order.status)} {order.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Payment:</span>
                  <Badge variant="secondary">{order.payment_status}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span>{new Date(order.order_date).toLocaleDateString()}</span>
                </div>
                {order.estimated_delivery_date && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Est. Delivery:</span>
                    <span>{new Date(order.estimated_delivery_date).toLocaleDateString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{order.shipping_address.full_name}</p>
                <p className="text-sm text-gray-600">{order.shipping_address.line1}</p>
                {order.shipping_address.line2 && (
                  <p className="text-sm text-gray-600">{order.shipping_address.line2}</p>
                )}
                <p className="text-sm text-gray-600">
                  {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                </p>
                <p className="text-sm text-gray-600 mt-1">{order.shipping_address.phone_number}</p>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>₹{order.subtotal.toLocaleString()}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-₹{order.discount_amount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span>₹{order.shipping_charge.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span>₹{order.tax_amount.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>₹{order.total_amount.toLocaleString()}</span>
                </div>
                {order.payment_method && (
                  <div className="mt-2 pt-2 border-t">
                    <p className="text-sm text-gray-600">Payment Method:</p>
                    <p className="font-medium capitalize">{order.payment_method.replace('_', ' ')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
