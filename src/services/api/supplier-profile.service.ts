/**
 * Supplier Profile API Service
 */

import { api } from './base';

export interface SupplierProfileData {
  company_name: string;
  gst_number: string;
  description?: string;
  website_url?: string;
  contact_email?: string;
  contact_phone?: string;
  support_email?: string;
  support_phone?: string;
  business_type?: string;
  business_category?: string;
  company_registration_number?: string;
  pan_number?: string;
  cin_number?: string;
}

export const supplierProfileService = {
  /**
   * Get supplier profile
   */
  getProfile: async () => {
    return api.get('/supplier_profile');
  },

  /**
   * Create supplier profile
   */
  createProfile: async (profileData: SupplierProfileData) => {
    return api.post('/supplier_profile', { supplier_profile: profileData });
  },

  /**
   * Update supplier profile
   */
  updateProfile: async (profileData: Partial<SupplierProfileData>) => {
    return api.patch('/supplier_profile', { supplier_profile: profileData });
  },
};

