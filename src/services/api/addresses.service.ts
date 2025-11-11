/**
 * Addresses API Service
 */

import { api } from './base';

export interface AddressData {
  address_type: 'shipping' | 'billing';
  full_name: string;
  phone_number: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  label?: string;
  is_default_shipping?: boolean;
  is_default_billing?: boolean;
  delivery_instructions?: string;
}

export const addressesService = {
  /**
   * Get addresses
   */
  getAddresses: async () => {
    return api.get('/addresses');
  },

  /**
   * Create address
   */
  createAddress: async (addressData: AddressData) => {
    return api.post('/addresses', { address: addressData });
  },

  /**
   * Update address
   */
  updateAddress: async (addressId: number, addressData: Partial<AddressData>) => {
    return api.patch(`/addresses/${addressId}`, { address: addressData });
  },

  /**
   * Delete address
   */
  deleteAddress: async (addressId: number) => {
    return api.delete(`/addresses/${addressId}`);
  },
};

