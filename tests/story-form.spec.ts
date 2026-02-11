import { expect, test } from "@playwright/test";

import { loginAsGuest, loginAsUser } from "./fixtures/auth";

test.describe("스토리 폼 페이지 - 비로그인", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
  });

  test("스토리 생성 페이지 접근 시 로그인 페이지로 리다이렉트", async ({ page }) => {
    await page.goto("/stories/new");

    await expect(page.getByText("게스트로 계속하기")).toBeVisible({ timeout: 10000 });
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("스토리 폼 페이지 - 게스트", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await loginAsGuest(page);
  });

  test("스토리 생성 페이지 접근 시 로그인 페이지로 리다이렉트", async ({ page }) => {
    await page.goto("/stories/new");

    await expect(page.getByText("게스트로 계속하기")).toBeVisible({ timeout: 10000 });
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("스토리 폼 페이지 - 로그인", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await loginAsUser(page);
  });

  test("스토리 생성 페이지 접근 가능", async ({ page }) => {
    await page.goto("/stories/new");

    // 헤더 제목 확인
    await expect(page.getByText("새 스토리 작성")).toBeVisible({ timeout: 10000 });
  });

  test("스토리 생성 폼 UI 표시", async ({ page }) => {
    await page.goto("/stories/new");

    // 제목 입력 필드
    await expect(page.getByPlaceholder("작품의 제목을 입력하세요")).toBeVisible({ timeout: 10000 });

    // 작가 입력 필드
    await expect(page.getByPlaceholder("필명을 입력하세요")).toBeVisible();
  });

  test("탭 네비게이션 표시", async ({ page }) => {
    await page.goto("/stories/new");

    // 탭 버튼들 확인
    await expect(page.getByRole("tab", { name: "스토리 작성" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("tab", { name: "이미지 설정" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "캐릭터 설정" })).toBeVisible();
  });

  test("탭 전환", async ({ page }) => {
    await page.goto("/stories/new");

    // 이미지 설정 탭 클릭
    await page.getByRole("tab", { name: "이미지 설정" }).click();

    // 이미지 설정 관련 UI 표시
    await expect(page.getByText("커버 이미지")).toBeVisible({ timeout: 10000 });
  });

  test("뒤로가기 버튼 표시", async ({ page }) => {
    await page.goto("/stories/new");

    await expect(page.locator("header").locator("button").first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe("스토리 수정 페이지", () => {
  const mockStory = {
    id: "story-1",
    title: "기존 스토리",
    description: "기존 스토리 설명",
    authorName: "기존 작가",
    seriesTitle: null,
    summary: null,
    coverImage: null,
    coverColor: "bg-emerald-500",
    backgroundImage: null,
    category: { id: "cat-1", name: "창작", slug: "creative" },
    creator: { id: "user-test-id", nickname: "테스트유저" },
    characters: [],
  };

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await loginAsUser(page);

    // 스토리 API 모킹 (document 요청은 통과, API 요청만 모킹)
    await page.route(/\/stories\/[^/]+$/, (route) => {
      if (route.request().resourceType() === "document") {
        void route.continue();
        return;
      }
      if (route.request().method() === "GET") {
        void route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(mockStory),
        });
      } else {
        void route.continue();
      }
    });
  });

  test("스토리 수정 페이지 접근 가능", async ({ page }) => {
    await page.goto("/stories/story-1/edit");

    // 헤더 제목 확인
    await expect(page.getByText("스토리 수정")).toBeVisible({ timeout: 10000 });
  });

  test("기존 데이터가 폼에 채워짐", async ({ page }) => {
    await page.goto("/stories/story-1/edit");

    // 기존 제목이 입력되어 있음
    await expect(page.getByPlaceholder("작품의 제목을 입력하세요")).toHaveValue("기존 스토리", {
      timeout: 10000,
    });

    // 기존 작가 이름이 입력되어 있음
    await expect(page.getByPlaceholder("필명을 입력하세요")).toHaveValue("기존 작가");
  });
});
