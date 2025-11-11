# Luxe Threads Frontend

React 18 + TypeScript application powered by Vite and shadcn/ui components.

## Requirements

- **Node.js** - Version specified in `.node-version` (currently: 24.11.0)
- **npm** - Comes with Node.js

Optional tooling: `pnpm` or `yarn` if you prefer alternate package managers.

**Note:** Versions are managed via `.node-version` file (similar to `.nvmrc` for Node.js). The setup script automatically reads this file.

## Initial Setup

From the frontend directory:

```bash
cd luxethreads
./setup_frontend.sh
```

**📖 For detailed setup instructions, see [FRONTEND_PROJECT_SETUP.md](./FRONTEND_PROJECT_SETUP.md)**

Or manually:

```bash
cd luxethreads
npm install
```

## Day-to-Day Commands

### Run the dev server

```bash
npm run dev          # launches Vite at http://localhost:5173
```

### Build & preview

```bash
npm run build        # compile production assets to dist/
npm run preview      # serve the built app locally
```

### Quality checks

```bash
npm run lint         # eslint across the workspace
```

### Managing dependencies

```bash
npm install <pkg>@latest     # add or upgrade
npm outdated                 # list available updates
```

### Stop the dev server

```bash
# Press Ctrl+C in the dev server terminal
# Or kill detached processes manually:
pkill -f "vite"
```

## Environment Variables

- Copy `.env.example` to `.env.local` (if present) and populate API endpoints or keys.
- Keep `.env` values aligned with backend expectations when adding new flags.

## Troubleshooting

- Mismatched Node version? Run `nvm use 24.11.0` (or your manager equivalent).
- Clean install issues by deleting `node_modules` and `package-lock.json`, then rerun `npm install`.
