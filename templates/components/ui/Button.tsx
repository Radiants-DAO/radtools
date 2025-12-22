'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/icons';
import { Spinner } from './Progress';

// ============================================================================
// Types
// ============================================================================

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseButtonProps {
  /** Visual variant */
  variant?: ButtonVariant;
  /** Size preset */
  size?: ButtonSize;
  /** Expand to fill container width */
  fullWidth?: boolean;
  /** Square button with icon only (no text) */
  iconOnly?: boolean;
  /** Icon name (filename without .svg extension) */
  iconName?: string;
  /** Show loading spinner (only applies to buttons with icons) */
  loading?: boolean;
  /** Button content (optional when iconOnly is true) */
  children?: React.ReactNode;
  /** Additional className */
  className?: string;
}

interface ButtonAsButtonProps extends BaseButtonProps, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps> {
  /** URL for navigation - when provided, button can act as a link */
  href?: undefined;
}

interface ButtonAsLinkProps extends BaseButtonProps, Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps> {
  /** URL for navigation - renders as Next.js Link */
  href: string;
  /** Whether to render as Next.js Link (true) or use window.open (false) */
  asLink?: boolean;
  /** Target for link navigation (e.g., '_blank') */
  target?: string;
}

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

// ============================================================================
// Styles
// ============================================================================

/**
 * Base styles applied to all buttons
 * - Retro lift effect with box-shadow
 * - NO transitions (instant state changes)
 */
const baseStyles = `
  inline-flex items-center
  font-joystix uppercase
  whitespace-nowrap
  cursor-pointer select-none
  border border-black
  rounded-sm
  shadow-[0_1px_0_0_var(--color-black)]
  hover:-translate-y-0.5
  hover:shadow-[0_3px_0_0_var(--color-black)]
  active:translate-y-0.5
  active:shadow-none
  disabled:opacity-50 disabled:cursor-not-allowed
  disabled:hover:translate-y-0 disabled:hover:shadow-[0_1px_0_0_var(--color-black)]
`;

/**
 * Size presets
 * All buttons use h-8 (2rem) height for consistency
 * Text sizes: sm=10px, md=12px, lg=14px
 */
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[10px] gap-3',
  md: 'h-8 px-3 text-xs gap-3',
  lg: 'h-8 px-3 text-sm gap-3',
};

/**
 * Icon-only size presets (square buttons)
 * All buttons use w-8 h-8 (2rem) for consistency
 */
const iconOnlySizeStyles: Record<ButtonSize, string> = {
  sm: 'w-8 h-8 p-0',
  md: 'w-8 h-8 p-0',
  lg: 'w-8 h-8 p-0',
};

/**
 * Variant color schemes
 * - primary: cream bg, black text, yellow on hover
 * - secondary: black bg, cream text, inverts on hover
 * - outline: transparent bg, black border, fills on hover
 * - ghost: no border, subtle hover bg
 */
const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-sun-yellow text-black
    hover:bg-sun-yellow
    active:bg-sun-yellow
  `,
  secondary: `
    bg-black text-cream
    hover:bg-warm-cloud hover:text-black
    active:bg-sun-yellow active:text-black
  `,
  outline: `
    bg-transparent text-black
    hover:bg-warm-cloud
    active:bg-sun-yellow
  `,
  ghost: `
    bg-transparent text-black
    border-transparent
    shadow-none
    hover:bg-transparent hover:border-black hover:text-black hover:shadow-none hover:translate-y-0
    active:bg-sun-yellow active:text-black active:border-black active:translate-y-0
  `,
};

// ============================================================================
// Helper Functions
// ============================================================================

function getButtonClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  iconOnly: boolean,
  fullWidth: boolean,
  className: string
): string {
  return [
    baseStyles,
    iconOnly ? iconOnlySizeStyles[size] : sizeStyles[size],
    iconOnly ? 'justify-center' : 'justify-start',
    variantStyles[variant],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ============================================================================
// Component
// ============================================================================

/**
 * Button component with retro lift effect
 * 
 * Supports both button and link behaviors:
 * - Without href: renders as <button>
 * - With href + asLink=true (default): renders as Next.js <Link>
 * - With href + asLink=false: renders as <button> that opens URL via window.open
 */
export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    iconOnly = false,
    iconName,
    loading = false,
    children,
    className = '',
    ...rest
  } = props;

  const classes = getButtonClasses(variant, size, iconOnly, fullWidth, className);

  // Determine icon size based on button size
  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 18 : 16;

  // Only show loading spinner for buttons with icons
  const hasIcon = Boolean(iconName || iconOnly);
  const showLoading: boolean = Boolean(loading && hasIcon);

  // Render content with optional icon or loading spinner
  const content = showLoading ? (
    <>
      <Spinner size={iconSize} />
      {!iconOnly && children}
    </>
  ) : iconName ? (
    <>
      <Icon name={iconName} size={iconSize} />
      {!iconOnly && children}
    </>
  ) : (
    children
  );

  // Check if this is a link variant
  if ('href' in props && props.href) {
    const { href, asLink = true, target, ...linkRest } = rest as ButtonAsLinkProps;

    // Use Next.js Link for navigation
    if (asLink) {
      return (
        <Link 
          href={href} 
          target={target}
          className={classes}
          {...(linkRest as Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'target' | 'className'>)}
        >
          {content}
        </Link>
      );
    }

    // Use window.open via button click
    const linkButtonDisabled: boolean = showLoading || Boolean((linkRest as React.ButtonHTMLAttributes<HTMLButtonElement>).disabled);
    const { disabled: _, ...linkButtonRest } = linkRest as React.ButtonHTMLAttributes<HTMLButtonElement>;
    return (
      <button
        type="button"
        className={classes}
        onClick={() => window.open(href, target || '_self')}
        disabled={linkButtonDisabled}
        {...linkButtonRest}
      >
        {content}
      </button>
    );
  }

  // Standard button
  const buttonProps = rest as ButtonAsButtonProps;

  // Disable button when loading
  const disabled: boolean = showLoading || Boolean(buttonProps.disabled);
  const { disabled: _, ...buttonPropsWithoutDisabled } = buttonProps;

  return (
    <button className={classes} {...buttonPropsWithoutDisabled} disabled={disabled}>
      {content}
    </button>
  );
}

export default Button;
