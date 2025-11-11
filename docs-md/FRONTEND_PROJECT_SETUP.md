# Frontend Project Setup Guide

Complete setup guide for the `luxethreads` Vite + React frontend application.

## Overview

This is a modern frontend application built with:
- **Vite** - Fast build tool and dev server
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **React Router** - Client-side routing
- **Axios** - HTTP client

## Prerequisites

Before running the setup script, ensure you have:

- **git** - Version control
- **Node.js** - Version specified in `.node-version` (currently: 24.11.0)
- **npm** - Comes with Node.js

**Note:** Versions are managed via `.node-version` file (similar to `.nvmrc`). The setup script automatically reads this file.

## Quick Setup

Run the setup script from the frontend directory:

```bash
cd luxethreads
./setup_frontend.sh
```

This script will:
1. ✅ Check/install Node.js 24.11.0 (project-local via `.node-version`)
2. ✅ Install all npm dependencies
3. ✅ Verify setup completion

## Version Management

The project uses version files (similar to `.nvmrc` for Node.js):
- **`.node-version`** - Stores Node.js version (currently: 24.11.0)

This file is automatically read by:
- Setup script (`setup_frontend.sh`)
- Docker build scripts (`docker-build.sh`, `docker-compose.build.sh`)
- Version managers (nvm, asdf)

To change versions, simply edit this file - no code changes needed!

## Project-Local Configuration

**Important:** This setup script uses **project-local configuration only**:
- Uses `nvm use` (not `nvm alias default`) - only affects this project
- Uses `asdf local` via `.tool-versions` - only affects this project
- Respects existing `.node-version` or `.nvmrc` file
- **Won't affect other projects** on your system

## Docker Deployment

**📖 For Docker deployment instructions, see [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md)**

Quick Docker commands:
```bash
# Build Docker image
./docker-build.sh

# Run with docker-compose
docker-compose -f docker-compose.production.yml up -d
```

## Manual Setup (Alternative)

If you prefer to set up manually:

```bash
cd luxethreads

# Ensure Node.js version (project-local)
nvm use 24.11.0  # or asdf local nodejs 24.11.0

# Install dependencies
npm install
```

## Environment Variables

Create a `.env.local` file in the frontend directory (not committed to git):

```bash
# API endpoint
VITE_API_BASE_URL=http://localhost:3000/api/v1

# Environment
VITE_ENV=development
```

## Daily Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Type check
npm run type-check
```

## Project Structure

```
luxethreads/
├── src/
│   ├── components/      # React components
│   │   ├── admin/       # Admin components
│   │   ├── supplier/    # Supplier components
│   │   └── ui/          # UI components
│   ├── pages/           # Page components
│   ├── contexts/        # React contexts
│   ├── hooks/           # Custom hooks
│   ├── services/        # API services
│   └── utils/           # Utility functions
├── public/              # Static assets
├── package.json         # Dependencies
└── setup_frontend.sh    # Setup script
```

## Development Workflow

### Starting the Dev Server

```bash
npm run dev
```

The dev server will start at `http://localhost:5173` (Vite default port).

### Hot Module Replacement (HMR)

Vite provides instant HMR - changes to your code will reflect immediately in the browser without a full page reload.

### Building for Production

```bash
# Create production build
npm run build

# Preview the build locally
npm run preview
```

Production builds are output to the `dist/` directory.

## Managing Dependencies

```bash
# Add a new dependency
npm install <package-name>

# Add a dev dependency
npm install -D <package-name>

# Update dependencies
npm update

# Check for outdated packages
npm outdated

# Remove a dependency
npm uninstall <package-name>
```

## Key Features

### Admin Panel
- Role-based access control
- Dynamic navigation
- User, product, order management

### Supplier Dashboard
- Product management
- Order fulfillment
- Analytics and reports

### Customer Features
- Product browsing and search
- Shopping cart
- Order tracking
- Wishlist

## Troubleshooting

### Node.js Version Issues

**Problem:** Wrong Node.js version
```bash
# Check current version
node -v

# Set project-local version
nvm use 24.11.0
# or
asdf local nodejs 24.11.0
```

**Problem:** Node.js not found after installation
```bash
# Reload shell
hash -r
# or restart terminal
```

### npm Install Issues

**Problem:** npm install fails
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Problem:** Permission errors
```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm
```

### Dev Server Issues

**Problem:** Port already in use
```bash
# Find process using port 5173
lsof -ti:5173

# Kill process
kill -9 $(lsof -ti:5173)

# Or use different port
npm run dev -- --port 3001
```

**Problem:** Module not found errors
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

### Build Issues

**Problem:** Build fails
```bash
# Check for TypeScript errors
npm run type-check

# Check for linting errors
npm run lint

# Clear build cache
rm -rf dist
npm run build
```

## TypeScript

The project uses TypeScript for type safety:

```bash
# Type check without building
npm run type-check

# Watch mode for type checking
npm run type-check -- --watch
```

## Styling

The project uses Tailwind CSS:

```bash
# Tailwind config: tailwind.config.ts
# Main styles: src/index.css
```

## API Integration

API calls are handled through:
- `src/services/api/` - API service layer
- `src/lib/axios.js` - Axios configuration
- Environment variables for API endpoints

## Testing

```bash
# Run tests (if configured)
npm test

# Run tests in watch mode
npm test -- --watch
```

## Next Steps

After setup:
1. Start the dev server: `npm run dev`
2. Access the app: `http://localhost:5173`
3. Check console for any errors
4. Verify API connection to backend

## Support

For issues or questions:
- Check browser console for errors
- Check terminal for build errors
- Verify environment variables are set correctly
- Ensure backend server is running if using API

