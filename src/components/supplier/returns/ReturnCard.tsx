import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CheckCircle, XCircle, ChevronDown, Clock } from 'lucide-react';
import { SupplierReturnRequest } from '../types';
import { Loader2 } from 'lucide-react';

interface ReturnCardProps {
  returnRequest: SupplierReturnRequest;
  onApprove: (returnId: number, notes?: string) => Promise<void>;
  onReject: (returnId: number, rejectionReason: string) => Promise<void>;
}

const ReturnCard: React.FC<ReturnCardProps> = ({
  returnRequest,
  onApprove,
  onReject,
}) => {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
  const [isStatusHistoryOpen, setIsStatusHistoryOpen] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      requested: 'outline',
      approved: 'default',
      rejected: 'destructive',
      shipped: 'secondary',
      received: 'secondary',
      completed: 'default',
      cancelled: 'destructive',
    };
    return (
      <Badge variant={variants[status] || 'outline'} className="capitalize">
        {status}
      </Badge>
    );
  };

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await onApprove(returnRequest.id, approvalNotes || undefined);
      setIsApprovalDialogOpen(false);
      setApprovalNotes('');
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      return;
    }
    setIsRejecting(true);
    try {
      await onReject(returnRequest.id, rejectionReason.trim());
      setIsRejectionDialogOpen(false);
      setRejectionReason('');
    } finally {
      setIsRejecting(false);
    }
  };

  const canApprove = returnRequest.status === 'requested';
  const canReject = returnRequest.status === 'requested';

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Return #{returnRequest.return_id}</CardTitle>
            <CardDescription>
              Order #{returnRequest.order_number} • {formatDate(returnRequest.created_at)}
            </CardDescription>
            <div className="mt-2 text-sm">
              <span className="text-gray-500">Customer: </span>
              <span className="font-medium">{returnRequest.customer_name}</span>
              <span className="text-gray-400 mx-2">•</span>
              <span className="text-gray-500">{returnRequest.customer_email}</span>
            </div>
          </div>
          <div className="text-right">
            {getStatusBadge(returnRequest.status)}
            <div className="text-xs text-gray-500 mt-1 capitalize">
              {returnRequest.resolution_type}
            </div>
          </div>
        </div>
        {returnRequest.status_history && returnRequest.status_history.length > 0 && (
          <Collapsible open={isStatusHistoryOpen} onOpenChange={setIsStatusHistoryOpen}>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mt-2">
              <Clock className="h-4 w-4" />
              <span>Status History</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isStatusHistoryOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="space-y-1 text-sm">
                {returnRequest.status_history.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-600">
                    <span className="font-medium capitalize">{entry.status}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-xs">{formatDate(entry.timestamp)}</span>
                    {entry.notes && <span className="text-gray-500">- {entry.notes}</span>}
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Return Items */}
          {returnRequest.items && returnRequest.items.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Return Items ({returnRequest.items.length})</h4>
              <div className="space-y-2">
                {returnRequest.items.map((item) => (
                  <div key={item.return_item_id} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{item.product_name}</div>
                        <div className="text-sm text-gray-500">
                          SKU: {item.sku} • Qty: {item.quantity}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          <strong>Reason:</strong> {item.reason}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Amount: ${item.subtotal.toFixed(2)}
                        </div>
                      </div>
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.product_name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          {(canApprove || canReject) && (
            <div className="flex gap-2 pt-2 border-t">
              {canApprove && (
                <>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => setIsApprovalDialogOpen(true)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Approve Return Request</DialogTitle>
                        <DialogDescription>
                          Approve return request #{returnRequest.return_id}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label htmlFor="approval-notes">Notes (Optional)</Label>
                          <Textarea
                            id="approval-notes"
                            value={approvalNotes}
                            onChange={(e) => setApprovalNotes(e.target.value)}
                            placeholder="Add any notes about this approval..."
                            rows={3}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsApprovalDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleApprove} disabled={isApproving}>
                          {isApproving ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Approving...
                            </>
                          ) : (
                            'Approve Return'
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              )}
              {canReject && (
                <>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setIsRejectionDialogOpen(true)}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Dialog open={isRejectionDialogOpen} onOpenChange={setIsRejectionDialogOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reject Return Request</DialogTitle>
                        <DialogDescription>
                          Reject return request #{returnRequest.return_id}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label htmlFor="rejection-reason">Rejection Reason *</Label>
                          <Textarea
                            id="rejection-reason"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Please provide a reason for rejecting this return request..."
                            rows={4}
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRejectionDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handleReject}
                          disabled={isRejecting || !rejectionReason.trim()}
                          variant="destructive"
                        >
                          {isRejecting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Rejecting...
                            </>
                          ) : (
                            'Reject Return'
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </div>
          )}

          {/* Additional Info */}
          <div className="text-xs text-gray-500 space-y-1 pt-2 border-t">
            {returnRequest.refund_amount && (
              <div>
                <strong>Refund Amount:</strong> ${returnRequest.refund_amount.toFixed(2)}
              </div>
            )}
            {returnRequest.pickup_scheduled_at && (
              <div>
                <strong>Pickup Scheduled:</strong> {formatDate(returnRequest.pickup_scheduled_at)}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReturnCard;

