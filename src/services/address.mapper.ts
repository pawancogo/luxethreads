/**
 * Address Mapper - Data Transformation Layer
 * Maps API responses to application models
 * Follows Single Responsibility Principle
 */

import { AddressData } from './api/addresses.service';

export interface Address {
  id: number;
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

/**
 * Address Mapper - Transforms API responses to application models
 */
export class AddressMapper {
  /**
   * Map API response to Address array
   */
  mapApiResponseToAddresses(response: any): Address[] {
    return Array.isArray(response) ? response : [];
  }

  /**
   * Map form data to AddressData
   */
  mapFormDataToAddressData(formData: Partial<Address>): AddressData {
    return {
      address_type: formData.address_type || 'shipping',
      full_name: formData.full_name || '',
      phone_number: formData.phone_number || '',
      line1: formData.line1 || '',
      line2: formData.line2,
      city: formData.city || '',
      state: formData.state || '',
      postal_code: formData.postal_code || '',
      country: formData.country || 'India',
      label: formData.label,
      is_default_shipping: formData.is_default_shipping,
      is_default_billing: formData.is_default_billing,
      delivery_instructions: formData.delivery_instructions,
    };
  }

  /**
   * Extract error message from error object
   */
  extractErrorMessage(error: any): string {
    return error?.message || 'Failed to load addresses';
  }
}

export const addressMapper = new AddressMapper();

