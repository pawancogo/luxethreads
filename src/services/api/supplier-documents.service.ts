/**
 * Supplier Documents API Service
 */

import { api } from './base';

export const supplierDocumentsService = {
  /**
   * List documents
   */
  getDocuments: async () => {
    return api.get('/supplier/documents');
  },

  /**
   * Upload document
   */
  uploadDocument: async (file: File, documentType: string) => {
    const formData = new FormData();
    formData.append('document_type', documentType);
    formData.append('file', file);
    
    return api.post('/supplier/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Delete document
   */
  deleteDocument: async (documentId: number) => {
    return api.delete(`/supplier/documents/${documentId}`);
  },
};

