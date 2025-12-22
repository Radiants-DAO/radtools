'use client';

import { useEffect, useState, useRef } from 'react';
import { useDevToolsStore } from '../../store';
import { BaseColorEditor } from './BaseColorEditor';
import { ColorModeSelector } from './ColorModeSelector';
import { BorderRadiusEditor } from './BorderRadiusEditor';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';

export function VariablesTab() {
  const { loadFromCSS, syncToCSS, baseColors } = useDevToolsStore();
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const messageTimerRef = useRef<NodeJS.Timeout>(undefined);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    };
  }, []);

  // Load CSS on mount to sync with actual file
  useEffect(() => {
    loadFromCSS();
  }, [loadFromCSS]);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      await syncToCSS();
      setMessage({ type: 'success', text: 'Saved to globals.css!' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to save. Check console.' });
    } finally {
      setIsSaving(false);
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
      messageTimerRef.current = setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleReload = async () => {
    await loadFromCSS();
    setMessage({ type: 'success', text: 'Reloaded from CSS!' });
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    messageTimerRef.current = setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="flex flex-col h-full overflow-auto pt-4 pb-4 pl-4 pr-2 bg-[var(--color-white)] border border-black rounded space-y-4">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h2>Design Tokens</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            iconName="refresh"
            onClick={handleReload}
          >
            Reload
          </Button>
          <Button
            variant="secondary"
            size="md"
            iconName="save"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save to CSS'}
          </Button>
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <div
          className={`px-3 py-2 font-mondwest text-base rounded-sm ${
            message.type === 'success'
              ? 'bg-green text-black'
              : 'bg-error-red text-warm-cloud'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Editors */}
      <div className="space-y-4" data-edit-scope="theme-variables">
        <ColorModeSelector />
        <Divider />
        <BaseColorEditor />
        <Divider />
        <BorderRadiusEditor />
      </div>
    </div>
  );
}
