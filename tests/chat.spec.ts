import { expect, test } from "@playwright/test";

import { loginAsGuest, loginAsUser } from "./fixtures/auth";

// Mock 데이터 (실제 ChatCharacter 타입에 맞춤)
const mockCharacter = {
  id: "char-1",
  name: "테스트 캐릭터",
  role: "주인공",
  description: "테스트 캐릭터 설명",
  profileImage: null,
  backgroundImage: null,
  imageColor: "bg-emerald-500",
  personality: "친절한",
  firstMessage: null,
  voiceId: null,
  voiceSettings: null,
  story: {
    id: "story-1",
    title: "테스트 스토리",
    backgroundImage: null,
  },
};

const mockMessages = [
  {
    id: "msg-1",
    role: "user" as const,
    content: "안녕하세요",
    createdAt: new Date().toISOString(),
  },
  {
    id: "msg-2",
    role: "assistant" as const,
    content: "안녕하세요! 무엇을 도와드릴까요?",
    createdAt: new Date().toISOString(),
  },
];

// 비로그인/게스트 접근 테스트는 auth.spec.ts에서 수행

// 게스트 사용자 mock 데이터
const createGuestUser = (usageCount: number, maxUsage: number) => ({
  id: "guest-test-id",
  role: "guest" as const,
  usageCount,
  maxUsage,
});

