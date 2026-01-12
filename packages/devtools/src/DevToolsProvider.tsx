'use client';

import { ReactNode, useEffect } from 'react';
import { DevToolsPanel } from './DevToolsPanel';
import { TextEditMode } from './components/TextEditMode';
import { HelpMode } from './components/HelpMode';
import { GlobalSearch } from './components/GlobalSearch';
import { ComponentIdMode } from './components/ComponentIdMode';
import { useDevToolsStore } from './store';
import { ToastProvider } from '@radflow/ui/Toast';
import type { Tab } from './types';

interface DevToolsProviderProps {
  children: ReactNode;
}

export function DevToolsProvider({ children }: DevToolsProviderProps) {
  const {
    isOpen,
    togglePanel,
    panelWidth,
    setActiveTab,
    setSearchOpen,
  } = useDevToolsStore();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle panel: Shift+Cmd+K or Shift+Ctrl+K (always works)
      if (e.shiftKey && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        togglePanel();
        return;
      }

      // Only handle panel-specific shortcuts when panel is open
      if (!isOpen) return;

      // Tab switching: 1-5 (only when panel is focused)
      if (e.key >= '1' && e.key <= '5' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        const tabs: Tab[] = ['variables', 'typography', 'components', 'assets', 'mockStates'];
        const index = parseInt(e.key) - 1;
        if (tabs[index]) {
          setActiveTab(tabs[index]);
        }
        return;
      }

      // Escape: Exit modes / Close search
      if (e.key === 'Escape') {
        e.preventDefault();
        setSearchOpen(false);
        // Exit all modes (they'll handle their own toggle)
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isOpen,
    togglePanel,
    setActiveTab,
    setSearchOpen,
  ]);

  // Inject body padding when panel is open
  useEffect(() => {
    if (!isOpen) {
      document.body.style.paddingRight = '';
      return;
    }

    const style = document.createElement('style');
    style.id = 'devtools-body-padding';
    style.textContent = `
      body {
        padding-right: ${panelWidth}px !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById('devtools-body-padding');
      if (existingStyle) {
        existingStyle.remove();
      }
      document.body.style.paddingRight = '';
    };
  }, [isOpen, panelWidth]);

  // Production: render only children
  if (process.env.NODE_ENV === 'production') {
    return <>{children}</>;
  }

  return (
    <ToastProvider>
      {children}
      {isOpen && <DevToolsPanel />}
      <TextEditMode />
      <HelpMode />
      <GlobalSearch />
      <ComponentIdMode />
    </ToastProvider>
  );
}

