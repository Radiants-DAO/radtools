import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { PanelSlice, createPanelSlice } from './slices/panelSlice';
import { VariablesSlice, createVariablesSlice } from './slices/variablesSlice';
import { TypographySlice, createTypographySlice } from './slices/typographySlice';
import { ComponentsSlice, createComponentsSlice } from './slices/componentsSlice';
import { AssetsSlice, createAssetsSlice } from './slices/assetsSlice';
import { MockStatesSlice, createMockStatesSlice } from './slices/mockStatesSlice';

type DevToolsState = PanelSlice &
  VariablesSlice & 
  TypographySlice &
  ComponentsSlice & 
  AssetsSlice & 
  MockStatesSlice;

export const useDevToolsStore = create<DevToolsState>()(
  devtools(
    persist(
      (set, get, api) => ({
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