test.describe("채팅 페이지 - 게스트 제한", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
  });

  test("게스트 사용량 UI 표시", async ({ page }) => {
    // 게스트 사용자 (3/10 사용)
    const guestUser = createGuestUser(3, 10);

    await page.route("**/auth/me", (route) => {
      void route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(guestUser),
      });
    });

    await page.evaluate(
      ({ guestId }) => {
        const authStorage = {
          state: { accessToken: "guest-test-token", isAuthenticated: true, guestId },
          version: 0,
        };
        localStorage.setItem("auth-storage", JSON.stringify(authStorage));
      },
      { guestId: guestUser.id },
    );

    // 채팅 캐릭터 API 모킹
    await page.route("**/chat/characters", (route) => {
      if (route.request().method() === "GET") {
        void route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ characters: [mockCharacter] }),
        });
      } else {
        void route.continue();
      }
    });

    // 메시지 API 모킹
    await page.route(/\/chat\/characters\/[^/]+\/messages/, (route) => {
      void route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ messages: [], nextCursor: null, hasMore: false }),
      });
    });

    await page.reload();
    await page.goto("/chat");

    // 게스트 사용량 표시 확인 (3/10회)
    await expect(page.getByText("3/10")).toBeVisible({ timeout: 10000 });
  });

  test("게스트 사용 횟수 초과 시 에러 토스트 표시", async ({ page }) => {
    // 게스트 사용자 (사용량 거의 다 참)
    const guestUser = createGuestUser(9, 10);

    await page.route("**/auth/me", (route) => {
      void route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(guestUser),
      });
    });

    await page.evaluate(
      ({ guestId }) => {
        const authStorage = {
          state: { accessToken: "guest-test-token", isAuthenticated: true, guestId },
          version: 0,
        };
        localStorage.setItem("auth-storage", JSON.stringify(authStorage));
      },
      { guestId: guestUser.id },
    );

    // 채팅 캐릭터 API 모킹
    await page.route("**/chat/characters", (route) => {
      if (route.request().method() === "GET") {
        void route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ characters: [mockCharacter] }),
        });
      } else {
        void route.continue();
      }
    });

    // 메시지 API 모킹 - GET은 성공, POST는 403 에러
    await page.route(/\/chat\/characters\/[^/]+\/messages/, (route) => {
      if (route.request().method() === "GET") {
        void route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ messages: [], nextCursor: null, hasMore: false }),
        });
      } else if (route.request().method() === "POST") {
        void route.fulfill({
          status: 403,
          contentType: "application/json",
          body: JSON.stringify({ code: "GUEST_NOT_ALLOWED" }),
        });
      } else {
        void route.continue();
      }
    });

    await page.reload();
    await page.goto("/chat");

    // 메시지 입력 및 전송
    const input = page.getByPlaceholder("메시지 보내기");
    await expect(input).toBeVisible({ timeout: 10000 });
    await input.fill("테스트 메시지");
    await input.press("Enter");

    // 에러 토스트 표시 확인
    await expect(page.getByText("게스트 사용 횟수를 초과했습니다")).toBeVisible({ timeout: 10000 });
  });

  test("게스트 캐릭터 추가 제한 - 1개 초과 시 버튼 비활성화", async ({ page }) => {
    await loginAsGuest(page);

    // 채팅 캐릭터 API 모킹 (이미 1개 있음)
    await page.route("**/chat/characters", (route) => {
      if (route.request().method() === "GET") {
        void route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ characters: [mockCharacter] }),
        });
      } else {
        void route.continue();
      }
    });

    // 메시지 API 모킹
    await page.route(/\/chat\/characters\/[^/]+\/messages/, (route) => {
      void route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ messages: [], nextCursor: null, hasMore: false }),
      });
    });

    await page.goto("/chat");

    // 사이드바에서 캐릭터 수 표시 확인 (1/1)
    await expect(page.getByText("1/1")).toBeVisible({ timeout: 10000 });

    // 추가 버튼이 비활성화되어 있는지 확인 (사이드바의 + 버튼)
    // 비활성화 상태에서는 title이 "게스트는 캐릭터를 1개만 추가할 수 있습니다"로 변경됨
    const addButton = page
      .locator("aside")
      .getByRole("button", { name: "게스트는 캐릭터를 1개만 추가할 수 있습니다" });
    await expect(addButton).toBeDisabled();
  });

  test("게스트 캐릭터 추가 시 서버 에러 토스트 표시", async ({ page }) => {
    await loginAsGuest(page);

    // 채팅 캐릭터 API 모킹 (빈 목록 - 추가 가능 상태)
    await page.route("**/chat/characters", (route) => {
      if (route.request().method() === "GET") {
        void route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ characters: [] }),
        });
      } else if (route.request().method() === "POST") {
        // 캐릭터 추가 시 403 에러
        void route.fulfill({
          status: 403,
          contentType: "application/json",
          body: JSON.stringify({ code: "GUEST_CHARACTER_LIMIT" }),
        });
      } else {
        void route.continue();
      }
    });

    // 캐릭터 검색 API 모킹
    await page.route("**/characters?**", (route) => {
      void route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          characters: [
            {
              id: "char-2",
              name: "새 캐릭터",
              role: "조연",
              profileImage: null,
              imageColor: "bg-blue-500",
              story: { id: "story-2", title: "다른 스토리" },
            },
          ],
          totalCount: 1,
        }),
      });
    });

    await page.goto("/chat");

    // 대화 상대 추가 버튼 클릭
    await page.getByRole("button", { name: "대화 상대 추가" }).first().click();

    // 모달에서 캐릭터 선택
    await expect(page.getByText("새 캐릭터")).toBeVisible({ timeout: 10000 });
    await page.getByText("새 캐릭터").click();

    // 에러 토스트 표시 확인
    await expect(page.getByText("게스트는 캐릭터를 1개만 추가할 수 있습니다")).toBeVisible({
      timeout: 10000,
    });
  });
});

