import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Package, DollarSign, ShoppingCart, RotateCcw } from 'lucide-react';
import { SupplierAnalytics } from '../types';

interface AnalyticsCardsProps {
  summary: SupplierAnalytics['summary'];
}

const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({ summary }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.total_revenue)}</div>
          <p className="text-xs text-muted-foreground">
            {summary.delivered_orders} delivered orders
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.total_orders}</div>
          <p className="text-xs text-muted-foreground">
            Avg: {formatCurrency(summary.average_order_value)} per order
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.total_items_sold}</div>
          <p className="text-xs text-muted-foreground">
            {summary.total_items_returned > 0 && (
              <span className="text-red-600">
                {summary.total_items_returned} returned ({summary.return_rate.toFixed(1)}%)
              </span>
            )}
            {summary.total_items_returned === 0 && 'No returns'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Order Status</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.delivered_orders}</div>
          <p className="text-xs text-muted-foreground">
            {summary.shipped_orders} shipped, {summary.pending_orders} pending
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsCards;

