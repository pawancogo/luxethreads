import { useState } from 'react';
import { adminReportsAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface UseAdminReportsReturn {
  loading: boolean;
  error: Error | null;
  getSalesReport: (startDate?: string, endDate?: string) => Promise<any>;
  getProductsReport: (startDate?: string, endDate?: string) => Promise<any>;
  getUsersReport: (startDate?: string, endDate?: string) => Promise<any>;
  getSuppliersReport: (startDate?: string, endDate?: string) => Promise<any>;
  getRevenueReport: (startDate?: string, endDate?: string) => Promise<any>;
  getReturnsReport: (startDate?: string, endDate?: string) => Promise<any>;
  exportReport: (reportType: string, startDate?: string, endDate?: string) => Promise<void>;
}

export const useAdminReports = (): UseAdminReportsReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const getSalesReport = async (startDate?: string, endDate?: string): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminReportsAPI.getSalesReport({
        start_date: startDate,
        end_date: endDate,
      });
      return response;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch sales report',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getProductsReport = async (startDate?: string, endDate?: string): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminReportsAPI.getProductsReport({
        start_date: startDate,
        end_date: endDate,
      });
      return response;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch products report',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getUsersReport = async (startDate?: string, endDate?: string): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminReportsAPI.getUsersReport({
        start_date: startDate,
        end_date: endDate,
      });
      return response;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch users report',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getSuppliersReport = async (startDate?: string, endDate?: string): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminReportsAPI.getSuppliersReport({
        start_date: startDate,
        end_date: endDate,
      });
      return response;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch suppliers report',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getRevenueReport = async (startDate?: string, endDate?: string): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminReportsAPI.getRevenueReport({
        start_date: startDate,
        end_date: endDate,
      });
      return response;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch revenue report',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getReturnsReport = async (startDate?: string, endDate?: string): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminReportsAPI.getReturnsReport({
        start_date: startDate,
        end_date: endDate,
      });
      return response;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch returns report',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (reportType: string, startDate?: string, endDate?: string): Promise<void> => {
    try {
      await adminReportsAPI.exportReport(reportType, {
        start_date: startDate,
        end_date: endDate,
      });
      toast({
        title: 'Success',
        description: 'Report exported successfully',
      });
    } catch (err) {
      const error = err as Error;
      toast({
        title: 'Error',
        description: error.message || 'Failed to export report',
        variant: 'destructive',
      });
    }
  };

  return {
    loading,
    error,
    getSalesReport,
    getProductsReport,
    getUsersReport,
    getSuppliersReport,
    getRevenueReport,
    getReturnsReport,
    exportReport,
  };
};