test.describe("채팅 페이지", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await loginAsUser(page);
  });

  test("캐릭터가 없을 때 빈 상태 표시", async ({ page }) => {
    // 채팅 캐릭터 API 모킹 (빈 목록)
    await page.route("**/chat/characters", (route) => {
      if (route.request().method() === "GET") {
        void route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ characters: [] }),
        });
      } else {
        void route.continue();
      }
    });

    await page.goto("/chat");

    // 빈 상태 메시지 표시
    await expect(page.getByText("대화 상대를 선택하세요")).toBeVisible({ timeout: 10000 });

    // 대화 상대 추가 버튼 표시 (EmptyState 영역 내)
    await expect(page.getByRole("button", { name: "대화 상대 추가" }).first()).toBeVisible();
  });

  test("캐릭터가 있을 때 채팅 UI 표시", async ({ page }) => {
    // 채팅 캐릭터 API 모킹
    await page.route("**/chat/characters", (route) => {
      if (route.request().method() === "GET") {
        void route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ characters: [mockCharacter] }),
        });
      } else {
        void route.continue();
      }
    });

    // 메시지 API 모킹 (URL에 쿼리 파라미터 포함 가능)
    await page.route(/\/chat\/characters\/[^/]+\/messages/, (route) => {
      if (route.request().method() === "GET") {
        void route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            messages: mockMessages,
            nextCursor: null,
            hasMore: false,
          }),
        });
      } else {
        void route.continue();
      }
    });

    await page.goto("/chat");

    // 캐릭터 이름 표시 (헤더의 h1)
    await expect(page.locator("h1").filter({ hasText: "테스트 캐릭터" })).toBeVisible({
      timeout: 10000,
    });

    // 메시지 입력창 표시
    await expect(page.getByPlaceholder("메시지 보내기")).toBeVisible();

    // 기존 메시지 표시 (메시지 로딩 완료 대기)
    await expect(page.getByText("안녕하세요").first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("무엇을 도와드릴까요?")).toBeVisible();
  });

  test("메시지 전송", async ({ page }) => {
    // 채팅 캐릭터 API 모킹
    await page.route("**/chat/characters", (route) => {
      if (route.request().method() === "GET") {
        void route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ characters: [mockCharacter] }),
        });
      } else {
        void route.continue();
      }
    });

    // 메시지 목록 API 모킹 (URL에 쿼리 파라미터 포함 가능)
    await page.route(/\/chat\/characters\/[^/]+\/messages/, (route) => {
      if (route.request().method() === "GET") {
        void route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            messages: [],
            nextCursor: null,
            hasMore: false,
          }),
        });
      } else if (route.request().method() === "POST") {
        // 메시지 전송 응답
        void route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            userMessage: {
              id: "new-msg-1",
              role: "user",
              content: "테스트 메시지",
              createdAt: new Date().toISOString(),
            },
            aiMessage: {
              id: "new-msg-2",
              role: "assistant",
              content: "AI 응답입니다.",
              createdAt: new Date().toISOString(),
            },
          }),
        });
      } else {
        void route.continue();
      }
    });

    await page.goto("/chat");

    // 입력창에 메시지 입력
    const input = page.getByPlaceholder("메시지 보내기");
    await expect(input).toBeVisible({ timeout: 10000 });
    await input.fill("테스트 메시지");

    // Enter 키로 전송 (또는 폼 제출)
    await input.press("Enter");

    // AI 응답 표시 확인
    await expect(page.getByText("AI 응답입니다.")).toBeVisible({ timeout: 10000 });
  });

  test("대화 초기화", async ({ page }) => {
    // 채팅 캐릭터 API 모킹
    await page.route("**/chat/characters", (route) => {
      if (route.request().method() === "GET") {
        void route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ characters: [mockCharacter] }),
        });
      } else {
        void route.continue();
      }
    });

    let messagesCleared = false;

    // 메시지 API 모킹 (URL에 쿼리 파라미터 포함 가능)
    await page.route(/\/chat\/characters\/[^/]+\/messages/, (route) => {
      if (route.request().method() === "GET") {
        void route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            messages: messagesCleared ? [] : mockMessages,
            nextCursor: null,
            hasMore: false,
          }),
        });
      } else if (route.request().method() === "DELETE") {
        messagesCleared = true;
        void route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ message: "대화가 초기화되었습니다." }),
        });
      } else {
        void route.continue();
      }
    });

    await page.goto("/chat");

    // 기존 메시지 확인
    await expect(page.getByText("안녕하세요").first()).toBeVisible({ timeout: 10000 });

    // 초기화 버튼 클릭 (헤더의 아이콘 버튼, title="대화 초기화")
    await page.getByRole("button", { name: "대화 초기화" }).click();

    // 확인 다이얼로그에서 "확인" 버튼 클릭
    await page.getByRole("button", { name: "확인" }).click();

    // 토스트 메시지 확인
    await expect(page.getByText("대화가 초기화되었습니다")).toBeVisible({ timeout: 10000 });
  });
});
