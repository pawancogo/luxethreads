/**
 * Address Repository - Data Access Layer
 * Abstracts API calls for address operations
 * Follows Repository Pattern
 */

import { addressesService, AddressData } from './api/addresses.service';

/**
 * Address Repository - Handles data access for address operations
 */
export class AddressRepository {
  /**
   * Get addresses
   */
  async getAddresses(): Promise<any> {
    try {
      return await addressesService.getAddresses();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create address
   */
  async createAddress(addressData: AddressData): Promise<any> {
    try {
      return await addressesService.createAddress(addressData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update address
   */
  async updateAddress(addressId: number, addressData: Partial<AddressData>): Promise<any> {
    try {
      return await addressesService.updateAddress(addressId, addressData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete address
   */
  async deleteAddress(addressId: number): Promise<void> {
    try {
      await addressesService.deleteAddress(addressId);
    } catch (error) {
      throw error;
    }
  }
}

export const addressRepository = new AddressRepository();

