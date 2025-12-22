import { StateCreator } from 'zustand';
import type { BaseColor, ColorMode } from '../../types';

export interface VariablesSlice {
  // State
  baseColors: BaseColor[];
  colorModes: ColorMode[];
  activeColorMode: string | null;
  borderRadius: Record<string, string>;
  
  // Actions - Base Colors
  addBaseColor: (color: Omit<BaseColor, 'id'>) => void;
  updateBaseColor: (id: string, updates: Partial<BaseColor>) => void;
  deleteBaseColor: (id: string) => void;
  
  // Actions - Color Modes
  addColorMode: (mode: Omit<ColorMode, 'id'>) => void;
  updateColorMode: (id: string, updates: Partial<ColorMode>) => void;
  deleteColorMode: (id: string) => void;
  setActiveColorMode: (id: string | null) => void;
  
  // Actions - Border Radius
  updateBorderRadius: (key: string, value: string) => void;
  addBorderRadius: (key: string, value: string) => void;
  deleteBorderRadius: (key: string) => void;
  
  // Helper - Get base color by ID
  getBaseColorById: (id: string) => BaseColor | undefined;
  
  // Sync
  syncToCSS: () => Promise<void>;
  loadFromCSS: () => Promise<void>;
}

// Default base colors matching radOS
const defaultBaseColors: BaseColor[] = [
  // Brand colors
  { id: 'cream', name: 'cream', displayName: 'Cream', value: '#FEF8E2', category: 'brand' },
  { id: 'black', name: 'black', displayName: 'Black', value: '#0F0E0C', category: 'brand' },
  { id: 'sun-yellow', name: 'sun-yellow', displayName: 'Sun Yellow', value: '#FCE184', category: 'brand' },
  { id: 'sky-blue', name: 'sky-blue', displayName: 'Sky Blue', value: '#95BAD2', category: 'brand' },
  { id: 'warm-cloud', name: 'warm-cloud', displayName: 'Warm Cloud', value: '#FEF8E2', category: 'brand' },
  { id: 'sunset-fuzz', name: 'sunset-fuzz', displayName: 'Sunset Fuzz', value: '#FCC383', category: 'brand' },
  { id: 'sun-red', name: 'sun-red', displayName: 'Sun Red', value: '#FF6B63', category: 'brand' },
  { id: 'green', name: 'green', displayName: 'Green', value: '#CEF5CA', category: 'brand' },
  { id: 'white', name: 'white', displayName: 'White', value: '#FFFFFF', category: 'brand' },
  // Neutral colors
  { id: 'lightest', name: 'lightest', displayName: 'Lightest', value: '#FEF8E2', category: 'neutral' },
  { id: 'lighter', name: 'lighter', displayName: 'Lighter', value: '#CCCCCC', category: 'neutral' },
  { id: 'light', name: 'light', displayName: 'Light', value: '#AAAAAA', category: 'neutral' },
  { id: 'dark', name: 'dark', displayName: 'Dark', value: '#444444', category: 'neutral' },
  { id: 'darker', name: 'darker', displayName: 'Darker', value: '#222222', category: 'neutral' },
  { id: 'darkest', name: 'darkest', displayName: 'Darkest', value: '#000000', category: 'neutral' },
];

export const createVariablesSlice: StateCreator<VariablesSlice, [], [], VariablesSlice> = (set, get) => ({
  baseColors: defaultBaseColors,
  colorModes: [],
  activeColorMode: null,
  borderRadius: {
    none: '0',
    xs: '0.125rem',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    full: '9999px',
  },

  // Base Color Actions
  addBaseColor: (color) => set((state) => ({
    baseColors: [...state.baseColors, { ...color, id: crypto.randomUUID() }]
  })),
  
  updateBaseColor: (id, updates) => set((state) => ({
    baseColors: state.baseColors.map((c) => 
      c.id === id ? { ...c, ...updates } : c
    )
  })),
  
  deleteBaseColor: (id) => set((state) => ({
    baseColors: state.baseColors.filter((c) => c.id !== id)
  })),

  // Color Mode Actions
  addColorMode: (mode) => set((state) => ({
    colorModes: [...state.colorModes, { ...mode, id: crypto.randomUUID() }]
  })),
  
  updateColorMode: (id, updates) => set((state) => ({
    colorModes: state.colorModes.map((m) => 
      m.id === id ? { ...m, ...updates } : m
    )
  })),
  
  deleteColorMode: (id) => set((state) => ({
    colorModes: state.colorModes.filter((m) => m.id !== id)
  })),
  
  setActiveColorMode: (id) => set({ activeColorMode: id }),

  // Border Radius Actions
  updateBorderRadius: (key, value) => set((state) => ({
    borderRadius: { ...state.borderRadius, [key]: value }
  })),
  
  addBorderRadius: (key, value) => set((state) => ({
    borderRadius: { ...state.borderRadius, [key]: value }
  })),
  
  deleteBorderRadius: (key) => set((state) => {
    const { [key]: _, ...rest } = state.borderRadius;
    return { borderRadius: rest };
  }),

  // Helper
  getBaseColorById: (id) => {
    return get().baseColors.find(c => c.id === id);
  },

  // Sync to CSS - sends new data model format
  syncToCSS: async () => {
    const state = get();
    try {
      const response = await fetch('/api/devtools/write-css', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseColors: state.baseColors,
          borderRadius: state.borderRadius,
          colorModes: state.colorModes,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to sync CSS');
      }
    } catch (error) {
      throw error;
    }
  },

  // Load from CSS - parses existing CSS into new data model
  loadFromCSS: async () => {
    try {
      const res = await fetch('/api/devtools/read-css');
      if (!res.ok) {
        throw new Error('Failed to fetch CSS');
      }
      const css = await res.text();
      
      // Import parser dynamically to avoid SSR issues
      const { parseGlobalsCSS, parsedCSSToStoreState } = await import('../../lib/cssParser');
      
      const parsed = parseGlobalsCSS(css);
      const state = parsedCSSToStoreState(parsed);
      
      set({
        baseColors: state.baseColors,
        colorModes: state.colorModes,
        borderRadius: state.borderRadius,
      });
    } catch (error) {
      // Failed to load CSS
    }
  },
});
