'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';

// ============================================================================
// Types
// ============================================================================

type SliderSize = 'sm' | 'md' | 'lg';

interface SliderProps {
  /** Current value */
  value: number;
  /** Change handler */
  onChange: (value: number) => void;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Size preset */
  size?: SliderSize;
  /** Disabled state */
  disabled?: boolean;
  /** Show value label */
  showValue?: boolean;
  /** Label text */
  label?: string;
  /** Additional className */
  className?: string;
}

// ============================================================================
// Styles
// ============================================================================

const sizeStyles: Record<SliderSize, { track: string; thumb: string }> = {
  sm: {
    track: 'h-1',
    thumb: 'w-3 h-3 -mt-1',
  },
  md: {
    track: 'h-2',
    thumb: 'w-4 h-4 -mt-1',
  },
  lg: {
    track: 'h-3',
    thumb: 'w-5 h-5 -mt-1',
  },
};

// ============================================================================
// Component
// ============================================================================

/**
 * Slider component - Numeric range input
 */
export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  size = 'md',
  disabled = false,
  showValue = false,
  label,
  className = '',
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const styles = sizeStyles[size];

  // Calculate percentage
  const percentage = ((value - min) / (max - min)) * 100;

  // Snap value to step
  const snapToStep = useCallback((val: number) => {
    const stepped = Math.round((val - min) / step) * step + min;
    return Math.max(min, Math.min(max, stepped));
  }, [min, max, step]);

  // Calculate value from position
  const getValueFromPosition = useCallback((clientX: number) => {
    if (!trackRef.current) return value;

    const rect = trackRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newValue = min + percent * (max - min);
    return snapToStep(newValue);
  }, [min, max, value, snapToStep]);

  // Handle mouse/touch events
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (disabled) return;

    e.preventDefault();
    setIsDragging(true);

    const newValue = getValueFromPosition(e.clientX);
    onChange(newValue);
  }, [disabled, getValueFromPosition, onChange]);

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      const newValue = getValueFromPosition(e.clientX);
      onChange(newValue);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, getValueFromPosition, onChange]);

  // Handle keyboard
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    let newValue = value;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = Math.min(max, value + step);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = Math.max(min, value - step);
        break;
      case 'Home':
        newValue = min;
        break;
      case 'End':
        newValue = max;
        break;
      default:
        return;
    }

    e.preventDefault();
    onChange(newValue);
  };

  return (
    <div className={`space-y-2 ${className}`.trim()}>
      {/* Label & Value */}
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="font-mondwest text-base text-black">
              {label}
            </span>
          )}
          {showValue && (
            <span className="font-mondwest text-sm text-black/60">
              {value}
            </span>
          )}
        </div>
      )}

      {/* Track */}
      <div
        ref={trackRef}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-disabled={disabled}
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        className={`
          relative w-full
          ${styles.track}
          bg-black/10
          border border-black
          rounded-sm
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          focus:outline-none focus:ring-2 focus:ring-tertiary focus:ring-offset-2
        `.trim()}
      >
        {/* Filled Track */}
        <div
          className={`
            absolute top-0 left-0 h-full
            bg-sun-yellow
            rounded-sm
          `.trim()}
          style={{ width: `${percentage}%` }}
        />

        {/* Thumb */}
        <div
          className={`
            absolute top-[7px]
            ${styles.thumb}
            bg-cream
            border border-black
            rounded
            transform -translate-y-1/2
            ${isDragging ? 'scale-110' : ''}
            transition-transform
          `.trim()}
          style={{ left: `calc(${percentage}% - ${parseInt(styles.thumb.split(' ')[0].replace('w-', '')) * 2}px)` }}
        />
      </div>
    </div>
  );
}

export default Slider;
