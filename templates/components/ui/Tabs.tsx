'use client';

import React, { createContext, useContext, useState } from 'react';
import { Icon } from '@/components/icons';

// ============================================================================
// Types
// ============================================================================

type TabsVariant = 'pill' | 'line';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
  variant: TabsVariant;
}

interface TabsProps {
  /** Default active tab ID (uncontrolled mode) */
  defaultValue?: string;
  /** Active tab ID (controlled mode) */
  value?: string;
  /** Callback when tab changes (controlled mode) */
  onValueChange?: (value: string) => void;
  /** Visual variant */
  variant?: TabsVariant;
  /** Tab components */
  children: React.ReactNode;
  /** Additional classes for container */
  className?: string;
}

interface TabListProps {
  /** TabTrigger components */
  children: React.ReactNode;
  /** Additional classes */
  className?: string;
}

interface TabTriggerProps {
  /** Unique tab ID */
  value: string;
  /** Tab label */
  children: React.ReactNode;
  /** Icon name (filename without .svg extension) */
  iconName?: string;
  /** Additional classes */
  className?: string;
}

interface TabContentProps {
  /** Tab ID this content belongs to */
  value: string;
  /** Content to render when active */
  children: React.ReactNode;
  /** Additional classes */
  className?: string;
}

// ============================================================================
// Context
// ============================================================================

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tab components must be used within a Tabs provider');
  }
  return context;
}

// ============================================================================
// Styles
// ============================================================================

/**
 * Tab trigger base styles - matching Webflow tab style
 */
const triggerBaseStyles = `
  flex items-center justify-center
  px-4 py-2
  font-joystix text-xs uppercase
  cursor-pointer select-none
  text-black
  transition-all duration-200 ease-out
  relative
`;

/**
 * Pill variant styles (similar to buttons)
 */
const pillStyles = {
  inactive: `
    border border-black
    rounded-sm
    bg-transparent
    hover:bg-black/5
  `,
  active: `
    border border-black
    rounded-sm
    bg-sun-yellow
  `,
};

/**
 * Line variant styles (Webflow-style tabs with connected active state)
 */
const lineStyles = {
  inactive: `
    bg-transparent
    hover:bg-warm-cloud/50
  `,
  active: `
    border-b-0
    bg-warm-cloud
    border-t border-l border-r border-black
    rounded-t-md
    mb-0
    relative
    z-10
  `,
};

// ============================================================================
// Components
// ============================================================================

/**
 * Tabs container - provides context for tab state
 * Supports both controlled and uncontrolled modes
 */
export function Tabs({
  defaultValue,
  value,
  onValueChange,
  variant = 'pill',
  children,
  className = '',
}: TabsProps) {
  // Uncontrolled mode uses internal state
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  
  // Determine if controlled or uncontrolled
  const isControlled = value !== undefined;
  const activeTab = isControlled ? value : internalValue;
  
  const setActiveTab = (newValue: string) => {
    if (isControlled) {
      onValueChange?.(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, variant }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

/**
 * Container for tab triggers - Webflow-style tab menu
 */
export function TabList({ children, className = '' }: TabListProps) {
  return (
    <div className={`flex gap-1 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Individual tab trigger button - Webflow-style
 */
export function TabTrigger({
  value,
  children,
  iconName,
  className = '',
}: TabTriggerProps) {
  const { activeTab, setActiveTab, variant } = useTabsContext();
  const isActive = activeTab === value;

  const variantStyle = variant === 'pill'
    ? (isActive ? pillStyles.active : pillStyles.inactive)
    : (isActive ? lineStyles.active : lineStyles.inactive);

  const classes = [
    triggerBaseStyles,
    variantStyle,
    className,
  ]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveTab(value)}
      className={classes}
    >
      <span className="flex items-center gap-2">
        {iconName && (
          <span className="opacity-70">
            <Icon name={iconName} size={16} />
          </span>
        )}
        <span>{children}</span>
      </span>
    </button>
  );
}

/**
 * Tab content panel - Webflow-style tab pane
 */
export function TabContent({
  value,
  children,
  className = '',
}: TabContentProps) {
  const { activeTab, variant } = useTabsContext();

  if (activeTab !== value) {
    return null;
  }

  // For line variant, content connects seamlessly with active tab
  const contentClasses = variant === 'line'
    ? `bg-warm-cloud border-r border-black ${className}`
    : className;

  return (
    <div 
      role="tabpanel" 
      className={contentClasses}
    >
      {children}
    </div>
  );
}

export default Tabs;

