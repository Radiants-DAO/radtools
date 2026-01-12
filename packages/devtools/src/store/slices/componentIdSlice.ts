import { StateCreator } from 'zustand';
import type { ComponentInfo } from '../../types';

export interface ComponentIdSlice {
  isComponentIdActive: boolean;
  hoveredComponent: ComponentInfo | null;
  tooltipPosition: { x: number; y: number } | null;
  selectedComponentName: string | null; // Component to navigate to in Components tab

  toggleComponentIdMode: () => void;
  setHoveredComponent: (info: ComponentInfo | null, position?: { x: number; y: number }) => void;
  navigateToComponent: (name: string) => void;
  clearSelectedComponent: () => void;
}

export const createComponentIdSlice: StateCreator<ComponentIdSlice, [], [], ComponentIdSlice> = (set) => ({
  isComponentIdActive: false,
  hoveredComponent: null,
  tooltipPosition: null,
  selectedComponentName: null,

  toggleComponentIdMode: () => set((state) => ({ isComponentIdActive: !state.isComponentIdActive })),
  setHoveredComponent: (info, position) => set({
    hoveredComponent: info,
    tooltipPosition: position || null
  }),
  navigateToComponent: (name: string) => set({ selectedComponentName: name }),
  clearSelectedComponent: () => set({ selectedComponentName: null }),
});
