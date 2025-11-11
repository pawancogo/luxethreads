/**
 * Address Service - Business Logic Layer
 * Handles address operations and business rules
 * Follows Single Responsibility Principle
 */

import { AddressRepository } from './address.repository';
import { AddressMapper, Address } from './address.mapper';
import { AddressData } from './api/addresses.service';

/**
 * Address Service - Business logic for address operations
 */
export class AddressService {
  private repository: AddressRepository;
  private mapper: AddressMapper;

  constructor(repository?: AddressRepository) {
    this.repository = repository || new AddressRepository();
    this.mapper = new AddressMapper();
  }

  /**
   * Get user addresses
   */
  async getAddresses(): Promise<Address[]> {
    try {
      const response = await this.repository.getAddresses();
      return this.mapper.mapApiResponseToAddresses(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create address
   */
  async createAddress(addressData: Partial<Address>): Promise<Address> {
    try {
      const data = this.mapper.mapFormDataToAddressData(addressData);
      const response = await this.repository.createAddress(data);
      return response as Address;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update address
   */
  async updateAddress(addressId: number, addressData: Partial<Address>): Promise<Address> {
    try {
      const data = this.mapper.mapFormDataToAddressData(addressData);
      const response = await this.repository.updateAddress(addressId, data);
      return response as Address;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete address
   */
  async deleteAddress(addressId: number): Promise<void> {
    try {
      await this.repository.deleteAddress(addressId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find default shipping address
   */
  findDefaultShippingAddress(addresses: Address[]): Address | undefined {
    return addresses.find(a => a.is_default_shipping);
  }

  /**
   * Find default billing address
   */
  findDefaultBillingAddress(addresses: Address[]): Address | undefined {
    return addresses.find(a => a.is_default_billing);
  }

  /**
   * Extract error message
   */
  extractErrorMessage(error: any): string {
    return this.mapper.extractErrorMessage(error);
  }
}

export const addressService = new AddressService();

