'use client';

import React from 'react';

// ============================================================================
// Types
// ============================================================================

type CardVariant = 'default' | 'dark' | 'raised';

interface CardProps {
  /** Visual variant */
  variant?: CardVariant;
  /** Card content */
  children: React.ReactNode;
  /** Additional classes */
  className?: string;
  /** Optional padding override */
  noPadding?: boolean;
}

// ============================================================================
// Styles
// ============================================================================

/**
 * Base styles for all cards
 */
const baseStyles = `
  border border-black
  rounded-md
  overflow-hidden
`;

/**
 * Variant styles
 * - default: cream bg, black text
 * - dark: black bg, cream text  
 * - raised: cream bg with pixel shadow effect
 */
const variantStyles: Record<CardVariant, string> = {
  default: `
    bg-warm-cloud text-black
  `,
  dark: `
    bg-black text-cream
  `,
  raised: `
    bg-warm-cloud text-black
    shadow-[2px_2px_0_0_var(--color-black)]
  `,
};

// ============================================================================
// Component
// ============================================================================

/**
 * Card container component with consistent styling
 */
export function Card({
  variant = 'default',
  children,
  className = '',
  noPadding = false,
}: CardProps) {
  const classes = [
    baseStyles,
    variantStyles[variant],
    noPadding ? '' : 'p-4',
    className,
  ]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <div className={classes}>
      {children}
    </div>
  );
}

// ============================================================================
// Card Sub-components
// ============================================================================

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Card header with bottom border
 */
export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`px-4 py-3 border-b border-black ${className}`}>
      {children}
    </div>
  );
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Card body with standard padding
 */
export function CardBody({ children, className = '' }: CardBodyProps) {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Card footer with top border
 */
export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`px-4 py-3 border-t border-black ${className}`}>
      {children}
    </div>
  );
}

export default Card;

