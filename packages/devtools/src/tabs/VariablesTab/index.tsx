'use client';

import { useEffect } from 'react';
import { useDevToolsStore } from '../../store';
import { ColorDisplay } from './ColorDisplay';
import { ColorModeSelector } from './ColorModeSelector';
import { BorderRadiusDisplay } from './BorderRadiusDisplay';
import { Button } from '@radflow/ui/Button';
import { Divider } from '@radflow/ui/Divider';

export function VariablesTab() {
  const { loadFromCSS } = useDevToolsStore();

  useEffect(() => {
    loadFromCSS();
  }, [loadFromCSS]);

  return (
    <div className="flex flex-col h-full overflow-auto pt-4 pb-4 pl-4 pr-2 bg-[var(--color-white)] border border-black rounded space-y-4">
      <div className="flex items-center justify-between">
        <h2>Design Tokens</h2>
        <Button variant="outline" size="md" iconName="refresh" onClick={() => loadFromCSS()}>
          Reload
        </Button>
      </div>

      <div className="space-y-4" data-edit-scope="theme-variables">
        <ColorModeSelector />
        <Divider />
        <ColorDisplay />
        <Divider />
        <BorderRadiusDisplay />
      </div>
    </div>
  );
}
