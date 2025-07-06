# Complete Setup Guide: Fashion E-commerce Application

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Initialization](#project-initialization)
3. [Configuration Files Explained](#configuration-files-explained)
4. [Dependencies Installation](#dependencies-installation)
5. [Project Structure Setup](#project-structure-setup)
6. [Component Development Process](#component-development-process)
7. [Deployment Setup](#deployment-setup)

## Prerequisites

Before starting, ensure you have:
- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** for version control
- A code editor like **VS Code**

### Recommended VS Code Extensions
```
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Hero
- Auto Rename Tag
- Bracket Pair Colorizer
```

## Project Initialization

### Step 1: Create Vite React Project
```bash
# Create new Vite project with React and TypeScript
npm create vite@latest fashion-store -- --template react-ts

# Navigate to project directory
cd fashion-store

# Install dependencies
npm install
```

### Step 2: Install Additional Dependencies
```bash
# Core UI and styling dependencies
npm install tailwindcss postcss autoprefixer
npm install @tailwindcss/typography tailwindcss-animate
npm install class-variance-authority clsx tailwind-merge

# shadcn/ui dependencies
npm install @radix-ui/react-slot
npm install @radix-ui/react-toast
npm install @radix-ui/react-dialog
npm install @radix-ui/react-dropdown-menu
npm install @radix-ui/react-popover
npm install @radix-ui/react-select
npm install @radix-ui/react-separator
npm install @radix-ui/react-avatar
npm install @radix-ui/react-label
npm install @radix-ui/react-checkbox
npm install @radix-ui/react-accordion
npm install @radix-ui/react-tabs
npm install @radix-ui/react-navigation-menu

# React ecosystem
npm install react-router-dom
npm install @tanstack/react-query
npm install react-hook-form @hookform/resolvers
npm install zod

# Icons and utilities
npm install lucide-react
npm install date-fns
npm install sonner

# Charts (if needed)
npm install recharts
```

## Configuration Files Explained

### 1. `vite.config.ts` - Build Tool Configuration
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  // Development server configuration
  server: {
    host: "::",      // Listen on all interfaces
    port: 8080,      // Development port
  },
  
  // Plugins for React support
  plugins: [
    react(),         // React support with SWC compiler (faster than Babel)
  ],
  
  // Path aliases for cleaner imports
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),  // Use @ for src directory
    },
  },
});
```

**What this does:**
- Sets up React with SWC compiler for faster builds
- Configures development server on port 8080
- Creates path alias `@` pointing to `src` directory
- Enables hot module replacement for development

### 2. `tailwind.config.ts` - CSS Framework Configuration
```typescript
import type { Config } from "tailwindcss";

export default {
  // Dark mode configuration
  darkMode: ["class"],
  
  // Content paths for Tailwind to scan
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      // Custom color scheme
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        // ... more color definitions
      },
      
      // Custom animations
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
      }
    }
  },
  
  // Plugins for additional functionality
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
```

**What this does:**
- Configures Tailwind to scan all TypeScript/JSX files
- Sets up custom color system using CSS variables
- Adds custom animations for UI components
- Enables dark mode support
- Includes animation plugin for smoother transitions

### 3. `tsconfig.json` - TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",           // JavaScript target version
    "lib": ["ES2020", "DOM", "DOM.Iterable"],  // Available libraries
    "allowJs": true,              // Allow JavaScript files
    "skipLibCheck": true,         // Skip type checking of declaration files
    "esModuleInterop": true,      // Enable CommonJS/ES6 interop
    "allowSyntheticDefaultImports": true,
    "strict": true,               // Enable strict type checking
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,              // Don't emit JS files (Vite handles this)
    "jsx": "react-jsx",          // JSX compilation mode
    
    // Path mapping (matches Vite config)
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],            // Files to include
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**What this does:**
- Enables strict TypeScript checking
- Configures JSX compilation for React
- Sets up path mapping for cleaner imports
- Optimizes for modern JavaScript features

### 4. `postcss.config.js` - CSS Processing
```javascript
export default {
  plugins: {
    tailwindcss: {},    // Process Tailwind CSS
    autoprefixer: {},   // Add vendor prefixes automatically
  },
}
```

**What this does:**
- Processes Tailwind CSS classes
- Automatically adds browser vendor prefixes
- Optimizes CSS output

### 5. `components.json` - shadcn/ui Configuration
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib"
  }
}
```

