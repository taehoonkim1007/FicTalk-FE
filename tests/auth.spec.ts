import { expect, test } from "@playwright/test";

import { loginAsGuest, loginAsUser } from "./fixtures/auth";

test.describe("인증 흐름 - 비로그인", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
  });

  test("보호된 라우트(/my-stories) 접근 시 로그인 페이지로 리다이렉트", async ({ page }) => {
    await page.goto("/my-stories");

    // 로딩이 완료되고 로그인 페이지의 버튼이 보일 때까지 기다림
    await expect(page.getByText("게스트로 계속하기")).toBeVisible({ timeout: 15000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test("채팅 페이지 접근 시 로그인 페이지로 리다이렉트", async ({ page }) => {
    await page.goto("/chat");

    // 로딩이 완료되고 로그인 페이지의 버튼이 보일 때까지 기다림
    await expect(page.getByText("게스트로 계속하기")).toBeVisible({ timeout: 15000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test("로그인 페이지에서 게스트/Google 로그인 버튼이 표시됨", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByText("게스트로 계속하기")).toBeVisible();
    await expect(page.getByText(/Google/)).toBeVisible();
  });
});

test.describe("인증 흐름 - 게스트", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await loginAsGuest(page);
  });

  test("채팅 페이지 접근 가능 (guestAllowed=true)", async ({ page }) => {
    await page.goto("/chat");

    await page.waitForLoadState("domcontentloaded");

    // 로그인 페이지로 리다이렉트되지 않음
    await expect(page).not.toHaveURL(/\/login/);
  });

  test("내 스토리 페이지 접근 시 로그인 페이지로 리다이렉트 (guestAllowed=false)", async ({
    page,
  }) => {
    await page.goto("/my-stories");

    // 로딩이 완료되고 로그인 페이지의 버튼이 보일 때까지 기다림
    await expect(page.getByText("게스트로 계속하기")).toBeVisible({ timeout: 15000 });
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("인증 흐름 - 로그인", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await loginAsUser(page);
  });

  test("내 스토리 페이지 접근 가능", async ({ page }) => {
    await page.goto("/my-stories");

    // 로그인 페이지로 리다이렉트되지 않음 (10초 타임아웃)
    await expect(page).not.toHaveURL(/\/login/, { timeout: 10000 });
  });

  test("채팅 페이지 접근 가능", async ({ page }) => {
    await page.goto("/chat");

    // 로그인 페이지로 리다이렉트되지 않음 (10초 타임아웃)
    await expect(page).not.toHaveURL(/\/login/, { timeout: 10000 });
  });
});
