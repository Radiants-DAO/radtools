'use client';

import { Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@radflow/ui';
import { useDevToolsStore } from '../store';
import { BreakpointIndicator } from './BreakpointIndicator';

interface TopBarProps {
  onClose?: () => void;
  onFullscreen?: () => void;
  showCloseButton?: boolean;
  showFullscreenButton?: boolean;
  onSettingsClick?: () => void;
}

/**
 * Top bar component for DevTools panel.
 * Displays active theme name/logo, theme switcher dropdown, and window controls.
 */
export function TopBar({
  onClose,
  onFullscreen,
  showCloseButton = true,
  showFullscreenButton = false,
  onSettingsClick,
}: TopBarProps) {
  const { activeTheme, availableThemes, switchTheme } = useDevToolsStore();

  // Get current theme data
  const currentTheme = availableThemes.find((t) => t.id === activeTheme);

  const handleThemeSelect = async (themeId: string) => {
    if (themeId !== activeTheme) {
      await switchTheme(themeId);
    }
  };

  return (
    <div
      className="flex items-center justify-between p-1 select-none w-full bg-surface-elevated border border-edge-primary rounded-sm"
    >
      {/* Left: Theme Indicator + Dropdown */}
      <div className="flex items-center gap-2">
        <DropdownMenu position="bottom-start">
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              iconName="plug"
              title="Switch theme"
              className="gap-2"
            >
              {/* Theme Name */}
              <span className="font-joystix text-xs uppercase tracking-wider text-content-primary">
                {currentTheme?.name || 'RadOS'}
              </span>
              {/* Dropdown Arrow */}
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M3 5L6 8L9 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 max-h-[300px]">
            {availableThemes.map((theme) => (
              <DropdownMenuItem
                key={theme.id}
                onClick={() => handleThemeSelect(theme.id)}
                className={`flex items-center justify-between ${
                  theme.id === activeTheme ? 'bg-surface-tertiary' : ''
                }`}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="font-joystix text-xs text-content-primary">
                    {theme.name}
                  </span>
                  {theme.description && (
                    <span className="text-[10px] text-content-secondary">
                      {theme.description}
                    </span>
                  )}
                </div>
                {theme.id === activeTheme && (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="text-content-primary flex-shrink-0"
                  >
                    <path
                      d="M13 4L6 11L3 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onSettingsClick?.()}
              iconName="settings"
            >
              <span className="text-xs">Manage Themes</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Center: Breakpoint Indicator */}
      <BreakpointIndicator />

      {/* Right: Buttons */}
      <div className="flex items-center gap-1">
        {showFullscreenButton && onFullscreen && (
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            iconName="full-screen"
            onClick={onFullscreen}
            title="Toggle Fullscreen"
          />
        )}
        {showCloseButton && onClose && (
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            iconName="close"
            onClick={onClose}
            title="Close (⌘⇧K)"
          />
        )}
      </div>
    </div>
  );
}
