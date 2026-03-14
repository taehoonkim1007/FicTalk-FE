import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/image";
import { cn } from "@/lib/utils";
import type { Story } from "@/types/story";

interface StoryCardProps {
  story: Story;
  onClick?: () => void;
}

export const StoryCard = ({ story, onClick }: StoryCardProps) => (
  <div
    onClick={onClick}
    className={cn(
      "group relative aspect-[2/3] w-full cursor-pointer overflow-hidden rounded-xl bg-stone-900",
      "transition-all hover:ring-2 hover:ring-emerald-500",
    )}
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
              (story.category.slug as "world-lit" | "korean-lit" | "creative") || "secondary"
            }
            className="mb-2 text-white backdrop-blur-md"
          >
            {story.category.name}
          </Badge>
          <h3 className="text-2xl leading-tight font-bold text-balance text-white drop-shadow-lg">
            {story.title}
          </h3>
          {story.seriesTitle && (
            <p className="text-sm text-stone-400 italic drop-shadow-md">{story.seriesTitle}</p>
          )}
          <p className="font-medium text-stone-300 drop-shadow-md">{story.authorName}</p>
        </div>
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-stone-400">{story.description}</p>
    </div>
  </div>
);
