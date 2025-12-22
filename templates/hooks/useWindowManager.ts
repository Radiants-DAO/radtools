'use client';

import { useState, useCallback, useMemo } from 'react';

// ============================================================================
// Types
// ============================================================================

interface WindowPosition {
  x: number;
  y: number;
}

interface WindowSize {
  width: string;
  height: string;
}

interface WindowState {
  id: string;
  isOpen: boolean;
  isMinimized: boolean;
  position: WindowPosition;
  size: WindowSize;
  zIndex: number;
}

interface WindowManagerState {
  windows: Map<string, WindowState>;
  topZIndex: number;
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook for managing window state in a desktop-like interface
 *
 * Provides:
 * - Window open/close state
 * - Position tracking
 * - Size tracking
 * - Z-index management for focus
 *
 * @example
 * const { openWindow, closeWindow, focusWindow, getWindowState } = useWindowManager();
 */
export function useWindowManager() {
  const [state, setState] = useState<WindowManagerState>({
    windows: new Map(),
    topZIndex: 100,
  });

  // Get window state by ID
  const getWindowState = useCallback((id: string): WindowState | undefined => {
    return state.windows.get(id);
  }, [state.windows]);

  // Open a window
  const openWindow = useCallback((
    id: string,
    options?: {
      position?: WindowPosition;
      size?: WindowSize;
    }
  ) => {
    setState(prev => {
      const newWindows = new Map(prev.windows);
      const newZIndex = prev.topZIndex + 1;

      newWindows.set(id, {
        id,
        isOpen: true,
        isMinimized: false,
        position: options?.position || { x: 100, y: 50 },
        size: options?.size || { width: '900px', height: '700px' },
        zIndex: newZIndex,
      });

      return {
        windows: newWindows,
        topZIndex: newZIndex,
      };
    });
  }, []);

  // Close a window
  const closeWindow = useCallback((id: string) => {
    setState(prev => {
      const newWindows = new Map(prev.windows);
      const windowState = newWindows.get(id);

      if (windowState) {
        newWindows.set(id, { ...windowState, isOpen: false });
      }

      return { ...prev, windows: newWindows };
    });
  }, []);

  // Focus a window (bring to front)
  const focusWindow = useCallback((id: string) => {
    setState(prev => {
      const newWindows = new Map(prev.windows);
      const windowState = newWindows.get(id);

      if (windowState) {
        const newZIndex = prev.topZIndex + 1;
        newWindows.set(id, { ...windowState, zIndex: newZIndex });
        return { windows: newWindows, topZIndex: newZIndex };
      }

      return prev;
    });
  }, []);

  // Update window position
  const updateWindowPosition = useCallback((id: string, position: WindowPosition) => {
    setState(prev => {
      const newWindows = new Map(prev.windows);
      const windowState = newWindows.get(id);

      if (windowState) {
        newWindows.set(id, { ...windowState, position });
      } else {
        // Auto-create window state if it doesn't exist
        newWindows.set(id, {
          id,
          isOpen: true,
          isMinimized: false,
          position,
          size: { width: '900px', height: '700px' },
          zIndex: prev.topZIndex + 1,
        });
        return { windows: newWindows, topZIndex: prev.topZIndex + 1 };
      }

      return { ...prev, windows: newWindows };
    });
  }, []);

  // Update window size
  const updateWindowSize = useCallback((id: string, size: WindowSize) => {
    setState(prev => {
      const newWindows = new Map(prev.windows);
      const windowState = newWindows.get(id);

      if (windowState) {
        newWindows.set(id, { ...windowState, size });
      }

      return { ...prev, windows: newWindows };
    });
  }, []);

  // Minimize a window
  const minimizeWindow = useCallback((id: string) => {
    setState(prev => {
      const newWindows = new Map(prev.windows);
      const windowState = newWindows.get(id);

      if (windowState) {
        newWindows.set(id, { ...windowState, isMinimized: true });
      }

      return { ...prev, windows: newWindows };
    });
  }, []);

  // Restore a minimized window
  const restoreWindow = useCallback((id: string) => {
    setState(prev => {
      const newWindows = new Map(prev.windows);
      const windowState = newWindows.get(id);

      if (windowState) {
        const newZIndex = prev.topZIndex + 1;
        newWindows.set(id, { ...windowState, isMinimized: false, zIndex: newZIndex });
        return { windows: newWindows, topZIndex: newZIndex };
      }

      return prev;
    });
  }, []);

  // Check if window is open
  const isWindowOpen = useCallback((id: string): boolean => {
    const windowState = state.windows.get(id);
    return windowState?.isOpen ?? false;
  }, [state.windows]);

  // Get all open windows
  const openWindows = useMemo(() => {
    return Array.from(state.windows.values()).filter(w => w.isOpen);
  }, [state.windows]);

  return {
    getWindowState,
    openWindow,
    closeWindow,
    focusWindow,
    minimizeWindow,
    restoreWindow,
    updateWindowPosition,
    updateWindowSize,
    isWindowOpen,
    openWindows,
  };
}

export default useWindowManager;
