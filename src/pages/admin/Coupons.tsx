import React, { useState } from 'react';
import { useAdminCoupons } from '@/hooks/admin/useAdminCoupons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, MoreVertical, Calendar, Tag, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Coupons: React.FC = () => {
  const {
    coupons,
    loading,
    fetchCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
  } = useAdminCoupons();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    coupon_type: 'percentage',
    discount_value: '',
    max_discount_amount: '',
    min_order_amount: '0',
    valid_from: '',
    valid_until: '',
    is_active: true,
    max_uses: '',
    max_uses_per_user: '',
    is_new_user_only: false,
    is_first_order_only: false,
  });

  const handleOpenDialog = (coupon?: any) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code || '',
        name: coupon.name || '',
        description: coupon.description || '',
        coupon_type: coupon.coupon_type || 'percentage',
        discount_value: coupon.discount_value?.toString() || '',
        max_discount_amount: coupon.max_discount_amount?.toString() || '',
        min_order_amount: coupon.min_order_amount?.toString() || '0',
        valid_from: coupon.valid_from ? new Date(coupon.valid_from).toISOString().split('T')[0] : '',
        valid_until: coupon.valid_until ? new Date(coupon.valid_until).toISOString().split('T')[0] : '',
        is_active: coupon.is_active !== false,
        max_uses: coupon.max_uses?.toString() || '',
        max_uses_per_user: coupon.max_uses_per_user?.toString() || '',
        is_new_user_only: coupon.is_new_user_only || false,
        is_first_order_only: coupon.is_first_order_only || false,
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '',
        name: '',
        description: '',
        coupon_type: 'percentage',
        discount_value: '',
        max_discount_amount: '',
        min_order_amount: '0',
        valid_from: '',
        valid_until: '',
        is_active: true,
        max_uses: '',
        max_uses_per_user: '',
        is_new_user_only: false,
        is_first_order_only: false,
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    const couponData = {
      code: formData.code,
      name: formData.name,
      description: formData.description,
      coupon_type: formData.coupon_type,
      discount_value: parseFloat(formData.discount_value),
      max_discount_amount: formData.max_discount_amount ? parseFloat(formData.max_discount_amount) : undefined,
      min_order_amount: parseFloat(formData.min_order_amount) || 0,
      valid_from: formData.valid_from,
      valid_until: formData.valid_until,
      is_active: formData.is_active,
      max_uses: formData.max_uses ? parseInt(formData.max_uses) : undefined,
      max_uses_per_user: formData.max_uses_per_user ? parseInt(formData.max_uses_per_user) : undefined,
      is_new_user_only: formData.is_new_user_only,
      is_first_order_only: formData.is_first_order_only,
    };

    if (editingCoupon) {
      await updateCoupon(editingCoupon.id, couponData);
    } else {
      await createCoupon(couponData);
    }
    setDialogOpen(false);
  };

  const handleDelete = (couponId: number) => {
    setEditingCoupon({ id: couponId });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (editingCoupon?.id) {
      await deleteCoupon(editingCoupon.id);
      setDeleteDialogOpen(false);
      setEditingCoupon(null);
    }
  };

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: 'Copied!',
      description: 'Coupon code copied to clipboard',
    });
  };

  const getStatusBadge = (coupon: any) => {
    const now = new Date();
    const validFrom = new Date(coupon.valid_from);
    const validUntil = new Date(coupon.valid_until);

    if (!coupon.is_active) {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    if (now < validFrom) {
      return <Badge variant="outline" className="border-blue-500 text-blue-700">Upcoming</Badge>;
    }
    if (now > validUntil) {
      return <Badge variant="secondary">Expired</Badge>;
    }
    if (coupon.max_uses && coupon.usage_count && coupon.usage_count >= coupon.max_uses) {
      return <Badge variant="secondary">Max Uses Reached</Badge>;
    }
    return <Badge variant="default" className="bg-green-600">Active</Badge>;
  };

  if (loading && coupons.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading coupons...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Coupons Management</h1>
          <p className="text-gray-600">Create and manage discount coupons</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Create Coupon
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <Card key={coupon.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">{coupon.name}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleOpenDialog(coupon)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(coupon.id)}
                    className="text-red-600"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-lg">{coupon.code}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyCouponCode(coupon.code)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {coupon.description || 'No description'}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="h-4 w-4" />
                  <span className="capitalize">{coupon.coupon_type}</span>
                </div>
                {coupon.coupon_type === 'percentage' ? (
                  <div className="text-lg font-bold text-green-600">
                    {coupon.discount_value}% OFF
                  </div>
                ) : (
                  <div className="text-lg font-bold text-green-600">
                    ₹{coupon.discount_value} OFF
                  </div>
                )}
                {coupon.min_order_amount > 0 && (
                  <div className="text-xs text-gray-500">
                    Min order: ₹{coupon.min_order_amount}
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {new Date(coupon.valid_from).toLocaleDateString()} - {new Date(coupon.valid_until).toLocaleDateString()}
                  </span>
                </div>
                {coupon.usage_count !== undefined && (
                  <div className="text-xs text-gray-500">
                    Used: {coupon.usage_count} {coupon.max_uses ? `/ ${coupon.max_uses}` : ''} times
                  </div>
                )}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {getStatusBadge(coupon)}
                  {coupon.is_new_user_only && (
                    <Badge variant="outline" className="bg-blue-50">New Users Only</Badge>
                  )}
                  {coupon.is_first_order_only && (
                    <Badge variant="outline" className="bg-purple-50">First Order Only</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {coupons.length === 0 && !loading && (
        <Card className="text-center p-8">
          <p className="text-gray-500">No coupons found</p>
          <Button onClick={() => handleOpenDialog()} className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Create First Coupon
          </Button>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</DialogTitle>
            <DialogDescription>
              {editingCoupon ? 'Update coupon details' : 'Create a new discount coupon'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code">Coupon Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="SUMMER2025"
                  className="font-mono"
                />
              </div>
              <div>
                <Label htmlFor="coupon_type">Coupon Type *</Label>
                <Select
                  value={formData.coupon_type}
                  onValueChange={(value) => setFormData({ ...formData, coupon_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Summer Sale 2025"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Coupon description..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discount_value">Discount Value *</Label>
                <Input
                  id="discount_value"
                  type="number"
                  step="0.01"
                  value={formData.discount_value}
                  onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                  placeholder={formData.coupon_type === 'percentage' ? '10' : '100'}
                />
              </div>
              <div>
                <Label htmlFor="max_discount_amount">Max Discount (₹)</Label>
                <Input
                  id="max_discount_amount"
                  type="number"
                  step="0.01"
                  value={formData.max_discount_amount}
                  onChange={(e) => setFormData({ ...formData, max_discount_amount: e.target.value })}
                  placeholder="1000"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="min_order_amount">Min Order Amount (₹)</Label>
                <Input
                  id="min_order_amount"
                  type="number"
                  step="0.01"
                  value={formData.min_order_amount}
                  onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value })}
                  placeholder="500"
                />
              </div>
              <div>
                <Label htmlFor="max_uses">Max Uses (Leave empty for unlimited)</Label>
                <Input
                  id="max_uses"
                  type="number"
                  value={formData.max_uses}
                  onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                  placeholder="100"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="max_uses_per_user">Max Uses Per User</Label>
              <Input
                id="max_uses_per_user"
                type="number"
                value={formData.max_uses_per_user}
                onChange={(e) => setFormData({ ...formData, max_uses_per_user: e.target.value })}
                placeholder="1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="valid_from">Valid From *</Label>
                <Input
                  id="valid_from"
                  type="date"
                  value={formData.valid_from}
                  onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="valid_until">Valid Until *</Label>
                <Input
                  id="valid_until"
                  type="date"
                  value={formData.valid_until}
                  onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="is_new_user_only"
                  checked={formData.is_new_user_only}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_new_user_only: checked })}
                />
                <Label htmlFor="is_new_user_only">New Users Only</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="is_first_order_only"
                  checked={formData.is_first_order_only}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_first_order_only: checked })}
                />
                <Label htmlFor="is_first_order_only">First Order Only</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.code || !formData.name || !formData.discount_value || !formData.valid_from || !formData.valid_until}>
              {editingCoupon ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Coupon</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this coupon? This action cannot be undone.
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

export default Coupons;

