/**
 * Returns Page - Clean Architecture Implementation
 * Uses ReturnService and OrderService for business logic
 * Follows: UI → Logic (Services) → Data (API Services)
 */

import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Package, Loader2, CheckCircle, Clock, XCircle } from 'lucide-react';
import { returnService } from '@/services/return.service';
import { orderService } from '@/services/order.service';
import { ReturnRequestData } from '@/services/api/returns.service';
import type { ReturnRequest } from '@/services/return.mapper';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/stores/userStore';

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price_at_purchase: number;
  image_url?: string;
  can_return?: boolean;
}

interface Order {
  id: number;
  order_number: string;
  order_date: string;
  status: string;
  items: OrderItem[];
}

const Returns = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const { user } = useUser();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [viewMode, setViewMode] = useState<'create' | 'list'>(
    orderId ? 'create' : 'list'
  );

  const [returnForm, setReturnForm] = useState({
    order_id: orderId ? parseInt(orderId) : 0,
    resolution_type: 'refund' as 'refund' | 'replacement',
    items: [] as Array<{
      order_item_id: number;
      quantity: number;
      reason: string;
    }>,
  });

  useEffect(() => {
    if (user) {
      loadReturnRequests();
      if (viewMode === 'create') {
        loadOrders();
      }
    }
  }, [user, viewMode]);

  useEffect(() => {
    if (orderId && orders.length > 0) {
      const order = orders.find(o => o.id === parseInt(orderId));
      if (order) {
        setSelectedOrder(order);
        setReturnForm(prev => ({ ...prev, order_id: order.id }));
      }
    }
  }, [orderId, orders]);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const ordersList = await orderService.getMyOrders();
      setOrders(ordersList.filter((o: any) => o.status === 'delivered'));
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

  const loadReturnRequests = async () => {
    setIsLoading(true);
    try {
      const returnsList = await returnService.getMyReturns();
      setReturnRequests(returnsList);
    } catch (error: any) {
      const errorMessage = returnService.extractErrorMessage(error);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order);
    setReturnForm(prev => ({ ...prev, order_id: order.id, items: [] }));
  };

  const handleItemToggle = (item: OrderItem, quantity: number) => {
    setReturnForm(prev => {
      const existingIndex = prev.items.findIndex(i => i.order_item_id === item.id);
      
      if (existingIndex >= 0) {
        // Remove if quantity is 0
        if (quantity === 0) {
          return {
            ...prev,
            items: prev.items.filter(i => i.order_item_id !== item.id),
          };
        }
        // Update quantity
        const updated = [...prev.items];
        updated[existingIndex] = { ...updated[existingIndex], quantity };
        return { ...prev, items: updated };
      } else {
        // Add new item
        return {
          ...prev,
          items: [
            ...prev.items,
            {
              order_item_id: item.id,
              quantity,
              reason: '',
            },
          ],
        };
      }
    });
  };

  const handleReasonChange = (orderItemId: number, reason: string) => {
    setReturnForm(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.order_item_id === orderItemId ? { ...item, reason } : item
      ),
    }));
  };

  const handleSubmit = async () => {
    if (!selectedOrder) {
      toast({
        title: 'Error',
        description: 'Please select an order',
        variant: 'destructive',
      });
      return;
    }

    if (returnForm.items.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one item to return',
        variant: 'destructive',
      });
      return;
    }

    // Validate all items have reasons
    const itemsWithoutReason = returnForm.items.filter(item => !item.reason);
    if (itemsWithoutReason.length > 0) {
      toast({
        title: 'Error',
        description: 'Please provide a reason for all items',
        variant: 'destructive',
      });
      return;
    }

    setIsCreating(true);
    try {
      const returnData: ReturnRequestData = {
        order_id: returnForm.order_id,
        resolution_type: returnForm.resolution_type,
        items: returnForm.items,
      };
      await returnService.createReturnRequest(returnData);

      toast({
        title: 'Success',
        description: 'Return request submitted successfully',
      });

      setViewMode('list');
      setSelectedOrder(null);
      setReturnForm({
        order_id: 0,
        resolution_type: 'refund',
        items: [],
      });
      loadReturnRequests();
    } catch (error: any) {
      const errorMessage = returnService.extractErrorMessage(error);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      requested: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      received: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">Please log in to view returns</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/orders" className="flex items-center text-amber-600 hover:text-amber-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Orders
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Returns & Refunds</h1>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
              >
                My Returns
              </Button>
              <Button
                variant={viewMode === 'create' ? 'default' : 'outline'}
                onClick={() => setViewMode('create')}
              >
                Create Return
              </Button>
            </div>
          </div>
        </div>

        {viewMode === 'create' ? (
          <div className="space-y-6">
            {/* Order Selection */}
            {!selectedOrder && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Order</CardTitle>
                  <CardDescription>Choose an order to return items from</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No delivered orders available for return</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <Card
                          key={order.id}
                          className="cursor-pointer hover:shadow-md transition-all"
                          onClick={() => handleOrderSelect(order)}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-semibold">Order #{order.order_number || order.id}</h3>
                                <p className="text-sm text-gray-600">
                                  {new Date(order.order_date).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge>{order.status}</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Return Form */}
            {selectedOrder && (
              <Card>
                <CardHeader>
                  <CardTitle>Return Items from Order #{selectedOrder.order_number || selectedOrder.id}</CardTitle>
                  <CardDescription>
                    Select items to return and provide a reason
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Resolution Type */}
                  <div>
                    <Label>Return Type</Label>
                    <RadioGroup
                      value={returnForm.resolution_type}
                      onValueChange={(value) =>
                        setReturnForm(prev => ({ ...prev, resolution_type: value as 'refund' | 'replacement' }))
                      }
                    >
                      <div className="flex items-center space-x-2 mt-2">
                        <RadioGroupItem value="refund" id="refund" />
                        <Label htmlFor="refund">Refund</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="replacement" id="replacement" />
                        <Label htmlFor="replacement">Replacement</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Items Selection */}
                  <div>
                    <Label>Select Items to Return</Label>
                    <div className="space-y-4 mt-4">
                      {selectedOrder.items.map((item) => {
                        const returnItem = returnForm.items.find(i => i.order_item_id === item.id);
                        const isSelected = returnItem !== undefined;
                        const quantity = returnItem?.quantity || 0;

                        return (
                          <div key={item.id} className="border rounded-lg p-4">
                            <div className="flex gap-4">
                              {item.image_url && (
                                <img
                                  src={item.image_url}
                                  alt={item.product_name}
                                  className="w-16 h-16 object-cover rounded-md"
                                />
                              )}
                              <div className="flex-1">
                                <h4 className="font-semibold">{item.product_name}</h4>
                                <p className="text-sm text-gray-600">
                                  Quantity: {item.quantity} • ₹{item.price_at_purchase.toLocaleString()}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant={isSelected ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => handleItemToggle(item, isSelected ? 0 : item.quantity)}
                                >
                                  {isSelected ? 'Selected' : 'Select'}
                                </Button>
                              </div>
                            </div>

                            {isSelected && (
                              <div className="mt-4 space-y-3 pt-4 border-t">
                                <div>
                                  <Label>Return Quantity</Label>
                                  <Input
                                    type="number"
                                    min={1}
                                    max={item.quantity}
                                    value={quantity}
                                    onChange={(e) => {
                                      const qty = parseInt(e.target.value) || 0;
                                      handleItemToggle(item, Math.min(qty, item.quantity));
                                    }}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label>Reason for Return *</Label>
                                  <Select
                                    value={returnItem?.reason || ''}
                                    onValueChange={(value) => handleReasonChange(item.id, value)}
                                  >
                                    <SelectTrigger className="mt-1">
                                      <SelectValue placeholder="Select reason" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="defective">Defective/Damaged</SelectItem>
                                      <SelectItem value="wrong_item">Wrong Item</SelectItem>
                                      <SelectItem value="size_issue">Size Issue</SelectItem>
                                      <SelectItem value="quality_issue">Quality Issue</SelectItem>
                                      <SelectItem value="not_as_described">Not as Described</SelectItem>
                                      <SelectItem value="changed_mind">Changed Mind</SelectItem>
                                      <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button variant="outline" onClick={() => {
                      setSelectedOrder(null);
                      setReturnForm({ order_id: 0, resolution_type: 'refund', items: [] });
                    }}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isCreating || returnForm.items.length === 0}>
                      {isCreating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Return Request'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          /* Return Requests List */
          <Card>
            <CardHeader>
              <CardTitle>My Return Requests</CardTitle>
              <CardDescription>Track the status of your returns</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : returnRequests.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No return requests</h3>
                  <p className="text-gray-500 mb-6">You haven't requested any returns yet</p>
                  <Button onClick={() => setViewMode('create')}>
                    Create Return Request
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {returnRequests.map((request) => (
                    <Card key={request.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">Return #{request.return_id}</h3>
                              <Badge className={getStatusBadge(request.status)}>
                                {getStatusIcon(request.status)}
                                <span className="ml-1 capitalize">{request.status.replace('_', ' ')}</span>
                              </Badge>
                              <Badge variant="secondary">
                                {request.resolution_type}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              Order #{request.order_id} • Created {new Date(request.created_at).toLocaleDateString()}
                            </p>
                            {request.items && request.items.length > 0 && (
                              <div className="mt-2">
                                <p className="text-sm font-medium">Items:</p>
                                <ul className="text-sm text-gray-600 list-disc list-inside">
                                  {request.items.map((item, index) => (
                                    <li key={index}>
                                      {item.quantity} item(s) - {item.reason}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          <Link to={`/returns/${request.id}`}>
                            <Button variant="outline" size="sm">
                              View Details
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
        )}
      </div>
    </div>
  );
};

export default Returns;

