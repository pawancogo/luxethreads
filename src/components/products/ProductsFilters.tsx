import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { X } from 'lucide-react';
// Note: Fabrics, colors, and sizes should come from attribute_types API
// For now, using static arrays - these should be fetched from backend
const fabrics = ['cotton', 'silk', 'linen'];
const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Pink', 'Purple'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

interface ProductsFiltersProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  selectedCategory: string;
  selectedFabrics: string[];
  selectedColors: string[];
  selectedSizes: string[];
  priceRange: number[];
  onFiltersChange: (filters: {
    category: string;
    fabrics: string[];
    colors: string[];
    sizes: string[];
    priceRange: number[];
  }) => void;
}

const ProductsFilters: React.FC<ProductsFiltersProps> = ({
  showFilters,
  setShowFilters,
  selectedCategory,
  selectedFabrics,
  selectedColors,
  selectedSizes,
  priceRange,
  onFiltersChange
}) => {
  const handleCategoryChange = (category: string) => {
    onFiltersChange({
      category,
      fabrics: selectedFabrics,
      colors: selectedColors,
      sizes: selectedSizes,
      priceRange
    });
  };

  const handleFabricChange = (fabric: string, checked: boolean) => {
    const newFabrics = checked
      ? [...selectedFabrics, fabric]
      : selectedFabrics.filter(f => f !== fabric);
    
    onFiltersChange({
      category: selectedCategory,
      fabrics: newFabrics,
      colors: selectedColors,
      sizes: selectedSizes,
      priceRange
    });
  };

  const handleColorChange = (color: string, checked: boolean) => {
    const newColors = checked
      ? [...selectedColors, color]
      : selectedColors.filter(c => c !== color);
    
    onFiltersChange({
      category: selectedCategory,
      fabrics: selectedFabrics,
      colors: newColors,
      sizes: selectedSizes,
      priceRange
    });
  };

  const handleSizeChange = (size: string, checked: boolean) => {
    const newSizes = checked
      ? [...selectedSizes, size]
      : selectedSizes.filter(s => s !== size);
    
    onFiltersChange({
      category: selectedCategory,
      fabrics: selectedFabrics,
      colors: selectedColors,
      sizes: newSizes,
      priceRange
    });
  };

  const handlePriceChange = (newPriceRange: number[]) => {
    onFiltersChange({
      category: selectedCategory,
      fabrics: selectedFabrics,
      colors: selectedColors,
      sizes: selectedSizes,
      priceRange: newPriceRange
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      category: 'all',
      fabrics: [],
      colors: [],
      sizes: [],
      priceRange: [0, 10000]
    });
  };

  const activeFiltersCount = 
    (selectedCategory !== 'all' ? 1 : 0) +
    selectedFabrics.length +
    selectedColors.length +
    selectedSizes.length +
    (priceRange[0] !== 0 || priceRange[1] !== 10000 ? 1 : 0);

  return (
    <div className={`w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'} ${showFilters ? 'fixed inset-0 z-50 bg-white md:relative md:inset-auto md:z-auto' : ''}`}>
      <div className="h-full overflow-y-auto border-r border-gray-200">
        {/* Mobile Filter Header */}
        {showFilters && (
          <div className="md:hidden flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-medium">Filters</h3>
            <button onClick={() => setShowFilters(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>
        )}

        <div className="p-4 space-y-6">
          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="pb-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">FILTERS</h4>
                <button
                  onClick={clearFilters}
                  className="text-sm text-pink-500 hover:text-pink-600"
                >
                  CLEAR ALL
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {/* {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full">
                    {categories.find(c => c.id === selectedCategory)?.name}
                    <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleCategoryChange('all')} />
                  </span>
                )} */}
                {selectedFabrics.map(fabric => (
                  <span key={fabric} className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full">
                    {fabric}
                    <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleFabricChange(fabric, false)} />
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          {/* <div>
            <h4 className="font-medium text-gray-900 mb-3 text-sm uppercase tracking-wide">CATEGORIES</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategory === category.id}
                    onCheckedChange={() => handleCategoryChange(category.id)}
                    className="border-gray-300"
                  />
                  <Label htmlFor={`category-${category.id}`} className="ml-3 text-sm text-gray-700">
                    {category.name} ({category.count})
                  </Label>
                </div>
              ))}
            </div>
          </div> */}

          {/* Price */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3 text-sm uppercase tracking-wide">PRICE</h4>
            <div className="px-2">
              <Slider
                value={priceRange}
                onValueChange={handlePriceChange}
                max={10000}
                min={0}
                step={100}
                className="mb-4"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>₹{priceRange[0]}</span>
                <span>₹{priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Fabric */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3 text-sm uppercase tracking-wide">FABRIC</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {fabrics.map((fabric) => (
                <div key={fabric} className="flex items-center">
                  <Checkbox
                    id={`fabric-${fabric}`}
                    checked={selectedFabrics.includes(fabric)}
                    onCheckedChange={(checked) => handleFabricChange(fabric, checked as boolean)}
                    className="border-gray-300"
                  />
                  <Label htmlFor={`fabric-${fabric}`} className="ml-3 text-sm text-gray-700 capitalize">
                    {fabric}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3 text-sm uppercase tracking-wide">COLOR</h4>
            <div className="grid grid-cols-4 gap-3">
              {colors.map((color) => (
                <div key={color} className="flex flex-col items-center">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id={`color-${color}`}
                      checked={selectedColors.includes(color)}
                      onChange={(e) => handleColorChange(color, e.target.checked)}
                      className="sr-only"
                    />
                    <label
                      htmlFor={`color-${color}`}
                      className={`block w-8 h-8 rounded-full border-2 cursor-pointer ${
                        selectedColors.includes(color) ? 'border-gray-900 ring-2 ring-offset-2 ring-gray-900' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                    />
                  </div>
                  <span className="text-xs mt-1 text-gray-600">{color}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3 text-sm uppercase tracking-wide">SIZE</h4>
            <div className="grid grid-cols-4 gap-2">
              {sizes.map((size) => (
                <label
                  key={size}
                  className={`flex items-center justify-center h-10 border-2 rounded cursor-pointer text-sm ${
                    selectedSizes.includes(size)
                      ? 'border-pink-500 bg-pink-50 text-pink-600'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSizes.includes(size)}
                    onChange={(e) => handleSizeChange(size, e.target.checked)}
                    className="sr-only"
                  />
                  {size}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsFilters;