import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { SupplierReturnRequest } from './types';
import ReturnCard from './returns/ReturnCard';

interface ReturnsTabProps {
  returns: SupplierReturnRequest[];
  isLoadingReturns: boolean;
  onApproveReturn: (returnId: number, notes?: string) => Promise<void>;
  onRejectReturn: (returnId: number, rejectionReason: string) => Promise<void>;
}

const ReturnsTab: React.FC<ReturnsTabProps> = ({
  returns,
  isLoadingReturns,
  onApproveReturn,
  onRejectReturn,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Return Requests</CardTitle>
        <CardDescription>Manage return requests for your products</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingReturns ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : returns.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No return requests found.</div>
        ) : (
          <div className="space-y-6">
            {returns.map((returnRequest) => (
              <ReturnCard
                key={returnRequest.id}
                returnRequest={returnRequest}
                onApprove={onApproveReturn}
                onReject={onRejectReturn}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReturnsTab;

