import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/messages";
import {
  useCreateStory,
  useMyStory,
  usePublishStory,
  useUpdateStory,
} from "@/queries/useStoriesQueries";
import { useAuthStore } from "@/stores/useAuthStore";
import type { CreateCharacterRequest } from "@/types/character";
import { STORY_STATUS, type StoryFormData } from "@/types/story";

import { StoryForm } from "./StoryForm";

export const StoryFormPage = () => {
  // ==========================================
  // 외부 훅
  // ==========================================
  const navigate = useNavigate();
  const location = useLocation();
  const { storyId } = useParams<{ storyId: string }>();
  const { accessToken } = useAuthStore();

  // ==========================================
  // 로컬 상태
  // ==========================================
  // 게시 확인 다이얼로그 열림 상태
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);

  // ==========================================
  // 서버 상태 (React Query)
  // ==========================================
  const { data: existingStory, isLoading: isStoryLoading } = useMyStory(storyId || "", !!storyId);
  const { mutate: createStory, isPending: isCreating } = useCreateStory();
  const { mutate: updateStory, isPending: isUpdating } = useUpdateStory();
  const { mutate: publishStory, isPending: isPublishing } = usePublishStory();

  // ==========================================
  // 계산된 값 (Computed)
  // ==========================================
  const isEditMode = !!storyId;
  const isDraft = existingStory?.status === STORY_STATUS.DRAFT;
  const characterCount = existingStory?.characters?.length ?? 0;

  // ==========================================
  // 핸들러
  // ==========================================
  // 뒤로가기
  const handleBack = () => {
    const from = (location.state as { from?: string } | null)?.from;
    if (from) {
      void navigate(from);
    } else {
      void navigate(-1);
    }
  };

  // 폼 제출
  const handleFormSubmit = (data: StoryFormData) => {
    if (isEditMode && storyId) {
      const updateData = {
        title: data.title,
        authorName: data.authorName,
        description: data.description,
        summary: data.summary,
        coverColor: data.coverColor,
        coverImage: data.coverImage,
        backgroundImage: data.backgroundImage,
      };
      updateStory(
        { id: storyId, data: updateData },
        {
          onSuccess: () => {
            toast.success(SUCCESS_MESSAGES.STORY_UPDATED);
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
            // 작성 직후 편집 모드로 진입 (DRAFT 상태이므로 공개 페이지 접근 불가)
            void navigate(`/stories/${res.id}/edit`, {
              state: { from: "/my-stories" },
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

  // 게시 버튼 클릭 (다이얼로그 열기)
  const handlePublishClick = () => {
    if (characterCount < 1) {
      toast.error(ERROR_MESSAGES.STORY_PUBLISH_NO_CHARACTER);
      return;
    }
    setPublishDialogOpen(true);
  };

  // 게시 확인
  const handleConfirmPublish = () => {
    if (!storyId) return;
    publishStory(storyId, {
      onSuccess: () => {
        toast.success(SUCCESS_MESSAGES.STORY_PUBLISHED);
        setPublishDialogOpen(false);
        void navigate(`/stories/${storyId}`, {
          state: { from: "/my-stories" },
        });
      },
      onError: () => {
        toast.error(ERROR_MESSAGES.STORY_PUBLISH_FAILED);
      },
    });
  };

  if (!accessToken) {
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
          {isEditMode && isDraft && (
            <span className="rounded-full bg-stone-800 px-2 py-0.5 text-xs font-medium text-stone-300">
              비공개
            </span>
          )}
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
          showPublishButton={isEditMode && isDraft}
          onPublishClick={handlePublishClick}
          isPublishing={isPublishing}
        />
      </main>

      {/* 공개 전환 확인 다이얼로그 */}
      <AlertDialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>스토리를 공개로 전환하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              공개로 전환된 스토리는 다시 비공개로 되돌릴 수 없습니다. 정말로 전환하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPublishing}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmPublish}
              disabled={isPublishing}
              className="bg-emerald-600 text-white hover:bg-emerald-500"
            >
              {isPublishing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              공개로 전환
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
