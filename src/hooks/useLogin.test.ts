import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createWrapper } from "@/test/utils";

import { useLogin } from "./useLogin";

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock useAuthQueries
const mockMutate = vi.fn();
vi.mock("@/queries/useAuthQueries", () => ({
  useGuestToken: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

// Mock useAuthStore
const mockSetAccessToken = vi.fn();
const mockSetGuestId = vi.fn();
vi.mock("@/stores/useAuthStore", () => ({
  useAuthStore: () => ({
    guestId: "existing-guest-id",
    actions: {
      setAccessToken: mockSetAccessToken,
      setGuestId: mockSetGuestId,
    },
  }),
}));

describe("useLogin", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.location
    Object.defineProperty(window, "location", {
      value: { href: "" },
      writable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "location", {
      writable: true,
      value: originalLocation,
    });
    vi.clearAllMocks();
  });

  describe("loginWithGoogle", () => {
    it("Google OAuth URL로 리다이렉트한다", () => {
      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.loginWithGoogle();
      });

      expect(window.location.href).toContain("/auth/google");
    });
  });

  describe("loginAsGuest", () => {
    it("게스트 토큰 mutation을 호출한다", () => {
      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.loginAsGuest();
      });

      expect(mockMutate).toHaveBeenCalledWith("existing-guest-id", expect.any(Object));
    });

    it("성공 시 토큰을 설정하고 홈으로 이동한다", async () => {
      // onSuccess 콜백 테스트
      mockMutate.mockImplementation(
        (
          _: string | undefined,
          options: { onSuccess: (data: { accessToken: string; guestId: string }) => void },
        ) => {
          options.onSuccess({ accessToken: "new-token", guestId: "new-guest-id" });
        },
      );

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.loginAsGuest();
      });

      await waitFor(() => {
        expect(mockSetAccessToken).toHaveBeenCalledWith("new-token");
        expect(mockSetGuestId).toHaveBeenCalledWith("new-guest-id");
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    });
  });

  describe("goBack", () => {
    it("홈으로 이동한다", () => {
      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      act(() => {
        void result.current.goBack();
      });

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  describe("isGuestLoading", () => {
    it("isPending 상태를 반환한다", () => {
      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isGuestLoading).toBe(false);
    });
  });
});
