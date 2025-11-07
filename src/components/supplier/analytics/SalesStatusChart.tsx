import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SupplierAnalytics } from '../types';

interface SalesStatusChartProps {
  salesByStatus: SupplierAnalytics['sales_by_status'];
}

const SalesStatusChart: React.FC<SalesStatusChartProps> = ({ salesByStatus }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const statusColors: Record<string, string> = {
    delivered: '#10b981',
    shipped: '#3b82f6',
    packed: '#f59e0b',
    processing: '#8b5cf6',
    pending: '#6b7280',
    cancelled: '#ef4444',
    returned: '#f97316',
    refunded: '#ec4899',
  };

  const totalRevenue = salesByStatus.reduce((sum, s) => sum + s.total_revenue, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales by Status</CardTitle>
        <CardDescription>Revenue breakdown by fulfillment status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {salesByStatus
            .filter((s) => s.total_revenue > 0)
            .sort((a, b) => b.total_revenue - a.total_revenue)
            .map((status) => {
              const percentage = totalRevenue > 0 ? (status.total_revenue / totalRevenue) * 100 : 0;
              return (
                <div key={status.status} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize font-medium">{status.status}</span>
                    <span className="text-gray-600">
                      {formatCurrency(status.total_revenue)} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: statusColors[status.status] || '#6b7280',
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    {status.item_count} items • {status.total_quantity} total quantity
                  </div>
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesStatusChart;

