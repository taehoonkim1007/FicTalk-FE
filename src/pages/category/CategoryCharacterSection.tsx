import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { CharacterCard } from "@/components/character";
import { EmptyState, LoadingState, SectionHeader } from "@/components/common";
import { useCharacters } from "@/queries/useCharactersQueries";
import type { Category } from "@/types/category";
import type { CharacterWithStory } from "@/types/character";

interface CategoryCharacterSectionProps {
  category: Category;
}

export const CategoryCharacterSection = memo(({ category }: CategoryCharacterSectionProps) => {
  const navigate = useNavigate();
  const { data, isLoading } = useCharacters({ category: category.slug, limit: 4 });

  // rerender-functional-setstate: useCallback for stable reference
  const handleCharacterSelect = useCallback(
    (character: CharacterWithStory) => {
      void navigate(`/characters/${character.id}`);
    },
    [navigate],
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <SectionHeader
        title={category.title}
        emoji={category.emoji}
        actionLabel="전체보기"
        onAction={() => void navigate(`/${category.slug}/characters`)}
      />

      {isLoading ? (
        <LoadingState className="min-h-[12rem]" />
      ) : !data?.characters.length ? (
        <EmptyState title="등록된 캐릭터가 없습니다" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {data.characters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              categorySlug={category.slug as "world-lit" | "korean-lit" | "creative"}
              onClick={() => handleCharacterSelect(character)}
            />
          ))}
        </div>
      )}
    </section>
  );
});

CategoryCharacterSection.displayName = "CategoryCharacterSection";
