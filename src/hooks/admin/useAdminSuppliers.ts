import { useState, useEffect } from 'react';
import { adminSuppliersAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface Supplier {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone_number?: string;
  company_name?: string;
  verified: boolean;
  is_active: boolean;
  created_at: string;
}

interface UseAdminSuppliersReturn {
  suppliers: Supplier[];
  loading: boolean;
  error: Error | null;
  totalPages: number;
  currentPage: number;
  fetchSuppliers: (params?: {
    page?: number;
    per_page?: number;
    email?: string;
    search?: string;
    verified?: boolean;
    active?: boolean;
  }) => Promise<void>;
  activateSupplier: (supplierId: number) => Promise<boolean>;
  deactivateSupplier: (supplierId: number) => Promise<boolean>;
  suspendSupplier: (supplierId: number, reason?: string) => Promise<boolean>;
  deleteSupplier: (supplierId: number) => Promise<boolean>;
  updateSupplier: (supplierId: number, supplierData: Partial<Supplier>) => Promise<boolean>;
}

export const useAdminSuppliers = (): UseAdminSuppliersReturn => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const fetchSuppliers = async (params?: {
    page?: number;
    per_page?: number;
    email?: string;
    search?: string;
    verified?: boolean;
    active?: boolean;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminSuppliersAPI.getSuppliers(params);
      setSuppliers(response || []);
      if (params?.page) {
        setCurrentPage(params.page);
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch suppliers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const activateSupplier = async (supplierId: number): Promise<boolean> => {
    try {
      await adminSuppliersAPI.activateSupplier(supplierId);
      await fetchSuppliers({ page: currentPage });
      toast({
        title: 'Success',
        description: 'Supplier activated successfully',
      });
      return true;
    } catch (err) {
      const error = err as Error;
      toast({
        title: 'Error',
        description: error.message || 'Failed to activate supplier',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deactivateSupplier = async (supplierId: number): Promise<boolean> => {
    try {
      await adminSuppliersAPI.deactivateSupplier(supplierId);
      await fetchSuppliers({ page: currentPage });
      toast({
        title: 'Success',
        description: 'Supplier deactivated successfully',
      });
      return true;
    } catch (err) {
      const error = err as Error;
      toast({
        title: 'Error',
        description: error.message || 'Failed to deactivate supplier',
        variant: 'destructive',
      });
      return false;
    }
  };

  const suspendSupplier = async (supplierId: number, reason?: string): Promise<boolean> => {
    try {
      await adminSuppliersAPI.suspendSupplier(supplierId, reason);
      await fetchSuppliers({ page: currentPage });
      toast({
        title: 'Success',
        description: 'Supplier suspended successfully',
      });
      return true;
    } catch (err) {
      const error = err as Error;
      toast({
        title: 'Error',
        description: error.message || 'Failed to suspend supplier',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteSupplier = async (supplierId: number): Promise<boolean> => {
    try {
      await adminSuppliersAPI.deleteSupplier(supplierId);
      await fetchSuppliers({ page: currentPage });
      toast({
        title: 'Success',
        description: 'Supplier deleted successfully',
      });
      return true;
    } catch (err) {
      const error = err as Error;
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete supplier',
        variant: 'destructive',
      });
      return false;
    }
  };

  const updateSupplier = async (supplierId: number, supplierData: Partial<Supplier>): Promise<boolean> => {
    try {
      await adminSuppliersAPI.updateSupplier(supplierId, {
        first_name: supplierData.first_name,
        last_name: supplierData.last_name,
        phone_number: supplierData.phone_number,
        email: supplierData.email,
        supplier_profile: {
          company_name: supplierData.company_name,
        },
      });
      await fetchSuppliers({ page: currentPage });
      toast({
        title: 'Success',
        description: 'Supplier updated successfully',
      });
      return true;
    } catch (err) {
      const error = err as Error;
      toast({
        title: 'Error',
        description: error.message || 'Failed to update supplier',
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return {
    suppliers,
    loading,
    error,
    totalPages,
    currentPage,
    fetchSuppliers,
    activateSupplier,
    deactivateSupplier,
    suspendSupplier,
    deleteSupplier,
    updateSupplier,
  };
};

