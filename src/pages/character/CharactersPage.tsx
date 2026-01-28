import { useNavigate, useParams } from "react-router-dom";

import { ChevronRight, Loader2, Plus } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCategoryMeta } from "@/hooks/useCategoryMeta";
import { getImageUrl } from "@/lib/image";
import { useCharacters } from "@/queries/useCharactersQueries";
import type { CharacterWithStory } from "@/types/story";

export const CharactersPage = () => {
  const navigate = useNavigate();
  const { categorySlug } = useParams<{ categorySlug: string }>();

  const { data, isLoading, isError } = useCharacters({
    category: categorySlug,
  });

  const { Icon, title, description, colorClass } = useCategoryMeta(categorySlug);

  const handleCharacterSelect = (character: CharacterWithStory) => {
    void navigate(`/characters/${character.id}`);
  };

  if (isLoading) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-[50vh] flex-col items-center justify-center">
        <p className="text-red-400">캐릭터를 불러오는 중 오류가 발생했습니다.</p>
      </main>
    );
  }

  return (
    <main className="pb-20">
      <section className="mx-auto max-w-7xl px-4 py-8">
        {/* 카테고리 헤더 */}
        <div className="mb-8 flex flex-col items-start gap-4 border-b border-stone-800 pb-8 md:items-center md:text-center">
          <div className={`rounded-full bg-stone-900 p-3 ring-1 ring-white/10 ${colorClass}`}>
            <Icon className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white md:text-4xl">{title}</h1>
            <p className="text-stone-400 md:text-lg">{description}</p>
          </div>
          {categorySlug === "creative" && (
            <Button
              onClick={() =>
                void navigate("/stories/new", {
                  state: { from: `/${categorySlug}` },
                })
              }
              className="bg-emerald-500 text-black hover:bg-emerald-400"
            >
              <Plus className="mr-1 h-4 w-4" />
              게시글 추가
            </Button>
          )}
        </div>

        {/* 탭 네비게이션 */}
        <div className="mb-8 flex gap-2">
          <Button
            variant="ghost"
            onClick={() => void navigate(`/${categorySlug}`)}
            className="text-stone-400 hover:text-white"
          >
            스토리
          </Button>
          <Button variant="secondary" className="bg-emerald-600 text-white hover:bg-emerald-500">
            캐릭터
          </Button>
        </div>

        {/* 캐릭터 그리드 */}
        {!data?.characters.length ? (
          <div className="flex h-48 items-center justify-center">
            <p className="text-stone-500">등록된 캐릭터가 없습니다</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
            {data.characters.map((character) => (
              <div
                key={character.id}
                className="group relative h-40 w-full cursor-pointer overflow-hidden rounded-xl bg-stone-900 transition-all hover:ring-2 hover:ring-emerald-500"
                onClick={() => handleCharacterSelect(character)}
              >
                {/* 1. 배경 이미지 */}
                {character.backgroundImage ? (
                  <>
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${getImageUrl(character.backgroundImage)})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/60 to-transparent" />
                  </>
                ) : (
                  <div
                    className={`absolute inset-0 ${character.backgroundColor || "bg-stone-800"}`}
                  />
                )}

                {/* 2. 컨텐츠 */}
                <div className="absolute inset-0 flex flex-col justify-between p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16 shrink-0 border-2 border-stone-800/50">
                      {character.profileImage && (
                        <AvatarImage
                          src={getImageUrl(character.profileImage) || ""}
                          alt={character.name}
                          className="object-cover"
                        />
                      )}
                      <AvatarFallback
                        className={`${character.imageColor || "bg-stone-400"} text-xl font-bold text-white`}
                      >
                        {character.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-white drop-shadow-md">
                          {character.name}
                        </span>
                        <span className="rounded border border-stone-700 bg-stone-800/80 px-2 py-0.5 text-xs text-stone-300 backdrop-blur-sm">
                          {character.role}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-stone-300 drop-shadow-sm">
                        {character.description}
                      </p>
                    </div>
                  </div>

                  {/* 하단 정보 (스토리 제목 등) */}
                  <div className="flex items-center justify-between border-t border-white/10 pt-2 text-xs text-stone-400">
                    <Badge
                      variant={
                        (categorySlug as "world-lit" | "korean-lit" | "creative") || "secondary"
                      }
                      className="truncate text-white backdrop-blur-md"
                    >
                      {character.story.title}
                    </Badge>
                    <span className="flex shrink-0 items-center gap-1 font-medium transition-colors group-hover:text-emerald-500">
                      상세보기 <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 페이지네이션 */}
        {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`rounded px-3 py-1 text-sm ${
                  page === data.pagination.page
                    ? "bg-emerald-500 text-black"
                    : "bg-stone-800 text-stone-400 hover:bg-stone-700"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};
