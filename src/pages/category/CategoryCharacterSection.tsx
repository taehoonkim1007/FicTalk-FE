import { useNavigate } from "react-router-dom";

import { ChevronRight, Loader2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/image";
import { useCharacters } from "@/queries/useCharactersQueries";
import type { Category, CharacterWithStory } from "@/types/story";

interface CategoryCharacterSectionProps {
  category: Category;
}

export const CategoryCharacterSection = ({ category }: CategoryCharacterSectionProps) => {
  const navigate = useNavigate();
  const { data, isLoading } = useCharacters({ category: category.slug, limit: 4 });

  const handleCharacterSelect = (character: CharacterWithStory) => {
    void navigate(`/characters/${character.id}`);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold text-white md:text-2xl">
          {category.emoji} {category.title}
        </h2>
        <Button
          variant="link"
          size="sm"
          className="text-stone-400"
          onClick={() => void navigate(`/${category.slug}/characters`)}
        >
          전체보기 <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      ) : !data?.characters.length ? (
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
                      (category.slug as "world-lit" | "korean-lit" | "creative") || "secondary"
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
    </section>
  );
};
