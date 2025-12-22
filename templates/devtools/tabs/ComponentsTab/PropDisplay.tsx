'use client';

import { Icon } from '@/components/icons';
import type { DiscoveredComponent } from '../../types';

interface PropDisplayProps {
  component: DiscoveredComponent;
}

export function PropDisplay({ component }: PropDisplayProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-joystix text-sm uppercase text-black">{component.name}</h3>
        <span className="font-mondwest text-base text-black/60 font-mono">{component.path}</span>
      </div>

      {component.props.length > 0 ? (
        <div className="border border-black rounded-md overflow-hidden">
          <table className="w-full font-mondwest text-base">
            <thead className="bg-black/10">
              <tr>
                <th className="text-left px-3 py-2 text-black/60 font-joystix text-xs uppercase">Prop</th>
                <th className="text-left px-3 py-2 text-black/60 font-joystix text-xs uppercase">Type</th>
                <th className="text-left px-3 py-2 text-black/60 font-joystix text-xs uppercase">Required</th>
                <th className="text-left px-3 py-2 text-black/60 font-joystix text-xs uppercase">Default</th>
              </tr>
            </thead>
            <tbody>
              {component.props.map((prop) => (
                <tr key={prop.name} className="border-t border-black" style={{ borderTopColor: 'var(--border-black-20)' }}>
                  <td className="px-3 py-2 font-mono text-black">{prop.name}</td>
                  <td className="px-3 py-2 font-mono text-black/60">{prop.type}</td>
                  <td className="px-3 py-2">
                    {prop.required ? (
                      <Icon name="checkmark-filled" size={14} className="text-error-red" />
                    ) : (
                      <span className="text-black/60">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2 font-mono text-black/60">
                    {prop.defaultValue || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="font-mondwest text-base text-black/60 italic">No props defined for this component</p>
      )}
    </div>
  );
}

