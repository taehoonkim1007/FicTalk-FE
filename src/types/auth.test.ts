import { describe, expect, it } from "vitest";

import type { AuthenticatedUser, GuestUser } from "./auth";
import { isAuthenticatedUser, isGuestUser } from "./auth";

describe("isGuestUser", () => {
  it("게스트 사용자를 true로 판별한다", () => {
    const guest: GuestUser = {
      id: "guest-123",
      role: "guest",
      usageCount: 5,
      maxUsage: 10,
    };
    expect(isGuestUser(guest)).toBe(true);
  });

  it("인증된 사용자를 false로 판별한다", () => {
    const user: AuthenticatedUser = {
      id: "user-123",
      email: "test@example.com",
      name: "테스트",
      profileImage: null,
      role: "user",
    };
    expect(isGuestUser(user)).toBe(false);
  });
});

describe("isAuthenticatedUser", () => {
  it("인증된 사용자를 true로 판별한다", () => {
    const user: AuthenticatedUser = {
      id: "user-123",
      email: "test@example.com",
      name: "테스트",
      profileImage: "https://example.com/profile.png",
      role: "user",
    };
    expect(isAuthenticatedUser(user)).toBe(true);
  });

  it("게스트 사용자를 false로 판별한다", () => {
    const guest: GuestUser = {
      id: "guest-123",
      role: "guest",
      usageCount: 0,
      maxUsage: 10,
    };
    expect(isAuthenticatedUser(guest)).toBe(false);
  });
});
