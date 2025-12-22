'use client';

import React from 'react';
import { useWindowManager } from '@/hooks/useWindowManager';
import { CloseIcon } from '@/components/icons';

// ============================================================================
// Types
// ============================================================================

interface MobileAppModalProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Full-screen modal for mobile app display
 * Replaces draggable windows on mobile devices
 */
export function MobileAppModal({ id, title, children }: MobileAppModalProps) {
  const { getWindowState, closeWindow } = useWindowManager();
  const windowState = getWindowState(id);

  if (!windowState?.isOpen || windowState?.isMinimized) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-[200] bg-warm-cloud flex flex-col"
      style={{ zIndex: windowState.zIndex + 100 }}
    >
      {/* Header */}
      <header 
        className="
          flex items-center justify-between
          px-4 py-3
          bg-warm-cloud
          border-b
          flex-shrink-0
        "
        style={{ borderBottomColor: 'var(--border-primary-20)' }}
      >
        <h1 className="font-joystix text-sm text-primary uppercase">
          {title}
        </h1>
        <button
          type="button"
          onClick={() => closeWindow(id)}
          className="
            w-10 h-10
            flex items-center justify-center
            hover:bg-black/5 active:bg-black/10
            rounded-sm
            -mr-2
          "
        >
          <CloseIcon size={14} className="text-primary" />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

export default MobileAppModal;

