import { expect, test } from "@playwright/test";

test.describe("캐릭터 페이지", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
  });

  test("캐릭터 목록 페이지 접근 가능", async ({ page }) => {
    await page.goto("/world-lit/characters");

    await page.waitForLoadState("domcontentloaded");

    // 캐릭터 탭이 활성화됨
    await expect(page.getByRole("button", { name: "캐릭터" })).toBeVisible();
  });
});
