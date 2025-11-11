/**
 * Attribute Service - Business Logic Layer
 * Handles attribute operations and business rules
 * Follows Single Responsibility Principle
 */

import { AttributeRepository } from './attribute.repository';
import { AttributeMapper, AttributeType, ColorHexMap } from './attribute.mapper';

/**
 * Attribute Service - Business logic for attribute operations
 */
export class AttributeService {
  private repository: AttributeRepository;
  private mapper: AttributeMapper;
  private colorHexMapCache: ColorHexMap | null = null;

  constructor(repository?: AttributeRepository) {
    this.repository = repository || new AttributeRepository();
    this.mapper = new AttributeMapper();
  }

  /**
   * Get all attribute types
   */
  async getAllAttributeTypes(params?: { level?: 'product' | 'variant'; category_id?: number }): Promise<AttributeType[]> {
    try {
      const response = await this.repository.getAllAttributeTypes(params);
      return this.mapper.mapApiResponseToAttributeTypes(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get color hex map (with caching)
   */
  async getColorHexMap(): Promise<ColorHexMap> {
    // Return cached map if available
    if (this.colorHexMapCache !== null) {
      return this.colorHexMapCache;
    }

    try {
      const attributeTypes = await this.getAllAttributeTypes();
      const colorMap = this.mapper.extractColorHexMap(attributeTypes);
      this.colorHexMapCache = colorMap;
      return colorMap;
    } catch (error) {
      // Return empty map on error
      return {};
    }
  }

  /**
   * Get color hex code for a color name
   */
  async getColorHex(colorName: string): Promise<string | null> {
    const colorMap = await this.getColorHexMap();
    return colorMap[colorName] || null;
  }

  /**
   * Clear color hex map cache
   */
  clearColorHexMapCache(): void {
    this.colorHexMapCache = null;
  }

  /**
   * Extract error message
   */
  extractErrorMessage(error: any): string {
    return this.mapper.extractErrorMessage(error);
  }
}

export const attributeService = new AttributeService();

