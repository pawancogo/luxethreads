import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Package,
  ShoppingCart,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Eye,
  Upload,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import {
  productsAPI,
  categoriesAPI,
  brandsAPI,
  supplierOrdersAPI,
  supplierProfileAPI,
} from '@/services/api';

interface Category {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
}

interface SupplierProduct {
  id: number;
  name: string;
  description: string;
  status: string;
  category_id?: number;
  brand_id?: number;
  category_name?: string;
  brand_name?: string;
  product_variants?: ProductVariant[];
}

interface ProductVariant {
  id: number;
  sku: string;
  price: number;
  discounted_price?: number;
  stock_quantity: number;
  weight_kg?: number;
}

interface SupplierOrder {
  order_id: number;
  order_number: string;
  order_date: string;
  customer_name: string;
  customer_email: string;
  status: string;
  payment_status: string;
  total_amount: number;
  shipping_address?: any;
  items: OrderItem[];
}

interface OrderItem {
  order_item_id: number;
  product_variant_id: number;
  sku: string;
  product_name: string;
  brand_name: string;
  category_name: string;
  quantity: number;
  price_at_purchase: number;
  subtotal: number;
  image_url?: string;
}

interface SupplierProfile {
  id: number;
  company_name: string;
  gst_number: string;
  description?: string;
  website_url?: string;
  verified: boolean;
}

