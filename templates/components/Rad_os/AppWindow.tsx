'use client';

import React, { useCallback, useRef, useState, useEffect } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { useWindowManager } from '@/hooks/useWindowManager';
import { WindowTitleBar } from './WindowTitleBar';

// ============================================================================
// Types
// ============================================================================

interface AppWindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: string; height: string };
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  maxHeight?: string;
  resizable?: boolean;
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Draggable and resizable window container for apps
 * 
 * Features:
 * - Draggable via title bar
 * - Resizable via handles on edges and corners
 * - Click-to-focus (z-index management)
 * - Close button
 * - Copy link button
 * - Responsive sizing
 * 
 * @example
 * <AppWindow id="brand" title="Brand & Press">
 *   <BrandAssetsContent />
 * </AppWindow>
 */
export function AppWindow({
  id,
  title,
  children,
  defaultPosition = { x: 100, y: 50 },
  defaultSize = { width: '900px', height: '700px' },
  minWidth = '400px',
  minHeight = '300px',
  maxWidth = '95vw',
  maxHeight = '85vh',
  resizable = false,
  className = '',
}: AppWindowProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleBarRef = useRef<HTMLDivElement>(null);
  const { 
    getWindowState, 
    closeWindow, 
    focusWindow, 
    updateWindowPosition,
    updateWindowSize
  } = useWindowManager();

  const windowState = getWindowState(id);
  
  // Get current size from state or use default
  const currentSize = windowState?.size || defaultSize;
  
  // Parse size strings to numbers for calculations
  const parseSize = (size: string): number => {
    if (size.endsWith('px')) {
      return parseFloat(size);
    } else if (size.endsWith('vw')) {
      return (parseFloat(size) / 100) * (typeof window !== 'undefined' ? window.innerWidth : 1920);
    } else if (size.endsWith('vh')) {
      return (parseFloat(size) / 100) * (typeof window !== 'undefined' ? window.innerHeight : 1080);
    }
    return parseFloat(size);
  };

  const parseMinSize = (size: string): number => parseSize(size);
  const parseMaxSize = (size: string): number => {
    if (size.endsWith('vw')) {
      return (parseFloat(size) / 100) * (typeof window !== 'undefined' ? window.innerWidth : 1920);
    } else if (size.endsWith('vh')) {
      return (parseFloat(size) / 100) * (typeof window !== 'undefined' ? window.innerHeight : 1080);
    }
    return parseSize(size);
  };

  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ 
    x: 0, 
    y: 0, 
    width: 0, 
    height: 0,
    left: 0,
    top: 0,
    positionX: 0,
    positionY: 0,
  });
  const [resizeDirection, setResizeDirection] = useState<string>('');

  // Handle window focus on click
  const handleFocus = useCallback(() => {
    focusWindow(id);
  }, [focusWindow, id]);

  // Handle close
  const handleClose = useCallback(() => {
    closeWindow(id);
  }, [closeWindow, id]);

  // Handle drag stop - update position in state
  const handleDragStop = useCallback(
    (_e: DraggableEvent, data: DraggableData) => {
      updateWindowPosition(id, { x: data.x, y: data.y });
    },
    [id, updateWindowPosition]
  );

  // Handle resize start
  const handleResizeStart = useCallback((e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!nodeRef.current) return;
    
    const rect = nodeRef.current.getBoundingClientRect();
    const currentPos = windowState?.position || defaultPosition;
    
    setIsResizing(true);
    setResizeDirection(direction);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: rect.width,
      height: rect.height,
      left: rect.left,
      top: rect.top,
      positionX: currentPos.x,
      positionY: currentPos.y,
    });
    
    focusWindow(id);
  }, [focusWindow, id, windowState, defaultPosition]);

  // Handle resize
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!nodeRef.current) return;

      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      const minWidthNum = parseMinSize(minWidth);
      const minHeightNum = parseMinSize(minHeight);
      const maxWidthNum = parseMaxSize(maxWidth);
      const maxHeightNum = parseMaxSize(maxHeight);

      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      let newX = resizeStart.positionX;
      let newY = resizeStart.positionY;

      // Calculate new dimensions based on resize direction
      if (resizeDirection.includes('e')) {
        newWidth = Math.min(Math.max(resizeStart.width + deltaX, minWidthNum), maxWidthNum);
      }
      if (resizeDirection.includes('w')) {
        const widthChange = resizeStart.width - Math.min(Math.max(resizeStart.width - deltaX, minWidthNum), maxWidthNum);
        newWidth = Math.min(Math.max(resizeStart.width - deltaX, minWidthNum), maxWidthNum);
        newX = resizeStart.positionX + (resizeStart.width - newWidth);
      }
      if (resizeDirection.includes('s')) {
        newHeight = Math.min(Math.max(resizeStart.height + deltaY, minHeightNum), maxHeightNum);
      }
      if (resizeDirection.includes('n')) {
        const heightChange = resizeStart.height - Math.min(Math.max(resizeStart.height - deltaY, minHeightNum), maxHeightNum);
        newHeight = Math.min(Math.max(resizeStart.height - deltaY, minHeightNum), maxHeightNum);
        newY = resizeStart.positionY + (resizeStart.height - newHeight);
      }

      // Update size in state
      updateWindowSize(id, {
        width: `${newWidth}px`,
        height: `${newHeight}px`,
      });

      // Update position if resizing from left or top
      if (resizeDirection.includes('w') || resizeDirection.includes('n')) {
        updateWindowPosition(id, { x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeDirection('');
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeStart, resizeDirection, minWidth, minHeight, maxWidth, maxHeight, id, updateWindowSize, updateWindowPosition]);

  // Auto-size window based on content on initial mount
  useEffect(() => {
    // Only auto-size if window doesn't have a saved size
    if (windowState?.size) {
      return;
    }

    // Skip auto-sizing if defaultSize is fit-content (let CSS handle it)
    if (defaultSize.width === 'fit-content' || defaultSize.height === 'fit-content') {
      return;
    }

    // Wait for content to render
    const timeoutId = setTimeout(() => {
      if (!contentRef.current || !titleBarRef.current || !nodeRef.current) {
        return;
      }

      // Temporarily remove size constraints to measure natural content size
      const originalWindowWidth = nodeRef.current.style.width;
      const originalWindowHeight = nodeRef.current.style.height;
      const originalWindowMaxWidth = nodeRef.current.style.maxWidth;
      const originalWindowMaxHeight = nodeRef.current.style.maxHeight;
      const originalContentFlex = contentRef.current.style.flex;
      const originalContentOverflow = contentRef.current.style.overflow;
      const originalContentWidth = contentRef.current.style.width;
      const originalContentHeight = contentRef.current.style.height;

      // Set window to very large size temporarily to allow content to expand
      nodeRef.current.style.width = '9999px';
      nodeRef.current.style.height = '9999px';
      nodeRef.current.style.maxWidth = 'none';
      nodeRef.current.style.maxHeight = 'none';

      // Remove flex constraints from content container to measure natural size
      contentRef.current.style.flex = 'none';
      contentRef.current.style.overflow = 'visible';
      contentRef.current.style.width = 'auto';
      contentRef.current.style.height = 'auto';

      // Force layout recalculation
      void nodeRef.current.offsetHeight;
      void contentRef.current.offsetHeight;

      // Measure content dimensions
      const contentWidth = contentRef.current.scrollWidth;
      const contentHeight = contentRef.current.scrollHeight;

      // Measure title bar height
      const titleBarHeight = titleBarRef.current.offsetHeight;

      // Restore original styles
      nodeRef.current.style.width = originalWindowWidth;
      nodeRef.current.style.height = originalWindowHeight;
      nodeRef.current.style.maxWidth = originalWindowMaxWidth;
      nodeRef.current.style.maxHeight = originalWindowMaxHeight;
      contentRef.current.style.flex = originalContentFlex;
      contentRef.current.style.overflow = originalContentOverflow;
      contentRef.current.style.width = originalContentWidth;
      contentRef.current.style.height = originalContentHeight;

      // Window padding: 8px on sides, 8px bottom
      const horizontalPadding = 16; // 8px left + 8px right
      const verticalPadding = 8; // 8px bottom (title bar has its own padding)

      // Calculate required window dimensions
      const requiredWidth = contentWidth + horizontalPadding;
      const requiredHeight = contentHeight + titleBarHeight + verticalPadding;

      // Get viewport constraints
      const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
      const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
      const maxWidthPx = parseMaxSize(maxWidth);
      const maxHeightPx = parseMaxSize(maxHeight);
      const minWidthPx = parseMinSize(minWidth);
      const minHeightPx = parseMinSize(minHeight);

      // Cap at viewport size (95vw, 85vh) or max constraints
      const effectiveMaxWidth = Math.min(maxWidthPx, viewportWidth * 0.95);
      const effectiveMaxHeight = Math.min(maxHeightPx, viewportHeight * 0.85);

      // Apply constraints
      const finalWidth = Math.max(
        minWidthPx,
        Math.min(requiredWidth, effectiveMaxWidth)
      );
      const finalHeight = Math.max(
        minHeightPx,
        Math.min(requiredHeight, effectiveMaxHeight)
      );

      updateWindowSize(id, {
        width: `${finalWidth}px`,
        height: `${finalHeight}px`,
      });
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [id, windowState?.size, maxWidth, maxHeight, minWidth, minHeight, updateWindowSize, defaultSize.width, defaultSize.height]);

  // Don't render if window is not open or is minimized
  // This check must be AFTER all hooks are called!
  if (!windowState?.isOpen || windowState?.isMinimized) {
    return null;
  }

  return (
    <Draggable
      nodeRef={nodeRef}
      handle="[data-drag-handle]"
      position={windowState?.position || defaultPosition}
      onStop={handleDragStop}
      bounds="parent"
      disabled={isResizing}
    >
      <div
        ref={nodeRef}
        className={`
          absolute
          pointer-events-auto
          border border-primary
          rounded-lg
          shadow-[4px_4px_0px_0px_var(--border-primary)]
          overflow-hidden
          flex flex-col
          ${className}
        `}
        style={{
          width: currentSize.width,
          height: currentSize.height,
          minWidth,
          minHeight,
          maxWidth,
          maxHeight,
          zIndex: windowState?.zIndex || 100,
          padding: '0px 8px 8px',
          background: 'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-tertiary) 100%)',
        }}
        onMouseDown={handleFocus}
        data-app-window={id}
        data-resizable={resizable}
      >
        {/* Title Bar */}
        <div ref={titleBarRef}>
          <WindowTitleBar
            title={title}
            windowId={id}
            onClose={handleClose}
          />
        </div>

        {/* Content */}
        <div 
          ref={contentRef}
          className="flex-1 overflow-auto rounded-sm" 
        >
          {children}
        </div>

        {/* Resize Handles - only render if resizable is true */}
        {resizable && (
          <>
            {/* Corner handles */}
            <div
              className="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize z-10"
              onMouseDown={(e) => handleResizeStart(e, 'nw')}
            />
            <div
              className="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize z-10"
              onMouseDown={(e) => handleResizeStart(e, 'ne')}
            />
            <div
              className="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize z-10"
              onMouseDown={(e) => handleResizeStart(e, 'sw')}
            />
            <div
              className="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize z-10"
              onMouseDown={(e) => handleResizeStart(e, 'se')}
            />
            
            {/* Edge handles */}
            <div
              className="absolute top-0 left-3 right-3 h-1 cursor-ns-resize z-10"
              onMouseDown={(e) => handleResizeStart(e, 'n')}
            />
            <div
              className="absolute bottom-0 left-3 right-3 h-1 cursor-ns-resize z-10"
              onMouseDown={(e) => handleResizeStart(e, 's')}
            />
            <div
              className="absolute left-0 top-3 bottom-3 w-1 cursor-ew-resize z-10"
              onMouseDown={(e) => handleResizeStart(e, 'w')}
            />
            <div
              className="absolute right-0 top-3 bottom-3 w-1 cursor-ew-resize z-10"
              onMouseDown={(e) => handleResizeStart(e, 'e')}
            />
          </>
        )}
      </div>
    </Draggable>
  );
}

export default AppWindow;

