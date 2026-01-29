import { useNavigate, useSearchParams } from "react-router-dom";

import { Search } from "lucide-react";

import { CharacterCard } from "@/components/character";
import { EmptyState, ErrorState, LoadingState } from "@/components/common";
import { StoryCard } from "@/components/story";
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
      <EmptyState
        icon={<Search className="h-12 w-12 text-stone-600" />}
        title="검색어를 입력해주세요."
        className="min-h-[50vh]"
      />
    );
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (storiesError || charactersError) {
    return <ErrorState message="검색 중 오류가 발생했습니다." />;
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
          <EmptyState
            icon={<Search className="h-12 w-12 text-stone-600" />}
            title="검색 결과가 없습니다."
          />
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
                    <StoryCard
                      key={story.id}
                      story={story}
                      onClick={() => handleStorySelect(story)}
                    />
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
                    <CharacterCard
                      key={character.id}
                      character={character}
                      onClick={() => handleCharacterSelect(character)}
                    />
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
