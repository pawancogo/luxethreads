import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, DollarSign, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { SupplierPayment } from './types';
import PayoutCard from './payouts/PayoutCard';
import { CurrencyDisplay } from '@/components/common';

interface PayoutsTabProps {
  payments: SupplierPayment[];
  isLoadingPayments: boolean;
}

const PayoutsTab: React.FC<PayoutsTabProps> = ({ payments, isLoadingPayments }) => {
  const financialSummary = useMemo(() => {
    const completed = payments.filter((p) => p.status === 'completed');
    const pending = payments.filter((p) => p.status === 'pending' || p.status === 'processing');
    const failed = payments.filter((p) => p.status === 'failed');

    const totalPaid = completed.reduce((sum, p) => sum + p.net_amount, 0);
    const totalPending = pending.reduce((sum, p) => sum + p.net_amount, 0);
    const totalCommission = payments.reduce((sum, p) => sum + (p.commission_deducted || 0), 0);
    const totalGross = payments.reduce((sum, p) => sum + p.amount, 0);

    return {
      totalPaid,
      totalPending,
      totalCommission,
      totalGross,
      completedCount: completed.length,
      pendingCount: pending.length,
      failedCount: failed.length,
    };
  }, [payments]);

  if (isLoadingPayments) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payouts & Financial Reports</CardTitle>
          <CardDescription>View your payment history and financial summary</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(financialSummary.totalPaid)}
            </div>
            <p className="text-xs text-muted-foreground">
              {financialSummary.completedCount} completed payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              <CurrencyDisplay amount={financialSummary.totalPending} size="lg" />
            </div>
            <p className="text-xs text-muted-foreground">
              {financialSummary.pendingCount} pending payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              <CurrencyDisplay amount={financialSummary.totalCommission} size="lg" />
            </div>
            <p className="text-xs text-muted-foreground">
              Deducted from {payments.length} payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gross</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <CurrencyDisplay amount={financialSummary.totalGross} size="lg" />
            </div>
            <p className="text-xs text-muted-foreground">
              Before commission deductions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>All your payout transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No payment history available. Payments will appear here once processed.
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <PayoutCard key={payment.id} payment={payment} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PayoutsTab;

