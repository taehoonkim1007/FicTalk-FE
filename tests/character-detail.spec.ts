import { expect, test } from "@playwright/test";

// Mock 데이터
const mockCharacter = {
  id: "char-1",
  name: "테스트 캐릭터",
  role: "주인공",
  description: "테스트 캐릭터의 상세 설명입니다.",
  personality: "친절하고 용감한 성격",
  firstMessage: "안녕하세요! 만나서 반갑습니다.",
  profileImage: null,
  backgroundImage: null,
  backgroundColor: "bg-emerald-500",
  imageColor: "bg-emerald-500",
  story: {
    id: "story-1",
    title: "테스트 스토리",
    seriesTitle: null,
    authorName: "테스트 작가",
    coverImage: null,
    coverColor: "bg-stone-700",
  },
};

test.describe("캐릭터 상세 페이지", () => {
  test.beforeEach(async ({ page }) => {
    // 캐릭터 API 모킹 (document 요청은 통과, API 요청만 모킹)
    await page.route(/\/characters\/[^/]+$/, (route) => {
      if (route.request().resourceType() === "document") {
        void route.continue();
        return;
      }
      void route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockCharacter),
      });
    });
  });

  test("캐릭터 정보 표시", async ({ page }) => {
    await page.goto("/characters/char-1");

    // 캐릭터 이름 표시
    await expect(page.getByRole("heading", { name: "테스트 캐릭터" })).toBeVisible({
      timeout: 10000,
    });

    // 역할 표시
    await expect(page.getByText("주인공")).toBeVisible();

    // 설명 표시
    await expect(page.getByText("테스트 캐릭터의 상세 설명입니다.")).toBeVisible();
  });

  test("성격 표시", async ({ page }) => {
    await page.goto("/characters/char-1");

    await expect(page.getByRole("heading", { name: "성격" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("친절하고 용감한 성격")).toBeVisible();
  });

  test("첫 인사말 표시", async ({ page }) => {
    await page.goto("/characters/char-1");

    await expect(page.getByText("첫 인사말")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/만나서 반갑습니다/)).toBeVisible();
  });

  test("소속 스토리 표시", async ({ page }) => {
    await page.goto("/characters/char-1");

    await expect(page.getByText("소속 스토리")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("테스트 스토리")).toBeVisible();
    await expect(page.getByText("테스트 작가")).toBeVisible();
  });

  test("대화 시작 버튼 표시", async ({ page }) => {
    await page.goto("/characters/char-1");

    await expect(page.getByRole("button", { name: /대화 시작하기/ })).toBeVisible({
      timeout: 10000,
    });
  });

  test("뒤로가기 버튼 표시", async ({ page }) => {
    await page.goto("/characters/char-1");

    await expect(page.getByText("뒤로가기")).toBeVisible({ timeout: 10000 });
  });
});
