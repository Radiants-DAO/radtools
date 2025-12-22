# RadTools

A Webflow-like visual editing dev tools system for Next.js + Tailwind v4 projects.

## Features

- **Variables Tab** - Manage design tokens (brand colors, semantic tokens, color modes, border radius)
- **Typography Tab** - Manage fonts and typography styles
- **Components Tab** - Auto-discover components from `/components/` directory with prop information
- **Assets Tab** - Upload, organize, and optimize images in `public/assets/`
- **Mock States Tab** - Simulate auth, wallet, subscription states during development

## Quick Start

1. Press `⇧⌘K` (Mac) or `⇧Ctrl+K` (Windows/Linux) to toggle the dev tools panel
2. The panel is draggable - move it wherever you like
3. Switch between tabs to access different features

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⇧⌘K` / `⇧Ctrl+K` | Toggle dev tools panel |
| `Esc` | Close modals |

## Tab Guide

### Variables Tab
Edit your design tokens visually:
- Add/edit/delete brand colors and neutrals
- Create semantic tokens that reference brand colors
- Toggle color modes (dark mode preview)
- Adjust border radius values
- Click "Save to CSS" to write changes to `app/globals.css`

### Typography Tab
Manage fonts and typography styles:
- Upload and manage font files from `public/fonts/`
- Configure typography styles for HTML elements (h1-h6, p, code, etc.)
- Visual editor for typography properties
- Changes automatically persist to `app/globals.css`

### Components Tab
Discover all components in your `/components/` directory:
- Auto-scans for default exports
- Displays prop types, required status, and default values
- Click "Refresh" to rescan after adding new components

### Assets Tab
Manage files in `public/assets/`:
- Drag and drop to upload images
- Organize into folders (icons, images, logos, backgrounds)
- Select images and click "Optimize" for Sharp-based compression
- Delete assets directly from the UI

### Mock States Tab
Simulate different app states:
- Pre-configured presets for auth, wallet, and subscription states
- Create custom mock states with JSON values
- Use `useMockState('category')` hook in components to consume mock data
- Only one state per category can be active at a time

## Using Mock States in Components

```tsx
import { useMockState } from '@/devtools';

function UserProfile() {
  const mockAuth = useMockState('auth');
  const realAuth = useRealAuthHook();
  
  // In development with mock active: use mock
  // In development without mock: use real
  // In production: mock is undefined, use real
  const auth = mockAuth ?? realAuth;
  
  if (!auth?.isAuthenticated) return <LoginPrompt />;
  return <Profile user={auth.user} />;
}
```

## Production Safety

- Dev tools are automatically excluded from production builds
- `NODE_ENV === 'production'` check prevents rendering
- API routes return 403 in production
- `useMockState()` returns `undefined` in production

## File Structure

```
/devtools/
├── index.ts              # Public exports
├── DevToolsProvider.tsx  # Main provider
├── DevToolsPanel.tsx     # Panel with tabs
├── store/                # Zustand store
├── tabs/                 # Tab components
├── components/           # Shared UI components
├── hooks/                # Custom hooks
├── lib/                  # Utilities
└── types/                # TypeScript types
```

## Dependencies

- `zustand` - State management
- `react-draggable` - Draggable panel
- `sharp` - Image optimization (API routes)
