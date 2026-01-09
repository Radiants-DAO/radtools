'use client';

import { useDevToolsStore } from '../../store';
import { useToast } from '@radflow/ui/Toast';
import type { BaseColor } from '../../types';

export function ColorDisplay() {
  const { baseColors } = useDevToolsStore();
  const { addToast } = useToast();

  const brandColors = baseColors.filter((c) => c.category === 'brand');
  const neutralColors = baseColors.filter((c) => c.category === 'neutral');
  const systemColors = baseColors.filter((c) => c.category === 'system');

  const copyHex = (value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      addToast({ title: 'Copied', description: value, variant: 'success' });
    });
  };

  const Section = ({ title, colors }: { title: string; colors: BaseColor[] }) => (
    <div className="space-y-2">
      <h4>{title}</h4>
      <div className="space-y-1">
        {colors.map((color) => (
          <div
            key={color.id}
            className="flex items-center gap-3 p-2 rounded-sm hover:bg-black/5 cursor-pointer"
            onClick={() => copyHex(color.value)}
          >
            <div
              className="w-6 h-6 rounded-xs border border-black flex-shrink-0"
              style={{ backgroundColor: color.value }}
            />
            <span className="flex-1 min-w-0 font-mondwest text-base text-black truncate">
              {color.displayName}
            </span>
            <code className="text-sm font-mono text-black/60 uppercase flex-shrink-0">
              {color.value}
            </code>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {brandColors.length > 0 && <Section title="Brand Colors" colors={brandColors} />}
      {neutralColors.length > 0 && <Section title="Neutrals" colors={neutralColors} />}
      {systemColors.length > 0 && <Section title="System Colors" colors={systemColors} />}
      
      <p className="text-sm text-black/60">
        Edit colors directly in <code>globals.css</code> → <code>@theme</code> block.
      </p>
    </div>
  );
}
