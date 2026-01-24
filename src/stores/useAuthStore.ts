import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CurrentUser } from "@/types/auth";

// ==========================================
// State & Actions Interface
// ==========================================
interface AuthState {
  user: CurrentUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  guestId: string | undefined;

  actions: {
    setUser: (user: CurrentUser) => void;
    setAccessToken: (token: string) => void;
    setGuestId: (guestId: string) => void;
    logout: () => void;
    clearAuth: () => void;
  };
}

// ==========================================
// Store Implementation
// ==========================================
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      guestId: undefined,

      actions: {
        setUser: (user: CurrentUser) => {
          set({ user, isAuthenticated: true });
        },

        setAccessToken: (token: string) => {
          set({ accessToken: token, isAuthenticated: true });
        },

        setGuestId: (guestId: string) => {
          set({ guestId });
        },

        logout: () => {
          set({ user: null, accessToken: null, isAuthenticated: false });
        },

        clearAuth: () => {
          set({ user: null, accessToken: null, isAuthenticated: false, guestId: undefined });
        },
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        guestId: state.guestId,
      }),
    },
  ),
);
