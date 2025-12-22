'use client';

import { useDevToolsStore } from '../../store';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

// Available semantic tokens that can be overridden in color modes
const OVERRIDABLE_TOKENS = [
  { id: 'primary', label: 'Primary' },
  { id: 'secondary', label: 'Secondary' },
  { id: 'tertiary', label: 'Tertiary' },
  { id: 'alternate', label: 'Alternate' },
  { id: 'heading', label: 'Heading' },
  { id: 'body', label: 'Body' },
  { id: 'caption', label: 'Caption' },
  { id: 'border', label: 'Border' },
  { id: 'muted', label: 'Muted' },
];

export function ColorModeSelector() {
  const { colorModes, activeColorMode, setActiveColorMode, addColorMode, deleteColorMode, baseColors } = useDevToolsStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newModeName, setNewModeName] = useState('');
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const { addToast } = useToast();

  // Apply color mode to document
  useEffect(() => {
    const html = document.documentElement;
    
    // Remove all color mode classes
    colorModes.forEach((mode) => {
      html.classList.remove(mode.name);
    });
    
    // Add active color mode class
    if (activeColorMode) {
      const activeMode = colorModes.find((m) => m.id === activeColorMode);
      if (activeMode) {
        html.classList.add(activeMode.name);
      }
    }
  }, [activeColorMode, colorModes]);

  const handleAddOverride = (token: string, colorId: string) => {
    if (colorId) {
      setOverrides({ ...overrides, [token]: colorId });
    } else {
      const { [token]: _, ...rest } = overrides;
      setOverrides(rest);
    }
  };

  const handleCreateColorMode = () => {
    if (!newModeName.trim()) {
      addToast({
        title: 'Missing name',
        description: 'Please enter a mode name',
        variant: 'warning',
      });
      return;
    }
    if (Object.keys(overrides).length === 0) {
      addToast({
        title: 'No overrides',
        description: 'Please add at least one override',
        variant: 'warning',
      });
      return;
    }

    // Convert color IDs to CSS variable references
    const cssOverrides: Record<string, string> = {};
    for (const [token, colorId] of Object.entries(overrides)) {
      const color = baseColors.find(c => c.id === colorId);
      if (color) {
        // Store as reference format: "neutral-darkest" or "sun-yellow"
        const varName = color.category === 'neutral' ? `neutral-${color.name}` : color.name;
        cssOverrides[token] = varName;
      }
    }

    addColorMode({
      name: newModeName.toLowerCase().replace(/\s+/g, '-'),
      className: `.${newModeName.toLowerCase().replace(/\s+/g, '-')}`,
      overrides: cssOverrides,
    });

    // Reset form
    setNewModeName('');
    setOverrides({});
    setShowAddForm(false);
  };

  const handleDeleteColorMode = (id: string) => {
    if (activeColorMode === id) {
      setActiveColorMode(null);
    }
    deleteColorMode(id);
  };

  // Get all base colors for the dropdown
  const allColors = [...baseColors.filter(c => c.category === 'brand'), ...baseColors.filter(c => c.category === 'neutral')];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3>Color Mode</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeColorMode === null ? 'primary' : 'ghost'}
          size="md"
          onClick={() => setActiveColorMode(null)}
          className={activeColorMode === null ? 'border-2' : ''}
        >
          Default
        </Button>
        <Button
          variant="outline"
          size="md"
          iconName={showAddForm ? "close" : undefined}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : '+ Add Mode'}
        </Button>
        
        {colorModes.map((mode) => (
          <div key={mode.id} className="flex items-center gap-1">
            <Button
              variant={activeColorMode === mode.id ? 'primary' : 'ghost'}
              size="md"
              onClick={() => setActiveColorMode(mode.id)}
              className={activeColorMode === mode.id ? 'border-2' : ''}
            >
              {mode.name}
            </Button>
            <Button
              variant="ghost"
              size="md"
              iconOnly={true}
              iconName="close"
              onClick={() => handleDeleteColorMode(mode.id)}
              className="text-error-red hover:bg-error-red/10 active:bg-error-red/20"
              title="Delete color mode"
            />
          </div>
        ))}
      </div>

      {/* Add Color Mode Form */}
      {showAddForm && (
        <div className="p-3 bg-black/10 rounded-md space-y-3">
          <h4>Create Color Mode</h4>
          
          <div>
            <label className="block font-mondwest text-sm text-black/60 mb-1">Mode Name</label>
            <input
              type="text"
              value={newModeName}
              onChange={(e) => setNewModeName(e.target.value)}
              placeholder="e.g., dark"
              className="w-full px-2 py-1.5 font-mondwest text-base bg-warm-cloud border border-black rounded-sm text-black"
            />
          </div>

          <div>
            <label className="block font-mondwest text-sm text-black/60 mb-2">Token Overrides</label>
            <div className="space-y-2">
              {OVERRIDABLE_TOKENS.map((token) => (
                <div key={token.id} className="flex items-center gap-2">
                  <span className="w-24 font-mondwest text-sm text-black">{token.label}</span>
                  <select
                    value={overrides[token.id] || ''}
                    onChange={(e) => handleAddOverride(token.id, e.target.value)}
                    className="flex-1 px-2 py-1 font-mondwest text-sm bg-warm-cloud border border-black rounded-sm text-black"
                  >
                    <option value="">— No override —</option>
                    <optgroup label="Brand Colors">
                      {allColors.filter(c => c.category === 'brand').map((color) => (
                        <option key={color.id} value={color.id}>
                          {color.displayName}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Neutral Colors">
                      {allColors.filter(c => c.category === 'neutral').map((color) => (
                        <option key={color.id} value={color.id}>
                          {color.displayName}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  {overrides[token.id] && (
                    <div
                      className="w-6 h-6 rounded-sm border border-black"
                      style={{ backgroundColor: baseColors.find(c => c.id === overrides[token.id])?.value }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="secondary"
            size="md"
            onClick={handleCreateColorMode}
          >
            Create Mode
          </Button>
        </div>
      )}

      {/* Active Overrides Display */}
      {activeColorMode && (
        <div className="p-3 bg-black/10 rounded-md">
          <h4 className="mb-2">Active Overrides</h4>
          <div className="space-y-1">
            {Object.entries(colorModes.find((m) => m.id === activeColorMode)?.overrides || {}).map(([token, ref]) => (
              <div key={token} className="flex items-center gap-2 font-mondwest text-base">
                <span className="text-black font-mono">{token}</span>
                <span className="text-black/60">→</span>
                <span className="text-black/60 font-mono">{ref}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

