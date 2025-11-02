import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ShipOrderDialogProps {
  orderItemId: number;
  orderId: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trackingNumber: string;
  onTrackingNumberChange: (value: string) => void;
  onShipOrder: () => void;
}

const ShipOrderDialog: React.FC<ShipOrderDialogProps> = ({
  orderItemId,
  orderId,
  isOpen,
  onOpenChange,
  trackingNumber,
  onTrackingNumberChange,
  onShipOrder,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={() => onOpenChange(true)}>
          Ship
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ship Order Item</DialogTitle>
          <DialogDescription>Mark order item as shipped</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="tracking_number">Tracking Number *</Label>
            <Input
              id="tracking_number"
              value={trackingNumber}
              onChange={(e) => onTrackingNumberChange(e.target.value)}
              placeholder="Enter tracking number"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onShipOrder}>Mark as Shipped</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShipOrderDialog;

