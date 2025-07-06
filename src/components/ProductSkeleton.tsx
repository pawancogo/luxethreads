
const ProductSkeleton = () => {
  return (
    <div className="group relative bg-white border border-gray-200 rounded-md overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-[3/4] bg-gray-200" />
      
      {/* Content Skeleton */}
      <div className="p-3 space-y-2">
        {/* Brand name */}
        <div className="h-4 bg-gray-200 rounded w-20" />
        
        {/* Product name */}
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        
        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="h-5 bg-gray-200 rounded w-12" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>
        
        {/* Price */}
        <div className="flex items-center space-x-2">
          <div className="h-5 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-12" />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
        
        {/* Fabric & Category */}
        <div className="h-3 bg-gray-200 rounded w-24" />
        
        {/* Sizes */}
        <div className="flex items-center space-x-1">
          <div className="h-3 bg-gray-200 rounded w-10" />
          <div className="flex space-x-1">
            <div className="h-5 w-6 bg-gray-200 rounded" />
            <div className="h-5 w-6 bg-gray-200 rounded" />
            <div className="h-5 w-6 bg-gray-200 rounded" />
          </div>
        </div>
        
        {/* Colors */}
        <div className="flex items-center space-x-1">
          <div className="h-3 bg-gray-200 rounded w-12" />
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-gray-200 rounded-full" />
            <div className="w-3 h-3 bg-gray-200 rounded-full" />
            <div className="w-3 h-3 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;