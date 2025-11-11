# Migration Guide: Context to Zustand Stores

## Overview
This project has been migrated from React Context API to Zustand for state management. This provides better performance, simpler code, and easier testing.

## What Changed

### 1. UserContext → userStore
**Old:**
```typescript
import { useUser } from '@/contexts/UserContext';
const { user, login, logout } = useUser();
```

**New:**
```typescript
import { useUser, useUserActions } from '@/stores/userStore';
const user = useUser(); // Only subscribes to user changes
const { login, logout } = useUserActions(); // Only subscribes to actions
```

**Performance:** Components only re-render when the specific data they use changes.

### 2. CartContext → cartStore
**Old:**
```typescript
import { useCart } from '@/contexts/CartContext';
const { state, addToCart } = useCart();
```

**New:**
```typescript
import { useCart, useCartItems, useCartTotal } from '@/stores/cartStore';
const { state, addToCart } = useCart(); // Full API (backward compatible)
// OR use optimized selectors:
const items = useCartItems(); // Only re-renders when items change
const total = useCartTotal(); // Only re-renders when total changes
```

### 3. FilterContext → filterStore
**Old:**
```typescript
import { useFilter } from '@/contexts/FilterContext';
const { filters, results, setFilter } = useFilter();
```

**New:**
```typescript
import { useFilter, useFilters, useFilterResults } from '@/stores/filterStore';
const filter = useFilter(); // Full API (backward compatible)
// OR use optimized selectors:
const filters = useFilters(); // Only re-renders when filters change
const results = useFilterResults(); // Only re-renders when results change
```

### 4. SupplierContext → supplierStore
**Old:**
```typescript
import { useSupplier } from '@/contexts/SupplierContext';
const { profile, products, refreshProfile } = useSupplier();
```

**New:**
```typescript
import { useSupplier, useSupplierProfile, useSupplierProducts } from '@/stores/supplierStore';
const supplier = useSupplier(); // Full API (backward compatible)
// OR use optimized selectors:
const profile = useSupplierProfile(); // Only re-renders when profile changes
const products = useSupplierProducts(); // Only re-renders when products change
```

### 5. NotificationContext → notificationStore
**Old:**
```typescript
import { useNotifications } from '@/contexts/NotificationContext';
const { notifications, unreadCount, markAsRead } = useNotifications();
```

**New:**
```typescript
import { useNotifications, useNotificationList, useUnreadCount } from '@/stores/notificationStore';
const notifications = useNotifications(); // Full API (backward compatible)
// OR use optimized selectors:
const notifications = useNotificationList(); // Only re-renders when notifications change
const unreadCount = useUnreadCount(); // Only re-renders when count changes
```

### 6. ProductContext → Removed
**Old:**
```typescript
import { useProduct } from '@/contexts/ProductContext';
const { products, categories, brands } = useProduct();
```

**New:**
```typescript
// Use React Query hooks directly
import { useProductsQuery } from '@/hooks/useProductsQuery';
import { useCategoriesQuery } from '@/hooks/useCategoriesQuery';
import { useBrandsQuery } from '@/hooks/useBrandsQuery';

const { data: products } = useProductsQuery();
const { data: categories } = useCategoriesQuery();
const { data: brands } = useBrandsQuery();
```

## Performance Benefits

1. **Selective Re-renders:** Components only re-render when the specific data they subscribe to changes
2. **No Provider Nesting:** No deep provider trees, reducing component tree complexity
3. **Better DevTools:** Zustand DevTools provide better debugging experience
4. **Smaller Bundle:** Zustand is smaller than managing multiple contexts

## Migration Steps for Components

1. **Update imports:**
   - Replace context imports with store imports
   - Use selector hooks for better performance

2. **Update hook usage:**
   - Most hooks maintain the same API (backward compatible)
   - Use selector hooks when you only need specific data

3. **Remove Provider usage:**
   - No need to wrap components in providers
   - Stores are available globally

## Example Migration

**Before:**
```typescript
function MyComponent() {
  const { user, isLoading } = useUser();
  const { state: cartState } = useCart();
  
  if (isLoading) return <Loading />;
  return <div>{user?.name} - {cartState.itemCount} items</div>;
}
```

**After (Optimized):**
```typescript
function MyComponent() {
  const user = useUser(); // Only re-renders when user changes
  const isLoading = useUserLoading(); // Only re-renders when loading changes
  const itemCount = useCartItemCount(); // Only re-renders when count changes
  
  if (isLoading) return <Loading />;
  return <div>{user?.name} - {itemCount} items</div>;
}
```

## App.tsx Changes

**Before:**
```typescript
<UserProvider>
  <SupplierProvider>
    <FilterProvider>
      <CartProvider>
        <NotificationProvider>
          <ProductProvider>
            <AppContent />
          </ProductProvider>
        </NotificationProvider>
      </CartProvider>
    </FilterProvider>
  </SupplierProvider>
</UserProvider>
```

**After:**
```typescript
<QueryClientProvider>
  <TooltipProvider>
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  </TooltipProvider>
</QueryClientProvider>
```

Much simpler! Stores are initialized automatically when hooks are called.

## Notes

- All stores maintain backward compatibility with existing component code
- Performance optimizations are optional - use selector hooks when needed
- React Query is still used for server state (cart, products, etc.)
- Zustand is used for client state (user, filters, notifications)

