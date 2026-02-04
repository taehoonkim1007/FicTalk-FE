import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { ArrowLeft, BookOpen, Loader2, MessageCircle, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ErrorState, LoadingState } from "@/components/common";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/messages";
import { useStartChat } from "@/hooks/useStartChat";
import { getImageUrl } from "@/lib/image";
import { useDeleteStory, useStory, useStoryCharacters } from "@/queries/useStoriesQueries";
import { useAuthStore } from "@/stores/useAuthStore";
import type { CharacterDetail } from "@/types/character";

export const StoryDetailPage = () => {
  // ==========================================
  // 로컬 상태
  // ==========================================
  // 삭제 확인 다이얼로그 상태
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // ==========================================
  // 외부 훅
  // ==========================================
  const navigate = useNavigate();
  const location = useLocation();
  const { storyId } = useParams<{ storyId: string }>();
  const { user } = useAuthStore();
  const { startChat } = useStartChat();

  // ==========================================
  // 서버 상태 (React Query)
  // ==========================================
  const { data: story, isLoading, isError } = useStory(storyId || "", !!storyId);
  const { data: charactersData } = useStoryCharacters(storyId || "", !!storyId);
  const { mutate: deleteStory, isPending: isDeleting } = useDeleteStory();

  // ==========================================
  // 계산된 값 (Computed)
  // ==========================================
  const characters = charactersData?.characters || story?.characters || [];
  const isOwner = user && story && story.creator && user.id === story.creator.id;

  // ==========================================
  // 핸들러
  // ==========================================
  // 채팅 시작
  const handleStartChat = (character: CharacterDetail) => {
    if (!story) return;

    void startChat({
      storyId: story.id,
      storyTitle: story.title,
      characterId: character.id,
      characterName: character.name,
      firstMessage: character.firstMessage,
    });
  };

  // 뒤로가기
  const handleBack = () => {
    const from = (location.state as { from?: string } | null)?.from;
    if (from) {
      void navigate(from);
    } else if (story) {
      void navigate(`/${story.category.slug}`);
    } else {
      void navigate(-1);
    }
  };

  // 수정 페이지로 이동
  const handleEdit = () => {
    const from = (location.state as { from?: string } | null)?.from;
    void navigate(`/stories/${storyId}/edit`, {
      state: { from },
    });
  };

  // 삭제 다이얼로그 열기
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  // 삭제 확인
  const handleConfirmDelete = () => {
    if (!storyId) return;

    deleteStory(storyId, {
      onSuccess: () => {
        toast.success(SUCCESS_MESSAGES.STORY_DELETED);
        setDeleteDialogOpen(false);
        const from = (location.state as { from?: string } | null)?.from;
        if (from) {
          void navigate(from);
        } else {
          void navigate(`/${story?.category.slug || ""}`);
        }
      },
      onError: () => {
        toast.error(ERROR_MESSAGES.STORY_DELETE_FAILED);
      },
    });
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError || !story) {
    return (
      <ErrorState
        message="스토리를 찾을 수 없습니다."
        action={
          <Button variant="ghost" onClick={() => void navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> 돌아가기
          </Button>
        }
      />
    );
  }

  return (
    <main>
      <div className="relative mx-auto min-h-screen max-w-7xl overflow-hidden bg-stone-950 shadow-2xl">
        {/* Shared Background */}
        {story.coverImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 blur-sm transition-transform duration-700 hover:scale-105"
            style={{ backgroundImage: `url(${getImageUrl(story.coverImage)})` }}
          />
        ) : (
          <div className={`absolute inset-0 ${story.coverColor} opacity-20`} />
        )}
        {/* Dark Overlay for Readability */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Back Button */}
        <div className="absolute top-4 left-4 z-20">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="rounded-full bg-black/30 text-stone-300 backdrop-blur-sm hover:bg-black/50 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> 돌아가기
          </Button>
        </div>

        {/* Scrollable Content Container */}
        <div className="relative z-10 flex flex-col items-center px-4 pt-20 pb-12">
          {/* Hero Content (Book Cover & Title) */}
          <div className="flex flex-col items-center">
            <div
              className={`relative h-[280px] w-[190px] overflow-hidden rounded-lg shadow-2xl ring-1 ring-white/10 transition-transform duration-500 hover:scale-105 ${!story.coverImage ? story.coverColor : ""}`}
            >
              {story.coverImage && (
                <img
                  src={getImageUrl(story.coverImage) || ""}
                  alt={story.title}
                  className="h-full w-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-white/10" />
            </div>

            <h1 className="mt-8 text-center text-4xl font-bold text-white drop-shadow-2xl md:text-5xl">
              {story.title}
            </h1>
            {story.seriesTitle && (
              <p className="mt-2 text-center text-lg text-stone-400 italic drop-shadow-md">
                {story.seriesTitle}
              </p>
            )}
            <p className="mt-3 font-medium text-emerald-400 drop-shadow-md">{story.authorName}</p>
          </div>

          {/* Body Content */}
          <div className="w-full max-w-3xl">
            {/* 관리 버튼 (Owner Only) */}
            {isOwner && (
              <div className="mt-8 flex justify-end gap-2 border-b border-white/10 pb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  className="text-stone-300 hover:bg-white/10 hover:text-yellow-400"
                >
                  <Pencil className="mr-1 h-4 w-4" />
                  수정
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeleteClick}
                  disabled={isDeleting}
                  className="text-stone-300 hover:bg-white/10 hover:text-red-400"
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  삭제
                </Button>
              </div>
            )}

            {/* 작품 설명 박스 */}
            <div className="mt-8 rounded-xl bg-black/40 p-8 text-center backdrop-blur-sm">
              <BookOpen className="mx-auto h-8 w-8 text-stone-400" />
              <p className="mt-4 whitespace-pre-line text-stone-300">
                {story.description || "작품 설명이 준비되어 있지 않습니다."}
              </p>
            </div>

            {/* 등장인물 선택 */}
            <div className="mt-12">
              <h2 className="border-l-4 border-emerald-500 pl-3 text-lg font-bold text-white">
                등장인물 선택
              </h2>

              {characters.length === 0 ? (
                <p className="mt-6 text-center text-stone-400">등록된 캐릭터가 없습니다.</p>
              ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {characters.map((char) => (
                    <div
                      key={char.id}
                      onClick={() => void navigate(`/characters/${char.id}`)}
                      className="group relative h-32 w-full cursor-pointer overflow-hidden rounded-xl bg-stone-900 transition-all hover:ring-2 hover:ring-emerald-500"
                    >
                      {/* Background Image */}
                      {char.backgroundImage ? (
                        <>
                          <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                            style={{
                              backgroundImage: `url(${getImageUrl(char.backgroundImage)})`,
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/60 to-transparent" />
                        </>
                      ) : (
                        <div className={`absolute inset-0 ${char.imageColor || "bg-stone-800"}`} />
                      )}

                      {/* Content */}
                      <div className="absolute inset-0 flex items-center p-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16 shrink-0 border-2 border-stone-800/50">
                            {char.profileImage && (
                              <AvatarImage
                                src={getImageUrl(char.profileImage) || ""}
                                alt={char.name}
                                className="object-cover"
                              />
                            )}
                            <AvatarFallback
                              className={`${char.imageColor || "bg-stone-400"} text-xl font-bold text-white`}
                            >
                              {char.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-white drop-shadow-md">
                                {char.name}
                              </span>
                              <span className="rounded border border-stone-700 bg-stone-800/80 px-2 py-0.5 text-xs text-stone-300 backdrop-blur-sm">
                                {char.role}
                              </span>
                            </div>
                            <p className="mt-1 line-clamp-2 text-sm text-stone-300 drop-shadow-sm">
                              {char.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Hover Action Button */}
                      <div className="absolute top-1/2 right-4 z-20 -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <Button
                          size="sm"
                          className="h-8 bg-emerald-500 text-white hover:bg-emerald-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartChat(char);
                          }}
                        >
                          <MessageCircle className="mr-1 h-3 w-3" />
                          대화하기
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
            <AlertDialogAction onClick={handleConfirmDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              삭제
            </AlertDialogAction>
            <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
};
