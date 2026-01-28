import { useNavigate, useSearchParams } from "react-router-dom";

import { ChevronRight, Loader2, Search } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/image";
import { useCharacters } from "@/queries/useCharactersQueries";
import { useStories } from "@/queries/useStoriesQueries";
import type { CharacterWithStory, Story } from "@/types/story";

export const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const {
    data: storiesData,
    isLoading: storiesLoading,
    isError: storiesError,
  } = useStories({ search: query, limit: 12 });

  const {
    data: charactersData,
    isLoading: charactersLoading,
    isError: charactersError,
  } = useCharacters({ search: query, limit: 12 });

  const stories = storiesData?.stories || [];
  const characters = charactersData?.characters || [];
  const isLoading = storiesLoading || charactersLoading;
  const hasNoResults = !isLoading && stories.length === 0 && characters.length === 0;

  const handleStorySelect = (story: Story) => {
    void navigate(`/stories/${story.id}`, {
      state: { from: `/search?q=${encodeURIComponent(query)}` },
    });
  };

  const handleCharacterSelect = (character: CharacterWithStory) => {
    void navigate(`/characters/${character.id}`, {
      state: { from: `/search?q=${encodeURIComponent(query)}` },
    });
  };

  if (!query) {
    return (
      <main className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <Search className="h-12 w-12 text-stone-600" />
        <p className="text-stone-400">검색어를 입력해주세요.</p>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </main>
    );
  }

  if (storiesError || charactersError) {
    return (
      <main className="flex min-h-[50vh] flex-col items-center justify-center">
        <p className="text-red-400">검색 중 오류가 발생했습니다.</p>
      </main>
    );
  }

  return (
    <main className="pb-20">
      <section className="mx-auto max-w-7xl px-4 py-8">
        {/* 검색 헤더 */}
        <div className="mb-8 border-b border-stone-800 pb-8">
          <h1 className="text-2xl font-bold text-white md:text-3xl">
            &quot;{query}&quot; 검색 결과
          </h1>
          <p className="mt-2 text-stone-400">
            스토리 {stories.length}건, 캐릭터 {characters.length}건
          </p>
        </div>

        {hasNoResults ? (
          <div className="flex h-48 flex-col items-center justify-center gap-4">
            <Search className="h-12 w-12 text-stone-600" />
            <p className="text-stone-500">검색 결과가 없습니다.</p>
          </div>
        ) : (
          <>
            {/* 스토리 섹션 */}
            {stories.length > 0 && (
              <div className="mb-12">
                <h2 className="mb-6 border-l-4 border-emerald-500 pl-3 text-lg font-bold text-white">
                  스토리 ({stories.length}건)
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
                  {stories.map((story) => (
                    <div
                      key={story.id}
                      className="group relative aspect-[2/3] w-full cursor-pointer overflow-hidden rounded-xl bg-stone-900 transition-all hover:ring-2 hover:ring-emerald-500"
                      onClick={() => handleStorySelect(story)}
                    >
                      {/* 배경 이미지 */}
                      <div className="absolute inset-0">
                        {story.coverImage ? (
                          <div
                            className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: `url(${getImageUrl(story.coverImage)})` }}
                          />
                        ) : (
                          <div className={`h-full w-full ${story.coverColor}`} />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                      </div>

                      {/* 컨텐츠 */}
                      <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <Badge
                              variant={
                                (story.category.slug as "world-lit" | "korean-lit" | "creative") ||
                                "secondary"
                              }
                              className="mb-2 text-white backdrop-blur-md"
                            >
                              {story.category.name}
                            </Badge>
                            <h3 className="text-2xl leading-tight font-bold text-balance text-white drop-shadow-lg">
                              {story.title}
                            </h3>
                            <p className="font-medium text-stone-300 drop-shadow-md">
                              {story.authorName}
                            </p>
                          </div>
                        </div>
                        <p className="mt-3 line-clamp-2 text-sm text-stone-400">
                          {story.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 캐릭터 섹션 */}
            {characters.length > 0 && (
              <div>
                <h2 className="mb-6 border-l-4 border-emerald-500 pl-3 text-lg font-bold text-white">
                  캐릭터 ({characters.length}건)
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
                  {characters.map((character) => (
                    <div
                      key={character.id}
                      className="group relative h-40 w-full cursor-pointer overflow-hidden rounded-xl bg-stone-900 transition-all hover:ring-2 hover:ring-emerald-500"
                      onClick={() => handleCharacterSelect(character)}
                    >
                      {/* 배경 이미지 */}
                      {character.backgroundImage ? (
                        <>
                          <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                            style={{
                              backgroundImage: `url(${getImageUrl(character.backgroundImage)})`,
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/60 to-transparent" />
                        </>
                      ) : (
                        <div
                          className={`absolute inset-0 ${character.backgroundColor || "bg-stone-800"}`}
                        />
                      )}

                      {/* 컨텐츠 */}
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

                        {/* 하단 정보 */}
                        <div className="flex items-center justify-between border-t border-white/10 pt-2 text-xs text-stone-400">
                          <Badge
                            variant="secondary"
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
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
};
