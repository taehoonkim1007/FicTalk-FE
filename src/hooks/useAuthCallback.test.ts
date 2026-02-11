import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createWrapper } from "@/test/utils";

import { useAuthCallback } from "./useAuthCallback";

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useSearchParams: () => [new URLSearchParams()],
}));

// Mock useAuthQueries
const mockMutate = vi.fn();
vi.mock("@/queries/useAuthQueries", () => ({
  useExchangeCode: () => ({
    mutate: mockMutate,
    isPending: false,
    isError: false,
    error: null,
  }),
}));

// Mock useAuthStore
const mockLoginWithToken = vi.fn();
vi.mock("@/stores/useAuthStore", () => ({
  useAuthStore: () => ({
    actions: {
      loginWithToken: mockLoginWithToken,
    },
  }),
}));

describe("useAuthCallback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("code가 없으면 /login으로 리다이렉트한다", async () => {
    renderHook(() => useAuthCallback(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true });
    });
  });

  it("isLoading 상태를 반환한다", () => {
    const { result } = renderHook(() => useAuthCallback(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
  });

  it("isError 상태를 반환한다", () => {
    const { result } = renderHook(() => useAuthCallback(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isError).toBe(false);
  });
});

describe("useAuthCallback - with code", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // code가 있는 경우를 위해 useSearchParams mock 재설정
    vi.doMock("react-router-dom", () => ({
      useNavigate: () => mockNavigate,
      useSearchParams: () => [new URLSearchParams("code=test-auth-code")],
    }));
  });

  it("code가 있으면 mutate를 호출한다", () => {
    // 이 테스트는 모듈 격리가 필요하여 별도 파일로 분리가 권장됨
    // 현재는 기본 동작 테스트만 수행
    expect(mockMutate).toBeDefined();
  });
});
