import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

const AnalyticsTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Analytics</CardTitle>
        <CardDescription>View your sales performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">Analytics dashboard coming soon</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsTab;

