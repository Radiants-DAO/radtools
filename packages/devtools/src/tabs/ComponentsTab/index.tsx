'use client';

import { useState, useEffect, useMemo } from 'react';
import { Tabs, TabList, TabTrigger, TabContent, useToast } from '@radflow/ui';
import { DesignSystemTab } from './DesignSystemTab';
import { UITab } from './UITab';
import { DynamicFolderTab } from './DynamicFolderTab';
import { AddTabButton } from './AddTabButton';
import { COMPONENT_TABS, type ComponentTabConfig } from './tabConfig';
import { ComponentsSecondaryNav } from '../../components/ComponentsSecondaryNav';
import { useDevToolsStore } from '../../store';

const STORAGE_KEY = 'devtools-dynamic-component-tabs';

/**
 * Load dynamic tabs from localStorage
 */
function loadDynamicTabs(): ComponentTabConfig[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Save dynamic tabs to localStorage
 */
function saveDynamicTabs(tabs: ComponentTabConfig[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tabs));
  } catch {
    // Ignore storage errors
  }
}

interface ComponentsTabProps {
  activeSubTab?: string;
  onTabsChange?: (tabs: Array<{ id: string; label: string }>) => void;
  onAddFolder?: (folderName: string) => void;
  componentTabs?: Array<{ id: string; label: string }>;
  onComponentSubTabChange?: (tab: string) => void;
}

export function ComponentsTab({
  activeSubTab = 'design-system',
  onTabsChange,
  onAddFolder,
  componentTabs = [],
  onComponentSubTabChange,
}: ComponentsTabProps) {
  const [dynamicTabs, setDynamicTabs] = useState<ComponentTabConfig[]>([]);
  const { addToast } = useToast();
  const { selectedComponentName, clearSelectedComponent } = useDevToolsStore();

  // Load dynamic tabs on mount and auto-discover folders
  useEffect(() => {
    const loadTabs = async () => {
      // First, load saved tabs from localStorage
      const savedTabs = loadDynamicTabs();

      // Then, fetch available folders from API
      try {
        const response = await fetch('/api/devtools/components/folders');
        if (response.ok) {
          const data = await response.json();
          const discoveredFolders = data.folders || [];

          // Create tabs for discovered folders that don't already exist
          const existingFolderIds = new Set(savedTabs.map(tab => tab.id));
          const newTabs: ComponentTabConfig[] = discoveredFolders
            .filter((folder: string) => !existingFolderIds.has(`folder-${folder}`))
            .map((folder: string) => ({
              id: `folder-${folder}`,
              label: folder,
              description: `Components from /components/${folder}/`,
            }));

          // Merge saved tabs with newly discovered tabs
          const allDiscoveredTabs = [...savedTabs, ...newTabs];
          setDynamicTabs(allDiscoveredTabs);

          // Save the updated tabs list
          if (newTabs.length > 0) {
            saveDynamicTabs(allDiscoveredTabs);
          }
        } else {
          // If API fails, just use saved tabs
          setDynamicTabs(savedTabs);
        }
      } catch (error) {
        // If fetch fails, just use saved tabs
        console.warn('Failed to auto-discover folders:', error);
        setDynamicTabs(savedTabs);
      }
    };

    loadTabs();
  }, []);

  // Memoize allTabs to prevent unnecessary re-renders
  const allTabs = useMemo(() => [...COMPONENT_TABS, ...dynamicTabs], [dynamicTabs]);
  
  // Memoize the mapped tabs array to prevent unnecessary effect runs
  const tabsForParent = useMemo(
    () => allTabs.map((tab) => ({ id: tab.id, label: tab.label })),
    [allTabs]
  );
  
  // Notify parent of tabs change
  useEffect(() => {
    if (onTabsChange) {
      onTabsChange(tabsForParent);
    }
  }, [tabsForParent, onTabsChange]);

  const handleAddFolder = async (folderName: string) => {
    // Validate folder name
    if (!folderName || !/^[a-zA-Z0-9_-]+$/.test(folderName)) {
      addToast({
        title: 'Invalid folder name',
        description: 'Folder name must contain only letters, numbers, underscores, or hyphens',
        variant: 'warning',
      });
      return;
    }

    // Check if folder already exists
    if (dynamicTabs.some((tab) => tab.id === `folder-${folderName}`)) {
      addToast({
        title: 'Folder exists',
        description: 'A tab for this folder already exists',
        variant: 'warning',
      });
      return;
    }

    try {
      // Create folder via API
      const response = await fetch('/api/devtools/components/create-folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderName }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create folder');
      }

      // Add new tab
      const newTab: ComponentTabConfig = {
        id: `folder-${folderName}`,
        label: folderName,
        description: `Components from /components/${folderName}/`,
      };

      const updatedTabs = [...dynamicTabs, newTab];
      setDynamicTabs(updatedTabs);
      saveDynamicTabs(updatedTabs);

      // Tabs will be updated via useEffect that calls onTabsChange
    } catch (error) {
      console.error('Failed to create folder:', error);
      addToast({
        title: 'Failed to create folder',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'error',
      });
    }
  };

  // Expose handleAddFolder for footer access
  useEffect(() => {
    (window as any).__componentsTabAddFolder = handleAddFolder;
    return () => {
      delete (window as any).__componentsTabAddFolder;
    };
  }, [dynamicTabs]);

  return (
    <div className="flex flex-col h-full">
      {/* Secondary Navigation Tabs at Top */}
      <ComponentsSecondaryNav
        activeSubTab={activeSubTab}
        onSubTabChange={(tabId) => {
          if (onComponentSubTabChange) {
            onComponentSubTabChange(tabId);
          }
        }}
        tabs={componentTabs.length > 0 ? componentTabs : tabsForParent}
        onAddFolder={onAddFolder || (() => {})}
      />

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {allTabs.map((tab: ComponentTabConfig) => {
          // UI tab
          if (tab.id === 'ui' && activeSubTab === 'ui') {
            return (
              <div key={tab.id} className="h-full pr-2 pl-2 pb-2 rounded overflow-auto">
                <UITab />
              </div>
            );
          }

          // Design system tab
          if (tab.id === 'design-system' && activeSubTab === 'design-system') {
            return (
              <div key={tab.id} className="h-full pr-2 pl-2 pb-2 rounded overflow-auto">
                <DesignSystemTab
                  selectedComponentName={selectedComponentName}
                  onComponentFocused={clearSelectedComponent}
                />
              </div>
            );
          }

          // Dynamic folder tabs
          if (tab.id.startsWith('folder-') && activeSubTab === tab.id) {
            const folderName = tab.id.replace('folder-', '');
            return (
              <div key={tab.id} className="h-full pr-2 pl-2 pb-2 rounded overflow-auto">
                <DynamicFolderTab folderName={folderName} />
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
