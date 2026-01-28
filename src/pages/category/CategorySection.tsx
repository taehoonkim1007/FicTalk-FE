import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { ChevronRight, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/image";
import { useStories } from "@/queries/useStoriesQueries";
import type { Category, Story } from "@/types/story";

interface CategorySectionProps {
  category: Category;
}

export const CategorySection = memo(({ category }: CategorySectionProps) => {
  const navigate = useNavigate();
  const { data, isLoading } = useStories({ category: category.slug, limit: 4 });

  // rerender-functional-setstate: useCallback for stable reference
  const handleStorySelect = useCallback(
    (story: Story) => {
      void navigate(`/stories/${story.id}`);
    },
    [navigate],
  );

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
          onClick={() => void navigate(`/${category.slug}`)}
        >
          전체보기 <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      ) : !data?.stories.length ? (
        <div className="flex h-48 items-center justify-center">
          <p className="text-stone-500">등록된 스토리가 없습니다</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {data.stories.map((story) => (
            <div
              key={story.id}
              className="group relative aspect-[2/3] w-full cursor-pointer overflow-hidden rounded-xl bg-stone-900 transition-all hover:ring-2 hover:ring-emerald-500"
              onClick={() => handleStorySelect(story)}
            >
              {/* 배경 이미지 (Zoom 효과) */}
              <div className="absolute inset-0">
                {story.coverImage ? (
                  <div
                    className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${getImageUrl(story.coverImage)})` }}
                  />
                ) : (
                  <div className={`h-full w-full ${story.coverColor}`} />
                )}
                {/* 어두운 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              </div>

              {/* 컨텐츠 */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Badge
                      variant={
                        (category.slug as "world-lit" | "korean-lit" | "creative") || "secondary"
                      }
                      className="mb-2 text-white backdrop-blur-md"
                    >
                      {story.category.name}
                    </Badge>
                    <h3 className="text-2xl leading-tight font-bold text-balance text-white drop-shadow-lg">
                      {story.title}
                    </h3>
                    {story.seriesTitle && (
                      <p className="text-sm text-stone-400 italic drop-shadow-md">
                        {story.seriesTitle}
                      </p>
                    )}
                    <p className="font-medium text-stone-300 drop-shadow-md">{story.authorName}</p>
                  </div>
                </div>

                <p className="mt-3 line-clamp-2 text-sm text-stone-400">{story.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
});

CategorySection.displayName = "CategorySection";
