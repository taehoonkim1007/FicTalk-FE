import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setAccessToken: (token: string) => void;
  logout: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      isAuthenticated: false,

      setAccessToken: (token: string) => {
        set({ accessToken: token, isAuthenticated: true });
      },

      logout: () => set({ accessToken: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
