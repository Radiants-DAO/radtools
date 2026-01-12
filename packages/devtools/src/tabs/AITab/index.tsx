'use client';

import { useEffect, useState } from 'react';
import { useDevToolsStore } from '../../store';
import { PromptsSubTab } from './PromptsSubTab';
import { ThemePromptsSubTab } from './ThemePromptsSubTab';
import { StylesSubTab } from './StylesSubTab';
import { radflowPrompts } from '../../data/prompts';
import { srefCodes } from '../../data/srefCodes';
import { Button } from '@radflow/ui/Button';

type AISubTab = 'radflow-prompts' | 'theme-prompts' | 'styles';

export function AITab() {
  const {
    radflowPrompts: storeRadflowPrompts,
    themePrompts,
    srefCodes: storeSrefCodes,
    loadRadflowPrompts,
    loadSrefCodes,
  } = useDevToolsStore();

  const [activeSubTab, setActiveSubTab] = useState<AISubTab>('radflow-prompts');
  const [searchQuery, setSearchQuery] = useState('');

  // Load data on mount
  useEffect(() => {
    if (storeRadflowPrompts.length === 0) {
      loadRadflowPrompts(radflowPrompts);
    }
    if (storeSrefCodes.length === 0) {
      loadSrefCodes(srefCodes);
    }
  }, []);

  const subTabs: Array<{ id: AISubTab; label: string; count: number }> = [
    { id: 'radflow-prompts', label: 'RadFlow Prompts', count: storeRadflowPrompts.length },
    { id: 'theme-prompts', label: 'Theme Prompts', count: themePrompts.length },
    { id: 'styles', label: 'Styles (SREF)', count: storeSrefCodes.length },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header with sub-tabs and search */}
      <div className="flex-shrink-0 border-b border-edge-primary/10 bg-surface-secondary/5">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex gap-2">
            {subTabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeSubTab === tab.id ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setActiveSubTab(tab.id)}
              >
                {tab.label} ({tab.count})
              </Button>
            ))}
          </div>
        </div>

        {/* Search bar */}
        <div className="px-4 pb-3">
          <input
            type="text"
            placeholder="Search prompts and styles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 bg-surface-primary border border-edge-primary/20 rounded-md text-content-primary placeholder:text-content-tertiary focus:outline-none focus:ring-2 focus:ring-interactive-primary"
          />
        </div>
      </div>

      {/* Sub-tab content */}
      <div className="flex-1 overflow-y-auto">
        {activeSubTab === 'radflow-prompts' && (
          <PromptsSubTab prompts={storeRadflowPrompts} searchQuery={searchQuery} />
        )}
        {activeSubTab === 'theme-prompts' && (
          <ThemePromptsSubTab prompts={themePrompts} searchQuery={searchQuery} />
        )}
        {activeSubTab === 'styles' && (
          <StylesSubTab codes={storeSrefCodes} searchQuery={searchQuery} />
        )}
      </div>
    </div>
  );
}
