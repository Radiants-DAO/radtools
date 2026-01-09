'use client';

import { Icon } from '@radflow/ui';

interface PanelHeaderProps {
  title: string;
  onClose?: () => void;
  onFullscreen?: () => void;
  showCloseButton?: boolean;
  showFullscreenButton?: boolean;
  iconName?: string;
}

/**
 * Simple header component for DevTools panel.
 * Replaces the old WindowTitleBar from Rad_os.
 */
export function PanelHeader({
  title,
  onClose,
  onFullscreen,
  showCloseButton = true,
  showFullscreenButton = false,
  iconName,
}: PanelHeaderProps) {
  return (
    <div
      data-drag-handle
      className="flex items-center justify-between px-3 py-2 border-b border-black/20 cursor-move select-none"
      style={{ background: 'rgba(0,0,0,0.05)' }}
    >
      {/* Left: Icon + Title */}
      <div className="flex items-center gap-2">
        {iconName && (
          <Icon name={iconName} size="sm" className="text-black" />
        )}
        <span className="font-joystix text-xs uppercase tracking-wider text-black">
          {title}
        </span>
      </div>

      {/* Right: Buttons */}
      <div className="flex items-center gap-1">
        {showFullscreenButton && onFullscreen && (
          <button
            onClick={onFullscreen}
            className="w-6 h-6 flex items-center justify-center hover:bg-black/10 rounded transition-colors"
            title="Toggle Fullscreen"
          >
            <Icon name="full-screen" size="sm" className="text-black" />
          </button>
        )}
        {showCloseButton && onClose && (
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center hover:bg-black/10 rounded transition-colors"
            title="Close"
          >
            <Icon name="close" size="sm" className="text-black" />
          </button>
        )}
      </div>
    </div>
  );
}
