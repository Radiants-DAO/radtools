import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { VariablesSlice, createVariablesSlice } from './slices/variablesSlice';
import { TypographySlice, createTypographySlice } from './slices/typographySlice';
import { ComponentsSlice, createComponentsSlice } from './slices/componentsSlice';
import { AssetsSlice, createAssetsSlice } from './slices/assetsSlice';
import { MockStatesSlice, createMockStatesSlice } from './slices/mockStatesSlice';
import { PanelSlice, createPanelSlice } from './slices/panelSlice';
import type { Tab } from '../types';

interface PanelState {
  isOpen: boolean;
  activeTab: Tab;
  panelPosition: { x: number; y: number };
  panelSize: { width: number; height: number };
  togglePanel: () => void;
  setActiveTab: (tab: Tab) => void;
  setPanelPosition: (position: { x: number; y: number }) => void;
  setPanelSize: (size: { width: number; height: number }) => void;
}

type DevToolsState = PanelState & 
  PanelSlice &
  VariablesSlice & 
  TypographySlice &
  ComponentsSlice & 
  AssetsSlice & 
  MockStatesSlice;

export const useDevToolsStore = create<DevToolsState>()(
  devtools(
    persist(
      (set, get, api) => ({
        // Panel state
        isOpen: false,
        activeTab: 'variables' as Tab,
        panelPosition: { x: 20, y: 20 },
        panelSize: { width: 420, height: 600 },
        togglePanel: () => set((state) => ({ isOpen: !state.isOpen })),
        setActiveTab: (tab) => set({ activeTab: tab }),
        setPanelPosition: (position) => set({ panelPosition: position }),
        setPanelSize: (size) => set({ panelSize: size }),

        // Slices
        ...createPanelSlice(set, get, api),
        ...createVariablesSlice(set, get, api),
        ...createTypographySlice(set, get, api),
        ...createComponentsSlice(set, get, api),
        ...createAssetsSlice(set, get, api),
        ...createMockStatesSlice(set, get, api),
      }),
      {
        name: 'devtools-storage',
        partialize: (state) => ({
          // Only persist these fields
          panelPosition: state.panelPosition,
          panelSize: state.panelSize,
          activeTab: state.activeTab,
          mockStates: state.mockStates,
        }),
      }
    ),
    { name: 'RadTools DevTools' }
  )
);

