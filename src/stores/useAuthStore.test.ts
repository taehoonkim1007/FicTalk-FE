import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { AuthenticatedUser, GuestUser } from "@/types/auth";

import { useAuthStore } from "./useAuthStore";

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      accessToken: null,
      guestId: undefined,
      _hasHydrated: false,
    });
  });

  afterEach(() => {
    useAuthStore.setState({
      user: null,
      accessToken: null,
      guestId: undefined,
      _hasHydrated: false,
    });
  });

  describe("setUser", () => {
    it("사용자를 설정한다", () => {
      const user: AuthenticatedUser = {
        id: "user-123",
        email: "test@example.com",
        name: "테스트",
        profileImage: null,
        role: "user",
      };

      useAuthStore.getState().actions.setUser(user);

      const state = useAuthStore.getState();
      expect(state.user).toEqual(user);
    });

    it("게스트 사용자도 설정할 수 있다", () => {
      const guest: GuestUser = {
        id: "guest-123",
        role: "guest",
        usageCount: 5,
        maxUsage: 10,
      };

      useAuthStore.getState().actions.setUser(guest);

      const state = useAuthStore.getState();
      expect(state.user).toEqual(guest);
    });
  });

  describe("setAccessToken", () => {
    it("토큰을 설정한다", () => {
      useAuthStore.getState().actions.setAccessToken("test-token");

      const state = useAuthStore.getState();
      expect(state.accessToken).toBe("test-token");
    });
  });

  describe("setGuestId", () => {
    it("guestId를 설정한다", () => {
      useAuthStore.getState().actions.setGuestId("guest-456");

      expect(useAuthStore.getState().guestId).toBe("guest-456");
    });
  });

  describe("loginWithToken", () => {
    it("토큰을 설정하고 기존 상태를 초기화한다", () => {
      useAuthStore.setState({
        user: { id: "old", role: "guest", usageCount: 0, maxUsage: 10 },
        guestId: "old-guest",
      });

      useAuthStore.getState().actions.loginWithToken("new-token");

      const state = useAuthStore.getState();
      expect(state.accessToken).toBe("new-token");
      expect(state.user).toBeNull();
      expect(state.guestId).toBeUndefined();
    });
  });

  describe("logout", () => {
    it("user와 accessToken을 초기화한다", () => {
      useAuthStore.setState({
        user: {
          id: "user-123",
          email: "test@test.com",
          name: "테스트",
          profileImage: null,
          role: "user",
        },
        accessToken: "test-token",
        guestId: "guest-123",
      });

      useAuthStore.getState().actions.logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.guestId).toBe("guest-123");
    });
  });

  describe("clearAuth", () => {
    it("모든 인증 상태를 초기화한다 (guestId 포함)", () => {
      useAuthStore.setState({
        user: {
          id: "user-123",
          email: "test@test.com",
          name: "테스트",
          profileImage: null,
          role: "user",
        },
        accessToken: "test-token",
        guestId: "guest-123",
      });

      useAuthStore.getState().actions.clearAuth();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.guestId).toBeUndefined();
    });
  });

  describe("setHasHydrated", () => {
    it("_hasHydrated 상태를 변경한다", () => {
      useAuthStore.getState().actions.setHasHydrated(true);
      expect(useAuthStore.getState()._hasHydrated).toBe(true);

      useAuthStore.getState().actions.setHasHydrated(false);
      expect(useAuthStore.getState()._hasHydrated).toBe(false);
    });
  });
});
