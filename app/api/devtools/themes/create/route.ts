import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface CreateThemeRequest {
  // Step 1: Basic Info
  themeName: string;
  themeId: string;
  description: string;
  packageName: string;

  // Step 2: Colors
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  surfaceColor: string;
  textColor: string;
  colorPreset?: string;

  // Step 3: Fonts
  headingFont: string;
  bodyFont: string;
  monoFont: string;
  fontPreset?: string;

  // Step 4: Icons
  iconSet: 'rad-os' | 'custom';
  customIcons?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateThemeRequest = await request.json();

    // Validate required fields
    if (!body.themeName || !body.themeId || !body.packageName) {
      return NextResponse.json(
        { error: 'Missing required fields: themeName, themeId, packageName' },
        { status: 400 }
      );
    }

    // Validate colors
    if (!body.primaryColor || !body.secondaryColor || !body.accentColor || !body.surfaceColor || !body.textColor) {
      return NextResponse.json(
        { error: 'Missing required color fields' },
        { status: 400 }
      );
    }

    // Validate fonts
    if (!body.headingFont || !body.bodyFont || !body.monoFont) {
      return NextResponse.json(
        { error: 'Missing required font fields' },
        { status: 400 }
      );
    }

    // Create theme folder path
    const packagesDir = path.join(process.cwd(), 'packages');
    const themeFolderName = `theme-${body.themeId}`;
    const themePath = path.join(packagesDir, themeFolderName);

    // Check if theme already exists
    try {
      await fs.access(themePath);
      return NextResponse.json(
        { error: `Theme folder already exists: ${themeFolderName}` },
        { status: 409 }
      );
    } catch {
      // Theme doesn't exist, proceed with creation
    }

    // Create theme folder structure
    await fs.mkdir(themePath, { recursive: true });
    await fs.mkdir(path.join(themePath, 'components'), { recursive: true });
    await fs.mkdir(path.join(themePath, 'assets'), { recursive: true });
    await fs.mkdir(path.join(themePath, 'assets', 'icons'), { recursive: true });
    await fs.mkdir(path.join(themePath, 'assets', 'logos'), { recursive: true });
    await fs.mkdir(path.join(themePath, 'agents'), { recursive: true });

    // Generate package.json
    const packageJson = generatePackageJson(body);
    await fs.writeFile(
      path.join(themePath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    // Generate CSS files
    const tokensCSS = generateTokensCSS(body);
    await fs.writeFile(path.join(themePath, 'tokens.css'), tokensCSS);

    const darkCSS = generateDarkCSS(body);
    await fs.writeFile(path.join(themePath, 'dark.css'), darkCSS);

    const typographyCSS = generateTypographyCSS(body);
    await fs.writeFile(path.join(themePath, 'typography.css'), typographyCSS);

    const fontsCSS = generateFontsCSS(body);
    await fs.writeFile(path.join(themePath, 'fonts.css'), fontsCSS);

    const baseCSS = generateBaseCSS(body);
    await fs.writeFile(path.join(themePath, 'base.css'), baseCSS);

    const scrollbarCSS = generateScrollbarCSS(body);
    await fs.writeFile(path.join(themePath, 'scrollbar.css'), scrollbarCSS);

    const animationsCSS = generateAnimationsCSS();
    await fs.writeFile(path.join(themePath, 'animations.css'), animationsCSS);

    const indexCSS = generateIndexCSS(body);
    await fs.writeFile(path.join(themePath, 'index.css'), indexCSS);

    // Copy icons if custom selection
    if (body.iconSet === 'custom' && body.customIcons && body.customIcons.length > 0) {
      const sourceIconsDir = path.join(process.cwd(), 'public', 'assets', 'icons');
      const destIconsDir = path.join(themePath, 'assets', 'icons');

      for (const iconName of body.customIcons) {
        const sourcePath = path.join(sourceIconsDir, `${iconName}.svg`);
        const destPath = path.join(destIconsDir, `${iconName}.svg`);

        try {
          await fs.copyFile(sourcePath, destPath);
        } catch (error) {
          console.warn(`Failed to copy icon ${iconName}:`, error);
        }
      }
    }

    // Create README.md
    const readme = generateReadme(body);
    await fs.writeFile(path.join(themePath, 'README.md'), readme);

    return NextResponse.json({
      success: true,
      themePath: themeFolderName,
      themeId: body.themeId,
      packageName: body.packageName,
    });
  } catch (error) {
    console.error('Error creating theme:', error);
    return NextResponse.json(
      { error: 'Failed to create theme', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

/**
 * Generate package.json content
 */
function generatePackageJson(config: CreateThemeRequest) {
  return {
    name: config.packageName,
    version: '0.1.0',
    description: config.description || `${config.themeName} theme for RadFlow`,
    license: 'MIT',
    main: 'index.css',
    exports: {
      '.': './index.css',
      './tokens': './tokens.css',
      './dark': './dark.css',
      './fonts': './fonts.css',
      './typography': './typography.css',
      './base': './base.css',
      './scrollbar': './scrollbar.css',
      './animations': './animations.css',
    },
    files: [
      'index.css',
      'tokens.css',
      'dark.css',
      'fonts.css',
      'typography.css',
      'base.css',
      'scrollbar.css',
      'animations.css',
      'agents',
      'assets',
      'components',
    ],
    peerDependencies: {
      '@radflow/theme': '^0.1.0',
    },
    devDependencies: {
      '@radflow/theme': 'workspace:*',
    },
    keywords: [
      'radflow',
      'theme',
      config.themeId,
      ...(config.colorPreset ? [config.colorPreset] : []),
    ],
  };
}

/**
 * Generate tokens.css content
 */
function generateTokensCSS(config: CreateThemeRequest): string {
  return `/* ============================================================================
   ${config.packageName} - Design Tokens

   Brand colors and semantic token mappings for the ${config.themeName} theme.
   ============================================================================ */

@theme inline {
  /* ============================================
     BRAND COLORS (internal reference only)
     ============================================ */

  --color-primary: ${config.primaryColor};
  --color-secondary: ${config.secondaryColor};
  --color-accent: ${config.accentColor};
  --color-surface: ${config.surfaceColor};
  --color-text: ${config.textColor};

  /* Fonts */
  --font-heading: '${config.headingFont}';
  --font-body: '${config.bodyFont}';
  --font-mono: '${config.monoFont}';
}

@theme {
  /* ══════════════════════════════════════════════════════════════════════════
     TIER 1: BRAND COLORS (Raw Palette)
     Direct hex values - the source of truth for all derived tokens
     Usage: bg-primary, text-accent, border-secondary, etc.
     ══════════════════════════════════════════════════════════════════════════ */

  --color-primary: ${config.primaryColor};
  --color-secondary: ${config.secondaryColor};
  --color-accent: ${config.accentColor};
  --color-surface: ${config.surfaceColor};
  --color-text: ${config.textColor};

  /* ══════════════════════════════════════════════════════════════════════════
     PROPERTY-BASED SEMANTIC TOKENS
     Organized by CSS property type - these flip in dark mode
     ══════════════════════════════════════════════════════════════════════════ */

  /* ─────────────────────────────────────────────
     SURFACE TOKENS (backgrounds)
     Usage: bg-surface-primary, bg-surface-secondary
     ───────────────────────────────────────────── */
  --color-surface-primary: var(--color-surface);
  --color-surface-secondary: var(--color-secondary);
  --color-surface-tertiary: var(--color-primary);
  --color-surface-elevated: #FFFFFF;
  --color-surface-success: #CEF5CA;
  --color-surface-warning: ${config.primaryColor};
  --color-surface-error: #FF6B63;

  /* ─────────────────────────────────────────────
     CONTENT TOKENS (text/icons)
     Usage: text-content-primary, text-content-secondary
     For muted text, use opacity: text-content-primary/50
     ───────────────────────────────────────────── */
  --color-content-primary: var(--color-text);
  --color-content-secondary: var(--color-primary);
  --color-content-tertiary: var(--color-accent);
  --color-content-inverted: var(--color-surface);
  --color-content-success: #CEF5CA;
  --color-content-warning: ${config.primaryColor};
  --color-content-error: #FF6B63;
  --color-content-link: var(--color-accent);

  /* ─────────────────────────────────────────────
     EDGE TOKENS (borders/dividers)
     Usage: border-edge-primary, border-edge-secondary
     For subtle borders, use opacity: border-edge-primary/20
     ───────────────────────────────────────────── */
  --color-edge-primary: var(--color-text);
  --color-edge-secondary: var(--color-primary);
  --color-edge-elevated: #FFFFFF;

  /* Edge states */
  --color-edge-success: #CEF5CA;
  --color-edge-warning: ${config.primaryColor};
  --color-edge-error: #FF6B63;
  --color-edge-focus: var(--color-accent);

  /* ─────────────────────────────────────────────
     ACCENT TOKENS
     High-contrast colors for important UI elements
     ───────────────────────────────────────────── */
  --color-accent-primary: var(--color-accent);
  --color-accent-secondary: var(--color-primary);
  --color-accent-tertiary: var(--color-secondary);

  /* Border Radius → rounded-sm, rounded-md, etc. */
  --radius-none: 0;
  --radius-xs: 0.125rem;  /* 2px */
  --radius-sm: 0.25rem;   /* 4px */
  --radius-md: 0.5rem;    /* 8px */
  --radius-lg: 1rem;      /* 16px */
  --radius-full: 9999px;

  /* Shadows */
  --shadow-btn: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
  --shadow-btn-hover: 0 2px 6px 0 rgba(0, 0, 0, 0.35);
  --shadow-card: 0 1px 4px 0 rgba(0, 0, 0, 0.15);
  --shadow-card-lg: 0 4px 12px 0 rgba(0, 0, 0, 0.2);
  --shadow-card-hover: 0 6px 16px 0 rgba(0, 0, 0, 0.25);
  --shadow-panel-left: 4px 0 8px 0 rgba(0, 0, 0, 0.1);
  --shadow-inner: inset 0 0 0 1px var(--color-edge-primary);
}
`;
}

/**
 * Generate dark.css content
 */
function generateDarkCSS(config: CreateThemeRequest): string {
  return `/* ══════════════════════════════════════════════════════════════════════════
   ${config.packageName} - Dark Mode

   Override property tokens - component tokens inherit automatically
   ══════════════════════════════════════════════════════════════════════════ */

.dark {
  /* ─────────────────────────────────────────────
     SURFACE TOKENS (inverted)
     ───────────────────────────────────────────── */
  --color-surface-primary: #1C1917;
  --color-surface-secondary: ${config.secondaryColor};
  --color-surface-tertiary: ${config.textColor};
  --color-surface-elevated: #292524;
  --color-surface-success: #1a3d1a;
  --color-surface-warning: #3d3520;
  --color-surface-error: #3d1a1a;

  /* ─────────────────────────────────────────────
     CONTENT TOKENS (inverted)
     ───────────────────────────────────────────── */
  --color-content-primary: ${config.surfaceColor};
  --color-content-secondary: ${config.primaryColor};
  --color-content-tertiary: ${config.accentColor};
  --color-content-inverted: ${config.textColor};
  --color-content-success: #CEF5CA;
  --color-content-warning: ${config.primaryColor};
  --color-content-error: #FF8A84;
  --color-content-link: var(--color-accent);

  /* ─────────────────────────────────────────────
     EDGE TOKENS (inverted)
     ───────────────────────────────────────────── */
  --color-edge-primary: ${config.surfaceColor};
  --color-edge-secondary: ${config.primaryColor};
  --color-edge-elevated: #292524;

  /* Edge states */
  --color-edge-success: #CEF5CA;
  --color-edge-warning: ${config.primaryColor};
  --color-edge-error: #FF8A84;
  --color-edge-focus: var(--color-accent);

  /* ─────────────────────────────────────────────
     DARK MODE SHADOWS
     Softer shadows for dark backgrounds
     ───────────────────────────────────────────── */
  --shadow-btn: 0 1px 8px 0 rgba(${hexToRgb(config.primaryColor)}, 0.3);
  --shadow-btn-hover: 0 3px 12px 0 rgba(${hexToRgb(config.primaryColor)}, 0.5);
  --shadow-card: 0 0 12px 2px rgba(${hexToRgb(config.primaryColor)}, 0.2);
  --shadow-card-lg: 0 0 20px 4px rgba(${hexToRgb(config.primaryColor)}, 0.25);
  --shadow-card-hover: 0 0 24px 6px rgba(${hexToRgb(config.primaryColor)}, 0.35);
  --shadow-panel-left: -4px 0 12px 0 rgba(${hexToRgb(config.primaryColor)}, 0.15);
  --shadow-inner: inset 0 0 0 1px var(--color-edge-primary);
}
`;
}

/**
 * Generate typography.css content
 */
function generateTypographyCSS(config: CreateThemeRequest): string {
  return `/* ============================================================================
   ${config.packageName} - Typography

   Base typography styles using @layer base for Tailwind v4 integration.
   These styles define the default appearance of HTML elements.
   ============================================================================ */

@layer base {
  h1 {
    @apply text-4xl font-bold leading-tight text-content-primary;
    font-family: ${config.headingFont};
  }

  h2 {
    @apply text-3xl font-normal leading-tight text-content-primary;
    font-family: ${config.headingFont};
  }

  h3 {
    @apply text-2xl font-semibold leading-snug text-content-primary;
    font-family: ${config.headingFont};
  }

  h4 {
    @apply text-xl font-medium leading-snug text-content-primary;
    font-family: ${config.headingFont};
  }

  h5 {
    @apply text-lg font-medium leading-normal text-content-primary;
    font-family: ${config.headingFont};
  }

  h6 {
    @apply text-base font-medium leading-normal text-content-primary;
    font-family: ${config.headingFont};
  }

  p {
    @apply text-base font-normal leading-relaxed text-content-primary;
    font-family: ${config.bodyFont};
  }

  a {
    @apply text-base font-normal leading-normal text-content-link underline hover:opacity-80;
    font-family: ${config.bodyFont};
  }

  ul {
    @apply text-base font-normal leading-relaxed text-content-primary pl-6;
    font-family: ${config.bodyFont};
  }

  ol {
    @apply text-base font-normal leading-relaxed text-content-primary pl-6;
    font-family: ${config.bodyFont};
  }

  li {
    @apply text-base font-normal leading-relaxed text-content-primary mb-2;
    font-family: ${config.bodyFont};
  }

  small {
    @apply text-sm font-normal leading-normal text-content-primary;
    font-family: ${config.bodyFont};
  }

  strong {
    @apply text-base font-bold leading-normal text-content-primary;
    font-family: ${config.bodyFont};
  }

  em {
    @apply text-base font-normal leading-normal text-content-primary italic;
    font-family: ${config.bodyFont};
  }

  code {
    @apply text-xs font-normal leading-normal text-content-primary bg-surface-secondary/20 px-1 py-0.5 rounded-sm;
    font-family: ${config.monoFont};
  }

  pre {
    @apply text-sm font-normal leading-relaxed text-content-primary bg-surface-secondary/10 p-4 rounded-sm overflow-x-auto;
    font-family: ${config.monoFont};
  }

  kbd {
    @apply text-xs font-normal leading-normal text-content-inverted bg-surface-secondary px-1 py-0.5 rounded-sm;
    font-family: ${config.monoFont};
  }

  mark {
    @apply text-base font-normal leading-normal text-content-primary bg-surface-tertiary;
    font-family: ${config.bodyFont};
  }

  blockquote {
    @apply text-base font-normal leading-relaxed text-content-primary border-l-4 border-edge-primary pl-4 italic;
    font-family: ${config.bodyFont};
  }

  cite {
    @apply text-sm font-normal leading-normal text-content-primary italic;
    font-family: ${config.bodyFont};
  }

  abbr {
    @apply text-base font-normal leading-normal text-content-primary underline decoration-dotted;
    font-family: ${config.bodyFont};
  }

  dfn {
    @apply text-base font-normal leading-normal text-content-primary italic;
    font-family: ${config.bodyFont};
  }

  q {
    @apply text-base font-normal leading-normal text-content-primary italic;
    font-family: ${config.bodyFont};
  }
}
`;
}

/**
 * Generate fonts.css content
 */
function generateFontsCSS(config: CreateThemeRequest): string {
  return `/* ============================================================================
   ${config.packageName} - Font Face Definitions

   Custom fonts for the ${config.themeName} theme.
   Fonts should be placed in the project's /public/fonts/ directory.
   ============================================================================ */

/* Note: Add @font-face declarations here if using custom fonts.
   System fonts like '${config.headingFont}', '${config.bodyFont}', and '${config.monoFont}'
   don't require @font-face declarations. */

/* Example @font-face declaration:

@font-face {
  font-family: '${config.headingFont}';
  src: url('/fonts/${config.headingFont.replace(/\s+/g, '')}.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

*/
`;
}

/**
 * Generate base.css content
 */
function generateBaseCSS(config: CreateThemeRequest): string {
  return `/* ============================================================================
   ${config.packageName} - Base Styles

   Base HTML and body styles.
   ============================================================================ */

@layer base {
  html {
    @apply font-body antialiased;
  }

  body {
    @apply bg-surface-primary text-content-primary;
    font-family: ${config.bodyFont};
  }
}
`;
}

/**
 * Generate scrollbar.css content
 */
function generateScrollbarCSS(config: CreateThemeRequest): string {
  return `/* ============================================================================
   ${config.packageName} - Scrollbar Styles

   Custom scrollbar styling for webkit browsers.
   ============================================================================ */

::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

::-webkit-scrollbar-track {
  background: var(--color-surface-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--color-edge-primary);
  border-radius: var(--radius-sm);
  border: 2px solid var(--color-surface-secondary);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-accent-primary);
}

::-webkit-scrollbar-corner {
  background: var(--color-surface-secondary);
}
`;
}

/**
 * Generate animations.css content
 */
function generateAnimationsCSS(): string {
  return `/* ============================================================================
   Animation Definitions

   Reusable animations for the theme.
   ============================================================================ */

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
`;
}

/**
 * Generate index.css content
 */
function generateIndexCSS(config: CreateThemeRequest): string {
  return `/* ============================================================================
   ${config.packageName} - ${config.themeName} Theme

   ${config.description || `Custom theme for RadFlow`}

   Usage:
     @import "tailwindcss";
     @import "${config.packageName}";

   Or import individual parts:
     @import "${config.packageName}/fonts";
     @import "${config.packageName}/tokens";
     @import "${config.packageName}/dark";
     @import "${config.packageName}/typography";
   ============================================================================ */

@import "./fonts.css";
@import "./tokens.css";
@import "./dark.css";
@import "./typography.css";
@import "./base.css";
@import "./scrollbar.css";
@import "./animations.css";
`;
}

/**
 * Generate README.md content
 */
function generateReadme(config: CreateThemeRequest): string {
  return `# ${config.themeName}

${config.description || `A custom theme for RadFlow`}

## Installation

\`\`\`bash
npm install ${config.packageName}
\`\`\`

## Usage

Import the theme in your global CSS file:

\`\`\`css
@import "tailwindcss";
@import "${config.packageName}";
\`\`\`

Or import specific parts:

\`\`\`css
@import "${config.packageName}/fonts";
@import "${config.packageName}/tokens";
@import "${config.packageName}/dark";
@import "${config.packageName}/typography";
\`\`\`

## Theme Configuration

### Colors

- **Primary**: ${config.primaryColor}
- **Secondary**: ${config.secondaryColor}
- **Accent**: ${config.accentColor}
- **Surface**: ${config.surfaceColor}
- **Text**: ${config.textColor}

### Typography

- **Heading Font**: ${config.headingFont}
- **Body Font**: ${config.bodyFont}
- **Monospace Font**: ${config.monoFont}

### Icons

${config.iconSet === 'rad-os' ? 'Uses the complete RadOS icon library' : `Custom icon selection (${config.customIcons?.length || 0} icons)`}

## Dark Mode

This theme includes dark mode support. Add the \`dark\` class to your root element to enable:

\`\`\`html
<html class="dark">
  <!-- Your app -->
</html>
\`\`\`

## License

MIT
`;
}

/**
 * Convert hex color to RGB values
 */
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0, 0, 0';

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  return `${r}, ${g}, ${b}`;
}
