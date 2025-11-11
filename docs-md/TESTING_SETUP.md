# Frontend Testing Setup

## Installation

To run the frontend tests, you need to install the testing dependencies:

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/ui
```

## Test Scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

## Test Files Created

### Chunk 1: Authentication & User Management ✅
- `src/__tests__/auth.test.tsx` - Login and Signup form tests

### Chunk 2: Products & Search ✅
- `src/__tests__/products.test.tsx` - Product listing and search tests

### Chunk 3: Cart & Wishlist ✅
- `src/__tests__/cart-wishlist.test.tsx` - Cart and wishlist operations

### Chunk 4-10: Additional Test Files
- `src/__tests__/orders.test.tsx` - Order creation and management
- `src/__tests__/payments.test.tsx` - Payment processing
- `src/__tests__/returns-reviews.test.tsx` - Returns and reviews
- `src/__tests__/supplier.test.tsx` - Supplier dashboard
- `src/__tests__/admin.test.tsx` - Admin dashboard
- `src/__tests__/notifications-support.test.tsx` - Notifications and support
- `src/__tests__/e2e.test.tsx` - End-to-end integration tests

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

