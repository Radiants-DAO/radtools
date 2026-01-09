import { StateCreator } from 'zustand';
import type { Tab } from '../../types';

export interface PanelSlice {
  // Panel state
  isOpen: boolean;
  activeTab: Tab;
  panelPosition: { x: number; y: number };
  panelSize: { width: number; height: number };
  isFullscreen: boolean;
  
  // Actions
  togglePanel: () => void;
  setActiveTab: (tab: Tab) => void;
  setPanelPosition: (position: { x: number; y: number }) => void;
  setPanelSize: (size: { width: number; height: number }) => void;
  toggleFullscreen: () => void;
  setFullscreen: (value: boolean) => void;
}

export const createPanelSlice: StateCreator<PanelSlice, [], [], PanelSlice> = (set) => ({
  isOpen: false,
  activeTab: 'variables' as Tab,
  panelPosition: { x: 20, y: 20 },
  panelSize: { width: 420, height: 600 },
  isFullscreen: false,
  
  togglePanel: () => set((state) => ({ isOpen: !state.isOpen })),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setPanelPosition: (position) => set({ panelPosition: position }),
  setPanelSize: (size) => set({ panelSize: size }),
  toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),
  setFullscreen: (value) => set({ isFullscreen: value }),
});
