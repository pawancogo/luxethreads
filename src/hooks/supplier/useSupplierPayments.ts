import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supplierPaymentsAPI } from '@/services/api';
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
      const response = await supplierPaymentsAPI.getSupplierPayments();
      // API interceptor already extracts data, so response is the data directly
      const paymentsData = Array.isArray(response) ? response : [];
      setPayments(paymentsData);
    } catch (err: any) {
      const errorMessage = err?.errors?.[0] || err?.message || 'Failed to load payments';
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
      const response = await supplierPaymentsAPI.getSupplierPayment(paymentId);
      return response as SupplierPayment;
    } catch (err: any) {
      const errorMessage = err?.errors?.[0] || err?.message || 'Failed to load payment details';
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
  }, []);

  return {
    payments,
    isLoading,
    error,
    refetch: loadPayments,
    getPayment,
  };
};

