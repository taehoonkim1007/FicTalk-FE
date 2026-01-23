import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { User } from "@/types";

// ==========================================
// State & Actions Interface
// ==========================================
interface AuthState {
  // 회원용
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  // 게스트용
  guestUsageCount: number;
  maxGuestLimit: number;

  // 액션 그룹
  actions: {
    // 회원용
    login: (user: User, token: string) => void;
    logout: () => void;
    setAccessToken: (token: string) => void;
    clearAuth: () => void;

    // 게스트용
    increaseGuestUsage: () => void;
    resetGuestUsage: () => void;
  };
}

// ==========================================
// Store Implementation
// ==========================================
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // 회원용 초기값
      user: null,
      accessToken: null,
      isAuthenticated: false,

      // 게스트용 초기값
      guestUsageCount: 0,
      maxGuestLimit: 5,

      // 액션 그룹
      actions: {
        // 회원용 액션
        login: (user: User, token: string) => {
          set({ user, accessToken: token, isAuthenticated: true });
        },

        setAccessToken: (token: string) => {
          set({ accessToken: token, isAuthenticated: true });
        },

        logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),

        clearAuth: () => set({ user: null, accessToken: null, isAuthenticated: false }),

        // 게스트용 액션
        increaseGuestUsage: () => set((state) => ({ guestUsageCount: state.guestUsageCount + 1 })),

        resetGuestUsage: () => set({ guestUsageCount: 0 }),
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        guestUsageCount: state.guestUsageCount,
      }),
    },
  ),
);
