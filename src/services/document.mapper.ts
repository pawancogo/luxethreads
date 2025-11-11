/**
 * Document Mapper - Data Transformation Layer
 * Maps API responses to application models
 * Follows Single Responsibility Principle
 */

export interface KYCDocument {
  id: number;
  filename: string;
  content_type: string;
  byte_size: number;
  url: string;
  created_at: string;
  size: string;
}

/**
 * Document Mapper - Transforms API responses to application models
 */
export class DocumentMapper {
  /**
   * Map API response to KYCDocument array
   */
  mapApiResponseToDocuments(response: any): KYCDocument[] {
    return Array.isArray(response) ? response : [];
  }

  /**
   * Extract error message from error object
   */
  extractErrorMessage(error: any): string {
    return error?.errors?.[0] || error?.message || 'Failed to process document';
  }
}

export const documentMapper = new DocumentMapper();

