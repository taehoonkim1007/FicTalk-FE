import { expect, test } from "@playwright/test";

import { loginAsGuest, loginAsUser } from "./fixtures/auth";

test.describe("스토리 페이지 - 비로그인", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
  });

  test("창작 카테고리에서 게시글 추가 버튼이 보이지 않음", async ({ page }) => {
    await page.goto("/creative");

    await page.waitForLoadState("domcontentloaded");

    await expect(page.getByText("게시글 추가")).not.toBeVisible();
  });

  test("스토리 목록 페이지 접근 가능", async ({ page }) => {
    await page.goto("/world-lit");

    await page.waitForLoadState("domcontentloaded");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});

test.describe("스토리 페이지 - 게스트", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await loginAsGuest(page);
  });

  test("창작 카테고리에서 게시글 추가 버튼이 보이지 않음", async ({ page }) => {
    await page.goto("/creative");

    await page.waitForLoadState("domcontentloaded");

    await expect(page.getByText("게시글 추가")).not.toBeVisible();
  });
});

test.describe("스토리 페이지 - 로그인", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await loginAsUser(page);
  });

  test("창작 카테고리에서 게시글 추가 버튼이 보임", async ({ page }) => {
    await page.goto("/creative");

    // 페이지 콘텐츠가 로드될 때까지 기다림 (제목이 표시됨)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 10000 });

    // 버튼이 보일 때까지 기다림
    await expect(page.getByText("게시글 추가")).toBeVisible({ timeout: 10000 });
  });
});
