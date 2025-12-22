'use client';

import React from 'react';
import { Icon } from '@/components/icons';

// ============================================================================
// Types
// ============================================================================

type AlertVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface AlertProps {
  /** Alert variant */
  variant?: AlertVariant;
  /** Alert title */
  title?: string;
  /** Alert content */
  children: React.ReactNode;
  /** Show close button */
  closable?: boolean;
  /** Close handler */
  onClose?: () => void;
  /** Icon name (filename without .svg extension) - overrides variant default */
  iconName?: string;
  /** Additional className */
  className?: string;
}

// ============================================================================
// Styles
// ============================================================================

const variantStyles: Record<AlertVariant, string> = {
  default: 'bg-warm-cloud border-black text-black',
  success: 'bg-green/10 border-green text-black',
  warning: 'bg-sun-yellow/10 border-sun-yellow text-black',
  error: 'bg-error-red/10 border-error-red text-black',
  info: 'bg-sky-blue/10 border-sky-blue text-black',
};

const variantIconMap: Record<AlertVariant, string> = {
  default: 'information-circle',
  success: 'checkmark-filled',
  warning: 'warning-triangle-filled-2',
  error: 'close',
  info: 'information-circle',
};

// ============================================================================
// Component
// ============================================================================

/**
 * Alert component - Static alert banners
 */
export function Alert({
  variant = 'default',
  title,
  children,
  closable = false,
  onClose,
  iconName,
  className = '',
}: AlertProps) {
  const displayIconName = iconName || variantIconMap[variant];

  return (
    <div
      role="alert"
      className={`
        p-4
        border-2
        rounded-sm
        ${variantStyles[variant]}
        ${className}
      `.trim()}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <span className="flex-shrink-0 mt-0.5">
          <Icon name={displayIconName} size={16} />
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <p className="font-joystix text-xs uppercase mb-1">
              {title}
            </p>
          )}
          <div className="font-mondwest text-base text-black/80">
            {children}
          </div>
        </div>

        {/* Close Button */}
        {closable && (
          <button
            onClick={onClose}
            className="text-black/50 hover:text-black flex-shrink-0 -mt-1"
            aria-label="Close"
          >
            <Icon name="close" size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

export default Alert;
