import { useNavigate, useParams } from "react-router-dom";

import { ArrowLeft, BookOpen, MessageCircle } from "lucide-react";

import { ErrorState, LoadingState } from "@/components/common";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useStartChat } from "@/hooks/useStartChat";
import { getImageUrl } from "@/lib/image";
import { getParticle } from "@/lib/utils";
import { useCharacter } from "@/queries/useCharactersQueries";

export const CharacterDetailPage = () => {
  // ==========================================
  // 외부 훅
  // ==========================================
  const navigate = useNavigate();
  const { characterId } = useParams<{ characterId: string }>();
  const { startChat } = useStartChat();

  // ==========================================
  // 서버 상태 (React Query)
  // ==========================================
  const { data: character, isLoading, isError } = useCharacter(characterId || "");

  // ==========================================
  // 핸들러
  // ==========================================
  // 채팅 시작
  const handleStartChat = () => {
    if (!character) return;

    void startChat({
      storyId: character.story.id,
      storyTitle: character.story.title,
      characterId: character.id,
      characterName: character.name,
      firstMessage: character.firstMessage,
    });
  };

  // 스토리 상세 페이지로 이동
  const handleGoToStory = () => {
    if (!character) return;
    void navigate(`/stories/${character.story.id}`);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError || !character) {
    return (
      <ErrorState
        message="캐릭터를 찾을 수 없습니다."
        action={
          <Button variant="ghost" onClick={() => void navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> 돌아가기
          </Button>
        }
      />
    );
  }

  return (
    <main className="pb-20">
      {/* 배경 이미지 영역 */}
      <div
        className={`relative mx-auto mt-6 h-48 max-w-7xl overflow-hidden rounded-2xl ${!character.backgroundImage ? character.backgroundColor || "bg-stone-900" : ""}`}
        style={
          character.backgroundImage
            ? {
                backgroundImage: `url(${getImageUrl(character.backgroundImage)})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-950" />
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => void navigate(-1)}
          className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full bg-black/30 px-3 py-2 text-stone-300 transition-colors hover:bg-black/50 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>뒤로가기</span>
        </button>
      </div>

      <section className="mx-auto max-w-3xl px-4">
        {/* 캐릭터 프로필 */}
        <div className="-mt-16 flex flex-col items-center text-center">
          {/* 아바타 */}
          <Avatar className="h-[12rem] w-[12rem] ring-4 ring-stone-950">
            {character.profileImage && (
              <AvatarImage src={getImageUrl(character.profileImage) || ""} alt={character.name} />
            )}
            <AvatarFallback
              className={`${character.imageColor || "bg-stone-400"} text-5xl font-bold text-white`}
            >
              {character.name[0]}
            </AvatarFallback>
          </Avatar>

          {/* 이름 & 역할 */}
          <h1 className="mt-6 font-serif text-4xl font-bold text-white">{character.name}</h1>
          <span className="mt-2 inline-block rounded-full bg-stone-700 px-4 py-1 text-sm text-stone-300">
            {character.role}
          </span>
        </div>

        {/* 설명 */}
        <div className="mt-8 rounded-xl bg-stone-900 p-8 text-center">
          <p className="whitespace-pre-line text-stone-400">{character.description}</p>
        </div>

        {/* 성격 (있는 경우) */}
        {character.personality && (
          <div className="mt-6 rounded-xl bg-stone-900 p-6">
            <h2 className="mb-3 text-sm font-medium text-stone-500">성격</h2>
            <p className="whitespace-pre-line text-stone-300">{character.personality}</p>
          </div>
        )}

        {/* 첫 인사말 (있는 경우) */}
        {character.firstMessage && (
          <div className="mt-6 rounded-xl bg-stone-900 p-6">
            <h2 className="mb-3 text-sm font-medium text-stone-500">첫 인사말</h2>
            <p className="whitespace-pre-line text-stone-300 italic">"{character.firstMessage}"</p>
          </div>
        )}

        {/* 소속 스토리 */}
        <div className="mt-8">
          <h2 className="mb-4 border-l-4 border-emerald-500 pl-3 text-lg font-bold text-white">
            소속 스토리
          </h2>
          <div
            onClick={handleGoToStory}
            className="cursor-pointer rounded-xl bg-stone-900 p-4 transition-all hover:ring-2 hover:ring-emerald-500"
          >
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-stone-800">
                {character.story.coverImage ? (
                  <img
                    src={getImageUrl(character.story.coverImage) || ""}
                    alt={character.story.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className={`flex h-full w-full items-center justify-center ${character.story.coverColor || "bg-stone-700"}`}
                  >
                    <BookOpen className="h-6 w-6 text-white/60" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-white">{character.story.title}</h3>
                {character.story.seriesTitle && (
                  <p className="text-sm text-stone-400 italic">{character.story.seriesTitle}</p>
                )}
                <p className="text-sm text-stone-400">{character.story.authorName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 대화 시작 버튼 */}
        <div className="mt-12 pb-12">
          <Button
            size="lg"
            className="w-full bg-emerald-500 text-lg font-medium text-black hover:bg-emerald-400"
            onClick={handleStartChat}
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            {character.name}
            {getParticle(character.name)} 대화 시작하기
          </Button>
        </div>
      </section>
    </main>
  );
};
