'use client';

import React from 'react';

// ============================================================================
// Types
// ============================================================================

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  /** Visual variant */
  variant?: BadgeVariant;
  /** Size preset */
  size?: BadgeSize;
  /** Badge content */
  children: React.ReactNode;
  /** Additional classes */
  className?: string;
}

// ============================================================================
// Styles
// ============================================================================

/**
 * Base badge styles
 */
const baseStyles = `
  inline-flex items-center justify-center
  font-joystix uppercase
  rounded-sm
  whitespace-nowrap
`;

/**
 * Size presets
 */
const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-2xs',
  md: 'px-2.5 py-1 text-xs',
};

/**
 * Variant color schemes
 */
const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-warm-cloud text-black border border-black',
  success: 'bg-green text-black border border-black',
  warning: 'bg-sun-yellow text-black border border-black',
  error: 'bg-error-red text-black border border-black',
  info: 'bg-sky-blue text-black border border-black',
};

// ============================================================================
// Component
// ============================================================================

/**
 * Badge component for status indicators and labels
 */
export function Badge({
  variant = 'default',
  size = 'md',
  children,
  className = '',
}: BadgeProps) {
  const classes = [
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    className,
  ]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <span className={classes}>
      {children}
    </span>
  );
}

export default Badge;

