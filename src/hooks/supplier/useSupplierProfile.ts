/**
 * useSupplierProfile Hook - Clean Architecture Implementation
 * Uses SupplierService for business logic
 * Follows: UI → Logic (SupplierService) → Data (API Services)
 */

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supplierService } from '@/services/supplier.service';
import { SupplierProfile } from '@/components/supplier/types';

interface UseSupplierProfileReturn {
  profile: SupplierProfile | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateProfile: (data: {
    company_name: string;
    gst_number: string;
    description: string;
    website_url: string;
  }) => Promise<void>;
  createProfile: (data: {
    company_name: string;
    gst_number: string;
    description: string;
    website_url: string;
  }) => Promise<void>;
}

export const useSupplierProfile = (): UseSupplierProfileReturn => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<SupplierProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const profileData = await supplierService.getProfile();
      setProfile(profileData);
    } catch (err: any) {
      const errorMessage = supplierService.extractErrorMessage(err);
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: {
    company_name: string;
    gst_number: string;
    description: string;
    website_url: string;
  }): Promise<void> => {
    try {
      await supplierService.updateProfile(data);
      toast({
        title: 'Success',
        description: 'Supplier profile updated successfully',
      });
      await loadProfile();
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

  const createProfile = async (data: {
    company_name: string;
    gst_number: string;
    description: string;
    website_url: string;
  }): Promise<void> => {
    try {
      await supplierService.createProfile(data);
      toast({
        title: 'Success',
        description: 'Supplier profile created successfully',
      });
      await loadProfile();
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
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    profile,
    isLoading,
    error,
    refetch: loadProfile,
    updateProfile,
    createProfile,
  };
};

