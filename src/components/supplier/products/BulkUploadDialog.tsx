import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, Download, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { productsAPI } from '@/services/api';

interface BulkUploadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete: () => void;
}

const BulkUploadDialog: React.FC<BulkUploadDialogProps> = ({
  isOpen,
  onOpenChange,
  onUploadComplete,
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    total: number;
    successful: number;
    failed: number;
    products: Array<{ row: number; product_id: number; name: string; sku: string }>;
    errors: Array<{ row: number; errors: string[]; data: any }>;
  } | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast({
        title: 'Invalid File',
        description: 'Please select a CSV file',
        variant: 'destructive',
      });
      return;
    }

    setSelectedFile(file);
    setUploadResult(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: 'No File Selected',
        description: 'Please select a CSV file to upload',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('csv_file', selectedFile);

      const response = await productsAPI.bulkUpload(formData);
      
      setUploadResult(response);
      
      if (response.failed === 0) {
        toast({
          title: 'Success',
          description: `Successfully imported ${response.successful} products`,
        });
        onUploadComplete();
        setTimeout(() => {
          onOpenChange(false);
          resetDialog();
        }, 2000);
      } else {
        toast({
          title: 'Upload Completed with Errors',
          description: `${response.successful} succeeded, ${response.failed} failed`,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      const errorMessage = error?.errors?.[0] || error?.message || 'Failed to upload products';
      toast({
        title: 'Upload Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await productsAPI.downloadTemplate();
      const blob = new Blob([response], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'products_import_template.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: 'Template Downloaded',
        description: 'CSV template downloaded successfully',
      });
    } catch (error: any) {
      const errorMessage = error?.errors?.[0] || error?.message || 'Failed to download template';
      toast({
        title: 'Download Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const resetDialog = () => {
    setSelectedFile(null);
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = (open: boolean) => {
    if (!open && !isUploading) {
      resetDialog();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Upload Products</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import multiple products at once. Download the template to see the
            required format.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Download Template */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-500" />
              <div>
                <div className="font-medium">CSV Template</div>
                <div className="text-sm text-gray-500">
                  Download template with example format and required fields
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>

          {/* File Upload */}
          <div>
            <Label htmlFor="csv-file">Select CSV File</Label>
            <div className="mt-2">
              <Input
                id="csv-file"
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
            </div>
            {selectedFile && (
              <div className="mt-2 text-sm text-gray-600">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
              </div>
            )}
          </div>

          {/* Upload Result */}
          {uploadResult && (
            <div className="space-y-2">
              <Alert variant={uploadResult.failed === 0 ? 'default' : 'destructive'}>
                <AlertDescription>
                  <div className="flex items-center gap-2">
                    {uploadResult.failed === 0 ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    <div>
                      <strong>Import Summary:</strong> {uploadResult.successful} succeeded,{' '}
                      {uploadResult.failed} failed out of {uploadResult.total} total rows
                    </div>
                  </div>
                </AlertDescription>
              </Alert>

              {/* Errors */}
              {uploadResult.errors && uploadResult.errors.length > 0 && (
                <div className="max-h-60 overflow-y-auto border rounded-lg p-3">
                  <div className="font-medium mb-2 text-sm">Errors:</div>
                  <div className="space-y-1 text-xs">
                    {uploadResult.errors.slice(0, 10).map((error, index) => (
                      <div key={index} className="text-red-600">
                        Row {error.row}: {error.errors.join(', ')}
                      </div>
                    ))}
                    {uploadResult.errors.length > 10 && (
                      <div className="text-gray-500">
                        ... and {uploadResult.errors.length - 10} more errors
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Successfully Created Products */}
              {uploadResult.products && uploadResult.products.length > 0 && (
                <div className="max-h-60 overflow-y-auto border rounded-lg p-3">
                  <div className="font-medium mb-2 text-sm text-green-600">
                    Successfully Created ({uploadResult.products.length}):
                  </div>
                  <div className="space-y-1 text-xs">
                    {uploadResult.products.slice(0, 10).map((product, index) => (
                      <div key={index} className="text-gray-700">
                        Row {product.row}: {product.name} (SKU: {product.sku})
                      </div>
                    ))}
                    {uploadResult.products.length > 10 && (
                      <div className="text-gray-500">
                        ... and {uploadResult.products.length - 10} more products
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)} disabled={isUploading}>
            {uploadResult ? 'Close' : 'Cancel'}
          </Button>
          <Button onClick={handleUpload} disabled={!selectedFile || isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Products
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkUploadDialog;

