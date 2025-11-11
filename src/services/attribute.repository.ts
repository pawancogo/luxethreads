/**
 * Attribute Repository - Data Access Layer
 * Abstracts API calls for attribute operations
 * Follows Repository Pattern
 */

import { attributeTypesService } from './api/attribute-types.service';

/**
 * Attribute Repository - Handles data access for attribute operations
 */
export class AttributeRepository {
  /**
   * Get all attribute types
   */
  async getAllAttributeTypes(params?: { level?: 'product' | 'variant'; category_id?: number }): Promise<any> {
    try {
      return await attributeTypesService.getAll(params);
    } catch (error) {
      throw error;
    }
  }
}

export const attributeRepository = new AttributeRepository();

