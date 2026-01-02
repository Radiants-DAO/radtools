/**
 * Icon Components for RadTools
 * SVG icons copied from radOS reference
 */

import React from 'react';
import { Icon } from './icons/Icon';

// ============================================================================
// Standard Icon Sizes
// ============================================================================

export const ICON_SIZE = {
  xs: 14,
  sm: 18,
  md: 20,
  lg: 24,
} as const;

export type IconSize = keyof typeof ICON_SIZE;

interface IconProps {
  className?: string;
  size?: number | string;
}

// ============================================================================
// UI Icons
// ============================================================================

export function CloseIcon({ className = '', size = 10 }: IconProps) {
  return <Icon name="close" size={typeof size === 'number' ? size : parseInt(String(size))} className={className} />;
}

export function CopyIcon({ className = '', size = 18 }: IconProps) {
  return <Icon name="copy" size={typeof size === 'number' ? size : parseInt(String(size))} className={className} />;
}

export function CopiedIcon({ className = '', size = 18 }: IconProps) {
  return <Icon name="checkmark-filled" size={typeof size === 'number' ? size : parseInt(String(size))} className={className} />;
}

export function HelpIcon({ className = '', size = 16 }: IconProps) {
  return <Icon name="question" size={typeof size === 'number' ? size : parseInt(String(size))} className={className} />;
}

export function ComponentsIcon({ className = '', size = 16 }: IconProps) {
  return <Icon name="wrench" size={typeof size === 'number' ? size : parseInt(String(size))} className={className} />;
}

export function ChevronIcon({ className = '', size = 8 }: IconProps) {
  return <Icon name="chevron-down" size={typeof size === 'number' ? size : parseInt(String(size))} className={className} />;
}

export default {
  CloseIcon,
  CopyIcon,
  CopiedIcon,
  HelpIcon,
  ComponentsIcon,
  ChevronIcon,
};

// Re-export Icon component from icons directory
export { Icon };

