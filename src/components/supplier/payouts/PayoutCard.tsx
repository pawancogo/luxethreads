import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CurrencyDisplay, DateDisplay } from '@/components/common';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar, DollarSign, FileText, ExternalLink } from 'lucide-react';
import { SupplierPayment } from '../types';

interface PayoutCardProps {
  payment: SupplierPayment;
}

const PayoutCard: React.FC<PayoutCardProps> = ({ payment }) => {
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      completed: 'default',
      processing: 'secondary',
      pending: 'outline',
      failed: 'destructive',
      cancelled: 'destructive',
    };
    return (
      <Badge variant={variants[status] || 'outline'} className="capitalize">
        {status}
      </Badge>
    );
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      bank_transfer: 'Bank Transfer',
      upi: 'UPI',
      neft: 'NEFT',
      rtgs: 'RTGS',
    };
    return labels[method] || method;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">Payment #{payment.payment_id}</CardTitle>
              <div className="text-sm text-gray-500 mt-1">
                <DateDisplay date={payment.period_start_date} format="date" /> - <DateDisplay date={payment.period_end_date} format="date" />
              </div>
            </div>
            {getStatusBadge(payment.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Gross Amount</div>
                <div className="text-xl font-bold">
                  <CurrencyDisplay amount={payment.amount} currency={payment.currency} maximumFractionDigits={2} />
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Net Amount</div>
                <div className="text-xl font-bold text-green-600">
                  <CurrencyDisplay amount={payment.net_amount} currency={payment.currency} maximumFractionDigits={2} />
                </div>
              </div>
            </div>
            {payment.commission_deducted && payment.commission_deducted > 0 && (
              <div className="border-t pt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Commission Deducted</span>
                  <span className="font-medium">
                    <CurrencyDisplay amount={payment.commission_deducted} currency={payment.currency} maximumFractionDigits={2} />
                    {payment.commission_rate && ` (${payment.commission_rate}%)`}
                  </span>
                </div>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t">
              <div className="text-sm">
                <span className="text-gray-500">Method: </span>
                <span className="font-medium">{getPaymentMethodLabel(payment.payment_method)}</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsDetailOpen(true)}>
                <FileText className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Details - {payment.payment_id}</DialogTitle>
            <DialogDescription>
              Complete payment information and transaction details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-500">Status</div>
                <div className="mt-1">{getStatusBadge(payment.status)}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Payment Method</div>
                <div className="mt-1 font-medium">{getPaymentMethodLabel(payment.payment_method)}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Period Start</div>
                <div className="mt-1">
                  <DateDisplay date={payment.period_start_date} format="date" />
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Period End</div>
                <div className="mt-1">
                  <DateDisplay date={payment.period_end_date} format="date" />
                </div>
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Gross Amount</span>
                <span className="font-medium">
                  <CurrencyDisplay amount={payment.amount} currency={payment.currency} maximumFractionDigits={2} />
                </span>
              </div>
              {payment.commission_deducted && payment.commission_deducted > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Commission Deducted</span>
                  <span className="font-medium text-red-600">
                    -<CurrencyDisplay amount={payment.commission_deducted} currency={payment.currency} maximumFractionDigits={2} />
                    {payment.commission_rate && ` (${payment.commission_rate}%)`}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t pt-2 font-bold text-lg">
                <span>Net Amount</span>
                <span className="text-green-600">
                  <CurrencyDisplay amount={payment.net_amount} currency={payment.currency} maximumFractionDigits={2} />
                </span>
              </div>
            </div>

            {payment.bank_account_details && (
              <div className="border-t pt-4">
                <div className="text-sm font-medium text-gray-500 mb-2">Bank Account Details</div>
                <div className="text-sm space-y-1">
                  {payment.bank_account_details.account_holder_name && (
                    <div>
                      <span className="text-gray-500">Account Holder: </span>
                      <span className="font-medium">{payment.bank_account_details.account_holder_name}</span>
                    </div>
                  )}
                  {payment.bank_account_details.bank_account_number && (
                    <div>
                      <span className="text-gray-500">Account Number: </span>
                      <span className="font-medium">
                        ****{String(payment.bank_account_details.bank_account_number).slice(-4)}
                      </span>
                    </div>
                  )}
                  {payment.bank_account_details.ifsc_code && (
                    <div>
                      <span className="text-gray-500">IFSC Code: </span>
                      <span className="font-medium">{payment.bank_account_details.ifsc_code}</span>
                    </div>
                  )}
                  {payment.bank_account_details.bank_branch && (
                    <div>
                      <span className="text-gray-500">Bank Branch: </span>
                      <span className="font-medium">{payment.bank_account_details.bank_branch}</span>
                    </div>
                  )}
                  {payment.bank_account_details.upi_id && (
                    <div>
                      <span className="text-gray-500">UPI ID: </span>
                      <span className="font-medium">{payment.bank_account_details.upi_id}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {payment.notes && (
              <div className="border-t pt-4">
                <div className="text-sm font-medium text-gray-500 mb-2">Notes</div>
                <div className="text-sm">{payment.notes}</div>
              </div>
            )}

            <div className="border-t pt-4 text-xs text-gray-500">
              <div>Created: {new Date(payment.created_at).toLocaleString()}</div>
              {payment.processed_at && (
                <div>Processed: {new Date(payment.processed_at).toLocaleString()}</div>
              )}
              {payment.processed_by && (
                <div>Processed by: {payment.processed_by.name}</div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PayoutCard;

