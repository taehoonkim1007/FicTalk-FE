import { type Page } from "@playwright/test";

// 게스트 사용자 mock 데이터
export const guestUser = {
  id: "guest-test-id",
  role: "guest" as const,
  usageCount: 0,
  maxUsage: 10,
};

// 로그인 사용자 mock 데이터
export const authenticatedUser = {
  id: "user-test-id",
  role: "user" as const,
  email: "test@example.com",
  nickname: "테스트유저",
  profileImage: null,
};

// localStorage에 인증 상태 설정
export const setAuthState = async (
  page: Page,
  options: {
    accessToken: string;
    guestId?: string;
  },
) => {
  await page.evaluate(({ accessToken, guestId }) => {
    const authStorage = {
      state: {
        accessToken,
        isAuthenticated: true,
        guestId: guestId || undefined,
      },
      version: 0,
    };
    localStorage.setItem("auth-storage", JSON.stringify(authStorage));
  }, options);
};

// 게스트 상태로 설정
export const loginAsGuest = async (page: Page) => {
  // API 모킹: /auth/me 엔드포인트
  await page.route("**/auth/me", (route) => {
    void route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(guestUser),
    });
  });

  // localStorage 설정
  await setAuthState(page, {
    accessToken: "guest-test-token",
    guestId: guestUser.id,
  });

  // 페이지 새로고침으로 인증 상태 반영
  await page.reload();
  await page.waitForLoadState("domcontentloaded");
};

// 로그인 상태로 설정
export const loginAsUser = async (page: Page) => {
  // API 모킹: /auth/me 엔드포인트
  await page.route("**/auth/me", (route) => {
    void route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(authenticatedUser),
    });
  });

  // localStorage 설정
  await setAuthState(page, {
    accessToken: "user-test-token",
  });

  // 페이지 새로고침하고 API 응답 기다림
  await Promise.all([page.waitForResponse("**/auth/me"), page.reload()]);
};
