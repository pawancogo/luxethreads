import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supplierProfileAPI } from '@/services/api';
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
      const response = await supplierProfileAPI.getProfile();
      // Handle both direct object and axios response structure
      const profileData = response?.data?.data || response?.data || response;
      setProfile(profileData as unknown as SupplierProfile);
    } catch (err: any) {
      // Profile might not exist yet, that's okay
      if (err?.status !== 404) {
        const errorMessage = err?.errors?.[0] || err?.message || 'Failed to load profile';
        setError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
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
      await supplierProfileAPI.updateProfile(data);
      toast({
        title: 'Success',
        description: 'Supplier profile updated successfully',
      });
      await loadProfile();
    } catch (err: any) {
      const errorMessage = err?.errors?.[0] || err?.message || 'Failed to update profile';
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
      await supplierProfileAPI.createProfile(data);
      toast({
        title: 'Success',
        description: 'Supplier profile created successfully',
      });
      await loadProfile();
    } catch (err: any) {
      const errorMessage = err?.errors?.[0] || err?.message || 'Failed to create profile';
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

