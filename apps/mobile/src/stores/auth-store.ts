import type { PublicUser } from '@tonti/types';
import { create } from 'zustand';
import { authApi } from '../api/auth';
import { sessionToken } from '../api/session-token';
import { tokenStorage } from '../services/token-storage';

interface AuthState {
  user: PublicUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setSession: (token: string, user: PublicUser) => Promise<void>;
  clearSession: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isHydrated: false,

  setSession: async (token, user) => {
    sessionToken.set(token);
    await tokenStorage.set(token);
    set({ token, user, isAuthenticated: true, isHydrated: true });
  },

  clearSession: async () => {
    sessionToken.set(null);
    await tokenStorage.delete();
    set({ token: null, user: null, isAuthenticated: false, isHydrated: true });
  },

  restoreSession: async () => {
    try {
      const token = await tokenStorage.get();
      if (!token) {
        sessionToken.set(null);
        set({ token: null, user: null, isAuthenticated: false, isHydrated: true });
        return;
      }

      sessionToken.set(token);
      const user = await authApi.me();
      set({ token, user, isAuthenticated: true, isHydrated: true });
    } catch {
      sessionToken.set(null);
      await tokenStorage.delete();
      set({ token: null, user: null, isAuthenticated: false, isHydrated: true });
    }
  },
}));
