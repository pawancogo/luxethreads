/**
 * Document Repository - Data Access Layer
 * Abstracts API calls for document operations
 * Follows Repository Pattern
 */

import { supplierDocumentsService } from './api/supplier-documents.service';

/**
 * Document Repository - Handles data access for document operations
 */
export class DocumentRepository {
  /**
   * Get documents
   */
  async getDocuments(): Promise<any> {
    try {
      return await supplierDocumentsService.getDocuments();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Upload document
   */
  async uploadDocument(file: File, documentType: string = 'kyc'): Promise<any> {
    try {
      return await supplierDocumentsService.uploadDocument(file, documentType);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete document
   */
  async deleteDocument(documentId: number): Promise<void> {
    try {
      await supplierDocumentsService.deleteDocument(documentId);
    } catch (error) {
      throw error;
    }
  }
}

export const documentRepository = new DocumentRepository();

