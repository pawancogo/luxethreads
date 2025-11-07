import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Sparkles, Award } from 'lucide-react';

interface ProductBadgesProps {
  is_featured?: boolean;
  is_bestseller?: boolean;
  is_new_arrival?: boolean;
  is_trending?: boolean;
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';
  className?: string;
}

export const ProductBadges: React.FC<ProductBadgesProps> = ({
  is_featured,
  is_bestseller,
  is_new_arrival,
  is_trending,
  stockStatus,
  className = '',
}) => {
  const badges: React.ReactNode[] = [];
  
  if (is_featured) {
    badges.push(
      <Badge key="featured" variant="default" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <Star className="w-3 h-3 mr-1" />
        Featured
      </Badge>
    );
  }
  
  if (is_bestseller) {
    badges.push(
      <Badge key="bestseller" variant="default" className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
        <Award className="w-3 h-3 mr-1" />
        Bestseller
      </Badge>
    );
  }
  
  if (is_new_arrival) {
    badges.push(
      <Badge key="new" variant="default" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
        <Sparkles className="w-3 h-3 mr-1" />
        New
      </Badge>
    );
  }
  
  if (is_trending) {
    badges.push(
      <Badge key="trending" variant="default" className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
        <TrendingUp className="w-3 h-3 mr-1" />
        Trending
      </Badge>
    );
  }
  
  if (stockStatus === 'low_stock') {
    badges.push(
      <Badge key="low-stock" variant="outline" className="border-yellow-500 text-yellow-700 bg-yellow-50">
        Low Stock
      </Badge>
    );
  }
  
  if (stockStatus === 'out_of_stock') {
    badges.push(
      <Badge key="out-of-stock" variant="outline" className="border-red-500 text-red-700 bg-red-50">
        Out of Stock
      </Badge>
    );
  }
  
  if (badges.length === 0) return null;
  
  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {badges}
    </div>
  );
};


