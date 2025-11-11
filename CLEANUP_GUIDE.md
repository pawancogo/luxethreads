# Cleanup Guide: Removing Old Context Files

## Overview
After successful migration to Zustand, the old context files can be safely removed. This guide provides step-by-step instructions for cleanup.

## ⚠️ Important Notes

1. **Backup First**: Make sure you have a backup or commit before removing files
2. **Test Thoroughly**: Run the application and test all features before removing
3. **Keep Types**: Some type definitions may still be referenced - we've extracted them to `src/types/product.ts`

## Files to Remove

### Context Files (Safe to Remove)
These files are no longer used and can be deleted:

```
src/contexts/UserContext.tsx          ✅ Migrated to stores/userStore.ts
src/contexts/CartContext.tsx          ✅ Migrated to stores/cartStore.ts
src/contexts/FilterContext.tsx        ✅ Migrated to stores/filterStore.ts
src/contexts/SupplierContext.tsx       ✅ Migrated to stores/supplierStore.ts
src/contexts/NotificationContext.tsx   ✅ Migrated to stores/notificationStore.ts
src/contexts/ProductContext.tsx        ✅ Removed (use React Query hooks directly)
```

### Keep These Context Files
```
src/contexts/RbacContext.tsx          ⚠️ Still in use (if needed)
```

## Step-by-Step Cleanup

### Step 1: Verify No Active Imports
Run this command to check for any remaining imports:

```bash
grep -r "from '@/contexts/(UserContext|CartContext|FilterContext|SupplierContext|NotificationContext|ProductContext)'" src/
```

If any files are found, update them first before removing context files.

### Step 2: Update Type Imports
Some files may still import types from old contexts. Update them:

**Old:**
```typescript
import { Product, CartItem } from '@/contexts/CartContext';
import { User, UserRole } from '@/contexts/UserContext';
```

**New:**
```typescript
import { Product, CartItem } from '@/types/product';
import { User, UserRole } from '@/stores/userStore';
```

### Step 3: Remove Context Files
Once verified, delete the context files:

```bash
# Remove migrated contexts
rm src/contexts/UserContext.tsx
rm src/contexts/CartContext.tsx
rm src/contexts/FilterContext.tsx
rm src/contexts/SupplierContext.tsx
rm src/contexts/NotificationContext.tsx
rm src/contexts/ProductContext.tsx
```

### Step 4: Update Test Files
Test files may need updates. Check and update:

```
src/__tests__/contexts/UserContext.test.tsx
src/__tests__/contexts/CartContext.test.tsx
src/__tests__/contexts/ProductContext.test.tsx
```

**Option 1**: Update tests to use new stores
**Option 2**: Remove tests if contexts are fully migrated

### Step 5: Clean Up Unused Imports
Run your linter to find and remove unused imports:

```bash
npm run lint -- --fix
```

### Step 6: Verify Build
Ensure everything still builds:

```bash
npm run build
```

### Step 7: Run Tests
Run your test suite:

```bash
npm test
```

## Files That May Need Updates

### Type-Only Imports
These files import types but don't use contexts:
- `src/lib/productMapper.ts` - May import Product type
- `src/data/mockProducts.ts` - May import Product type
- `src/hooks/useProductsPage.ts` - May import Product type

**Action**: Update to import from `@/types/product`

### Test Files
- `src/__tests__/contexts/*.test.tsx` - Update or remove
- `src/__tests__/components/*.test.tsx` - May reference old contexts

**Action**: Update tests to use new stores or mock stores

## Verification Checklist

- [ ] No imports from old contexts in source files
- [ ] All types imported from correct locations
- [ ] Application builds successfully
- [ ] All tests pass
- [ ] Application runs without errors
- [ ] All features work correctly
- [ ] No console errors or warnings

## Rollback Plan

If something goes wrong:

1. **Git Rollback:**
   ```bash
   git checkout HEAD -- src/contexts/
   ```

2. **Restore from Backup:**
   - Restore deleted files from your backup

3. **Gradual Rollback:**
   - Restore one context at a time if needed

## Post-Cleanup

After cleanup:

1. **Update Documentation:**
   - Remove references to old contexts
   - Update architecture diagrams
   - Update onboarding docs

2. **Update CI/CD:**
   - Ensure build scripts don't reference old contexts
   - Update deployment docs if needed

3. **Team Communication:**
   - Notify team about cleanup
   - Update shared knowledge base

## Summary

The migration is complete and old context files can be safely removed. The new Zustand stores provide better performance and maintainability. Follow this guide to clean up old files while ensuring nothing breaks.

---

**Status**: Ready for cleanup
**Risk Level**: Low (with proper verification)
**Estimated Time**: 15-30 minutes

