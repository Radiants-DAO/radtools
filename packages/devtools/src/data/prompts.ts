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

  // Component Preview Generation
  {
    id: 'generate-component-preview',
    title: 'Generate Component Preview (Full Guide)',
    category: 'DevTools',
    content: `# RadFlow Component Preview Generator

Generate comprehensive, interactive component previews for the RadFlow DevTools UI tab.

## Context

The Components tab in RadFlow DevTools displays visual previews of theme components. Each theme package (e.g., \`@radflow/theme-rad-os\`, \`@radflow/theme-phase\`) has its own preview files in \`/preview/\`. Each section showcases variants, sizes, states, and interactive demos.

## Before Starting

Read these files to understand the patterns:
1. \`/packages/theme-rad-os/preview/core.tsx\` or \`/packages/theme-phase/preview/core.tsx\` - See existing preview implementations
2. \`/packages/theme-{name}/components/core/{ComponentName}.tsx\` - Read the component's props and variants
3. \`/packages/devtools/src/lib/searchIndex.ts\` - Search index structure

## Preview Structure

### Section & Row Pattern

Every preview uses this structure:

\`\`\`tsx
function {SectionName}Content() {
  return (
    <div className="space-y-6">
      <Section title="Feature Name" variant="h4" subsectionId="feature-kebab-case">
        <Row props='prop="value1" | "value2"'>
          {/* Components side-by-side */}
        </Row>
      </Section>
    </div>
  );
}
\`\`\`

### Data Attributes (Required for RadFlow Editing)

\`\`\`tsx
// Base component (default variant)
<Button
  variant="primary"
  data-edit-scope="component-definition"
  data-component="Button"
>
  Primary
</Button>

// Non-default variant - add data-edit-variant
<Button
  variant="secondary"
  data-edit-scope="component-definition"
  data-component="Button"
  data-edit-variant="secondary"
>
  Secondary
</Button>
\`\`\`

## Real Examples

### Variants + Disabled States

\`\`\`tsx
<Section title="Button Variants" variant="h4" subsectionId="button-variants">
  <Row props='variant="primary" | "secondary" | "outline" | "ghost"'>
    <Button variant="primary" data-edit-scope="component-definition" data-component="Button">Primary</Button>
    <Button variant="primary" disabled data-edit-scope="component-definition" data-component="Button">Disabled</Button>
  </Row>
  <Row props='variant="secondary"'>
    <Button variant="secondary" data-edit-scope="component-definition" data-component="Button" data-edit-variant="secondary">Secondary</Button>
    <Button variant="secondary" disabled data-edit-scope="component-definition" data-component="Button" data-edit-variant="secondary">Disabled</Button>
  </Row>
</Section>
\`\`\`

### Interactive Demo (Loading State)

\`\`\`tsx
function LoadingButtonDemo() {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <Button
      variant="primary"
      iconName="refresh"
      loading={loading}
      onClick={handleClick}
      data-edit-scope="component-definition"
      data-component="Button"
    >
      Click to Load
    </Button>
  );
}
\`\`\`

### Compound Components (Card)

\`\`\`tsx
<Section title="Card with Sub-components" variant="h4" subsectionId="card-compound">
  <Row props='CardHeader, CardBody, CardFooter'>
    <Card noPadding className="w-80" data-edit-scope="component-definition" data-component="Card">
      <CardHeader><h4>Card Header</h4></CardHeader>
      <CardBody><p>This is the card body content.</p></CardBody>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="ghost" size="md">Cancel</Button>
        <Button variant="primary" size="md">Confirm</Button>
      </CardFooter>
    </Card>
  </Row>
</Section>
\`\`\`

## Checklist

For each component, include:
- [ ] All variants with data-edit-variant for non-defaults
- [ ] All sizes (sm, md, lg)
- [ ] Disabled state
- [ ] Error state (form components)
- [ ] Loading state (if applicable)
- [ ] With icon (if applicable)
- [ ] Compound sub-components
- [ ] Interactive demo for stateful props
- [ ] Width constraints (w-64, w-80, max-w-md as needed)
- [ ] Search index entries

## Output

When generating a preview, provide:
1. The \`{ComponentName}Content()\` function
2. Any interactive demo functions (e.g., \`LoadingDemo\`, \`ToastDemo\`)
3. Updates to \`COMPONENT_SECTIONS\` array
4. Search index entries for \`UITabSearchIndex.ts\`
5. Required imports`,
    tags: ['devtools', 'preview', 'component', 'ui-tab'],
    isThemeSpecific: false,
  },
  {
    id: 'component-preview-template',
    title: 'Component Preview Template (Boilerplate)',
    category: 'DevTools',
    content: `# Component Preview Template

Copy this template and fill in the blanks to create a preview for your component.

## Step 1: Read the Component

First, read your component file to understand its props:

\`\`\`
Read /packages/theme-{name}/components/core/{YourComponent}.tsx
\`\`\`

Look for:
- \`type {YourComponent}Props\`
- Variants (e.g., \`variant?: 'primary' | 'secondary'\`)
- Sizes (e.g., \`size?: 'sm' | 'md' | 'lg'\`)
- States (disabled, error, loading)
- Sub-components (Header, Body, Footer, etc.)

## Step 2: Create the Content Function

\`\`\`tsx
// Add to UITab.tsx

function {YourComponent}Content() {
  return (
    <div className="space-y-6">
      {/* VARIANTS */}
      <Section title="{YourComponent} Variants" variant="h4" subsectionId="{your-component}-variants">
        <Row props='variant="default" | "variant2" | "variant3"'>
          <{YourComponent}
            variant="default"
            data-edit-scope="component-definition"
            data-component="{YourComponent}"
          >
            Default
          </{YourComponent}>
          <{YourComponent}
            variant="variant2"
            data-edit-scope="component-definition"
            data-component="{YourComponent}"
            data-edit-variant="variant2"
          >
            Variant 2
          </{YourComponent}>
          {/* Add disabled state */}
          <{YourComponent}
            variant="default"
            disabled
            data-edit-scope="component-definition"
            data-component="{YourComponent}"
          >
            Disabled
          </{YourComponent}>
        </Row>
      </Section>

      {/* SIZES */}
      <Section title="{YourComponent} Sizes" variant="h4" subsectionId="{your-component}-sizes">
        <Row props='size="sm" | "md" | "lg"'>
          <{YourComponent} size="sm" data-edit-scope="component-definition" data-component="{YourComponent}">
            Small
          </{YourComponent}>
        </Row>
        <Row props='size="md"'>
          <{YourComponent} size="md" data-edit-scope="component-definition" data-component="{YourComponent}">
            Medium
          </{YourComponent}>
        </Row>
        <Row props='size="lg"'>
          <{YourComponent} size="lg" data-edit-scope="component-definition" data-component="{YourComponent}">
            Large
          </{YourComponent}>
        </Row>
      </Section>

      {/* STATES (if applicable) */}
      <Section title="{YourComponent} States" variant="h4" subsectionId="{your-component}-states">
        <Row props='error={true}'>
          <{YourComponent} error data-edit-scope="component-definition" data-component="{YourComponent}">
            Error State
          </{YourComponent}>
        </Row>
        <Row props='loading={true}'>
          <{YourComponent} loading data-edit-scope="component-definition" data-component="{YourComponent}">
            Loading
          </{YourComponent}>
        </Row>
      </Section>
    </div>
  );
}
\`\`\`

## Step 3: Add Interactive Demo (if needed)

For components with state that users should interact with:

\`\`\`tsx
function {YourComponent}Demo() {
  const [value, setValue] = useState(initialValue);

  return (
    <{YourComponent}
      value={value}
      onChange={setValue}
      data-edit-scope="component-definition"
      data-component="{YourComponent}"
    />
  );
}
\`\`\`

## Step 4: Register the Section

Add to \`COMPONENT_SECTIONS\` array in UITab.tsx:

\`\`\`tsx
const COMPONENT_SECTIONS = [
  // ... existing sections
  { id: '{your-section-id}', title: '{Section Title}', content: <{YourComponent}Content /> },
];
\`\`\`

## Step 5: Add Search Index Entries

Add to \`UITabSearchIndex.ts\`:

\`\`\`tsx
// Section
{ text: '{Section Title}', sectionId: '{your-section-id}', type: 'section' },

// Component
{ text: '{YourComponent}', sectionId: '{your-section-id}', type: 'component' },

// Subsections
{ text: '{YourComponent} Variants', sectionId: '{your-section-id}', subsectionTitle: '{YourComponent} Variants', type: 'subsection' },
{ text: '{YourComponent} Sizes', sectionId: '{your-section-id}', subsectionTitle: '{YourComponent} Sizes', type: 'subsection' },
{ text: '{YourComponent} States', sectionId: '{your-section-id}', subsectionTitle: '{YourComponent} States', type: 'subsection' },
\`\`\`

## Quick Reference: Data Attributes

\`\`\`tsx
// Always required on editable components:
data-edit-scope="component-definition"
data-component="{ComponentName}"  // Exact component name

// Only for non-default variants:
data-edit-variant="{variant}"     // e.g., "secondary", "outline"
\`\`\``,
    tags: ['devtools', 'preview', 'template', 'boilerplate'],
    isThemeSpecific: false,
  },
];