const SupplierDashboard = () => {
  const { user } = useUser();
  const { toast } = useToast();

  // Loading states
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);

  // Data states
  const [products, setProducts] = useState<SupplierProduct[]>([]);
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [supplierProfile, setSupplierProfile] = useState<SupplierProfile | null>(null);

  // Dialog states
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddVariantOpen, setIsAddVariantOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isShipOrderOpen, setIsShipOrderOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedOrderItemId, setSelectedOrderItemId] = useState<number | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  // Form states
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category_id: '',
    brand_id: '',
  });

  const [editingProduct, setEditingProduct] = useState<SupplierProduct | null>(null);

  const [newVariant, setNewVariant] = useState({
    sku: '',
    price: '',
    discounted_price: '',
    stock_quantity: '',
    weight_kg: '',
  });

  const [profileForm, setProfileForm] = useState({
    company_name: '',
    gst_number: '',
    description: '',
    website_url: '',
  });

  const [trackingNumber, setTrackingNumber] = useState('');

  // Load data on mount
  useEffect(() => {
    if (user?.role === 'supplier') {
      loadProducts();
      loadOrders();
      loadProfile();
      loadCategories();
      loadBrands();
    }
  }, [user]);

  // Load functions
  const loadProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const response = await productsAPI.getSupplierProducts();
      setProducts(Array.isArray(response) ? response : []);
    } catch (error: any) {
      const errorMessage = error?.errors?.[0] || error?.message || 'Failed to load products';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const loadOrders = async () => {
    try {
      setIsLoadingOrders(true);
      const response = await supplierOrdersAPI.getSupplierOrders();
      setOrders(Array.isArray(response) ? response : []);
    } catch (error: any) {
      const errorMessage = error?.errors?.[0] || error?.message || 'Failed to load orders';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const loadProfile = async () => {
    try {
      setIsLoadingProfile(true);
      const response = await supplierProfileAPI.getProfile();
      const profile = response as unknown as SupplierProfile;
      setSupplierProfile(profile);
      setProfileForm({
        company_name: profile.company_name || '',
        gst_number: profile.gst_number || '',
        description: profile.description || '',
        website_url: profile.website_url || '',
      });
    } catch (error: any) {
      // Profile might not exist yet, that's okay
      if (error?.status !== 404) {
        const errorMessage = error?.errors?.[0] || error?.message || 'Failed to load profile';
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const loadCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const response = await categoriesAPI.getAll();
      setCategories(Array.isArray(response) ? response : []);
    } catch (error: any) {
      const errorMessage = error?.errors?.[0] || error?.message || 'Failed to load categories';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const loadBrands = async () => {
    try {
      setIsLoadingBrands(true);
      const response = await brandsAPI.getAll();
      setBrands(Array.isArray(response) ? response : []);
    } catch (error: any) {
      const errorMessage = error?.errors?.[0] || error?.message || 'Failed to load brands';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoadingBrands(false);
    }
  };

  // Product management
  const handleCreateProduct = async () => {
    if (!newProduct.name || !newProduct.description || !newProduct.category_id || !newProduct.brand_id) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      await productsAPI.createProduct({
        name: newProduct.name,
        description: newProduct.description,
        category_id: parseInt(newProduct.category_id),
        brand_id: parseInt(newProduct.brand_id),
      });

      toast({
        title: 'Success',
        description: 'Product created successfully',
      });

      setIsAddProductOpen(false);
      setNewProduct({
        name: '',
        description: '',
        category_id: '',
        brand_id: '',
      });
      loadProducts();
    } catch (error: any) {
      const errorMessage = error?.errors?.[0] || error?.message || 'Failed to create product';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleEditProduct = async () => {
    if (!editingProduct) return;

    try {
      await productsAPI.updateProduct(editingProduct.id, {
        name: editingProduct.name,
        description: editingProduct.description,
        category_id: editingProduct.category_id as any,
        brand_id: editingProduct.brand_id as any,
      });

      toast({
        title: 'Success',
        description: 'Product updated successfully',
      });

      setIsEditProductOpen(false);
      setEditingProduct(null);
      loadProducts();
    } catch (error: any) {
      const errorMessage = error?.errors?.[0] || error?.message || 'Failed to update product';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await productsAPI.deleteProduct(productId);
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
      loadProducts();
    } catch (error: any) {
      const errorMessage = error?.errors?.[0] || error?.message || 'Failed to delete product';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  // Variant management
  const handleCreateVariant = async () => {
    if (!selectedProductId || !newVariant.sku || !newVariant.price || !newVariant.stock_quantity) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      await productsAPI.createVariant(selectedProductId, {
        sku: newVariant.sku,
        price: parseFloat(newVariant.price),
        discounted_price: newVariant.discounted_price ? parseFloat(newVariant.discounted_price) : undefined,
        stock_quantity: parseInt(newVariant.stock_quantity),
        weight_kg: newVariant.weight_kg ? parseFloat(newVariant.weight_kg) : undefined,
      });

      toast({
        title: 'Success',
        description: 'Product variant created successfully',
      });

      setIsAddVariantOpen(false);
      setNewVariant({
        sku: '',
        price: '',
        discounted_price: '',
        stock_quantity: '',
        weight_kg: '',
      });
      setSelectedProductId(null);
      loadProducts();
    } catch (error: any) {
      const errorMessage = error?.errors?.[0] || error?.message || 'Failed to create variant';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteVariant = async (productId: number, variantId: number) => {
    if (!confirm('Are you sure you want to delete this variant?')) return;

    try {
      await productsAPI.deleteVariant(productId, variantId);
      toast({
        title: 'Success',
        description: 'Variant deleted successfully',
      });
      loadProducts();
    } catch (error: any) {
      const errorMessage = error?.errors?.[0] || error?.message || 'Failed to delete variant';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  // Order management
  const handleShipOrder = async () => {
    if (!selectedOrderItemId || !trackingNumber) {
      toast({
        title: 'Validation Error',
        description: 'Tracking number is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      await supplierOrdersAPI.shipOrderItem(selectedOrderItemId, trackingNumber);
      toast({
        title: 'Success',
        description: 'Order marked as shipped successfully',
      });

      setIsShipOrderOpen(false);
      setTrackingNumber('');
      setSelectedOrderItemId(null);
      setSelectedOrderId(null);
      loadOrders();
    } catch (error: any) {
      const errorMessage = error?.errors?.[0] || error?.message || 'Failed to ship order';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  // Profile management
  const handleUpdateProfile = async () => {
    if (!profileForm.company_name || !profileForm.gst_number) {
      toast({
        title: 'Validation Error',
        description: 'Company name and GST number are required',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (supplierProfile) {
        await supplierProfileAPI.updateProfile(profileForm);
      } else {
        await supplierProfileAPI.createProfile(profileForm);
      }

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });

      loadProfile();
    } catch (error: any) {
      const errorMessage = error?.errors?.[0] || error?.message || 'Failed to update profile';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  // Calculate stats
  const stats = [
    {
      title: 'My Products',
      value: products.length.toString(),
      icon: Package,
      change: `${products.filter(p => p.status === 'active').length} active`,
    },
    {
      title: 'Total Orders',
      value: orders.reduce((sum, order) => sum + order.items.length, 0).toString(),
      icon: ShoppingCart,
      change: `${orders.length} orders`,
    },
    {
      title: 'Revenue',
      value: `$${orders.reduce((sum, order) => sum + order.total_amount, 0).toFixed(2)}`,
      icon: DollarSign,
      change: `${orders.filter(o => o.status === 'shipped' || o.status === 'delivered').length} shipped`,
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
      active: 'default',
      pending: 'secondary',
      rejected: 'destructive',
      archived: 'secondary',
      paid: 'default',
      shipped: 'default',
      delivered: 'default',
    };
    return <Badge variant={variants[status] || 'default'}>{status.replace('_', ' ')}</Badge>;
  };

  // Get total stock for a product
  const getProductTotalStock = (product: SupplierProduct) => {
    if (!product.product_variants) return 0;
    return product.product_variants.reduce((sum, variant) => sum + variant.stock_quantity, 0);
  };

  // Get min price for a product
  const getProductMinPrice = (product: SupplierProduct) => {
    if (!product.product_variants || product.product_variants.length === 0) return 'N/A';
    const minPrice = Math.min(...product.product_variants.map(v => v.discounted_price || v.price));
    return `$${minPrice.toFixed(2)}`;
  };

  if (!user || user.role !== 'supplier') {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">You must be a supplier to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Supplier Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome, {supplierProfile?.company_name || user?.name || 'Supplier'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products">My Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Product Management</CardTitle>
                    <CardDescription>Manage your product catalog</CardDescription>
                  </div>
                  <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Product</DialogTitle>
                        <DialogDescription>Add a new product to your catalog</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Product Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            placeholder="Enter product name"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description">Description *</Label>
                          <Textarea
                            id="description"
                            name="description"
                            value={newProduct.description}
                            onChange={(e) =>
                              setNewProduct({ ...newProduct, description: e.target.value })
                            }
                            placeholder="Enter product description"
                            rows={4}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="category">Category *</Label>
                            <Select
                              value={newProduct.category_id}
                              onValueChange={(value) =>
                                setNewProduct({ ...newProduct, category_id: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category.id} value={category.id.toString()}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="brand">Brand *</Label>
                            <Select
                              value={newProduct.brand_id}
                              onValueChange={(value) =>
                                setNewProduct({ ...newProduct, brand_id: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select brand" />
                              </SelectTrigger>
                              <SelectContent>
                                {brands.map((brand) => (
                                  <SelectItem key={brand.id} value={brand.id.toString()}>
                                    {brand.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateProduct}>Create Product</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingProducts ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No products found. Create your first product to get started.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Brand</TableHead>
                        <TableHead>Price Range</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.category_name || 'N/A'}</TableCell>
                          <TableCell>{product.brand_name || 'N/A'}</TableCell>
                          <TableCell>{getProductMinPrice(product)}</TableCell>
                          <TableCell>{getProductTotalStock(product)}</TableCell>
                          <TableCell>{getStatusBadge(product.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Dialog
                                open={
                                  isAddVariantOpen && selectedProductId === product.id
                                }
                                onOpenChange={(open) => {
                                  setIsAddVariantOpen(open);
                                  if (open) {
                                    setSelectedProductId(product.id);
                                  } else {
                                    setSelectedProductId(null);
                                  }
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedProductId(product.id)}
                                  >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Variant
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px]">
                                  <DialogHeader>
                                    <DialogTitle>Add Product Variant</DialogTitle>
                                    <DialogDescription>
                                      Add a variant for {product.name}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                      <Label htmlFor="sku">SKU *</Label>
                                      <Input
                                        id="sku"
                                        value={newVariant.sku}
                                        onChange={(e) =>
                                          setNewVariant({ ...newVariant, sku: e.target.value })
                                        }
                                        placeholder="Enter SKU"
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="grid gap-2">
                                        <Label htmlFor="price">Price *</Label>
                                        <Input
                                          id="price"
                                          type="number"
                                          step="0.01"
                                          value={newVariant.price}
                                          onChange={(e) =>
                                            setNewVariant({
                                              ...newVariant,
                                              price: e.target.value,
                                            })
                                          }
                                          placeholder="0.00"
                                        />
                                      </div>
                                      <div className="grid gap-2">
                                        <Label htmlFor="discounted_price">Discounted Price</Label>
                                        <Input
                                          id="discounted_price"
                                          type="number"
                                          step="0.01"
                                          value={newVariant.discounted_price}
                                          onChange={(e) =>
                                            setNewVariant({
                                              ...newVariant,
                                              discounted_price: e.target.value,
                                            })
                                          }
                                          placeholder="0.00"
                                        />
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="grid gap-2">
                                        <Label htmlFor="stock_quantity">Stock Quantity *</Label>
                                        <Input
                                          id="stock_quantity"
                                          type="number"
                                          value={newVariant.stock_quantity}
                                          onChange={(e) =>
                                            setNewVariant({
                                              ...newVariant,
                                              stock_quantity: e.target.value,
                                            })
                                          }
                                          placeholder="0"
                                        />
                                      </div>
                                      <div className="grid gap-2">
                                        <Label htmlFor="weight_kg">Weight (kg)</Label>
                                        <Input
                                          id="weight_kg"
                                          type="number"
                                          step="0.01"
                                          value={newVariant.weight_kg}
                                          onChange={(e) =>
                                            setNewVariant({
                                              ...newVariant,
                                              weight_kg: e.target.value,
                                            })
                                          }
                                          placeholder="0.00"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setIsAddVariantOpen(false);
                                        setSelectedProductId(null);
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button onClick={handleCreateVariant}>Create Variant</Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingProduct(product);
                                  setIsEditProductOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Edit Product Dialog */}
            <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Edit Product</DialogTitle>
                  <DialogDescription>Update product information</DialogDescription>
                </DialogHeader>
                {editingProduct && (
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit_name">Product Name *</Label>
                      <Input
                        id="edit_name"
                        value={editingProduct.name}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit_description">Description *</Label>
                      <Textarea
                        id="edit_description"
                        value={editingProduct.description}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, description: e.target.value })
                        }
                        rows={4}
                      />
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditProductOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleEditProduct}>Update Product</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>Track and manage your orders</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingOrders ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No orders found.</div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <Card key={order.order_id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">Order #{order.order_number}</CardTitle>
                              <CardDescription>
                                {new Date(order.order_date).toLocaleDateString()} -{' '}
                                {order.customer_name} ({order.customer_email})
                              </CardDescription>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">${order.total_amount.toFixed(2)}</div>
                              <div className="text-sm text-gray-500">{getStatusBadge(order.status)}</div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Subtotal</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {order.items.map((item) => (
                                <TableRow key={item.order_item_id}>
                                  <TableCell className="font-medium">{item.product_name}</TableCell>
                                  <TableCell>{item.sku}</TableCell>
                                  <TableCell>{item.quantity}</TableCell>
                                  <TableCell>${item.price_at_purchase.toFixed(2)}</TableCell>
                                  <TableCell>${item.subtotal.toFixed(2)}</TableCell>
                                  <TableCell>
                                    {order.status === 'paid' && (
                                      <Dialog
                                        open={
                                          isShipOrderOpen &&
                                          selectedOrderItemId === item.order_item_id &&
                                          selectedOrderId === order.order_id
                                        }
                                        onOpenChange={(open) => {
                                          setIsShipOrderOpen(open);
                                          if (open) {
                                            setSelectedOrderItemId(item.order_item_id);
                                            setSelectedOrderId(order.order_id);
                                          } else {
                                            setSelectedOrderItemId(null);
                                            setSelectedOrderId(null);
                                            setTrackingNumber('');
                                          }
                                        }}
                                      >
                                        <DialogTrigger asChild>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                              setSelectedOrderItemId(item.order_item_id);
                                              setSelectedOrderId(order.order_id);
                                            }}
                                          >
                                            Ship
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                          <DialogHeader>
                                            <DialogTitle>Ship Order Item</DialogTitle>
                                            <DialogDescription>
                                              Mark order item as shipped
                                            </DialogDescription>
                                          </DialogHeader>
                                          <div className="grid gap-4 py-4">
                                            <div className="grid gap-2">
                                              <Label htmlFor="tracking_number">Tracking Number *</Label>
                                              <Input
                                                id="tracking_number"
                                                value={trackingNumber}
                                                onChange={(e) => setTrackingNumber(e.target.value)}
                                                placeholder="Enter tracking number"
                                              />
                                            </div>
                                          </div>
                                          <DialogFooter>
                                            <Button
                                              variant="outline"
                                              onClick={() => {
                                                setIsShipOrderOpen(false);
                                                setTrackingNumber('');
                                                setSelectedOrderItemId(null);
                                                setSelectedOrderId(null);
                                              }}
                                            >
                                              Cancel
                                            </Button>
                                            <Button onClick={handleShipOrder}>Mark as Shipped</Button>
                                          </DialogFooter>
                                        </DialogContent>
                                      </Dialog>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Sales Analytics</CardTitle>
                <CardDescription>View your sales performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">Analytics dashboard coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Supplier Profile</CardTitle>
                <CardDescription>Manage your supplier information</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingProfile ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Company Name *</Label>
                        <Input
                          value={profileForm.company_name}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, company_name: e.target.value })
                          }
                          placeholder="Enter company name"
                        />
                      </div>
                      <div>
                        <Label>GST Number *</Label>
                        <Input
                          value={profileForm.gst_number}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, gst_number: e.target.value })
                          }
                          placeholder="Enter GST number"
                        />
                      </div>
                    </div>
                    <div className="grid gap-4">
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={profileForm.description}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, description: e.target.value })
                          }
                          placeholder="Enter company description"
                          rows={4}
                        />
                      </div>
                      <div>
                        <Label>Website URL</Label>
                        <Input
                          value={profileForm.website_url}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, website_url: e.target.value })
                          }
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                    {supplierProfile && supplierProfile.verified && (
                      <div className="flex items-center gap-2">
                        <Badge variant="default">Verified</Badge>
                        <span className="text-sm text-gray-500">
                          Your profile has been verified
                        </span>
                      </div>
                    )}
                    <Button className="mt-4" onClick={handleUpdateProfile}>
                      {supplierProfile ? 'Update Profile' : 'Create Profile'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SupplierDashboard;
