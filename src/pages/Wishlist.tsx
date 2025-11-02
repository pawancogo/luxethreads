import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Heart, ShoppingCart } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { wishlistAPI } from '@/services/api';
import { Link } from 'react-router-dom';

interface WishlistItem {
  wishlist_item_id: number;
  product_variant: {
    variant_id: number;
    product_id: number;
    product_name: string;
    sku: string;
    price: number;
    discounted_price?: number;
    image_url?: string;
  };
}

const Wishlist = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadWishlist();
    }
  }, [user]);

  const loadWishlist = async () => {
    setIsLoading(true);
    try {
      const response = await wishlistAPI.getWishlist();
      setItems(response?.data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to load wishlist',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (itemId: number) => {
    try {
      await wishlistAPI.removeFromWishlist(itemId);
      toast({
        title: 'Success',
        description: 'Item removed from wishlist',
      });
      loadWishlist();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to remove item',
        variant: 'destructive',
      });
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">Please log in to view your wishlist</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle>My Wishlist</CardTitle>
          <CardDescription>Your saved items</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-500 mb-6">Start adding items you love!</p>
              <Link to="/products">
                <Button>Browse Products</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <Card key={item.wishlist_item_id}>
                  <CardContent className="pt-6">
                    {item.product_variant.image_url && (
                      <img
                        src={item.product_variant.image_url}
                        alt={item.product_variant.product_name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="font-semibold mb-2">{item.product_variant.product_name}</h3>
                    <p className="text-sm text-gray-500 mb-2">SKU: {item.product_variant.sku}</p>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        {item.product_variant.discounted_price ? (
                          <>
                            <span className="text-lg font-bold text-green-600">
                              ${item.product_variant.discounted_price.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500 line-through ml-2">
                              ${item.product_variant.price.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold">
                            ${item.product_variant.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/product/${item.product_variant.product_id}`}
                        className="flex-1"
                      >
                        <Button variant="outline" className="w-full">
                          View
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemove(item.wishlist_item_id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Wishlist;

