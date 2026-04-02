import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AnalyticsLayout } from "@/components/common/Analytics";
import { withSuspense } from "@/components/common/RouteSuspense";
import { MainLayout } from "@/components/layout/MainLayout";
// Critical path - eagerly loaded
import { HomePage } from "@/pages/HomePage";

// 배포 후 청크 해시 변경으로 인한 동적 import 실패 시 페이지 새로고침
const lazyWithRetry = (factory: () => Promise<{ default: React.ComponentType }>) =>
  lazy(() =>
    factory().catch(() => {
      const hasReloaded = sessionStorage.getItem("chunk-retry");
      if (!hasReloaded) {
        sessionStorage.setItem("chunk-retry", "1");
        window.location.reload();
        return new Promise(() => {});
      }
      sessionStorage.removeItem("chunk-retry");
      return Promise.reject(new Error("페이지를 불러올 수 없습니다. 새로고침해 주세요."));
    }),
  );

// Lazy loaded routes (bundle-dynamic-imports)
const SearchPage = lazyWithRetry(() =>
  import("@/pages/SearchPage").then((m) => ({ default: m.SearchPage })),
);
const StoriesPage = lazyWithRetry(() =>
  import("@/pages/story/StoriesPage").then((m) => ({ default: m.StoriesPage })),
);
const StoryDetailPage = lazyWithRetry(() =>
  import("@/pages/story/StoryDetailPage").then((m) => ({ default: m.StoryDetailPage })),
);
const StoryFormPage = lazyWithRetry(() =>
  import("@/pages/story/StoryFormPage").then((m) => ({ default: m.StoryFormPage })),
);
const MyStoriesPage = lazyWithRetry(() =>
  import("@/pages/story/MyStoriesPage").then((m) => ({ default: m.MyStoriesPage })),
);
const CharactersPage = lazyWithRetry(() =>
  import("@/pages/character/CharactersPage").then((m) => ({ default: m.CharactersPage })),
);
const CharacterDetailPage = lazyWithRetry(() =>
  import("@/pages/character/CharacterDetailPage").then((m) => ({
    default: m.CharacterDetailPage,
  })),
);
const LoginPage = lazyWithRetry(() =>
  import("@/pages/LoginPage").then((m) => ({ default: m.LoginPage })),
);
const AuthCallbackPage = lazyWithRetry(() =>
  import("@/pages/AuthCallbackPage").then((m) => ({ default: m.AuthCallbackPage })),
);
const ChatPage = lazyWithRetry(() =>
  import("@/pages/chat/ChatPage").then((m) => ({ default: m.ChatPage })),
);
const ProfilePage = lazyWithRetry(() =>
  import("@/pages/ProfilePage").then((m) => ({ default: m.ProfilePage })),
);

export const router = createBrowserRouter([
  {
    element: <AnalyticsLayout />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: "search",
            element: withSuspense(SearchPage),
          },
          {
            path: "stories/:storyId",
            element: withSuspense(StoryDetailPage),
          },
          {
            element: <ProtectedRoute guestAllowed={false} />,
            children: [
              {
                path: "my-stories",
                element: withSuspense(MyStoriesPage),
              },
              {
                path: "profile",
                element: withSuspense(ProfilePage),
              },
            ],
          },
          {
            path: "characters/:characterId",
            element: withSuspense(CharacterDetailPage),
          },
          {
            path: ":categorySlug/characters",
            element: withSuspense(CharactersPage),
          },
          {
            path: ":categorySlug",
            element: withSuspense(StoriesPage),
          },
        ],
      },
      // 스토리 작성/수정 페이지 - 일반 유저만 (MainLayout 밖)
      {
        element: <ProtectedRoute guestAllowed={false} />,
        children: [
          {
            path: "/stories/new",
            element: withSuspense(StoryFormPage),
          },
          {
            path: "/stories/:storyId/edit",
            element: withSuspense(StoryFormPage),
          },
        ],
      },
      // 채팅 페이지 - 게스트 포함 (MainLayout 밖)
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/chat",
            element: withSuspense(ChatPage),
          },
        ],
      },
      {
        path: "/login",
        element: withSuspense(LoginPage),
      },
      {
        path: "/auth/callback",
        element: withSuspense(AuthCallbackPage),
      },
    ],
  },
]);
