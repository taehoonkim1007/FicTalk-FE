import { createBrowserRouter } from "react-router-dom";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";
import { AuthCallbackPage } from "@/pages/AuthCallbackPage";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { SearchPage } from "@/pages/SearchPage";
import { CharacterDetailPage } from "@/pages/character/CharacterDetailPage";
import { CharactersPage } from "@/pages/character/CharactersPage";
import { MyStoriesPage } from "@/pages/story/MyStoriesPage";
import { StoriesPage } from "@/pages/story/StoriesPage";
import { StoryDetailPage } from "@/pages/story/StoryDetailPage";
import { StoryFormPage } from "@/pages/story/StoryFormPage";

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
        element: <SearchPage />,
      },
      {
        path: "stories/:storyId",
        element: <StoryDetailPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "my-stories",
            element: <MyStoriesPage />,
          },
        ],
      },
      {
        path: "characters/:characterId",
        element: <CharacterDetailPage />,
      },
      {
        path: ":categorySlug/characters",
        element: <CharactersPage />,
      },
      {
        path: ":categorySlug",
        element: <StoriesPage />,
      },
    ],
  },
  // 스토리 작성/수정 페이지 (MainLayout 밖)
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/stories/new",
        element: <StoryFormPage />,
      },
      {
        path: "/stories/:storyId/edit",
        element: <StoryFormPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/auth/callback",
    element: <AuthCallbackPage />,
  },
]);
