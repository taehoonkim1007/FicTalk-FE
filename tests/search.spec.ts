import { expect, test } from "@playwright/test";

test.describe("검색 페이지", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
  });

  test("검색 페이지 접근 가능", async ({ page }) => {
    await page.goto("/search");

    await page.waitForLoadState("domcontentloaded");

    // 검색 입력창이 표시됨
    await expect(page.getByPlaceholder(/검색/)).toBeVisible();
  });

  test("검색어 입력 시 결과 영역이 표시됨", async ({ page }) => {
    await page.goto("/search?q=테스트");

    await page.waitForLoadState("domcontentloaded");

    // 검색 결과 영역이 표시됨
    await expect(page.locator("main").first()).toBeVisible();
  });
});
