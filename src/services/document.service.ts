/**
 * Document Service - Business Logic Layer
 * Handles document operations and business rules
 * Follows Single Responsibility Principle
 */

import { DocumentRepository } from './document.repository';
import { DocumentMapper, KYCDocument } from './document.mapper';

/**
 * Document Service - Business logic for document operations
 */
export class DocumentService {
  private repository: DocumentRepository;
  private mapper: DocumentMapper;

  constructor(repository?: DocumentRepository) {
    this.repository = repository || new DocumentRepository();
    this.mapper = new DocumentMapper();
  }

  /**
   * Get documents
   */
  async getDocuments(): Promise<KYCDocument[]> {
    try {
      const response = await this.repository.getDocuments();
      return this.mapper.mapApiResponseToDocuments(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Upload document with validation
   */
  async uploadDocument(file: File, documentType: string = 'kyc'): Promise<void> {
    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a PDF, JPG, or PNG file.');
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB.');
    }

    try {
      await this.repository.uploadDocument(file, documentType);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete document
   */
  async deleteDocument(documentId: number): Promise<void> {
    try {
      await this.repository.deleteDocument(documentId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Extract error message
   */
  extractErrorMessage(error: any): string {
    return this.mapper.extractErrorMessage(error);
  }
}

export const documentService = new DocumentService();

