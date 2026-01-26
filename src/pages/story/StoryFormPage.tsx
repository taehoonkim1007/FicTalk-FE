import { useNavigate, useParams } from "react-router-dom";

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
  const { storyId } = useParams<{ storyId: string }>();
  const isEditMode = !!storyId;

  const { isAuthenticated } = useAuthStore();
  const { data: existingStory, isLoading: isStoryLoading } = useStory(storyId || "", isEditMode);

  const { mutate: createStory, isPending: isCreating } = useCreateStory();
  const { mutate: updateStory, isPending: isUpdating } = useUpdateStory();

  const handleFormSubmit = (data: StoryFormData) => {
    if (isEditMode && storyId) {
      updateStory(
        { id: storyId, data },
        {
          onSuccess: () => {
            toast.success(SUCCESS_MESSAGES.STORY_UPDATED);
            void navigate(`/stories/${storyId}`);
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
            void navigate(`/stories/${res.id}`);
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
      <main className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-stone-400">로그인이 필요합니다.</p>
        <Button onClick={() => void navigate("/login")}>로그인하기</Button>
      </main>
    );
  }

  if (isEditMode && isStoryLoading) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </main>
    );
  }

  return (
    <main className="pb-20">
      <section className="mx-auto max-w-3xl px-4 py-8">
        <button
          onClick={() => void navigate(-1)}
          className="mb-6 flex items-center gap-1 text-sm text-stone-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> 돌아가기
        </button>

        <h1 className="mb-8 text-3xl font-bold text-white">
          {isEditMode ? "스토리 수정" : "새 스토리 작성"}
        </h1>

        <StoryForm
          key={existingStory?.id || "new"}
          initialData={existingStory}
          onSubmit={handleFormSubmit}
          isSubmitting={isCreating || isUpdating}
        />
      </section>
    </main>
  );
};
