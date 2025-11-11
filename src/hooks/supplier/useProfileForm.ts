import { useState, useEffect } from 'react';
import { useForm } from '@/hooks/useForm';
import { useSupplier } from '@/stores/supplierStore';

interface UseProfileFormReturn {
  isEditing: boolean;
  profileForm: {
    company_name: string;
    gst_number: string;
    description: string;
    website_url: string;
  };
  startEditing: () => void;
  cancelEditing: () => void;
  updateFormField: (field: string, value: string) => void;
  saveProfile: () => Promise<void>;
}

export const useProfileForm = (): UseProfileFormReturn => {
  const { profile, updateProfile } = useSupplier();
  const [isEditing, setIsEditing] = useState(false);
  
  const profileForm = useForm({
    company_name: profile?.company_name || '',
    gst_number: profile?.gst_number || '',
    description: profile?.description || '',
    website_url: profile?.website_url || '',
  });

  // Update form when profile changes
  useEffect(() => {
    if (profile && !isEditing) {
      profileForm.setValue('company_name', profile.company_name || '');
      profileForm.setValue('gst_number', profile.gst_number || '');
      profileForm.setValue('description', profile.description || '');
      profileForm.setValue('website_url', profile.website_url || '');
    }
  }, [profile, isEditing]);

  const startEditing = () => {
    setIsEditing(true);
  };

  const cancelEditing = () => {
    // Reset to profile values
    if (profile) {
      profileForm.setValue('company_name', profile.company_name || '');
      profileForm.setValue('gst_number', profile.gst_number || '');
      profileForm.setValue('description', profile.description || '');
      profileForm.setValue('website_url', profile.website_url || '');
    }
    setIsEditing(false);
  };

  const updateFormField = (field: string, value: string) => {
    const validFields = ['company_name', 'gst_number', 'description', 'website_url'] as const;
    if (validFields.includes(field as any)) {
      profileForm.setValue(field as typeof validFields[number], value);
    }
  };

  const saveProfile = async () => {
    await updateProfile({
      company_name: profileForm.values.company_name,
      gst_number: profileForm.values.gst_number,
      description: profileForm.values.description,
      website_url: profileForm.values.website_url,
    });
    setIsEditing(false);
  };

  return {
    isEditing,
    profileForm: profileForm.values,
    startEditing,
    cancelEditing,
    updateFormField,
    saveProfile,
  };
};


