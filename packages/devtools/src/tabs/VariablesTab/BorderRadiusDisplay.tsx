'use client';

import { useDevToolsStore } from '../../store';

const RADIUS_KEYS = ['none', 'xs', 'sm', 'md', 'lg', 'full'] as const;

export function BorderRadiusDisplay() {
  const { borderRadius } = useDevToolsStore();

  return (
    <div className="space-y-3">
      <h3>Border Radius</h3>
      
      <div className="grid grid-cols-2 gap-2">
        {RADIUS_KEYS.map((key) => (
          <div key={key} className="flex items-center gap-2 p-2 bg-black/10 rounded-sm">
            <div
              className="w-8 h-8 bg-sun-yellow border border-black flex-shrink-0"
              style={{ borderRadius: borderRadius[key] || '0' }}
            />
            <div className="flex-1 min-w-0">
              <span className="font-mondwest text-base font-mono text-black block">{key}</span>
              <code className="text-sm font-mono text-black/60 block mt-0.5">
                {borderRadius[key] || '0'}
              </code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
