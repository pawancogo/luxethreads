import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Upload,
  TrendingUp
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

const SupplierDashboard = () => {
  const { user } = useUser();
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: '',
  });

  // Mock data
  const stats = [
    { title: 'My Products', value: '24', icon: Package, change: '+3 this month' },
    { title: 'Total Orders', value: '156', icon: ShoppingCart, change: '+12 this week' },
    { title: 'Revenue', value: '$8,450', icon: DollarSign, change: '+$1,200 this month' },
  ];

  const products = [
    { id: 1, name: 'Wireless Headphones', price: '$99.99', stock: 45, status: 'active', orders: 23 },
    { id: 2, name: 'Smart Watch', price: '$199.99', stock: 12, status: 'active', orders: 15 },
    { id: 3, name: 'Bluetooth Speaker', price: '$79.99', stock: 0, status: 'out_of_stock', orders: 8 },
  ];

  const orders = [
    { id: '#ORD-001', product: 'Wireless Headphones', quantity: 2, amount: '$199.98', status: 'pending', date: '2024-01-15' },
    { id: '#ORD-002', product: 'Smart Watch', quantity: 1, amount: '$199.99', status: 'shipped', date: '2024-01-14' },
    { id: '#ORD-003', product: 'Bluetooth Speaker', quantity: 3, amount: '$239.97', status: 'delivered', date: '2024-01-13' },
  ];

  const handleAddProduct = () => {
    console.log('Adding product:', newProduct);
    setIsAddProductOpen(false);
    setNewProduct({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      image: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
      active: 'default',
      out_of_stock: 'destructive',
      pending: 'secondary',
      shipped: 'default',
      delivered: 'default',
    };
    return <Badge variant={variants[status] || 'default'}>{status.replace('_', ' ')}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Supplier Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome, {user?.companyName || user?.name}</p>
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
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Add New Product</DialogTitle>
                        <DialogDescription>
                          Add a new product to your catalog
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Product Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={newProduct.name}
                            onChange={handleInputChange}
                            placeholder="Enter product name"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            name="description"
                            value={newProduct.description}
                            onChange={handleInputChange}
                            placeholder="Enter product description"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="price">Price</Label>
                            <Input
                              id="price"
                              name="price"
                              type="number"
                              value={newProduct.price}
                              onChange={handleInputChange}
                              placeholder="0.00"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="stock">Stock</Label>
                            <Input
                              id="stock"
                              name="stock"
                              type="number"
                              value={newProduct.stock}
                              onChange={handleInputChange}
                              placeholder="0"
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="category">Category</Label>
                          <Input
                            id="category"
                            name="category"
                            value={newProduct.category}
                            onChange={handleInputChange}
                            placeholder="Enter category"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="image">Image URL</Label>
                          <Input
                            id="image"
                            name="image"
                            value={newProduct.image}
                            onChange={handleInputChange}
                            placeholder="Enter image URL"
                          />
                        </div>
                        <Button variant="outline" className="w-full">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Image
                        </Button>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddProduct}>Add Product</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.price}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>{getStatusBadge(product.status)}</TableCell>
                        <TableCell>{product.orders}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>Track and manage your orders</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.product}</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>{order.amount}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Update Status
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Company Name</Label>
                      <Input value={user?.companyName || ''} readOnly />
                    </div>
                    <div>
                      <Label>Contact Email</Label>
                      <Input value={user?.email || ''} readOnly />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Tax ID</Label>
                      <Input value={user?.taxId || ''} readOnly />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input value={user?.phone || ''} readOnly />
                    </div>
                  </div>
                  <Button className="mt-4">Update Profile</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SupplierDashboard;