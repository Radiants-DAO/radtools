'use client';

import { useDevToolsStore } from '../../store';
import { useToast } from '@radflow/ui/Toast';

export function ShadowDisplay() {
  const { shadows } = useDevToolsStore();
  const { addToast } = useToast();

  const copyToClipboard = (text: string, description?: string) => {
    navigator.clipboard.writeText(text).then(() => {
      addToast({ title: 'Copied', description: description || text, variant: 'success' });
    }).catch(() => {
      addToast({ title: 'Failed to copy', description: 'Unable to copy to clipboard', variant: 'error' });
    });
  };

  if (shadows.length === 0) {
    return (
      <div className="space-y-2">
        <h4>Shadows</h4>
        <p className="text-sm text-content-primary/60">No shadows found in globals.css</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4>Shadows</h4>
      <div className="space-y-1">
        {shadows.map((shadow) => (
          <div
            key={shadow.id}
            className="flex items-center gap-3 p-2 rounded-sm hover:bg-content-primary/5 cursor-pointer"
            onClick={() => copyToClipboard(shadow.cssVar)}
            title="Click to copy CSS variable"
          >
            <div
              className="w-6 h-6 rounded-xs border border-edge-primary flex-shrink-0 bg-surface-primary"
              style={{ boxShadow: shadow.value }}
            />
            <span className="flex-1 min-w-0 font-mondwest text-base text-content-primary truncate">
              {shadow.displayName}
            </span>
            <code className="flex-shrink-0">
              {shadow.cssVar}
            </code>
          </div>
        ))}
      </div>
      
      <p className="text-sm text-content-primary/60">
        Edit shadows directly in <code>globals.css</code> → <code>@theme</code> block.
      </p>
    </div>
  );
}
