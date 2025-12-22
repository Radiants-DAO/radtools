'use client';

import React, { useState, useRef } from 'react';

// ============================================================================
// Types
// ============================================================================

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
type TooltipSize = 'sm' | 'md' | 'lg';

interface TooltipProps {
  /** Tooltip content */
  content: React.ReactNode;
  /** Position relative to trigger */
  position?: TooltipPosition;
  /** Delay before showing (ms) - set to 0 for instant */
  delay?: number;
  /** Size preset - matches Button sizes (sm=10px, md=12px, lg=14px) */
  size?: TooltipSize;
  /** Trigger element */
  children: React.ReactNode;
  /** Additional classes */
  className?: string;
}

// ============================================================================
// Styles
// ============================================================================

const positionStyles: Record<TooltipPosition, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

const arrowStyles: Record<TooltipPosition, string> = {
  top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-black',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-black',
  left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-black',
  right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-black',
};

/**
 * Font size presets matching Button component sizes
 * sm=10px, md=12px, lg=14px
 */
const sizeStyles: Record<TooltipSize, string> = {
  sm: 'text-[10px]',
  md: 'text-xs',
  lg: 'text-sm',
};

// ============================================================================
// Component
// ============================================================================

/**
 * Tooltip component for hover information
 */
export function Tooltip({
  content,
  position = 'top',
  delay = 0,
  size = 'md',
  children,
  className = '',
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    if (delay > 0) {
      timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
    } else {
      setIsVisible(true);
    }
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      
      {isVisible && (
        <div
          className={`
            absolute z-[1000]
            px-2 py-1
            bg-black text-cream
            font-joystix uppercase
            rounded-sm
            whitespace-nowrap
            pointer-events-none
            ${sizeStyles[size]}
            ${positionStyles[position]}
          `}
          role="tooltip"
        >
          {content}
          {/* Arrow */}
          <div
            className={`
              absolute
              border-4 border-solid
              ${arrowStyles[position]}
            `}
          />
        </div>
      )}
    </div>
  );
}

export default Tooltip;

