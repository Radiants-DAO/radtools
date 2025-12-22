'use client';

import React, { useEffect, useState } from 'react';
import { useDevToolsStore } from '../../store';
import { FontManager } from './FontManager';
import { TypographyStylesDisplay } from './TypographyStylesDisplay';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';

interface TypographyTabProps {
  searchQuery?: string;
}

export function TypographyTab({ searchQuery = '' }: TypographyTabProps) {
  const { loadTypographyFromCSS, loadFontsFromFilesystem } = useDevToolsStore();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load typography on mount
  useEffect(() => {
    loadTypographyFromCSS();
  }, [loadTypographyFromCSS]);

  // Handle reload
  const handleReload = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      // Load fonts from filesystem (more accurate)
      await loadFontsFromFilesystem();
      // Load typography styles from CSS
      await loadTypographyFromCSS();
      setMessage({ type: 'success', text: 'Typography reloaded!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to reload typography.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="flex flex-col h-full overflow-auto pt-4 pb-4 pl-4 pr-2 bg-[var(--color-white)] border border-black rounded space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2>
          Typography
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            iconName="refresh"
            onClick={handleReload}
            disabled={isLoading}
          >
            {isLoading ? 'Reloading...' : 'Reload'}
          </Button>
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <div
          className={`px-4 py-2 text-sm font-mondwest ${
            message.type === 'success'
              ? 'bg-success-green/30 text-black'
              : 'bg-error-red/30 text-black'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Content */}
      <div className="space-y-4">
        {/* Font Manager Section */}
        <FontManager />

        {/* Divider */}
        <Divider />

        {/* Typography Styles Section */}
        <TypographyStylesDisplay />
      </div>
    </div>
  );
}

export default TypographyTab;

