import { useNavigate, useParams } from "react-router-dom";

import { ArrowLeft, BookOpen, Loader2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/messages";
import { useDeleteStory, useStory, useStoryCharacters } from "@/queries/useStoriesQueries";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Character } from "@/types/story";

export const StoryDetailPage = () => {
  const navigate = useNavigate();
  const { storyId } = useParams<{ storyId: string }>();

  const { user } = useAuthStore();
  const { data: story, isLoading, isError } = useStory(storyId || "", !!storyId);
  const { data: charactersData } = useStoryCharacters(storyId || "", !!storyId);
  const { mutate: deleteStory, isPending: isDeleting } = useDeleteStory();

  const characters = charactersData?.characters || story?.characters || [];
  const isOwner = user && story && story.creator && user.id === story.creator.id;

  const handleStartChat = (character: Character) => {
    void navigate("/chat", {
      state: {
        storyId: story?.id,
        storyTitle: story?.title,
        characterId: character.id,
        characterName: character.name,
      },
    });
  };

  const handleEdit = () => {
    void navigate(`/stories/${storyId}/edit`);
  };

  const handleDelete = () => {
    if (!storyId) return;
    if (!window.confirm("정말로 이 스토리를 삭제하시겠습니까?")) return;

    deleteStory(storyId, {
      onSuccess: () => {
        toast.success(SUCCESS_MESSAGES.STORY_DELETED);
        void navigate("/creative");
      },
      onError: () => {
        toast.error(ERROR_MESSAGES.STORY_DELETE_FAILED);
      },
    });
  };

  if (isLoading) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </main>
    );
  }

  if (isError || !story) {
    return (
      <main className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-red-400">스토리를 찾을 수 없습니다.</p>
        <Button variant="ghost" onClick={() => void navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> 돌아가기
        </Button>
      </main>
    );
  }

  return (
    <main className="pb-20">
      <section className="mx-auto max-w-3xl px-4 py-12">
        {/* 책 커버 카드 */}
        <div className="flex justify-center">
          <div className={`h-[220px] w-[160px] rounded-xl ${story.coverColor}`} />
        </div>

        {/* 제목 & 작가명 */}
        <div className="mt-6 text-center">
          <h1 className="font-serif text-4xl font-bold text-white">{story.title}</h1>
          <p className="mt-2 text-emerald-500">{story.authorName}</p>
          {isOwner && (
            <div className="mt-4 flex justify-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="text-stone-400 hover:text-yellow-400"
              >
                <Pencil className="mr-1 h-4 w-4" />
                수정
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-stone-400 hover:text-red-400"
              >
                <Trash2 className="mr-1 h-4 w-4" />
                삭제
              </Button>
            </div>
          )}
        </div>

        {/* 작품 설명 박스 */}
        <div className="mt-8 rounded-xl bg-stone-900 p-8 text-center">
          <BookOpen className="mx-auto h-8 w-8 text-stone-500" />
          <p className="mt-4 whitespace-pre-line text-stone-400">
            {story.summary || "작품 설명이 준비되어 있지 않습니다."}
          </p>
        </div>

        {/* 등장인물 선택 */}
        <div className="mt-12">
          <h2 className="border-l-4 border-emerald-500 pl-3 text-lg font-bold text-white">
            등장인물 선택
          </h2>

          {characters.length === 0 ? (
            <p className="mt-6 text-center text-stone-500">등록된 캐릭터가 없습니다.</p>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {characters.map((char) => (
                <div
                  key={char.id}
                  onClick={() => handleStartChat(char)}
                  className="cursor-pointer rounded-xl bg-stone-900 p-4 transition-all hover:ring-2 hover:ring-emerald-500"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${char.imageColor}`}
                    >
                      <span className="text-lg font-bold text-white">{char.name[0]}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{char.name}</span>
                        <span className="rounded bg-stone-700 px-2 py-0.5 text-xs text-stone-300">
                          {char.role}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-stone-500">{char.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
