import React, { useState } from 'react';
import { useAdminProducts } from '@/hooks/admin/useAdminProducts';
import ProductCard from '@/components/admin/products/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Search, Filter, Download, CheckCircle, XCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';

const Products: React.FC = () => {
  const {
    products,
    loading,
    fetchProducts,
    approveProduct,
    rejectProduct,
    bulkApproveProducts,
    bulkRejectProducts,
    deleteProduct,
    exportProducts,
  } = useAdminProducts();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [bulkRejectDialogOpen, setBulkRejectDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToAction, setProductToAction] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleSearch = () => {
    fetchProducts({
      search: searchQuery || undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
    });
  };

  const handleSelectProduct = (productId: number, selected: boolean) => {
    const newSelected = new Set(selectedProducts);
    if (selected) {
      newSelected.add(productId);
    } else {
      newSelected.delete(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedProducts(new Set(products.map(p => p.id)));
    } else {
      setSelectedProducts(new Set());
    }
  };

  const handleApprove = async (productId: number) => {
    await approveProduct(productId);
  };

  const handleReject = (productId: number) => {
    setProductToAction(productId);
    setRejectDialogOpen(true);
  };

  const confirmReject = async () => {
    if (productToAction && rejectionReason.trim()) {
      await rejectProduct(productToAction, rejectionReason);
      setRejectDialogOpen(false);
      setProductToAction(null);
      setRejectionReason('');
    }
  };

  const handleBulkApprove = async () => {
    if (selectedProducts.size > 0) {
      await bulkApproveProducts(Array.from(selectedProducts));
      setSelectedProducts(new Set());
    }
  };

  const handleBulkReject = () => {
    if (selectedProducts.size > 0) {
      setBulkRejectDialogOpen(true);
    }
  };

  const confirmBulkReject = async () => {
    if (selectedProducts.size > 0 && rejectionReason.trim()) {
      await bulkRejectProducts(Array.from(selectedProducts), rejectionReason);
      setBulkRejectDialogOpen(false);
      setSelectedProducts(new Set());
      setRejectionReason('');
    }
  };

  const handleDelete = (productId: number) => {
    setProductToAction(productId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (productToAction) {
      await deleteProduct(productToAction);
      setDeleteDialogOpen(false);
      setProductToAction(null);
    }
  };

  const handleExport = () => {
    exportProducts({
      status: statusFilter !== 'all' ? statusFilter : undefined,
    });
  };

  if (loading && products.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Product Management</h1>
          <p className="text-gray-600">Manage and moderate products</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters & Bulk Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch}>
              <Filter className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
          </div>
          
          {selectedProducts.size > 0 && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium">
                {selectedProducts.size} product(s) selected
              </span>
              <Button
                size="sm"
                onClick={handleBulkApprove}
                className="ml-auto"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve Selected
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleBulkReject}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject Selected
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedProducts(new Set())}
              >
                Clear Selection
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mb-4 flex items-center gap-2">
        <input
          type="checkbox"
          checked={selectedProducts.size === products.length && products.length > 0}
          onChange={(e) => handleSelectAll(e.target.checked)}
          className="w-4 h-4"
        />
        <span className="text-sm text-gray-600">Select All</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            selected={selectedProducts.has(product.id)}
            onSelect={handleSelectProduct}
            onApprove={handleApprove}
            onReject={handleReject}
            onDelete={handleDelete}
            onViewDetails={(id) => {
              window.location.href = `/admin/products/${id}`;
            }}
          />
        ))}
      </div>

      {products.length === 0 && !loading && (
        <Card className="text-center p-8">
          <p className="text-gray-500">No products found</p>
        </Card>
      )}

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Product</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this product.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejection-reason">Rejection Reason</Label>
              <Textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setRejectDialogOpen(false);
              setRejectionReason('');
            }}>
              Cancel
            </Button>
            <Button onClick={confirmReject} disabled={!rejectionReason.trim()}>
              Reject Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Reject Dialog */}
      <Dialog open={bulkRejectDialogOpen} onOpenChange={setBulkRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject {selectedProducts.size} Products</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting these products.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bulk-rejection-reason">Rejection Reason</Label>
              <Textarea
                id="bulk-rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setBulkRejectDialogOpen(false);
              setRejectionReason('');
            }}>
              Cancel
            </Button>
            <Button onClick={confirmBulkReject} disabled={!rejectionReason.trim()}>
              Reject Products
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Products;

