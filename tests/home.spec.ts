import { expect, test } from "@playwright/test";

// Mock 데이터
const mockCategories = [
  { id: "1", name: "세계문학", slug: "world-lit" },
  { id: "2", name: "창작", slug: "creative" },
];

const mockHeroSlides = [
  {
    id: "slide-1",
    title: "테스트 스토리",
    description: "테스트 설명",
    coverImage: null,
    coverColor: "bg-emerald-500",
  },
];

test.describe("홈페이지", () => {
  test.beforeEach(async ({ page }) => {
    // 카테고리 API 모킹
    await page.route("**/categories", (route) => {
      void route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockCategories),
      });
    });

    // Hero 슬라이드 API 모킹
    await page.route("**/stories/hero", (route) => {
      void route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockHeroSlides),
      });
    });

    // 카테고리별 스토리 API 모킹 (document 요청은 통과)
    await page.route(/\/categories\/[^/]+\/stories/, (route) => {
      if (route.request().resourceType() === "document") {
        void route.continue();
        return;
      }
      void route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ stories: [], totalCount: 0 }),
      });
    });

    // 카테고리별 캐릭터 API 모킹 (document 요청은 통과)
    await page.route(/\/categories\/[^/]+\/characters/, (route) => {
      if (route.request().resourceType() === "document") {
        void route.continue();
        return;
      }
      void route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ characters: [], totalCount: 0 }),
      });
    });
  });

  test("홈페이지 접근 가능", async ({ page }) => {
    await page.goto("/");

    await page.waitForLoadState("domcontentloaded");

    // 스토리/캐릭터 탭 버튼 표시
    await expect(page.getByRole("button", { name: "스토리" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("button", { name: "캐릭터" })).toBeVisible();
  });

  test("스토리/캐릭터 탭 전환", async ({ page }) => {
    await page.goto("/");

    // 기본적으로 스토리 탭이 활성화
    const storyTab = page.getByRole("button", { name: "스토리" });
    const characterTab = page.getByRole("button", { name: "캐릭터" });

    await expect(storyTab).toBeVisible({ timeout: 10000 });

    // 캐릭터 탭 클릭
    await characterTab.click();

    // 캐릭터 탭이 활성화됨 (emerald 배경색)
    await expect(characterTab).toHaveClass(/bg-emerald/);
  });
});
