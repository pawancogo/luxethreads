import React, { useState, useEffect } from 'react';
import { useAdminReports } from '@/hooks/admin/useAdminReports';
import ReportsCards from '@/components/admin/reports/ReportsCards';
import SimpleLineChart from '@/components/supplier/analytics/SimpleLineChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Calendar, BarChart3 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

const Reports: React.FC = () => {
  const { loading, getSalesReport, getProductsReport, getUsersReport, getRevenueReport, exportReport } = useAdminReports();
  
  const [activeTab, setActiveTab] = useState('sales');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [salesData, setSalesData] = useState<any>(null);
  const [productsData, setProductsData] = useState<any>(null);
  const [usersData, setUsersData] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any>(null);

  useEffect(() => {
    // Set default date range (last 30 days)
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      loadReports();
    }
  }, [startDate, endDate, activeTab]);

  const loadReports = async () => {
    if (!startDate || !endDate) return;

    switch (activeTab) {
      case 'sales':
        const sales = await getSalesReport(startDate, endDate);
        setSalesData(sales);
        break;
      case 'products':
        const products = await getProductsReport(startDate, endDate);
        setProductsData(products);
        break;
      case 'users':
        const users = await getUsersReport(startDate, endDate);
        setUsersData(users);
        break;
      case 'revenue':
        const revenue = await getRevenueReport(startDate, endDate);
        setRevenueData(revenue);
        break;
    }
  };

  const handleExport = async () => {
    await exportReport(activeTab, startDate, endDate);
  };

  const handleQuickDateRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
          <p className="text-gray-600">View platform-wide analytics and reports</p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Date Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex items-end gap-2">
              <Button variant="outline" size="sm" onClick={() => handleQuickDateRange(7)}>
                7 Days
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleQuickDateRange(30)}>
                30 Days
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleQuickDateRange(90)}>
                90 Days
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          {loading ? (
            <div className="text-center p-8">Loading sales report...</div>
          ) : salesData ? (
            <>
              <ReportsCards summary={salesData.summary} type="sales" />
              {salesData.daily_stats && salesData.daily_stats.length > 0 && (
                <SimpleLineChart
                  data={salesData.daily_stats}
                  title="Daily Sales Trend"
                  description="Revenue and orders over time"
                  dataKey="revenue"
                />
              )}
              {salesData.daily_stats && salesData.daily_stats.length > 0 && (
                <SimpleLineChart
                  data={salesData.daily_stats}
                  title="Daily Orders Trend"
                  description="Number of orders over time"
                  dataKey="orders_count"
                />
              )}
            </>
          ) : (
            <Card className="text-center p-8">
              <p className="text-gray-500">No sales data available</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          {loading ? (
            <div className="text-center p-8">Loading products report...</div>
          ) : productsData ? (
            <>
              <ReportsCards summary={productsData.summary} type="products" />
              <Card>
                <CardHeader>
                  <CardTitle>Products by Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {productsData.products_by_status?.map((item: any) => (
                      <div key={item.status} className="flex justify-between items-center">
                        <span className="capitalize">{item.status}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.count}</span>
                          <span className="text-sm text-gray-500">({item.percentage}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="text-center p-8">
              <p className="text-gray-500">No products data available</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          {loading ? (
            <div className="text-center p-8">Loading users report...</div>
          ) : usersData ? (
            <>
              <ReportsCards summary={usersData.summary} type="users" />
              {usersData.new_users_daily && usersData.new_users_daily.length > 0 && (
                <SimpleLineChart
                  data={usersData.new_users_daily.map((item: any) => ({
                    date: item.date,
                    orders_count: item.count,
                    revenue: 0,
                    items_sold: 0,
                  }))}
                  title="New Users Daily"
                  description="New user registrations over time"
                  dataKey="orders_count"
                />
              )}
            </>
          ) : (
            <Card className="text-center p-8">
              <p className="text-gray-500">No users data available</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          {loading ? (
            <div className="text-center p-8">Loading revenue report...</div>
          ) : revenueData ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold">
                        ₹{revenueData.summary?.total_revenue?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold">{revenueData.summary?.total_orders || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Average Order Value</p>
                      <p className="text-2xl font-bold">
                        ₹{revenueData.summary?.average_order_value?.toLocaleString() || '0'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {revenueData.daily_revenue && revenueData.daily_revenue.length > 0 && (
                <SimpleLineChart
                  data={revenueData.daily_revenue.map((item: any) => ({
                    date: item.date,
                    orders_count: item.orders_count || 0,
                    revenue: item.revenue || 0,
                    items_sold: 0,
                  }))}
                  title="Daily Revenue Trend"
                  description="Revenue over time"
                  dataKey="revenue"
                />
              )}
            </>
          ) : (
            <Card className="text-center p-8">
              <p className="text-gray-500">No revenue data available</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;

