// Design Token Types

// Base Color (brand or neutral primitive)
export interface BaseColor {
  id: string;
  name: string;        // e.g., "sun-yellow", "lightest"
  displayName: string; // e.g., "Sun Yellow", "Lightest"
  value: string;       // e.g., "#FCE184"
  category: 'brand' | 'neutral';
}

// Legacy alias for backwards compatibility
export type BrandColor = BaseColor;

export interface ColorMode {
  id: string;
  name: string;        // e.g., "dark"
  className: string;   // e.g., ".dark"
  overrides: Record<string, string>;  // token name -> brand color reference
}

// Component Discovery Types
export interface DiscoveredComponent {
  name: string;
  path: string;
  props: PropDefinition[];
}

export interface PropDefinition {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
}

// Asset Types
export interface AssetFile {
  name: string;
  path: string;
  type: 'image' | 'video' | 'other';
  size: number;
  dimensions?: { width: number; height: number };
}

export interface AssetFolder {
  name: string;
  path: string;
  children: (AssetFolder | AssetFile)[];
}

// Mock State Types
export interface MockState {
  id: string;
  name: string;
  description: string;
  category: string;
  values: Record<string, unknown>;
  active: boolean;
}

// Tab Types
export type Tab = 'variables' | 'typography' | 'components' | 'assets' | 'mockStates';

// Typography Types

// Font file within a font definition
export interface FontFile {
  id: string;
  weight: number;            // 400, 700, etc.
  style: string;             // "normal", "italic"
  format: 'woff2' | 'woff' | 'ttf' | 'otf';
  path: string;              // "/fonts/Mondwest-Regular.woff2"
}

// Font Definition
export interface FontDefinition {
  id: string;
  name: string;              // "Mondwest", "Joystix Monospace"
  family: string;            // CSS font-family value
  files: FontFile[];         // Array of font files (Regular, Bold, etc.)
  weights: number[];         // [400, 700]
  styles: string[];          // ["normal", "italic"]
}

// Typography Style Definition (for @layer base HTML elements)
// Matches Webflow style guide sizing/font choices but uses Tailwind @apply
export interface TypographyStyle {
  id: string;
  element: string;           // "h1", "h2", "h3", "h4", "h5", "h6", "p", "a", "ul", "ol", "li"
  fontFamilyId: string;      // References FontDefinition.id
  fontSize: string;          // Tailwind class: "text-4xl", "text-3xl", etc.
  lineHeight?: string;       // Tailwind class: "leading-relaxed", "leading-tight", etc.
  letterSpacing?: string;    // Tailwind class: "tracking-wide", "tracking-normal", etc.
  fontWeight: string;        // Tailwind class: "font-bold", "font-semibold", "font-normal", etc.
  baseColorId: string;       // References BaseColor.id for text color
  displayName: string;       // "Heading 1", "Heading 2", "Paragraph", etc.
  utilities?: string[];      // Additional Tailwind utilities: ["underline"], ["hover:text-link-hover"]
}

