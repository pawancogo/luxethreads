import React, { useState } from 'react';
import { useAdminPromotions } from '@/hooks/admin/useAdminPromotions';
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
import { Plus, MoreVertical, Calendar, Tag, Image as ImageIcon } from 'lucide-react';

const Promotions: React.FC = () => {
  const {
    promotions,
    loading,
    fetchPromotions,
    createPromotion,
    updatePromotion,
    deletePromotion,
  } = useAdminPromotions();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    promotion_type: 'flash_sale',
    start_date: '',
    end_date: '',
    is_active: true,
    is_featured: false,
    discount_percentage: '',
    discount_amount: '',
    min_order_amount: '',
    max_discount_amount: '',
    banner_image_url: '',
  });

  const handleOpenDialog = (promotion?: any) => {
    if (promotion) {
      setEditingPromotion(promotion);
      setFormData({
        name: promotion.name || '',
        description: promotion.description || '',
        promotion_type: promotion.promotion_type || 'flash_sale',
        start_date: promotion.start_date ? new Date(promotion.start_date).toISOString().split('T')[0] : '',
        end_date: promotion.end_date ? new Date(promotion.end_date).toISOString().split('T')[0] : '',
        is_active: promotion.is_active !== false,
        is_featured: promotion.is_featured || false,
        discount_percentage: promotion.discount_percentage?.toString() || '',
        discount_amount: promotion.discount_amount?.toString() || '',
        min_order_amount: promotion.min_order_amount?.toString() || '',
        max_discount_amount: promotion.max_discount_amount?.toString() || '',
        banner_image_url: promotion.banner_image_url || '',
      });
    } else {
      setEditingPromotion(null);
      setFormData({
        name: '',
        description: '',
        promotion_type: 'flash_sale',
        start_date: '',
        end_date: '',
        is_active: true,
        is_featured: false,
        discount_percentage: '',
        discount_amount: '',
        min_order_amount: '',
        max_discount_amount: '',
        banner_image_url: '',
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    const promotionData = {
      name: formData.name,
      description: formData.description,
      promotion_type: formData.promotion_type,
      start_date: formData.start_date,
      end_date: formData.end_date,
      is_active: formData.is_active,
      is_featured: formData.is_featured,
      discount_percentage: formData.discount_percentage ? parseFloat(formData.discount_percentage) : undefined,
      discount_amount: formData.discount_amount ? parseFloat(formData.discount_amount) : undefined,
      min_order_amount: formData.min_order_amount ? parseFloat(formData.min_order_amount) : undefined,
      max_discount_amount: formData.max_discount_amount ? parseFloat(formData.max_discount_amount) : undefined,
      banner_image_url: formData.banner_image_url || undefined,
    };

    if (editingPromotion) {
      await updatePromotion(editingPromotion.id, promotionData);
    } else {
      await createPromotion(promotionData);
    }
    setDialogOpen(false);
  };

  const handleDelete = (promotionId: number) => {
    setEditingPromotion({ id: promotionId });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (editingPromotion?.id) {
      await deletePromotion(editingPromotion.id);
      setDeleteDialogOpen(false);
      setEditingPromotion(null);
    }
  };

  const getStatusBadge = (promotion: any) => {
    const now = new Date();
    const start = new Date(promotion.start_date);
    const end = new Date(promotion.end_date);

    if (!promotion.is_active) {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    if (now < start) {
      return <Badge variant="outline" className="border-blue-500 text-blue-700">Upcoming</Badge>;
    }
    if (now > end) {
      return <Badge variant="secondary">Expired</Badge>;
    }
    return <Badge variant="default" className="bg-green-600">Active</Badge>;
  };

  if (loading && promotions.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading promotions...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Promotions Management</h1>
          <p className="text-gray-600">Create and manage promotional campaigns</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Create Promotion
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {promotions.map((promotion) => (
          <Card key={promotion.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">{promotion.name}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleOpenDialog(promotion)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(promotion.id)}
                    className="text-red-600"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {promotion.description || 'No description'}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="h-4 w-4" />
                  <span className="capitalize">{promotion.promotion_type.replace('_', ' ')}</span>
                </div>
                {promotion.discount_percentage && (
                  <div className="text-lg font-bold text-green-600">
                    {promotion.discount_percentage}% OFF
                  </div>
                )}
                {promotion.discount_amount && (
                  <div className="text-lg font-bold text-green-600">
                    ₹{promotion.discount_amount} OFF
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {new Date(promotion.start_date).toLocaleDateString()} - {new Date(promotion.end_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {getStatusBadge(promotion)}
                  {promotion.is_featured && (
                    <Badge variant="outline" className="bg-purple-50">Featured</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {promotions.length === 0 && !loading && (
        <Card className="text-center p-8">
          <p className="text-gray-500">No promotions found</p>
          <Button onClick={() => handleOpenDialog()} className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Create First Promotion
          </Button>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPromotion ? 'Edit Promotion' : 'Create Promotion'}</DialogTitle>
            <DialogDescription>
              {editingPromotion ? 'Update promotion details' : 'Create a new promotional campaign'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
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
                placeholder="Promotion description..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="promotion_type">Promotion Type *</Label>
                <Select
                  value={formData.promotion_type}
                  onValueChange={(value) => setFormData({ ...formData, promotion_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flash_sale">Flash Sale</SelectItem>
                    <SelectItem value="buy_x_get_y">Buy X Get Y</SelectItem>
                    <SelectItem value="bundle_deal">Bundle Deal</SelectItem>
                    <SelectItem value="seasonal_sale">Seasonal Sale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="banner_image_url">Banner Image URL</Label>
                <Input
                  id="banner_image_url"
                  value={formData.banner_image_url}
                  onChange={(e) => setFormData({ ...formData, banner_image_url: e.target.value })}
                  placeholder="https://example.com/banner.jpg"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Start Date *</Label>
                <Input
                  id="start_date"
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="end_date">End Date *</Label>
                <Input
                  id="end_date"
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discount_percentage">Discount Percentage (%)</Label>
                <Input
                  id="discount_percentage"
                  type="number"
                  step="0.01"
                  value={formData.discount_percentage}
                  onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                  placeholder="10"
                />
              </div>
              <div>
                <Label htmlFor="discount_amount">Discount Amount (₹)</Label>
                <Input
                  id="discount_amount"
                  type="number"
                  step="0.01"
                  value={formData.discount_amount}
                  onChange={(e) => setFormData({ ...formData, discount_amount: e.target.value })}
                  placeholder="100"
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
                <Label htmlFor="max_discount_amount">Max Discount Amount (₹)</Label>
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
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
                <Label htmlFor="is_featured">Featured</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.name || !formData.start_date || !formData.end_date}>
              {editingPromotion ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Promotion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this promotion? This action cannot be undone.
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

export default Promotions;

