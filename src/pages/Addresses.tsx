import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { addressesAPI } from '@/services/api';
import { MapPin, Plus, Edit, Trash2, Check, X, Loader2 } from 'lucide-react';

interface Address {
  id: number;
  address_type: 'shipping' | 'billing';
  full_name: string;
  phone_number: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  label?: string;
  is_default_shipping?: boolean;
  is_default_billing?: boolean;
  delivery_instructions?: string;
}

const Addresses = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    address_type: 'shipping' as 'shipping' | 'billing',
    full_name: '',
    phone_number: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    label: '',
    is_default_shipping: false,
    is_default_billing: false,
    delivery_instructions: '',
  });

  useEffect(() => {
    if (user) {
      loadAddresses();
    }
  }, [user]);

  const loadAddresses = async () => {
    setIsLoading(true);
    try {
      const response = await addressesAPI.getAddresses();
      setAddresses(Array.isArray(response) ? response : []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to load addresses',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      address_type: 'shipping',
      full_name: '',
      phone_number: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'India',
      label: '',
      is_default_shipping: false,
      is_default_billing: false,
      delivery_instructions: '',
    });
    setEditingAddress(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      address_type: address.address_type,
      full_name: address.full_name,
      phone_number: address.phone_number,
      line1: address.line1,
      line2: address.line2 || '',
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country || 'India',
      label: address.label || '',
      is_default_shipping: address.is_default_shipping || false,
      is_default_billing: address.is_default_billing || false,
      delivery_instructions: address.delivery_instructions || '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.full_name || !formData.phone_number || !formData.line1 || !formData.city || !formData.state || !formData.postal_code) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      if (editingAddress) {
        await addressesAPI.updateAddress(editingAddress.id, formData);
        toast({
          title: 'Success',
          description: 'Address updated successfully',
        });
      } else {
        await addressesAPI.createAddress(formData);
        toast({
          title: 'Success',
          description: 'Address added successfully',
        });
      }
      setIsDialogOpen(false);
      resetForm();
      loadAddresses();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to save address',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (addressId: number) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      await addressesAPI.deleteAddress(addressId);
      toast({
        title: 'Success',
        description: 'Address deleted successfully',
      });
      loadAddresses();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to delete address',
        variant: 'destructive',
      });
    }
  };

  const handleSetDefault = async (addressId: number, type: 'shipping' | 'billing') => {
    try {
      const address = addresses.find(a => a.id === addressId);
      if (!address) return;

      const updateData: any = {};
      if (type === 'shipping') {
        updateData.is_default_shipping = !address.is_default_shipping;
      } else {
        updateData.is_default_billing = !address.is_default_billing;
      }

      await addressesAPI.updateAddress(addressId, updateData);
      toast({
        title: 'Success',
        description: `Default ${type} address updated`,
      });
      loadAddresses();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to update default address',
        variant: 'destructive',
      });
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">Please log in to view your addresses</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Addresses</h1>
          <p className="text-gray-600 mt-1">Manage your shipping and billing addresses</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Address
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
              <DialogDescription>
                {editingAddress ? 'Update your address information' : 'Add a new shipping or billing address'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="address_type">Address Type *</Label>
                <Select
                  value={formData.address_type}
                  onValueChange={(value) => handleSelectChange('address_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shipping">Shipping</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="label">Label (Optional)</Label>
                <Input
                  id="label"
                  name="label"
                  value={formData.label}
                  onChange={handleInputChange}
                  placeholder="e.g., Home, Office, Gift"
                />
              </div>

              <div>
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone_number">Phone Number *</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="line1">Address Line 1 *</Label>
                <Input
                  id="line1"
                  name="line1"
                  value={formData.line1}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="line2">Address Line 2</Label>
                <Input
                  id="line2"
                  name="line2"
                  value={formData.line2}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postal_code">Postal Code *</Label>
                  <Input
                    id="postal_code"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="delivery_instructions">Delivery Instructions (Optional)</Label>
                <Textarea
                  id="delivery_instructions"
                  name="delivery_instructions"
                  value={formData.delivery_instructions}
                  onChange={handleInputChange}
                  placeholder="Any special delivery instructions..."
                  rows={3}
                />
              </div>

              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_default_shipping"
                    checked={formData.is_default_shipping}
                    onChange={(e) => handleSelectChange('is_default_shipping', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="is_default_shipping" className="cursor-pointer">
                    Set as default shipping address
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_default_billing"
                    checked={formData.is_default_billing}
                    onChange={(e) => handleSelectChange('is_default_billing', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="is_default_billing" className="cursor-pointer">
                    Set as default billing address
                  </Label>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingAddress ? 'Update Address' : 'Add Address'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : addresses.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No addresses found</h3>
              <p className="text-gray-500 mb-4">Add your first address to get started</p>
              <Button onClick={openAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Address
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <Card key={address.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {address.label && (
                        <Badge variant="secondary">{address.label}</Badge>
                      )}
                      <Badge variant={address.address_type === 'shipping' ? 'default' : 'outline'}>
                        {address.address_type}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {address.full_name} • {address.phone_number}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">
                    {address.line1}
                    {address.line2 && `, ${address.line2}`}
                  </p>
                  <p className="text-sm text-gray-700">
                    {address.city}, {address.state} {address.postal_code}
                  </p>
                  <p className="text-sm text-gray-700">{address.country}</p>
                  {address.delivery_instructions && (
                    <p className="text-xs text-gray-500 mt-2">
                      <strong>Instructions:</strong> {address.delivery_instructions}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                  {(address.is_default_shipping || address.is_default_billing) && (
                    <div className="flex gap-2">
                      {address.is_default_shipping && (
                        <Badge variant="default" className="text-xs">Default Shipping</Badge>
                      )}
                      {address.is_default_billing && (
                        <Badge variant="default" className="text-xs">Default Billing</Badge>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetDefault(address.id, 'shipping')}
                    className="flex-1"
                  >
                    {address.is_default_shipping ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Default Shipping
                      </>
                    ) : (
                      'Set Shipping Default'
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetDefault(address.id, 'billing')}
                    className="flex-1"
                  >
                    {address.is_default_billing ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Default Billing
                      </>
                    ) : (
                      'Set Billing Default'
                    )}
                  </Button>
                </div>

                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(address)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(address.id)}
                    className="flex-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Addresses;

