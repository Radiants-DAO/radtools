'use client';

import Draggable from 'react-draggable';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useDevToolsStore } from './store';
import type { Tab } from './types';

// Import UI components
import { Button } from '@/components/ui/Button';
import { WindowTitleBar } from '@/components/Rad_os/WindowTitleBar';

// Import actual tab components
import { VariablesTab } from './tabs/VariablesTab';
import { TypographyTab } from './tabs/TypographyTab';
import { ComponentsTab } from './tabs/ComponentsTab';
import { AssetsTab } from './tabs/AssetsTab';
import { MockStatesTab } from './tabs/MockStatesTab';
import { ContextualFooter } from './components/ContextualFooter';

export function DevToolsPanel() {
  // Store hooks must be first - all functions below depend on these values
  const { 
    activeTab, 
    setActiveTab, 
    panelPosition, 
    setPanelPosition,
    panelSize,
    setPanelSize,
    togglePanel,
    isFullscreen,
    toggleFullscreen,
  } = useDevToolsStore();

  const nodeRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);

  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  // Footer state
  const [componentSubTab, setComponentSubTab] = useState<string>('design-system');
  const [componentSearchQuery, setComponentSearchQuery] = useState<string>('');
  const [typographySearchQuery, setTypographySearchQuery] = useState<string>('');
  const [componentTabs, setComponentTabs] = useState<Array<{ id: string; label: string }>>([]);

  const handleDragStop = (_: unknown, data: { x: number; y: number }) => {
    setPanelPosition({ x: data.x, y: data.y });
  };

  // Resize functionality
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!nodeRef.current) return;
    
    const rect = nodeRef.current.getBoundingClientRect();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: rect.width,
      height: rect.height,
    });
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!nodeRef.current) return;

      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;

      const minWidth = 300;
      const minHeight = 200;
      const maxWidth = window.innerWidth * 0.9;
      const maxHeight = window.innerHeight * 0.9;

      const newWidth = Math.min(Math.max(resizeStart.width + deltaX, minWidth), maxWidth);
      const newHeight = Math.min(Math.max(resizeStart.height + deltaY, minHeight), maxHeight);

      setPanelSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeStart, setPanelSize]);

  // Handle tab change from Tabs component
  const handleTabChange = (value: string) => {
    setActiveTab(value as Tab);
  };

  // Fullscreen styles
  const panelStyles = isFullscreen
    ? {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
      }
    : {
        top: 0,
        left: 0,
        width: `${panelSize.width}px`,
        height: `${panelSize.height}px`,
        minWidth: '300px',
        minHeight: '200px',
        maxWidth: '90vw',
        maxHeight: '90vh',
      };

  return (
    <Draggable
      nodeRef={nodeRef}
      handle="[data-drag-handle]"
      position={isFullscreen ? { x: 0, y: 0 } : panelPosition}
      onStop={handleDragStop}
      bounds="parent"
      disabled={isResizing || isFullscreen}
    >
      <div
        ref={nodeRef}
        className={`fixed z-[9999] overflow-hidden flex flex-col border ${
          isFullscreen ? 'inset-0' : 'rounded-[8px] shadow-[4px_4px_0_0_var(--color-black)]'
        }`}
        style={{
          ...panelStyles,
          background: 'linear-gradient(0deg, rgba(252, 225, 132, 1) 0%, rgba(254, 248, 226, 1) 100%)',
          borderStyle: 'solid',
          borderWidth: '1px',
          borderColor: 'var(--color-black)',
        }}
      >
        {/* Header */}
        <WindowTitleBar
          title="RADTOOLS"
          windowId="radtools"
          onClose={togglePanel}
          iconName="lightning"
          showTitle={true}
          showCopyButton={false}
          showCloseButton={true}
          showHelpButton={true}
          showActionButton={false}
          showFullscreenButton={true}
          onFullscreen={toggleFullscreen}
          helpTitle="How to Use RadTools"
          helpContent={
            <div className="space-y-4">
              <div>
                <h3 className="font-joystix text-sm uppercase mb-2">Getting Started</h3>
                <p className="font-mondwest text-sm text-black/80">
                  RadTools is a design system development tool that helps you manage components, typography, variables, and assets.
                </p>
              </div>
              <div>
                <h3 className="font-joystix text-sm uppercase mb-2">Features</h3>
                <ul className="font-mondwest text-sm text-black/80 space-y-1 list-disc list-inside pl-0">
                  <li>Components: Browse and inspect your UI components</li>
                  <li>Typography: Manage font families and typography styles</li>
                  <li>Variables: Edit design tokens and color variables</li>
                  <li>Assets: Upload and organize images, icons, and other assets</li>
                  <li>Mock States: Test components with different state configurations</li>
                </ul>
              </div>
              <div>
                <h3 className="font-joystix text-sm uppercase mb-2">Tips</h3>
                <ul className="font-mondwest text-sm text-black/80 space-y-1 list-disc list-inside">
                  <li>Drag the panel by the title bar to reposition it</li>
                  <li>Use the fullscreen button for a larger workspace</li>
                  <li>Click the close button to hide the panel</li>
                </ul>
              </div>
            </div>
          }
        />

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'variables' && (
            <div className="h-full pr-2 pl-2 pb-2 rounded">
              <VariablesTab />
            </div>
          )}
          {activeTab === 'typography' && (
            <div className="h-full pr-2 pl-2 pb-2 rounded">
              <TypographyTab searchQuery={typographySearchQuery} />
            </div>
          )}
          {activeTab === 'components' && (
            <ComponentsTab
              activeSubTab={componentSubTab}
              searchQuery={componentSearchQuery}
              onTabsChange={setComponentTabs}
            />
          )}
          {activeTab === 'assets' && (
            <div className="h-full pr-2 pl-2 pb-2 rounded">
              <AssetsTab />
            </div>
          )}
          {activeTab === 'mockStates' && (
            <div className="h-full pr-2 pl-2 pb-2 rounded">
              <MockStatesTab />
            </div>
          )}
        </div>

        {/* Contextual Footer */}
        <ContextualFooter
          activeTab={activeTab}
          onTabChange={handleTabChange}
          componentSubTab={componentSubTab}
          componentSearchQuery={componentSearchQuery}
          onComponentSubTabChange={setComponentSubTab}
          onComponentSearchChange={setComponentSearchQuery}
          componentTabs={componentTabs}
          onAddComponentFolder={async (folderName) => {
            // Trigger folder creation via ComponentsTab's exposed handler
            if ((window as any).__componentsTabAddFolder) {
              (window as any).__componentsTabAddFolder(folderName);
              // Switch to the new tab
              setComponentSubTab(`folder-${folderName}`);
            }
          }}
          typographySearchQuery={typographySearchQuery}
          onTypographySearchChange={setTypographySearchQuery}
        />

        {/* Resize Handle (hidden in fullscreen) */}
        {!isFullscreen && (
          <div
            ref={resizeHandleRef}
            onMouseDown={handleResizeStart}
            className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-10 flex items-center justify-center text-black"
            style={{
              fontFamily: '"PixelCode", monospace',
              fontSize: '10px',
              lineHeight: 1,
            }}
          >
            ┘
          </div>
        )}
      </div>
    </Draggable>
  );
}
