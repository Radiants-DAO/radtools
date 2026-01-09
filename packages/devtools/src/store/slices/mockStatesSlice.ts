import { StateCreator } from 'zustand';
import type { MockState } from '../../types';

export interface MockStatesSlice {
  // State
  mockStates: MockState[];
  
  // Actions
  toggleMockState: (id: string) => void;
}

// Default preset states
const defaultPresets: MockState[] = [
  {
    id: 'wallet-connected',
    name: 'Wallet Connected',
    description: 'Simulates a connected wallet',
    category: 'wallet',
    values: {
      isConnected: true,
      address: '0x1234567890abcdef1234567890abcdef12345678',
      balance: '1.5',
    },
    active: false,
  },
  {
    id: 'wallet-disconnected',
    name: 'Wallet Disconnected',
    description: 'Simulates a disconnected wallet',
    category: 'wallet',
    values: {
      isConnected: false,
      address: null,
      balance: '0',
    },
    active: false,
  },
  {
    id: 'token-hodler',
    name: 'Token Hodler',
    description: 'Simulates a user holding tokens',
    category: 'wallet',
    values: {
      isConnected: true,
      address: '0x1234567890abcdef1234567890abcdef12345678',
      balance: '10.5',
      hasTokens: true,
    },
    active: false,
  },
];

export const createMockStatesSlice: StateCreator<MockStatesSlice, [], [], MockStatesSlice> = (set) => ({
  mockStates: defaultPresets,

  toggleMockState: (id) => set((state) => {
    const targetState = state.mockStates.find((m) => m.id === id);
    if (!targetState) return state;

    // If activating, deactivate other states in the same category
    const newActive = !targetState.active;
    
    return {
      mockStates: state.mockStates.map((m) => {
        if (m.id === id) {
          return { ...m, active: newActive };
        }
        // Deactivate other states in the same category
        if (newActive && m.category === targetState.category && m.active) {
          return { ...m, active: false };
        }
        return m;
      })
    };
  }),
});

