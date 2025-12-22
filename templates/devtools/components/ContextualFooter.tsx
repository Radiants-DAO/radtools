'use client';

import type { Tab } from '../types';
import { SecondaryNavigation } from './SecondaryNavigation';
import { PrimaryNavigationFooter } from './PrimaryNavigationFooter';

interface ContextualFooterProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  // Components tab props
  componentSubTab?: string;
  componentSearchQuery?: string;
  onComponentSubTabChange?: (tab: string) => void;
  onComponentSearchChange?: (query: string) => void;
  componentTabs?: Array<{ id: string; label: string }>;
  onAddComponentFolder?: (folderName: string) => void;
  // Typography tab props
  typographySearchQuery?: string;
  onTypographySearchChange?: (query: string) => void;
}

export function ContextualFooter({
  activeTab,
  onTabChange,
  componentSubTab,
  componentSearchQuery,
  onComponentSubTabChange,
  onComponentSearchChange,
  componentTabs,
  onAddComponentFolder,
  typographySearchQuery,
  onTypographySearchChange,
}: ContextualFooterProps) {
  return (
    <>
      {/* Secondary Navigation (above footer) */}
      <SecondaryNavigation
        activeTab={activeTab}
        componentSubTab={componentSubTab}
        onComponentSubTabChange={onComponentSubTabChange}
        componentTabs={componentTabs}
        onAddComponentFolder={onAddComponentFolder}
      />
      {/* Primary Navigation Footer (always visible) */}
      <PrimaryNavigationFooter
        activeTab={activeTab}
        onTabChange={onTabChange}
        componentSearchQuery={componentSearchQuery}
        onComponentSearchChange={onComponentSearchChange}
        typographySearchQuery={typographySearchQuery}
        onTypographySearchChange={onTypographySearchChange}
      />
    </>
  );
}

