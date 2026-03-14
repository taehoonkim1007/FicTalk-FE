import { expect, test } from "@playwright/test";

import { loginAsUser } from "./fixtures/auth";

// Mock 데이터
const mockStory = {
  id: "story-1",
  title: "테스트 스토리",
  description: "테스트 스토리 설명입니다.",
  authorName: "테스트 작가",
  seriesTitle: null,
  coverImage: null,
  coverColor: "bg-emerald-500",
  category: {
    id: "cat-1",
    name: "창작",
    slug: "creative",
  },
  creator: {
    id: "user-1",
    nickname: "테스트유저",
  },
  characters: [],
};

const mockCharacters = [
  {
    id: "char-1",
    name: "테스트 캐릭터",
    role: "주인공",
    description: "테스트 캐릭터 설명",
    profileImage: null,
    backgroundImage: null,
    imageColor: "bg-emerald-500",
    firstMessage: "안녕하세요!",
  },
];

test.describe("스토리 상세 페이지", () => {
  test.beforeEach(async ({ page }) => {
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

    // 스토리 캐릭터 API 모킹
    await page.route(/\/stories\/[^/]+\/characters/, (route) => {
      void route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ characters: mockCharacters }),
      });
    });
  });

  test("스토리 정보 표시", async ({ page }) => {
    await page.goto("/stories/story-1");

    // 스토리 제목 표시
    await expect(page.getByRole("heading", { name: "테스트 스토리" })).toBeVisible({
      timeout: 10000,
    });

    // 작가 이름 표시
    await expect(page.getByText("테스트 작가")).toBeVisible();

    // 스토리 설명 표시
    await expect(page.getByText("테스트 스토리 설명입니다.")).toBeVisible();
  });

  test("등장인물 목록 표시", async ({ page }) => {
    await page.goto("/stories/story-1");

    // 등장인물 섹션 표시
    await expect(page.getByText("등장인물 선택")).toBeVisible({ timeout: 10000 });

    // 캐릭터 이름 표시 (exact match)
    await expect(page.getByText("테스트 캐릭터", { exact: true })).toBeVisible();
  });

  test("뒤로가기 버튼 표시", async ({ page }) => {
    await page.goto("/stories/story-1");

    await expect(page.getByRole("button", { name: /돌아가기/ })).toBeVisible({ timeout: 10000 });
  });
});

test.describe("스토리 상세 페이지 - 소유자", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await loginAsUser(page);

    // 스토리 API 모킹 (소유자, document 요청은 통과)
    await page.route(/\/stories\/[^/]+$/, (route) => {
      if (route.request().resourceType() === "document") {
        void route.continue();
        return;
      }
      if (route.request().method() === "GET") {
        void route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            ...mockStory,
            creator: { id: "user-test-id", nickname: "테스트유저" },
          }),
        });
      } else {
        void route.continue();
      }
    });

    // 스토리 캐릭터 API 모킹
    await page.route(/\/stories\/[^/]+\/characters/, (route) => {
      void route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ characters: mockCharacters }),
      });
    });
  });

  test("수정/삭제 버튼 표시", async ({ page }) => {
    await page.goto("/stories/story-1");

    // 수정 버튼 표시
    await expect(page.getByRole("button", { name: /수정/ })).toBeVisible({ timeout: 10000 });

    // 삭제 버튼 표시
    await expect(page.getByRole("button", { name: /삭제/ })).toBeVisible();
  });
});
