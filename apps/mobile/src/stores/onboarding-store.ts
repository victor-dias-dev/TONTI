import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

const STORAGE_KEY = 'tonti.onboarding.completed';

interface OnboardingState {
  completed: boolean;
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  complete: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  completed: false,
  isHydrated: false,

  hydrate: async () => {
    const value = await SecureStore.getItemAsync(STORAGE_KEY);
    set({ completed: value === 'true', isHydrated: true });
  },

  complete: async () => {
    await SecureStore.setItemAsync(STORAGE_KEY, 'true');
    set({ completed: true });
  },
}));
