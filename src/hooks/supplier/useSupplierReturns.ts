/**
 * useSupplierReturns Hook - Clean Architecture Implementation
 * Uses SupplierService for business logic
 * Follows: UI → Logic (SupplierService) → Data (API Services)
 */

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supplierService } from '@/services/supplier.service';
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
      const returnsList = await supplierService.getReturns();
      setReturns(returnsList);
    } catch (err: any) {
      const errorMessage = supplierService.extractErrorMessage(err);
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
      await supplierService.approveReturn(returnId, notes);
      toast({
        title: 'Success',
        description: 'Return request approved successfully',
      });
      await loadReturns();
    } catch (err: any) {
      const errorMessage = supplierService.extractErrorMessage(err);
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
      await supplierService.rejectReturn(returnId, rejectionReason);
      toast({
        title: 'Success',
        description: 'Return request rejected successfully',
      });
      await loadReturns();
    } catch (err: any) {
      const errorMessage = supplierService.extractErrorMessage(err);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

