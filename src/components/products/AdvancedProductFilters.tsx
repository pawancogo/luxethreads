import React, { useState, useEffect } from 'react';
import { X, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useFilter } from '@/contexts/FilterContext';
import { ProductFilters } from '@/types/filters';

interface AdvancedProductFiltersProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

const AdvancedProductFilters: React.FC<AdvancedProductFiltersProps> = ({
  isOpen,
  onToggle,
  className = '',
}) => {
  const {
    filters,
    setFilter,
    clearFilter,
    clearAllFilters,
    getActiveFilters,
    isFilterActive,
    availableFilters,
  } = useFilter();

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['price', 'category', 'brand', 'flags'])
  );

  const activeFilters = getActiveFilters();
  const hasActiveFilters = activeFilters.length > 0;

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const handlePriceChange = (values: number[]) => {
    setFilter('min_price', values[0]);
    setFilter('max_price', values[1]);
  };

  const priceRange = availableFilters?.price_range || { min: 0, max: 10000 };
  const currentPriceRange = [
    filters.min_price || priceRange.min,
    filters.max_price || priceRange.max,
  ];

  return (
    <div className={`${className}`}>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <h3 className="font-semibold">Filters</h3>
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2">
              {activeFilters.length}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-sm"
            >
              Clear All
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onToggle}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Desktop/Expanded Content */}
      <div
        className={`
          ${isOpen ? 'block' : 'hidden md:block'}
          bg-white border-r border-gray-200 h-full overflow-y-auto
        `}
      >
        <div className="p-4 space-y-6">
          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="pb-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-sm uppercase tracking-wide">Active Filters</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-xs text-pink-600 hover:text-pink-700"
                >
                  Clear All
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1 pr-1"
                  >
                    <span className="text-xs">
                      {filter.label}:{' '}
                      {filter.min !== undefined && filter.max !== undefined
                        ? `₹${filter.min} - ₹${filter.max}`
                        : filter.value?.toString() || filter.label}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => {
                        if (filter.type === 'price') {
                          clearFilter('min_price');
                          clearFilter('max_price');
                        } else {
                          clearFilter(filter.type as keyof ProductFilters);
                        }
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Price Range */}
          <div className="border-b border-gray-200 pb-4">
            <button
              type="button"
              onClick={() => toggleSection('price')}
              className="flex items-center justify-between w-full mb-3"
            >
              <h4 className="font-semibold text-sm uppercase tracking-wide">Price Range</h4>
              {expandedSections.has('price') ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {expandedSections.has('price') && (
              <div className="space-y-4">
                <Slider
                  value={currentPriceRange}
                  onValueChange={handlePriceChange}
                  min={priceRange.min}
                  max={priceRange.max}
                  step={100}
                  className="w-full"
                />
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Label className="text-xs text-gray-600">Min</Label>
                    <Input
                      type="number"
                      value={filters.min_price || priceRange.min}
                      onChange={(e) => setFilter('min_price', Number(e.target.value))}
                      className="mt-1"
                      min={priceRange.min}
                      max={priceRange.max}
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs text-gray-600">Max</Label>
                    <Input
                      type="number"
                      value={filters.max_price || priceRange.max}
                      onChange={(e) => setFilter('max_price', Number(e.target.value))}
                      className="mt-1"
                      min={priceRange.min}
                      max={priceRange.max}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Categories */}
          {availableFilters?.categories && availableFilters.categories.length > 0 && (
            <div className="border-b border-gray-200 pb-4">
              <button
                type="button"
                onClick={() => toggleSection('category')}
                className="flex items-center justify-between w-full mb-3"
              >
                <h4 className="font-semibold text-sm uppercase tracking-wide">Categories</h4>
                {expandedSections.has('category') ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              {expandedSections.has('category') && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {availableFilters.categories.map((category) => (
                    <div key={category.id} className="flex items-center">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={
                          filters.category_id === category.id ||
                          filters.category_slug === category.slug
                        }
                        onCheckedChange={(checked) => {
                          if (checked) {
                            clearFilter('category_slug');
                            setFilter('category_id', category.id);
                          } else {
                            clearFilter('category_id');
                          }
                        }}
                      />
                      <Label
                        htmlFor={`category-${category.id}`}
                        className="ml-3 text-sm text-gray-700 cursor-pointer"
                      >
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Brands */}
          {availableFilters?.brands && availableFilters.brands.length > 0 && (
            <div className="border-b border-gray-200 pb-4">
              <button
                type="button"
                onClick={() => toggleSection('brand')}
                className="flex items-center justify-between w-full mb-3"
              >
                <h4 className="font-semibold text-sm uppercase tracking-wide">Brands</h4>
                {expandedSections.has('brand') ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              {expandedSections.has('brand') && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {availableFilters.brands.map((brand) => (
                    <div key={brand.id} className="flex items-center">
                      <Checkbox
                        id={`brand-${brand.id}`}
                        checked={
                          filters.brand_id === brand.id ||
                          filters.brand_slug === brand.slug
                        }
                        onCheckedChange={(checked) => {
                          if (checked) {
                            clearFilter('brand_slug');
                            setFilter('brand_id', brand.id);
                          } else {
                            clearFilter('brand_id');
                          }
                        }}
                      />
                      <Label
                        htmlFor={`brand-${brand.id}`}
                        className="ml-3 text-sm text-gray-700 cursor-pointer"
                      >
                        {brand.name}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Phase 2 Flags */}
          {availableFilters?.flags && availableFilters.flags.length > 0 && (
            <div className="border-b border-gray-200 pb-4">
              <button
                type="button"
                onClick={() => toggleSection('flags')}
                className="flex items-center justify-between w-full mb-3"
              >
                <h4 className="font-semibold text-sm uppercase tracking-wide">Product Flags</h4>
                {expandedSections.has('flags') ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              {expandedSections.has('flags') && (
                <div className="space-y-2">
                  {availableFilters.flags.map((flag) => (
                    <div key={flag.key} className="flex items-center">
                      <Checkbox
                        id={`flag-${flag.key}`}
                        checked={isFilterActive(flag.key as keyof ProductFilters)}
                        onCheckedChange={(checked) => {
                          setFilter(flag.key as keyof ProductFilters, checked as boolean);
                        }}
                      />
                      <Label
                        htmlFor={`flag-${flag.key}`}
                        className="ml-3 text-sm text-gray-700 cursor-pointer"
                      >
                        {flag.label}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Stock Status */}
          <div className="border-b border-gray-200 pb-4">
            <button
              type="button"
              onClick={() => toggleSection('stock')}
              className="flex items-center justify-between w-full mb-3"
            >
              <h4 className="font-semibold text-sm uppercase tracking-wide">Stock Status</h4>
              {expandedSections.has('stock') ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {expandedSections.has('stock') && (
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox
                    id="stock-in"
                    checked={filters.in_stock === true}
                    onCheckedChange={(checked) => {
                      setFilter('in_stock', checked ? true : undefined);
                    }}
                  />
                  <Label htmlFor="stock-in" className="ml-3 text-sm text-gray-700 cursor-pointer">
                    In Stock Only
                  </Label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="stock-out"
                    checked={filters.in_stock === false}
                    onCheckedChange={(checked) => {
                      setFilter('in_stock', checked ? false : undefined);
                    }}
                  />
                  <Label htmlFor="stock-out" className="ml-3 text-sm text-gray-700 cursor-pointer">
                    Out of Stock
                  </Label>
                </div>
              </div>
            )}
          </div>

          {/* Rating */}
          <div className="border-b border-gray-200 pb-4">
            <button
              type="button"
              onClick={() => toggleSection('rating')}
              className="flex items-center justify-between w-full mb-3"
            >
              <h4 className="font-semibold text-sm uppercase tracking-wide">Minimum Rating</h4>
              {expandedSections.has('rating') ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {expandedSections.has('rating') && (
              <div className="space-y-2">
                <Select
                  value={filters.min_rating?.toString() || ''}
                  onValueChange={(value) => {
                    setFilter('min_rating', value ? Number(value) : undefined);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select minimum rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Rating</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="3">3+ Stars</SelectItem>
                    <SelectItem value="2">2+ Stars</SelectItem>
                    <SelectItem value="1">1+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Sorting */}
          {availableFilters?.sort_options && (
            <div className="pb-4">
              <button
                type="button"
                onClick={() => toggleSection('sort')}
                className="flex items-center justify-between w-full mb-3"
              >
                <h4 className="font-semibold text-sm uppercase tracking-wide">Sort By</h4>
                {expandedSections.has('sort') ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              {expandedSections.has('sort') && (
                <Select
                  value={filters.sort_by || 'recommended'}
                  onValueChange={(value) => {
                    setFilter('sort_by', value as ProductFilters['sort_by']);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFilters.sort_options.map((option) => (
                      <SelectItem key={option.value} value={option.value || 'recommended'}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedProductFilters;


