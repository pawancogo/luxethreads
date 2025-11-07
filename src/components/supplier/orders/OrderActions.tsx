import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Package, Truck, Loader2 } from 'lucide-react';
import { OrderItem } from '../types';

interface OrderActionsProps {
  orderItem: OrderItem;
  orderStatus: string | null;
  onConfirm: (orderItemId: number) => Promise<void>;
  onShip: (orderItemId: number, trackingNumber: string) => Promise<void>;
  onUpdateTracking: (orderItemId: number, trackingNumber: string, trackingUrl?: string) => Promise<void>;
}

const OrderActions: React.FC<OrderActionsProps> = ({
  orderItem,
  orderStatus,
  onConfirm,
  onShip,
  onUpdateTracking,
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isShipping, setIsShipping] = useState(false);
  const [isUpdatingTracking, setIsUpdatingTracking] = useState(false);
  const [isShipDialogOpen, setIsShipDialogOpen] = useState(false);
  const [isTrackingDialogOpen, setIsTrackingDialogOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState(orderItem.tracking_number || '');
  const [trackingUrl, setTrackingUrl] = useState(orderItem.tracking_url || '');

  const fulfillmentStatus = orderItem.fulfillment_status || 'pending';

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm(orderItem.order_item_id);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleShip = async () => {
    if (!trackingNumber.trim()) {
      return;
    }
    setIsShipping(true);
    try {
      await onShip(orderItem.order_item_id, trackingNumber.trim());
      setIsShipDialogOpen(false);
      setTrackingNumber('');
    } finally {
      setIsShipping(false);
    }
  };

  const handleUpdateTracking = async () => {
    if (!trackingNumber.trim()) {
      return;
    }
    setIsUpdatingTracking(true);
    try {
      await onUpdateTracking(
        orderItem.order_item_id,
        trackingNumber.trim(),
        trackingUrl.trim() || undefined
      );
      setIsTrackingDialogOpen(false);
    } finally {
      setIsUpdatingTracking(false);
    }
  };

  // Show confirm button if order is pending/paid and item is pending
  const canConfirm = (orderStatus === 'pending' || orderStatus === 'paid') && 
                     fulfillmentStatus === 'pending';

  // Show ship button if order is paid/packed and item is processing/packed
  const canShip = (orderStatus === 'paid' || orderStatus === 'packed') &&
                  (fulfillmentStatus === 'processing' || fulfillmentStatus === 'packed');

  // Show update tracking button if item is shipped
  const canUpdateTracking = fulfillmentStatus === 'shipped';

  return (
    <div className="flex gap-2">
      {/* Confirm Button */}
      {canConfirm && (
        <Button
          size="sm"
          variant="outline"
          onClick={handleConfirm}
          disabled={isConfirming}
          title="Confirm order and start processing"
        >
          {isConfirming ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4 mr-1" />
          )}
          Confirm
        </Button>
      )}

      {/* Ship Button */}
      {canShip && (
        <>
          <Button
            size="sm"
            variant="default"
            onClick={() => setIsShipDialogOpen(true)}
            title="Mark as shipped"
          >
            <Package className="h-4 w-4 mr-1" />
            Ship
          </Button>
          <Dialog open={isShipDialogOpen} onOpenChange={setIsShipDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ship Order Item</DialogTitle>
                <DialogDescription>
                  Enter tracking information for order item #{orderItem.order_item_id}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="tracking-number">Tracking Number *</Label>
                  <Input
                    id="tracking-number"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tracking-url">Tracking URL (Optional)</Label>
                  <Input
                    id="tracking-url"
                    value={trackingUrl}
                    onChange={(e) => setTrackingUrl(e.target.value)}
                    placeholder="https://tracking.example.com/..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsShipDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleShip} disabled={isShipping || !trackingNumber.trim()}>
                  {isShipping ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Shipping...
                    </>
                  ) : (
                    'Ship Order'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}

      {/* Update Tracking Button */}
      {canUpdateTracking && (
        <>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setTrackingNumber(orderItem.tracking_number || '');
              setTrackingUrl(orderItem.tracking_url || '');
              setIsTrackingDialogOpen(true);
            }}
            title="Update tracking information"
          >
            <Truck className="h-4 w-4 mr-1" />
            Update Tracking
          </Button>
          <Dialog open={isTrackingDialogOpen} onOpenChange={setIsTrackingDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Tracking Information</DialogTitle>
                <DialogDescription>
                  Update tracking details for order item #{orderItem.order_item_id}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="update-tracking-number">Tracking Number *</Label>
                  <Input
                    id="update-tracking-number"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="update-tracking-url">Tracking URL (Optional)</Label>
                  <Input
                    id="update-tracking-url"
                    value={trackingUrl}
                    onChange={(e) => setTrackingUrl(e.target.value)}
                    placeholder="https://tracking.example.com/..."
                  />
                </div>
                {orderItem.tracking_number && (
                  <div className="text-sm text-gray-500">
                    Current: {orderItem.tracking_number}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsTrackingDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateTracking}
                  disabled={isUpdatingTracking || !trackingNumber.trim()}
                >
                  {isUpdatingTracking ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    'Update Tracking'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}

      {/* Status Badge */}
      {fulfillmentStatus && (
        <div className="flex items-center">
          <span className="text-xs text-gray-500 capitalize">{fulfillmentStatus}</span>
        </div>
      )}
    </div>
  );
};

export default OrderActions;

