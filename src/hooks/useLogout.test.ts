import { act, renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SUCCESS_MESSAGES } from "@/constants/messages";
import { createWrapper } from "@/test/utils";

import { useLogout } from "./useLogout";

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock useAuthQueries
const mockMutate = vi.fn();
vi.mock("@/queries/useAuthQueries", () => ({
  useLogout: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
  authKeys: {
    all: ["auth"],
    currentUser: () => ["auth", "currentUser"],
  },
}));

// Mock useChatQueries
vi.mock("@/queries/useChatQueries", () => ({
  chatKeys: {
    all: ["chat"],
  },
}));

// Mock useAuthStore
const mockClearAuth = vi.fn();
vi.mock("@/stores/useAuthStore", () => ({
  useAuthStore: () => ({
    actions: {
      clearAuth: mockClearAuth,
    },
  }),
}));

// Mock QueryClient
const mockRemoveQueries = vi.fn();
vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useQueryClient: () => ({
      removeQueries: mockRemoveQueries,
    }),
  };
});

describe("useLogout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("logout", () => {
    it("로그아웃 mutation을 호출한다", () => {
      const { result } = renderHook(() => useLogout(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.logout();
      });

      expect(mockMutate).toHaveBeenCalledWith(undefined, expect.any(Object));
    });

    it("성공 시 캐시를 정리하고 인증 상태를 초기화한다", async () => {
      mockMutate.mockImplementation((_: unknown, options: { onSuccess: () => void }) => {
        options.onSuccess();
      });

      const { result } = renderHook(() => useLogout(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.logout();
      });

      await waitFor(() => {
        expect(mockRemoveQueries).toHaveBeenCalledWith({ queryKey: ["chat"] });
        expect(mockRemoveQueries).toHaveBeenCalledWith({ queryKey: ["auth", "currentUser"] });
        expect(mockClearAuth).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith(SUCCESS_MESSAGES.LOGOUT);
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    });

    it("실패해도 캐시를 정리하고 인증 상태를 초기화한다", async () => {
      mockMutate.mockImplementation((_: unknown, options: { onError: () => void }) => {
        options.onError();
      });

      const { result } = renderHook(() => useLogout(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.logout();
      });

      await waitFor(() => {
        expect(mockRemoveQueries).toHaveBeenCalledWith({ queryKey: ["chat"] });
        expect(mockRemoveQueries).toHaveBeenCalledWith({ queryKey: ["auth", "currentUser"] });
        expect(mockClearAuth).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    });
  });

  describe("isLoggingOut", () => {
    it("isPending 상태를 반환한다", () => {
      const { result } = renderHook(() => useLogout(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoggingOut).toBe(false);
    });
  });
});
