import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const AccessDenied: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">
            You must be a supplier to access this page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessDenied;

