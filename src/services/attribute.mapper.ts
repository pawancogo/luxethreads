/**
 * Attribute Mapper - Data Transformation Layer
 * Maps API responses to application models
 * Follows Single Responsibility Principle
 */

export interface AttributeType {
  id: number;
  name: string;
  level: 'product' | 'variant';
  values?: Array<{
    id: number;
    value: string;
    hex_code?: string;
  }>;
}

export interface ColorHexMap {
  [colorName: string]: string;
}

/**
 * Attribute Mapper - Transforms API responses to application models
 */
export class AttributeMapper {
  /**
   * Map API response to AttributeType array
   */
  mapApiResponseToAttributeTypes(response: any): AttributeType[] {
    return Array.isArray(response) ? response : [];
  }

  /**
   * Extract color hex map from attribute types
   */
  extractColorHexMap(attributeTypes: AttributeType[]): ColorHexMap {
    const colorType = attributeTypes.find(
      (at) => at.name?.toLowerCase() === 'color'
    );

    if (!colorType?.values || !Array.isArray(colorType.values)) {
      return {};
    }

    const map: ColorHexMap = {};
    colorType.values.forEach((value) => {
      if (value.hex_code && value.value) {
        map[value.value] = value.hex_code;
      }
    });

    return map;
  }

  /**
   * Extract error message from error object
   */
  extractErrorMessage(error: any): string {
    return error?.message || 'Failed to load attributes';
  }
}

export const attributeMapper = new AttributeMapper();