**What this does:**
- Configures shadcn/ui component generation
- Sets up component and utility paths
- Enables CSS variables for theming

## Dependencies Installation Process

### Core Dependencies Breakdown

#### 1. **React Ecosystem**
```bash
# React Router for navigation
npm install react-router-dom
npm install @types/react-router-dom  # TypeScript types
```

#### 2. **State Management**
```bash
# TanStack Query for server state
npm install @tanstack/react-query

# Form handling
npm install react-hook-form @hookform/resolvers zod
```

#### 3. **UI Components**
```bash
# Radix UI primitives (headless components)
npm install @radix-ui/react-slot
npm install @radix-ui/react-toast
npm install @radix-ui/react-dialog
# ... more Radix components as needed
```

#### 4. **Styling System**
```bash
# Tailwind CSS and utilities
npm install tailwindcss postcss autoprefixer
npm install tailwindcss-animate
npm install class-variance-authority clsx tailwind-merge
```

## Project Structure Setup

### Step 1: Create Directory Structure
```bash
mkdir -p src/{components,pages,contexts,hooks,lib,data}
mkdir -p src/components/ui
mkdir -p public
```

### Step 2: Initialize Core Files

#### `src/index.css` - Global Styles
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    /* ... more CSS variables */
  }
  
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark mode variables */
  }
}
```

#### `src/lib/utils.ts` - Utility Functions
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Component Development Process

### Step 1: Set up shadcn/ui Components
```bash
# Initialize shadcn/ui
npx shadcn-ui@latest init

# Add specific components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add toast
```

### Step 2: Create Context Providers
```typescript
// src/contexts/CartContext.tsx
import React, { createContext, useContext, useReducer } from 'react';

interface CartState {
  items: CartItem[];
  total: number;
}

const CartContext = createContext<CartState | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
```

### Step 3: Set up Routing
```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      {/* More routes */}
    </Routes>
  </BrowserRouter>
);
```

## Development Workflow

### 1. **Start Development Server**
```bash
npm run dev
```
This starts Vite development server with:
- Hot module replacement
- Fast refresh for React components
- TypeScript checking
- Tailwind CSS processing

### 2. **Build for Production**
```bash
npm run build
```
This creates optimized production build:
- Minified JavaScript and CSS
- Tree-shaken unused code
- Optimized assets

### 3. **Preview Production Build**
```bash
npm run preview
```
Serves production build locally for testing.

## Deployment Setup

### 1. **Netlify Deployment**
```bash
# Build command
npm run build

# Publish directory
dist
```

### 2. **Vercel Deployment**
```json
// vercel.json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 3. **Environment Variables**
```bash
# .env.local (not committed to git)
VITE_API_URL=https://api.yourapp.com
VITE_STRIPE_KEY=pk_test_...
```

## Common Issues and Solutions

### 1. **Import Path Issues**
```typescript
// Wrong
import Button from '../../../components/ui/Button'

// Correct (with path alias)
import Button from '@/components/ui/Button'
```

### 2. **Tailwind Classes Not Working**
- Ensure PostCSS is configured correctly
- Check that content paths include all component files
- Verify CSS import order in main.tsx

### 3. **TypeScript Errors**
- Install @types packages for libraries
- Configure tsconfig.json properly
- Use proper type definitions

## Resources for Learning

### Documentation
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query)

### Tutorials
- [React Router Tutorial](https://reactrouter.com/tutorial)
- [Tailwind CSS Course](https://tailwindcss.com/course)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

This setup guide provides everything needed to create and understand this fashion e-commerce application from scratch.