'use client';

import React, { useState, useRef, useEffect } from 'react';

// ============================================================================
// Types
// ============================================================================

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  /** Available options */
  options: SelectOption[];
  /** Currently selected value */
  value?: string;
  /** Placeholder text when no value selected */
  placeholder?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Error state */
  error?: boolean;
  /** Full width */
  fullWidth?: boolean;
  /** Additional classes */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Custom select/dropdown with retro styling
 */
export function Select({
  options,
  value,
  placeholder = 'Select...',
  onChange,
  disabled = false,
  error = false,
  fullWidth = false,
  className = '',
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${fullWidth ? 'w-full' : 'w-fit'} ${className}`}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          flex items-center justify-between gap-2
          w-full h-10 px-3
          font-mondwest text-base
          bg-warm-cloud text-black
          border rounded-sm
          ${error ? 'border-error' : 'border-black'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isOpen ? 'shadow-[0_3px_0_0_var(--color-black)] -translate-y-0.5' : 'shadow-[0_1px_0_0_var(--color-black)]'}
        `}
      >
        <span className={selectedOption ? 'text-black' : 'text-black/40'}>
          {selectedOption?.label || placeholder}
        </span>
        <span className={`text-black ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`
            absolute z-50 top-full left-0 right-0 mt-1
            bg-warm-cloud
            border border-black
            rounded-sm
            shadow-[2px_2px_0_0_var(--color-black)]
            overflow-hidden
          `}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => !option.disabled && handleSelect(option.value)}
              disabled={option.disabled}
              className={`
                w-full px-3 py-2
                font-mondwest text-base text-left
                ${option.value === value ? 'bg-sun-yellow text-black' : 'text-black'}
                ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-sun-yellow cursor-pointer'}
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Select;

