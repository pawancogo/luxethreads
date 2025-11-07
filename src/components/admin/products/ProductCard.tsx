import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Package, ShoppingBag, CheckCircle, XCircle } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  status: string;
  supplier: {
    id: number;
    company_name: string;
  };
  category: {
    id: number;
    name: string;
  };
  brand: {
    id: number;
    name: string;
  };
  base_price?: number;
  is_featured: boolean;
  is_bestseller: boolean;
  verified_at?: string;
  verified_by?: string;
  rejection_reason?: string;
  created_at: string;
  variants_count: number;
}

interface ProductCardProps {
  product: Product;
  selected?: boolean;
  onSelect?: (productId: number, selected: boolean) => void;
  onApprove?: (productId: number) => void;
  onReject?: (productId: number) => void;
  onDelete?: (productId: number) => void;
  onViewDetails?: (productId: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  selected = false,
  onSelect,
  onApprove,
  onReject,
  onDelete,
  onViewDetails,
}) => {
  const getStatusBadge = () => {
    switch (product.status) {
      case 'active':
        return <Badge variant="default" className="bg-green-600">Active</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'archived':
        return <Badge variant="secondary">Archived</Badge>;
      default:
        return <Badge variant="outline">{product.status}</Badge>;
    }
  };

  return (
    <Card className={selected ? 'border-2 border-blue-500' : ''}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2 flex-1">
          {onSelect && (
            <input
              type="checkbox"
              checked={selected}
              onChange={(e) => onSelect(product.id, e.target.checked)}
              className="w-4 h-4"
            />
          )}
          <CardTitle className="text-lg font-medium flex-1">{product.name}</CardTitle>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onViewDetails && (
              <DropdownMenuItem onClick={() => onViewDetails(product.id)}>
                View Details
              </DropdownMenuItem>
            )}
            {product.status === 'pending' && onApprove && (
              <DropdownMenuItem onClick={() => onApprove(product.id)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </DropdownMenuItem>
            )}
            {product.status === 'pending' && onReject && (
              <DropdownMenuItem onClick={() => onReject(product.id)}>
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(product.id)}
                className="text-red-600"
              >
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.short_description || product.description}
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Package className="h-4 w-4" />
            <span>{product.supplier.company_name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ShoppingBag className="h-4 w-4" />
            <span>{product.category.name} • {product.brand.name}</span>
          </div>
          {product.base_price && (
            <div className="text-sm font-medium">
              ₹{product.base_price.toFixed(2)}
            </div>
          )}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {getStatusBadge()}
            {product.is_featured && (
              <Badge variant="outline" className="bg-purple-50">Featured</Badge>
            )}
            {product.is_bestseller && (
              <Badge variant="outline" className="bg-orange-50">Bestseller</Badge>
            )}
            <span className="text-xs text-gray-500">
              {product.variants_count} variants
            </span>
          </div>
          {product.rejection_reason && (
            <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">
              <strong>Rejection Reason:</strong> {product.rejection_reason}
            </div>
          )}
          <div className="text-xs text-gray-500 mt-2">
            Created: {new Date(product.created_at).toLocaleDateString()}
            {product.verified_at && (
              <> • Verified: {new Date(product.verified_at).toLocaleDateString()}</>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;

