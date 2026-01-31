import { ChevronRight } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/image";
import { cn } from "@/lib/utils";
import type { CharacterWithStory } from "@/types/story";

interface CharacterCardProps {
  character: CharacterWithStory;
  categorySlug?: "world-lit" | "korean-lit" | "creative";
  onClick?: () => void;
  className?: string;
}

export const CharacterCard = ({
  character,
  categorySlug,
  onClick,
  className,
}: CharacterCardProps) => (
  <div
    onClick={onClick}
    className={cn(
      "group relative h-42 w-full cursor-pointer overflow-hidden rounded-xl bg-stone-900",
      "transition-all hover:ring-2 hover:ring-emerald-500",
      className,
    )}
  >
    {/* 배경 이미지 */}
    {character.backgroundImage ? (
      <>
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${getImageUrl(character.backgroundImage)})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/60 to-transparent" />
      </>
    ) : (
      <div className={`absolute inset-0 ${character.backgroundColor || "bg-stone-800"}`} />
    )}

    {/* 컨텐츠 */}
    <div className="absolute inset-0 flex flex-col justify-between p-4">
      <div className="flex items-start gap-4">
        <Avatar className="h-20 w-20 shrink-0 border-2 border-stone-800/50">
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
          <div>
            <p className="text-lg font-bold text-white drop-shadow-md">{character.name}</p>
            <span className="mt-1 inline-block rounded border border-stone-700 bg-stone-800/80 px-2 py-0.5 text-xs text-stone-300 backdrop-blur-sm">
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
          variant={categorySlug || "secondary"}
          className="truncate text-white backdrop-blur-md"
        >
          {character.story.seriesTitle
            ? `${character.story.title} - ${character.story.seriesTitle}`
            : character.story.title}
        </Badge>
        <span className="flex shrink-0 items-center gap-1 font-medium transition-colors group-hover:text-emerald-500">
          상세보기 <ChevronRight className="h-3 w-3" />
        </span>
      </div>
    </div>
  </div>
);
