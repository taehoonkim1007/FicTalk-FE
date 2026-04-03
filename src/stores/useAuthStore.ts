import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CurrentUser } from "@/types/auth";

// ==========================================
// State & Actions Interface
// ==========================================
interface AuthState {
  user: CurrentUser | null;
  accessToken: string | null;
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

// onRehydrateStorage에서 useAuthStore TDZ 회피를 위해 set 참조를 캡처
let storeSet: ((partial: Partial<AuthState>) => void) | undefined;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => {
      storeSet = set;

      return {
        user: null,
        accessToken: null,
        guestId: undefined,
        _hasHydrated: false,

        actions: {
          setUser: (user: CurrentUser) => {
            set({ user });
          },

          setAccessToken: (token: string) => {
            set({ accessToken: token });
          },

          setGuestId: (guestId: string) => {
            set({ guestId });
          },

          loginWithToken: (token: string) => {
            // 게스트 상태 초기화하고 새 토큰으로 로그인
            set({ user: null, accessToken: token, guestId: undefined });
          },

          logout: () => {
            set({ user: null, accessToken: null });
          },

          clearAuth: () => {
            set({ user: null, accessToken: null, guestId: undefined });
          },

          setHasHydrated: (state: boolean) => {
            set({ _hasHydrated: state });
          },
        },
      };
    },
    {
      name: "auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        guestId: state.guestId,
      }),
      onRehydrateStorage: () => (_state, error) => {
        if (error) {
          console.error("Auth store rehydration error:", error);
        }
        storeSet?.({ _hasHydrated: true });
      },
    },
  ),
);
