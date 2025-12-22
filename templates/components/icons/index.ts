/**
 * Icon System - Runtime SVG loader
 * 
 * Icons are loaded at runtime from public/assets/icons/ and automatically
 * processed to use currentColor for easy theming.
 * 
 * Usage:
 *   import { Icon } from '@/components/icons';
 *   
 *   <Icon name="arrow-left" size={24} className="text-blue-500" />
 * 
 * To add new icons:
 *   1. Upload SVG files via the Assets panel to the icons folder
 *   2. Use them immediately with <Icon name="filename-without-extension" />
 */

export { Icon } from './Icon';

// Re-export for convenience
export type { } from './Icon';
