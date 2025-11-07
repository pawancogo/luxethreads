import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supplierReturnsAPI } from '@/services/api';
import { SupplierReturnRequest } from '@/components/supplier/types';

interface UseSupplierReturnsReturn {
  returns: SupplierReturnRequest[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  approveReturn: (returnId: number, notes?: string) => Promise<void>;
  rejectReturn: (returnId: number, rejectionReason: string) => Promise<void>;
}

export const useSupplierReturns = (): UseSupplierReturnsReturn => {
  const { toast } = useToast();
  const [returns, setReturns] = useState<SupplierReturnRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReturns = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await supplierReturnsAPI.getSupplierReturns();
      // API interceptor already extracts data, so response is the data directly
      const returnsData = Array.isArray(response) ? response : [];
      setReturns(returnsData);
    } catch (err: any) {
      const errorMessage = err?.errors?.[0] || err?.message || 'Failed to load returns';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const approveReturn = async (returnId: number, notes?: string): Promise<void> => {
    try {
      await supplierReturnsAPI.approveReturn(returnId, notes);
      toast({
        title: 'Success',
        description: 'Return request approved successfully',
      });
      await loadReturns();
    } catch (err: any) {
      const errorMessage = err?.errors?.[0] || err?.message || 'Failed to approve return';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const rejectReturn = async (returnId: number, rejectionReason: string): Promise<void> => {
    try {
      await supplierReturnsAPI.rejectReturn(returnId, rejectionReason);
      toast({
        title: 'Success',
        description: 'Return request rejected successfully',
      });
      await loadReturns();
    } catch (err: any) {
      const errorMessage = err?.errors?.[0] || err?.message || 'Failed to reject return';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  useEffect(() => {
    loadReturns();
  }, []);

  return {
    returns,
    isLoading,
    error,
    refetch: loadReturns,
    approveReturn,
    rejectReturn,
  };
};

