import { PromptTemplate } from '../store/slices/aiSlice';

/**
 * Core RadFlow prompt templates
 * These are shared across all themes and provide AI assistance for common component/styling tasks
 */
export const radflowPrompts: PromptTemplate[] = [
  // Component Generation
  {
    id: 'create-button-component',
    title: 'Create Button Component',
    category: 'Components',
    content: `Create a Button component following RadFlow conventions:
- Use semantic tokens (bg-surface-primary, text-content-primary, etc.) instead of hardcoded colors
- Include variant props (primary, secondary, ghost)
- Include size props (sm, md, lg)
- Support iconOnly mode with proper padding
- Use default export
- Include TypeScript props interface with default values
- Location: /components/ (not /app/components/)
- Follow existing component patterns in the codebase`,
    tags: ['component', 'button', 'ui'],
    isThemeSpecific: false,
  },
  {
    id: 'create-card-component',
    title: 'Create Card Component',
    category: 'Components',
    content: `Create a Card component with RadFlow best practices:
- Use semantic tokens for backgrounds, borders, and text colors
- Support variants: default, outlined, elevated
- Include optional header, body, and footer slots
- Add hover states using semantic tokens
- Use default export with TypeScript props
- Apply proper spacing using theme spacing scale`,
    tags: ['component', 'card', 'layout'],
    isThemeSpecific: false,
  },
  {
    id: 'create-input-component',
    title: 'Create Input Component',
    category: 'Components',
    content: `Create an Input component with form integration:
- Use semantic tokens for all colors
- Include states: default, focus, error, disabled
- Support label, helper text, and error message slots
- Add proper focus ring using theme colors
- Include icon support (leading/trailing)
- Accessibility: proper ARIA labels and descriptions
- TypeScript interface with controlled/uncontrolled support`,
    tags: ['component', 'input', 'form'],
    isThemeSpecific: false,
  },

  // Layout
  {
    id: 'responsive-grid-layout',
    title: 'Responsive Grid Layout',
    category: 'Layout',
    content: `Create a responsive grid layout using RadFlow spacing:
- Use CSS Grid or Flexbox with theme spacing tokens
- Breakpoints: mobile (default), tablet (768px), desktop (1024px)
- Gap using semantic spacing (space-2, space-4, space-6)
- Responsive columns: 1 on mobile, 2 on tablet, 3+ on desktop
- Maintain consistent padding/margins using theme scale`,
    tags: ['layout', 'grid', 'responsive'],
    isThemeSpecific: false,
  },
  {
    id: 'sidebar-layout',
    title: 'Sidebar + Main Layout',
    category: 'Layout',
    content: `Create a sidebar + main content layout:
- Fixed sidebar width or collapsible
- Use semantic tokens for sidebar background
- Proper z-index layering
- Mobile: sidebar overlay with backdrop
- Desktop: persistent sidebar
- Smooth transitions using theme animation values`,
    tags: ['layout', 'sidebar', 'responsive'],
    isThemeSpecific: false,
  },

  // Styling
  {
    id: 'apply-theme-tokens',
    title: 'Apply Semantic Tokens',
    category: 'Styling',
    content: `Convert hardcoded colors to semantic tokens:
- Background: bg-surface-primary, bg-surface-secondary
- Text: text-content-primary, text-content-secondary, text-content-tertiary
- Borders: border-edge-primary, border-edge-secondary
- Interactive: bg-interactive-primary, text-interactive-primary
- Never use hex codes or rgb() in components
- Check theme documentation for available tokens`,
    tags: ['tokens', 'colors', 'styling'],
    isThemeSpecific: false,
  },
  {
    id: 'dark-mode-support',
    title: 'Add Dark Mode Support',
    category: 'Styling',
    content: `Ensure component works in both light and dark modes:
- All colors must use semantic tokens (they swap automatically)
- Test with light/dark theme toggle
- Check contrast ratios for accessibility
- Images: provide light/dark variants if needed
- Shadows: verify visibility in both modes
- Don't use mode-specific classes unless absolutely necessary`,
    tags: ['dark-mode', 'theming', 'accessibility'],
    isThemeSpecific: false,
  },
  {
    id: 'hover-focus-states',
    title: 'Interactive States (Hover/Focus)',
    category: 'Styling',
    content: `Add proper interactive states:
- Hover: use hover:bg-surface-secondary or theme-defined hover states
- Focus: visible focus ring (focus:ring-2 focus:ring-interactive-primary)
- Active: pressed/active state with semantic tokens
- Disabled: reduced opacity with cursor-not-allowed
- Transitions: smooth (transition-colors duration-150)
- Accessibility: ensure keyboard navigation works`,
    tags: ['interactivity', 'states', 'accessibility'],
    isThemeSpecific: false,
  },

  // Refactoring
  {
    id: 'component-composition',
    title: 'Component Composition',
    category: 'Refactoring',
    content: `Refactor using composition patterns:
- Break large components into smaller, reusable pieces
- Use compound components (e.g., Card.Header, Card.Body)
- Prefer composition over configuration
- Extract shared logic into custom hooks
- Keep components focused on single responsibility`,
    tags: ['refactoring', 'composition', 'architecture'],
    isThemeSpecific: false,
  },
  {
    id: 'extract-custom-hook',
    title: 'Extract Custom Hook',
    category: 'Refactoring',
    content: `Extract reusable logic into a custom hook:
- Identify stateful logic used across multiple components
- Follow React hooks naming convention (useXxx)
- Return values, functions, and state
- Keep hooks focused and composable
- Add TypeScript types for params and return values`,
    tags: ['refactoring', 'hooks', 'reusability'],
    isThemeSpecific: false,
  },

  // Accessibility
  {
    id: 'keyboard-navigation',
    title: 'Keyboard Navigation',
    category: 'Accessibility',
    content: `Add keyboard navigation support:
- Tab order: logical and sequential
- Focus indicators: visible and high contrast
- Keyboard shortcuts: document and implement
- Arrow keys: for lists/grids/menus
- Escape key: close modals/dropdowns
- Enter/Space: activate buttons/links
- Test with keyboard only (no mouse)`,
    tags: ['accessibility', 'keyboard', 'a11y'],
    isThemeSpecific: false,
  },
  {
    id: 'screen-reader-support',
    title: 'Screen Reader Support',
    category: 'Accessibility',
    content: `Improve screen reader accessibility:
- ARIA labels: aria-label, aria-labelledby for all interactive elements
- ARIA roles: proper semantic roles (button, navigation, etc.)
- ARIA states: aria-expanded, aria-selected, aria-disabled
- Live regions: aria-live for dynamic content
- Hidden content: aria-hidden for decorative elements
- Skip links: for main content
- Test with VoiceOver (Mac) or NVDA (Windows)`,
    tags: ['accessibility', 'screen-reader', 'aria'],
    isThemeSpecific: false,
  },
];
