import { StateCreator } from 'zustand';

export interface PanelSlice {
  // Fullscreen state (NOT persisted)
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  setFullscreen: (value: boolean) => void;
}

export const createPanelSlice: StateCreator<PanelSlice, [], [], PanelSlice> = (set) => ({
  isFullscreen: false,
  
  toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),
  
  setFullscreen: (value) => set({ isFullscreen: value }),
});

