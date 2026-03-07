# Required Dependencies

Add these dependencies to your `package.json` for the Sanity CMS setup to work properly.

## Installation

```bash
npm install @sanity/client @sanity/image-url sanity @sanity/structure @sanity/vision
```

## Dependencies Breakdown

### Core Sanity Packages

| Package | Version | Purpose |
|---------|---------|---------|
| `sanity` | `^3.0.0` | Sanity CMS framework and studio |
| `@sanity/client` | `^6.0.0` | Client library for fetching content |
| `@sanity/image-url` | `^1.0.0` | Image URL builder and optimizer |

### Studio Tools

| Package | Version | Purpose |
|---------|---------|---------|
| `@sanity/structure` | `^3.0.0` | Custom content structure/menu in studio |
| `@sanity/vision` | `^3.0.0` | GROQ query playground in studio |

### TypeScript Support

These are optional but recommended for type safety:

```bash
npm install -D @sanity/types
```

| Package | Version | Purpose |
|---------|---------|---------|
| `@sanity/types` | `^3.0.0` | TypeScript type definitions |

## Peer Dependencies

Your Next.js or React project should have:

```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "next": "^13.0.0"
}
```

## Full package.json Example

```json
{
  "name": "dc-photography-portfolio",
  "version": "1.0.0",
  "description": "Photography portfolio with Sanity CMS",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "sanity": "sanity",
    "sanity:build": "sanity build"
  },
  "dependencies": {
    "@sanity/client": "^6.15.0",
    "@sanity/image-url": "^1.0.2",
    "@sanity/structure": "^3.37.0",
    "@sanity/vision": "^3.37.0",
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "sanity": "^3.37.0"
  },
  "devDependencies": {
    "@sanity/types": "^3.37.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "typescript": "^5.0.0"
  }
}
```

## Version Compatibility

As of 2026-03-07, these package versions are current:

- **Sanity 3.x** - Latest major version with modern features
- **Next.js 14.x** - Latest stable version
- **React 18.x** - Latest React version with hooks and concurrent features

## Installation Steps

### 1. Create .env.local
Copy environment variables:
```bash
cp .env.example .env.local
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Build for Production
```bash
npm run build
```

### 4. Deploy Sanity Studio
```bash
npm run sanity:build
```

## Troubleshooting

### Import Errors
If you see errors like `Cannot find module '@sanity/client'`:
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Restart your development server

### TypeScript Errors
For TypeScript support:
```bash
npm install -D typescript @types/node @types/react @types/react-dom @sanity/types
```

### Version Conflicts
If you have version conflicts:
1. Check your Node version (should be 16+)
2. Try deleting `package-lock.json`
3. Run `npm install` with `--legacy-peer-deps` if needed

## Optional Enhancements

### Image Optimization
For advanced image handling, consider:
```bash
npm install next-image-export-optimizer
```

### Code Formatting
For development consistency:
```bash
npm install -D prettier eslint eslint-config-next
```

### Testing
For content validation:
```bash
npm install -D jest @testing-library/react
```

## Keeping Dependencies Updated

Check for updates:
```bash
npm outdated
```

Update packages:
```bash
npm update
```

Update major versions:
```bash
npm install sanity@latest @sanity/client@latest @sanity/image-url@latest
```

Always test thoroughly after updating to newer versions!
