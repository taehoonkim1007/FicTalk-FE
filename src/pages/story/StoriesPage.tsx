import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Loader2, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { useCategoryMeta } from "@/hooks/useCategoryMeta";
import { getImageUrl } from "@/lib/image";
import { useStories } from "@/queries/useStoriesQueries";
import type { Story } from "@/types/story";

export const StoriesPage = () => {
  const navigate = useNavigate();
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useStories({
    category: categorySlug,
    page,
    limit: 12,
  });

  const { Icon, title, description, colorClass } = useCategoryMeta(categorySlug);

  const handleStorySelect = (story: Story) => {
    void navigate(`/stories/${story.id}`, {
      state: { from: `/${categorySlug}` },
    });
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
        <p className="text-red-400">스토리를 불러오는 중 오류가 발생했습니다.</p>
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
          <Button variant="secondary" className="bg-emerald-600 text-white hover:bg-emerald-500">
            스토리
          </Button>
          <Button
            variant="ghost"
            onClick={() => void navigate(`/${categorySlug}/characters`)}
            className="text-stone-400 hover:text-white"
          >
            캐릭터
          </Button>
        </div>

        {!data?.stories.length ? (
          <div className="flex h-48 items-center justify-center">
            <p className="text-stone-500">등록된 스토리가 없습니다</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
            {data.stories.map((story) => (
              <div
                key={story.id}
                className="group relative h-64 w-full cursor-pointer overflow-hidden rounded-xl bg-stone-900 transition-all hover:ring-2 hover:ring-emerald-500"
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
                      {story.seriesTitle && (
                        <p className="text-sm text-stone-400 italic drop-shadow-md">
                          {story.seriesTitle}
                        </p>
                      )}
                      <p className="font-medium text-stone-300 drop-shadow-md">
                        {story.authorName}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 line-clamp-2 text-sm text-stone-400">{story.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={data.pagination.page}
              totalPages={data.pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </section>
    </main>
  );
};
