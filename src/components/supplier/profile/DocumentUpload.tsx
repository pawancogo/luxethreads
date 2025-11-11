/**
 * DocumentUpload Component - Clean Architecture Implementation
 * Uses DocumentService for business logic
 * Follows: UI → Logic (DocumentService) → Data (API Services)
 */

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { documentService } from '@/services/document.service';
import type { KYCDocument } from '@/services/document.mapper';
import { Loader2, Upload, File, X, Download } from 'lucide-react';

export type { KYCDocument };

interface DocumentUploadProps {
  documents: KYCDocument[];
  onDocumentsChange: () => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  documents,
  onDocumentsChange,
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await documentService.uploadDocument(file);
      toast({
        title: 'Success',
        description: 'Document uploaded successfully.',
      });
      onDocumentsChange();
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      const errorMessage = documentService.extractErrorMessage(err);
      toast({
        title: 'Upload failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (documentId: number) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    setIsDeleting(documentId);
    try {
      await documentService.deleteDocument(documentId);
      toast({
        title: 'Success',
        description: 'Document deleted successfully.',
      });
      onDocumentsChange();
    } catch (err: any) {
      const errorMessage = documentService.extractErrorMessage(err);
      toast({
        title: 'Delete failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleDownload = (document: KYCDocument) => {
    window.open(document.url, '_blank');
  };

  const getFileIcon = (contentType: string) => {
    if (contentType === 'application/pdf') {
      return <File className="h-5 w-5 text-red-500" />;
    }
    return <File className="h-5 w-5 text-blue-500" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>KYC Documents</CardTitle>
        <p className="text-sm text-gray-500">
          Upload your business verification documents (GST certificate, PAN card, business registration, etc.)
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Button */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            onClick={handleFileSelect}
            disabled={isUploading}
            variant="outline"
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload Document
              </>
            )}
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            Supported formats: PDF, JPG, PNG (Max 10MB)
          </p>
        </div>

        {/* Documents List */}
        {documents.length > 0 ? (
          <div className="space-y-2">
            <Label>Uploaded Documents</Label>
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3 flex-1">
                  {getFileIcon(doc.content_type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.filename}</p>
                    <p className="text-xs text-gray-500">{doc.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(doc)}
                    title="View/Download"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(doc.id)}
                    disabled={isDeleting === doc.id}
                    title="Delete"
                  >
                    {isDeleting === doc.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <File className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No documents uploaded yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;

