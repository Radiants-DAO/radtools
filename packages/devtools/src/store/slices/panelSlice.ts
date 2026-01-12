import { StateCreator } from 'zustand';
import type { Tab } from '../../types';

export interface PanelSlice {
  // Panel state
  isOpen: boolean;
  isMinimized: boolean; // Panel minimized (LeftRail only) vs expanded (full panel)
  activeTab: Tab;
  panelWidth: number; // Width for fixed-right panel (default 400px)
  isFullscreen: boolean;
  isSettingsOpen: boolean; // Settings panel visibility

  // Actions
  togglePanel: () => void;
  toggleMinimized: () => void;
  expandPanel: () => void;
  minimizePanel: () => void;
  setActiveTab: (tab: Tab) => void;
  setPanelWidth: (width: number) => void;
  toggleFullscreen: () => void;
  setFullscreen: (value: boolean) => void;
  openSettings: () => void;
  closeSettings: () => void;
  expandAndNavigate: (tab: Tab) => void;
}

export const createPanelSlice: StateCreator<PanelSlice, [], [], PanelSlice> = (set) => ({
  isOpen: false,
  isMinimized: false,
  activeTab: 'variables' as Tab,
  panelWidth: 400, // Default width for fixed-right panel
  isFullscreen: false,
  isSettingsOpen: false,

  togglePanel: () => set((state) => ({ isOpen: !state.isOpen })),
  toggleMinimized: () => set((state) => ({ isMinimized: !state.isMinimized })),
  expandPanel: () => set({ isMinimized: false }),
  minimizePanel: () => set({ isMinimized: true }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setPanelWidth: (width) => set({ panelWidth: Math.max(300, Math.min(width, window.innerWidth * 0.8)) }),
  toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),
  setFullscreen: (value) => set({ isFullscreen: value }),
  openSettings: () => set({ isSettingsOpen: true }),
  closeSettings: () => set({ isSettingsOpen: false }),
  expandAndNavigate: (tab: Tab) => set({ isMinimized: false, activeTab: tab, isOpen: true }),
});
