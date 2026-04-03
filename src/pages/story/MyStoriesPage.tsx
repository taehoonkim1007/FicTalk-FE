import { type MouseEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ChevronRight, Loader2, PenSquare, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { EmptyState, ErrorState, LoadingState } from "@/components/common";
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
import { getImageUrl } from "@/lib/image";
import { useDeleteStory, useMyStories } from "@/queries/useStoriesQueries";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Story } from "@/types/story";

export const MyStoriesPage = () => {
  // ==========================================
  // 로컬 상태
  // ==========================================
  // 삭제 확인 다이얼로그 열림 상태
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  // 삭제 대상 스토리 ID
  const [storyToDelete, setStoryToDelete] = useState<string | null>(null);

  // ==========================================
  // 외부 훅
  // ==========================================
  const navigate = useNavigate();

  // ==========================================
  // 외부 상태 (Store)
  // ==========================================
  const { accessToken } = useAuthStore();

  // ==========================================
  // 서버 상태 (React Query)
  // ==========================================
  const { data: stories = [], isLoading, isError } = useMyStories(!!accessToken);
  const { mutate: deleteStory, isPending: isDeleting } = useDeleteStory();

  // ==========================================
  // 핸들러
  // ==========================================
  // 스토리 선택
  const handleStorySelect = (story: Story) => {
    void navigate(`/stories/${story.id}`, {
      state: { from: "/my-stories" },
    });
  };

  // 스토리 수정
  const handleEditStory = (e: MouseEvent, storyId: string) => {
    e.stopPropagation();
    void navigate(`/stories/${storyId}/edit`);
  };

  // 삭제 버튼 클릭
  const handleDeleteClick = (e: MouseEvent, storyId: string) => {
    e.stopPropagation();
    setStoryToDelete(storyId);
    setDeleteDialogOpen(true);
  };

  // 삭제 확인
  const handleConfirmDelete = () => {
    if (!storyToDelete) return;

    deleteStory(storyToDelete, {
      onSuccess: () => {
        toast.success(SUCCESS_MESSAGES.STORY_DELETED);
        setDeleteDialogOpen(false);
        setStoryToDelete(null);
      },
      onError: () => {
        toast.error(ERROR_MESSAGES.STORY_DELETE_FAILED);
      },
    });
  };

  if (!accessToken) {
    return (
      <EmptyState
        title="로그인이 필요합니다."
        action={<Button onClick={() => void navigate("/login")}>로그인하기</Button>}
        className="min-h-[50vh]"
      />
    );
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState message="스토리를 불러오는 중 오류가 발생했습니다." />;
  }

  return (
    <main className="pb-20">
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">내 스토리</h1>
            <p className="mt-2 text-sm text-stone-500">{stories.length}개의 스토리</p>
          </div>
          <Button
            className="bg-emerald-500 text-black hover:bg-emerald-400"
            onClick={() =>
              void navigate("/stories/new", {
                state: { from: "/my-stories" },
              })
            }
          >
            <Plus className="mr-2 h-4 w-4" /> 새 스토리 작성
          </Button>
        </div>

        {stories.length === 0 ? (
          <EmptyState
            title="아직 작성한 스토리가 없습니다"
            variant="dashed"
            action={
              <Button
                variant="ghost"
                className="text-emerald-500"
                onClick={() =>
                  void navigate("/stories/new", {
                    state: { from: "/my-stories" },
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" /> 첫 스토리 작성하기
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {stories.map((story) => (
              <div
                key={story.id}
                className="group cursor-pointer overflow-hidden rounded-xl bg-stone-900 transition-all hover:ring-2 hover:ring-emerald-500"
                onClick={() => handleStorySelect(story)}
              >
                <div
                  className={`relative h-32 overflow-hidden ${!story.coverImage ? story.coverColor : ""}`}
                >
                  {story.coverImage && (
                    <img
                      src={getImageUrl(story.coverImage) || ""}
                      alt={story.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                  <div className="absolute right-3 bottom-3 left-3">
                    <h3 className="truncate text-lg leading-tight font-bold text-white">
                      {story.title}
                    </h3>
                    {story.seriesTitle && (
                      <p className="truncate text-xs text-stone-400 italic">{story.seriesTitle}</p>
                    )}
                  </div>
                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={(e) => handleEditStory(e, story.id)}
                      className="rounded-full bg-stone-900/80 p-2 text-stone-300 transition-colors hover:bg-stone-800 hover:text-white"
                    >
                      <PenSquare className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(e, story.id)}
                      className="rounded-full bg-stone-900/80 p-2 text-stone-300 transition-colors hover:bg-red-900 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-3 p-4">
                  <p className="line-clamp-2 text-sm text-stone-400">{story.description}</p>
                  <div className="flex items-center justify-between border-t border-stone-800 pt-2 text-xs text-stone-500">
                    <span className="rounded bg-stone-800 px-2 py-0.5">{story.category.name}</span>
                    <span className="flex items-center gap-1 font-medium transition-colors hover:text-emerald-500">
                      상세보기 <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>스토리 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 스토리를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
};
