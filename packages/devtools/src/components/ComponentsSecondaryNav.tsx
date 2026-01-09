'use client';

import { AddTabButton } from '../tabs/ComponentsTab/AddTabButton';

interface ComponentsSecondaryNavProps {
  activeSubTab: string;
  onSubTabChange: (tab: string) => void;
  tabs: Array<{ id: string; label: string }>;
  onAddFolder: (folderName: string) => void;
}

export function ComponentsSecondaryNav({
  activeSubTab,
  onSubTabChange,
  tabs,
  onAddFolder,
}: ComponentsSecondaryNavProps) {
  return (
    <div className="flex items-center gap-1 px-2 py-2 bg-warm-cloud border-t border-black overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onSubTabChange(tab.id)}
          className={`flex items-center justify-center px-4 py-2 font-joystix text-xs uppercase cursor-pointer select-none text-black transition-all duration-200 ease-out relative border border-black rounded-sm ${
            activeSubTab === tab.id ? 'bg-sun-yellow' : 'bg-transparent hover:bg-black/5'
          }`}
        >
          {tab.label}
        </button>
      ))}
      <AddTabButton
        onAdd={(folderName) => {
          onAddFolder(folderName);
          // Also trigger via ComponentsTab's handler if available
          if ((window as any).__componentsTabAddFolder) {
            (window as any).__componentsTabAddFolder(folderName);
          }
        }}
      />
    </div>
  );
}

