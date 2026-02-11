import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Plus } from "lucide-react";

import { EmptyState, ErrorState, LoadingState } from "@/components/common";
import { StoryCard } from "@/components/story";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { useCategoryMeta } from "@/hooks/useCategoryMeta";
import { useStories } from "@/queries/useStoriesQueries";
import { useAuthStore } from "@/stores/useAuthStore";
import { isGuestUser } from "@/types/auth";
import type { Story } from "@/types/story";

export const StoriesPage = () => {
  // ==========================================
  // 로컬 상태
  // ==========================================
  const [page, setPage] = useState(1);

  // ==========================================
  // 외부 훅
  // ==========================================
  const navigate = useNavigate();
  const { categorySlug } = useParams<{ categorySlug: string }>();

  // ==========================================
  // 외부 상태 (Store)
  // ==========================================
  const { user } = useAuthStore();

  // ==========================================
  // 서버 상태 (React Query)
  // ==========================================
  const { data, isLoading, isError } = useStories({
    category: categorySlug,
    page,
    limit: 12,
  });

  // ==========================================
  // 계산된 값 (Computed)
  // ==========================================
  const { Icon, title, description, colorClass } = useCategoryMeta(categorySlug);

  // ==========================================
  // 핸들러
  // ==========================================
  // 스토리 선택
  const handleStorySelect = (story: Story) => {
    void navigate(`/stories/${story.id}`, {
      state: { from: `/${categorySlug}` },
    });
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState message="스토리를 불러오는 중 오류가 발생했습니다." />;
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
          {categorySlug === "creative" && user && !isGuestUser(user) && (
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
          <EmptyState title="등록된 스토리가 없습니다" />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
            {data.stories.map((story) => (
              <StoryCard key={story.id} story={story} onClick={() => handleStorySelect(story)} />
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
