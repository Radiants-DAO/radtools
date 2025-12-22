'use client';

import React, { forwardRef } from 'react';
import { Icon } from '@/components/icons';

// ============================================================================
// Types
// ============================================================================

type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Size preset */
  size?: InputSize;
  /** Error state */
  error?: boolean;
  /** Full width */
  fullWidth?: boolean;
  /** Icon name (filename without .svg extension) - displays on the left */
  iconName?: string;
  /** Additional classes */
  className?: string;
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Error state */
  error?: boolean;
  /** Full width */
  fullWidth?: boolean;
  /** Additional classes */
  className?: string;
}

// ============================================================================
// Styles
// ============================================================================

/**
 * Base input styles matching the retro aesthetic
 */
const baseStyles = `
  font-mondwest
  bg-warm-cloud text-black
  border border-black
  rounded-sm
  placeholder:text-black/40
  focus:outline-none
  focus:ring-2 focus:ring-sun-yellow focus:ring-offset-0
  disabled:opacity-50 disabled:cursor-not-allowed
`;

/**
 * Size presets
 */
const sizeStyles: Record<InputSize, string> = {
  sm: 'h-8 px-2 text-sm',
  md: 'h-10 px-3 text-base',
  lg: 'h-12 px-4 text-base',
};

/**
 * Error state styles
 */
const errorStyles = `
  border-sun-red
  focus:ring-sun-red
`;

// ============================================================================
// Components
// ============================================================================

/**
 * Text input with retro styling
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    size = 'md',
    error = false,
    fullWidth = false,
    iconName,
    className = '',
    ...props
  },
  ref
) {
  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 18 : 16;
  const paddingLeft = iconName ? (size === 'sm' ? 'pl-8' : size === 'lg' ? 'pl-12' : 'pl-10') : '';
  
  const classes = [
    baseStyles,
    sizeStyles[size],
    error ? errorStyles : '',
    fullWidth ? 'w-full' : '',
    paddingLeft,
    className,
  ]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  const input = (
    <input ref={ref} className={classes} {...props} />
  );

  if (iconName) {
    return (
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon name={iconName} size={iconSize} className="text-black/40" />
        </div>
        {input}
      </div>
    );
  }

  return input;
});

/**
 * Textarea with retro styling
 */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  {
    error = false,
    fullWidth = false,
    className = '',
    ...props
  },
  ref
) {
  const classes = [
    baseStyles,
    'px-3 py-2 text-base',
    'resize-y min-h-24',
    error ? errorStyles : '',
    fullWidth ? 'w-full' : '',
    className,
  ]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <textarea ref={ref} className={classes} {...props} />
  );
});

// ============================================================================
// Label Component
// ============================================================================

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

/**
 * Form label
 */
export function Label({ children, required, className = '', ...props }: LabelProps) {
  return (
    <label
      className={className}
      {...props}
    >
      {children}
      {required && <span className="text-error-red ml-1">*</span>}
    </label>
  );
}

export default Input;


