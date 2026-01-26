import { useNavigate, useParams } from "react-router-dom";

import { ChevronRight, Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCategoryMeta } from "@/hooks/useCategoryMeta";
import { useStories } from "@/queries/useStoriesQueries";
import type { Story } from "@/types/story";

export const StoriesPage = () => {
  const navigate = useNavigate();
  const { categorySlug } = useParams<{ categorySlug: string }>();

  const { data, isLoading, isError } = useStories({
    category: categorySlug,
  });

  const { Icon, title, desc, color } = useCategoryMeta(categorySlug);

  const handleStorySelect = (story: Story) => {
    void navigate(`/stories/${story.id}`);
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
        <div className="mb-12 flex flex-col items-start gap-4 border-b border-stone-800 pb-8 md:items-center md:text-center">
          <div className={`rounded-full bg-stone-900 p-3 ring-1 ring-white/10 ${color}`}>
            <Icon className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white md:text-4xl">{title}</h1>
            <p className="text-stone-400 md:text-lg">{desc}</p>
          </div>
          {categorySlug === "creative" && (
            <Button
              onClick={() => void navigate("/stories/new")}
              className="bg-emerald-500 text-black hover:bg-emerald-400"
            >
              <Plus className="mr-1 h-4 w-4" />
              게시글 추가
            </Button>
          )}
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
                className="group cursor-pointer overflow-hidden rounded-xl bg-stone-900 transition-all hover:ring-2 hover:ring-emerald-500"
                onClick={() => handleStorySelect(story)}
              >
                <div className={`relative h-40 overflow-hidden md:h-48 ${story.coverColor}`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-40" />
                  <div className="absolute right-3 bottom-3 left-3">
                    <h3 className="truncate text-lg leading-tight font-bold text-white">
                      {story.title}
                    </h3>
                    <p className="mt-1 truncate text-xs text-stone-300">{story.authorName}</p>
                  </div>
                </div>
                <div className="space-y-3 p-4">
                  <p className="line-clamp-2 text-sm text-stone-400">{story.description}</p>
                  <div className="flex items-center justify-between border-t border-stone-800 pt-2 text-xs text-stone-500">
                    <span className="rounded bg-stone-800 px-2 py-0.5">{story.category.name}</span>
                    <span className="flex items-center gap-1 font-medium transition-colors hover:text-emerald-500">
                      상세보기 <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
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
