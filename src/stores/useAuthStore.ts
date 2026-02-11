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
  _hasHydrated: boolean;

  actions: {
    setUser: (user: CurrentUser) => void;
    setAccessToken: (token: string) => void;
    setGuestId: (guestId: string) => void;
    loginWithToken: (token: string) => void;
    logout: () => void;
    clearAuth: () => void;
    setHasHydrated: (state: boolean) => void;
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
      _hasHydrated: false,

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

        loginWithToken: (token: string) => {
          // 게스트 상태 초기화하고 새 토큰으로 로그인
          set({ user: null, accessToken: token, isAuthenticated: true, guestId: undefined });
        },

        logout: () => {
          set({ user: null, accessToken: null, isAuthenticated: false });
        },

        clearAuth: () => {
          set({ user: null, accessToken: null, isAuthenticated: false, guestId: undefined });
        },

        setHasHydrated: (state: boolean) => {
          set({ _hasHydrated: state });
        },
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        guestId: state.guestId,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Auth store rehydration error:", error);
        }
        // 항상 hydrated 상태로 설정 (storage가 비어있어도)
        if (state) {
          // accessToken이 있으면 isAuthenticated도 true로 동기화
          if (state.accessToken) {
            state.isAuthenticated = true;
          }
          state.actions.setHasHydrated(true);
        } else {
          useAuthStore.getState().actions.setHasHydrated(true);
        }
      },
    },
  ),
);
