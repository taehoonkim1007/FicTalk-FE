import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { withSuspense } from "@/components/common/RouteSuspense";
import { MainLayout } from "@/components/layout/MainLayout";
// Critical path - eagerly loaded
import { HomePage } from "@/pages/HomePage";

// Lazy loaded routes (bundle-dynamic-imports)
const SearchPage = lazy(() =>
  import("@/pages/SearchPage").then((m) => ({ default: m.SearchPage })),
);
const StoriesPage = lazy(() =>
  import("@/pages/story/StoriesPage").then((m) => ({ default: m.StoriesPage })),
);
const StoryDetailPage = lazy(() =>
  import("@/pages/story/StoryDetailPage").then((m) => ({ default: m.StoryDetailPage })),
);
const StoryFormPage = lazy(() =>
  import("@/pages/story/StoryFormPage").then((m) => ({ default: m.StoryFormPage })),
);
const MyStoriesPage = lazy(() =>
  import("@/pages/story/MyStoriesPage").then((m) => ({ default: m.MyStoriesPage })),
);
const CharactersPage = lazy(() =>
  import("@/pages/character/CharactersPage").then((m) => ({ default: m.CharactersPage })),
);
const CharacterDetailPage = lazy(() =>
  import("@/pages/character/CharacterDetailPage").then((m) => ({
    default: m.CharacterDetailPage,
  })),
);
const LoginPage = lazy(() => import("@/pages/LoginPage").then((m) => ({ default: m.LoginPage })));
const AuthCallbackPage = lazy(() =>
  import("@/pages/AuthCallbackPage").then((m) => ({ default: m.AuthCallbackPage })),
);

export const router = createBrowserRouter([
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
        element: <ProtectedRoute />,
        children: [
          {
            path: "my-stories",
            element: withSuspense(MyStoriesPage),
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
  // 스토리 작성/수정 페이지 (MainLayout 밖)
  {
    element: <ProtectedRoute />,
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
  {
    path: "/login",
    element: withSuspense(LoginPage),
  },
  {
    path: "/auth/callback",
    element: withSuspense(AuthCallbackPage),
  },
]);
