'use client';

import React, { forwardRef } from 'react';
import { Icon } from '@/components/icons';

// ============================================================================
// Types
// ============================================================================

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Label text */
  label?: string;
  /** Additional classes for container */
  className?: string;
}

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Label text */
  label?: string;
  /** Additional classes for container */
  className?: string;
}

// ============================================================================
// Checkbox Component
// ============================================================================

/**
 * Retro-styled checkbox
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, className = '', disabled, ...props },
  ref
) {
  return (
    <label
      className={`
        inline-flex items-center gap-2 cursor-pointer
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <div className="relative">
        <input
          ref={ref}
          type="checkbox"
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        {/* Custom checkbox visual */}
        <div
          className={`
            w-5 h-5
            bg-warm-cloud
            border border-black
            rounded-xs
            peer-checked:bg-sun-yellow
            peer-focus:ring-2 peer-focus:ring-sun-yellow peer-focus:ring-offset-1
            flex items-center justify-center
          `}
        />
        {/* Checkmark - visible when checkbox is checked */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">
          <Icon
            name="checkmark"
            size={14}
            className="text-black"
          />
        </div>
      </div>
      {label && (
        <span className="font-mondwest text-base text-black select-none">
          {label}
        </span>
      )}
    </label>
  );
});

// ============================================================================
// Radio Component
// ============================================================================

/**
 * Retro-styled radio button
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, className = '', disabled, ...props },
  ref
) {
  return (
    <label
      className={`
        inline-flex items-center gap-2 cursor-pointer
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <div className="relative">
        <input
          ref={ref}
          type="radio"
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        {/* Custom radio visual */}
        <div
          className={`
            w-5 h-5
            bg-warm-cloud
            border border-black
            rounded-full
            peer-checked:bg-sun-yellow
            peer-focus:ring-2 peer-focus:ring-sun-yellow peer-focus:ring-offset-1
            flex items-center justify-center
          `}
        >
          {/* Inner dot placeholder */}
        </div>
        {/* Inner dot when checked */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-black rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none"
        />
      </div>
      {label && (
        <span className="font-mondwest text-base text-black select-none">
          {label}
        </span>
      )}
    </label>
  );
});

export default Checkbox;

