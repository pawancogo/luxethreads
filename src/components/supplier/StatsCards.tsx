import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Package, ShoppingCart, DollarSign } from 'lucide-react';
import { SupplierProduct, SupplierOrder } from './types';

interface StatsCardsProps {
  products: SupplierProduct[];
  orders: SupplierOrder[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ products, orders }) => {
  const stats = [
    {
      title: 'My Products',
      value: products.length.toString(),
      icon: Package,
      change: `${products.filter(p => p.status === 'active').length} active`,
    },
    {
      title: 'Total Orders',
      value: orders.reduce((sum, order) => sum + order.items.length, 0).toString(),
      icon: ShoppingCart,
      change: `${orders.length} orders`,
    },
    {
      title: 'Revenue',
      value: `$${orders.reduce((sum, order) => sum + order.total_amount, 0).toFixed(2)}`,
      icon: DollarSign,
      change: 'Total revenue',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <IconComponent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;

