/**
 * AnalyticsTab Component - Clean Architecture Implementation
 * Uses SupplierAnalyticsService for business logic
 * Follows: UI → Logic (SupplierAnalyticsService) → Data (API Services)
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Calendar, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supplierAnalyticsService } from '@/services/supplier-analytics.service';
import { SupplierAnalytics } from '@/services/supplier-analytics.mapper';
import AnalyticsCards from './analytics/AnalyticsCards';
import SimpleLineChart from './analytics/SimpleLineChart';
import TopProductsTable from './analytics/TopProductsTable';
import SalesStatusChart from './analytics/SalesStatusChart';

const AnalyticsTab: React.FC = () => {
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<SupplierAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const data = await supplierAnalyticsService.getAnalytics({
        start_date: startDate,
        end_date: endDate,
      });
      setAnalytics(data);
    } catch (error: any) {
      const errorMessage = supplierAnalyticsService.extractErrorMessage(error);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const handleDateRangeChange = () => {
    loadAnalytics();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sales Analytics</CardTitle>
          <CardDescription>View your sales performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sales Analytics</CardTitle>
          <CardDescription>View your sales performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No analytics data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Date Range
          </CardTitle>
          <CardDescription>Select a date range to view analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <Button onClick={handleDateRangeChange}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Update
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <AnalyticsCards summary={analytics.summary} />

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <SimpleLineChart
          data={analytics.daily_stats}
          title="Daily Revenue"
          description="Revenue trend over time"
          dataKey="revenue"
        />
        <SimpleLineChart
          data={analytics.daily_stats}
          title="Daily Orders"
          description="Order count trend over time"
          dataKey="orders_count"
        />
      </div>

      {/* Top Products and Sales Status */}
      <div className="grid gap-6 md:grid-cols-2">
        <TopProductsTable topProducts={analytics.top_products} />
        <SalesStatusChart salesByStatus={analytics.sales_by_status} />
      </div>

      {/* Returns Summary */}
      {analytics.returns_summary.total_return_requests > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Returns Summary</CardTitle>
            <CardDescription>Return requests and status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-500">Total Return Requests</div>
                <div className="text-2xl font-bold">{analytics.returns_summary.total_return_requests}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Approved</div>
                <div className="text-2xl font-bold text-green-600">
                  {analytics.returns_summary.approved_returns}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Rejected</div>
                <div className="text-2xl font-bold text-red-600">
                  {analytics.returns_summary.rejected_returns}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Completed</div>
                <div className="text-2xl font-bold">{analytics.returns_summary.completed_returns}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Returned Items</div>
                <div className="text-2xl font-bold">{analytics.returns_summary.total_returned_items}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Returned Value</div>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    minimumFractionDigits: 0,
                  }).format(analytics.returns_summary.total_returned_value)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsTab;
