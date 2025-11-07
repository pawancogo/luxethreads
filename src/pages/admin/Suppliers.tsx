import React, { useState } from 'react';
import { useAdminSuppliers } from '@/hooks/admin/useAdminSuppliers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Building2, Mail, Phone, CheckCircle, XCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
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

const Suppliers: React.FC = () => {
  const {
    suppliers,
    loading,
    fetchSuppliers,
    activateSupplier,
    deactivateSupplier,
    suspendSupplier,
    deleteSupplier,
  } = useAdminSuppliers();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);

  const handleSearch = () => {
    fetchSuppliers({
      search: searchQuery || undefined,
      verified: verifiedFilter === 'verified' ? true : verifiedFilter === 'unverified' ? false : undefined,
      active: statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined,
    });
  };

  const handleDelete = (supplierId: number) => {
    setSelectedSupplier(supplierId);
    setDeleteDialogOpen(true);
  };

  const handleSuspend = (supplierId: number) => {
    setSelectedSupplier(supplierId);
    setSuspendDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedSupplier) {
      await deleteSupplier(selectedSupplier);
      setDeleteDialogOpen(false);
      setSelectedSupplier(null);
    }
  };

  const confirmSuspend = async () => {
    if (selectedSupplier) {
      await suspendSupplier(selectedSupplier, 'Suspended by admin');
      setSuspendDialogOpen(false);
      setSelectedSupplier(null);
    }
  };

  if (loading && suppliers.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading suppliers...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Supplier Management</h1>
        <p className="text-gray-600">Manage supplier accounts and verification</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by company name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Suppliers</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch}>
              <Filter className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.map((supplier) => (
          <Card key={supplier.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">{supplier.company_name || supplier.full_name}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {supplier.is_active && !supplier.verified && (
                    <DropdownMenuItem onClick={() => activateSupplier(supplier.id)}>
                      Verify & Activate
                    </DropdownMenuItem>
                  )}
                  {supplier.is_active && (
                    <DropdownMenuItem onClick={() => deactivateSupplier(supplier.id)}>
                      Deactivate
                    </DropdownMenuItem>
                  )}
                  {!supplier.is_active && (
                    <DropdownMenuItem onClick={() => activateSupplier(supplier.id)}>
                      Activate
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => handleSuspend(supplier.id)}>
                    Suspend
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(supplier.id)}
                    className="text-red-600"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building2 className="h-4 w-4" />
                  <span>{supplier.company_name || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{supplier.email}</span>
                </div>
                {supplier.phone_number && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{supplier.phone_number}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={supplier.is_active ? 'default' : 'secondary'}>
                    {supplier.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  {supplier.verified ? (
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      <XCircle className="mr-1 h-3 w-3" />
                      Unverified
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Joined: {new Date(supplier.created_at).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {suppliers.length === 0 && !loading && (
        <Card className="text-center p-8">
          <p className="text-gray-500">No suppliers found</p>
        </Card>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Supplier</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this supplier? This action cannot be undone.
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

      <AlertDialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend Supplier</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to suspend this supplier? The supplier account will be deactivated and unverified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSuspend} className="bg-orange-600 hover:bg-orange-700">
              Suspend
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Suppliers;

