'use client';

import { ReactNode, useEffect } from 'react';
import { DevToolsPanel } from './DevToolsPanel';
import { BreakpointIndicator } from './components/BreakpointIndicator';
import { useDevToolsStore } from './store';
import { ToastProvider } from '@radflow/ui/Toast';

interface DevToolsProviderProps {
  children: ReactNode;
}

export function DevToolsProvider({ children }: DevToolsProviderProps) {
  const { isOpen, togglePanel } = useDevToolsStore();

  // Keyboard shortcut: Shift+Cmd+K (Mac) / Shift+Ctrl+K (Windows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle panel with Shift+Cmd+K or Shift+Ctrl+K
      if (e.shiftKey && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        togglePanel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePanel]);

  // Production: render only children
  if (process.env.NODE_ENV === 'production') {
    return <>{children}</>;
  }

  return (
    <ToastProvider>
      {children}
      {isOpen && <DevToolsPanel />}
      <BreakpointIndicator />
    </ToastProvider>
  );
}

