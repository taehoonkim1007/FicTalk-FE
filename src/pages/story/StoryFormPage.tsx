import { useLocation, useNavigate, useParams } from "react-router-dom";

import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/messages";
import { useCreateStory, useStory, useUpdateStory } from "@/queries/useStoriesQueries";
import { useAuthStore } from "@/stores/useAuthStore";
import type { CreateCharacterRequest, StoryFormData } from "@/types/story";

import { StoryForm } from "./StoryForm";

export const StoryFormPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { storyId } = useParams<{ storyId: string }>();
  const isEditMode = !!storyId;

  const handleBack = () => {
    const from = (location.state as { from?: string } | null)?.from;
    if (from) {
      void navigate(from);
    } else {
      void navigate(-1);
    }
  };

  const { isAuthenticated } = useAuthStore();
  const { data: existingStory, isLoading: isStoryLoading } = useStory(storyId || "", isEditMode);

  const { mutate: createStory, isPending: isCreating } = useCreateStory();
  const { mutate: updateStory, isPending: isUpdating } = useUpdateStory();

  const handleFormSubmit = (data: StoryFormData) => {
    if (isEditMode && storyId) {
      const updateData = {
        title: data.title,
        authorName: data.authorName,
        description: data.description,
        summary: data.summary,
        coverColor: data.coverColor,
      };
      updateStory(
        { id: storyId, data: updateData },
        {
          onSuccess: () => {
            toast.success(SUCCESS_MESSAGES.STORY_UPDATED);
            const from = (location.state as { from?: string } | null)?.from;
            void navigate(`/stories/${storyId}`, {
              state: { from },
            });
          },
          onError: () => {
            toast.error(ERROR_MESSAGES.STORY_UPDATE_FAILED);
          },
        },
      );
    } else {
      createStory(
        {
          ...data,
          categorySlug: "creative",
          characters: data.characters.filter(
            (c: CreateCharacterRequest) => c.name && c.role && c.description,
          ),
        },
        {
          onSuccess: (res) => {
            toast.success(SUCCESS_MESSAGES.STORY_CREATED);
            const from = (location.state as { from?: string } | null)?.from;
            void navigate(`/stories/${res.id}`, {
              state: { from: from || "/creative" },
              replace: true,
            });
          },
          onError: () => {
            toast.error(ERROR_MESSAGES.STORY_CREATE_FAILED);
          },
        },
      );
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-stone-950">
        <p className="text-stone-400">로그인이 필요합니다.</p>
        <Button onClick={() => void navigate("/login")} className="mt-4">
          로그인하기
        </Button>
      </div>
    );
  }

  if (isEditMode && isStoryLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-950">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 border-b border-stone-800 bg-stone-950">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-4 px-4">
          <button
            onClick={handleBack}
            className="text-stone-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-white">
            {isEditMode ? "스토리 수정" : "새 스토리 작성"}
          </h1>
        </div>
      </header>

      {/* 폼 */}
      <main className="mx-auto max-w-3xl px-4 py-6">
        <StoryForm
          key={existingStory?.id || "new"}
          initialData={existingStory ?? null}
          onSubmit={handleFormSubmit}
          isSubmitting={isCreating || isUpdating}
          isEditMode={isEditMode}
        />
      </main>
    </div>
  );
};
