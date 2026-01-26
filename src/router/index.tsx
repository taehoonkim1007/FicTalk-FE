import { createBrowserRouter } from "react-router-dom";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";
import { AuthCallbackPage } from "@/pages/AuthCallbackPage";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
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
          {
            path: "stories/new",
            element: <StoryFormPage />,
          },
          {
            path: "stories/:storyId/edit",
            element: <StoryFormPage />,
          },
        ],
      },
      {
        path: ":categorySlug",
        element: <StoriesPage />,
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
