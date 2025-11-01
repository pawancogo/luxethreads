import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useUser } from '@/contexts/UserContext';
import { addressesAPI, ordersAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

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
}

const Checkout = () => {
  const { state, clearCart, loadCart } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState<number | 'new'>('new');
  const [selectedBillingAddress, setSelectedBillingAddress] = useState<number | 'new' | 'same'>('same');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState('');
  const [shippingMethod, setShippingMethod] = useState('standard');

  // Load addresses on mount
  useEffect(() => {
    const loadAddresses = async () => {
      if (!user) return;
      
      try {
        setIsLoadingAddresses(true);
        const response = await addressesAPI.getAddresses();
        const addressList = Array.isArray(response) ? response : [];
        setAddresses(addressList);
        
        // Auto-select first address if available
        if (addressList.length > 0) {
          setSelectedShippingAddress(addressList[0].id);
        }
      } catch (error) {
        console.error('Error loading addresses:', error);
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    loadAddresses();
  }, [user]);

  // Load selected address data into form
  useEffect(() => {
    if (selectedShippingAddress !== 'new' && addresses.length > 0) {
      const address = addresses.find(a => a.id === selectedShippingAddress);
      if (address) {
        setFormData({
          full_name: address.full_name,
          phone_number: address.phone_number,
          line1: address.line1,
          line2: address.line2 || '',
          city: address.city,
          state: address.state,
          postal_code: address.postal_code,
          country: address.country,
        });
      }
    }
  }, [selectedShippingAddress, addresses]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentMethod) {
      toast({
        title: "Please select a payment method",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to place an order.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (selectedShippingAddress === 'new') {
      // Validate new address
      if (!formData.full_name || !formData.phone_number || !formData.line1 || !formData.city || !formData.state || !formData.postal_code) {
        toast({
          title: "Please fill in all required address fields",
          variant: "destructive",
        });
        return;
      }
    }

    try {
      setIsLoading(true);
      
      let shippingAddressId: number;
      let billingAddressId: number;

      // Create or use shipping address
      if (selectedShippingAddress === 'new') {
        const shippingAddress = await addressesAPI.createAddress({
          address_type: 'shipping',
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          line1: formData.line1,
          line2: formData.line2,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postal_code,
          country: formData.country,
        });
        shippingAddressId = (shippingAddress as any).id;
      } else {
        shippingAddressId = selectedShippingAddress;
      }

      // Handle billing address
      if (selectedBillingAddress === 'same') {
        billingAddressId = shippingAddressId;
      } else if (selectedBillingAddress === 'new') {
        // Create billing address (same as shipping for now, can be enhanced)
        const billingAddress = await addressesAPI.createAddress({
          address_type: 'billing',
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          line1: formData.line1,
          line2: formData.line2,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postal_code,
          country: formData.country,
        });
        billingAddressId = (billingAddress as any).id;
      } else {
        billingAddressId = selectedBillingAddress;
      }

      // Create order
      const order = await ordersAPI.createOrder({
        shipping_address_id: shippingAddressId,
        billing_address_id: billingAddressId,
        shipping_method: shippingMethod,
        payment_method_id: paymentMethod === 'cod' ? undefined : paymentMethod,
      });

      toast({
        title: "Order placed successfully!",
        description: `Your order #${(order as any).id || 'N/A'} has been placed.`,
      });

      // Clear cart and reload
      await clearCart();
      await loadCart();
      navigate('/order-confirmation', { state: { orderId: (order as any).id } });
    } catch (error: any) {
      const errorMessage = error?.message || error?.errors?.[0] || "Failed to place order";
      toast({
        title: "Order failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (state.items.length === 0) {
    navigate('/cart');
    return null;
  }

  const subtotal = state.total;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingAddresses ? (
                  <div className="text-center py-4 text-gray-600">Loading addresses...</div>
                ) : addresses.length > 0 ? (
                  <>
                    <div>
                      <Label>Select Address</Label>
                      <Select 
                        value={selectedShippingAddress === 'new' ? 'new' : selectedShippingAddress.toString()}
                        onValueChange={(value) => setSelectedShippingAddress(value === 'new' ? 'new' : parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">Add New Address</SelectItem>
                          {addresses.filter(a => a.address_type === 'shipping' || !a.address_type).map((address) => (
                            <SelectItem key={address.id} value={address.id.toString()}>
                              {address.full_name}, {address.line1}, {address.city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                ) : null}

                {selectedShippingAddress === 'new' && (
                  <>
                    <div>
                      <Label htmlFor="full_name">Full Name *</Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter full name"
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
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div>
                      <Label htmlFor="line1">Address Line 1 *</Label>
                      <Input
                        id="line1"
                        name="line1"
                        value={formData.line1}
                        onChange={handleInputChange}
                        placeholder="Street address"
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
                        placeholder="Apartment, suite, etc. (optional)"
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
                        <Label htmlFor="postal_code">Postal Code *</Label>
                        <Input
                          id="postal_code"
                          name="postal_code"
                          value={formData.postal_code}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                  </>
                )}
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={selectedBillingAddress === 'same' ? 'same' : selectedBillingAddress === 'new' ? 'new' : selectedBillingAddress.toString()} onValueChange={(value) => {
                  if (value === 'same') {
                    setSelectedBillingAddress('same');
                  } else if (value === 'new') {
                    setSelectedBillingAddress('new');
                  } else {
                    setSelectedBillingAddress(parseInt(value));
                  }
                }}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="same" id="same" />
                    <Label htmlFor="same">Same as shipping address</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="new" id="new" />
                    <Label htmlFor="new">Add new billing address</Label>
                  </div>
                  {addresses.filter(a => a.address_type === 'billing').map((address) => (
                    <div key={address.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={address.id.toString()} id={`billing-${address.id}`} />
                      <Label htmlFor={`billing-${address.id}`}>
                        {address.full_name}, {address.line1}, {address.city}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Shipping Method */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Method</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={shippingMethod} onValueChange={setShippingMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Shipping (3-5 days)</SelectItem>
                    <SelectItem value="express">Express Shipping (1-2 days)</SelectItem>
                    <SelectItem value="overnight">Overnight Shipping</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cod">Cash on Delivery</SelectItem>
                    <SelectItem value="stripe">Credit/Debit Card (Stripe)</SelectItem>
                    <SelectItem value="razorpay">UPI/Net Banking (Razorpay)</SelectItem>
                  </SelectContent>
                </Select>

                {paymentMethod === 'stripe' && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-700">
                      <strong>Note:</strong> Stripe integration placeholder. In production, implement actual Stripe checkout.
                    </p>
                  </div>
                )}

                {paymentMethod === 'razorpay' && (
                  <div className="mt-4 p-4 bg-green-50 rounded-md">
                    <p className="text-sm text-green-700">
                      <strong>Note:</strong> Razorpay integration placeholder. In production, implement actual Razorpay checkout.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {state.items.map((item) => (
                    <div key={item.cartItemId} className="flex items-center space-x-3">
                      <img
                        src={item.image || '/placeholder.svg'}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-600">
                          {item.brandName && `${item.brandName} • `}
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-medium">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18%)</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <Button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white mt-6"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Placing Order...' : 'Place Order'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
