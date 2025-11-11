/**
 * useSupplierPayments Hook - Clean Architecture Implementation
 * Uses SupplierService for business logic
 * Follows: UI → Logic (SupplierService) → Data (API Services)
 */

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supplierService } from '@/services/supplier.service';
import { SupplierPayment } from '@/components/supplier/types';

interface UseSupplierPaymentsReturn {
  payments: SupplierPayment[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getPayment: (paymentId: number) => Promise<SupplierPayment | null>;
}

export const useSupplierPayments = (): UseSupplierPaymentsReturn => {
  const { toast } = useToast();
  const [payments, setPayments] = useState<SupplierPayment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPayments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const paymentsList = await supplierService.getPayments();
      setPayments(paymentsList);
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

  const getPayment = async (paymentId: number): Promise<SupplierPayment | null> => {
    try {
      return await supplierService.getPayment(paymentId);
    } catch (err: any) {
      const errorMessage = supplierService.extractErrorMessage(err);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    }
  };

  useEffect(() => {
    loadPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    payments,
    isLoading,
    error,
    refetch: loadPayments,
    getPayment,
  };
};

