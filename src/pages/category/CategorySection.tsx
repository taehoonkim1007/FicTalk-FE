import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { EmptyState, LoadingState, SectionHeader } from "@/components/common";
import { StoryCard } from "@/components/story";
import { useStories } from "@/queries/useStoriesQueries";
import type { Category } from "@/types/category";
import type { Story } from "@/types/story";

interface CategorySectionProps {
  category: Category;
}

export const CategorySection = memo(({ category }: CategorySectionProps) => {
  // ==========================================
  // 외부 훅
  // ==========================================
  const navigate = useNavigate();

  // ==========================================
  // 서버 상태 (React Query)
  // ==========================================
  const { data, isLoading } = useStories({ category: category.slug, limit: 4 });

  // ==========================================
  // 핸들러
  // ==========================================
  // 스토리 선택
  const handleStorySelect = useCallback(
    (story: Story) => {
      void navigate(`/stories/${story.id}`);
    },
    [navigate],
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <SectionHeader
        title={category.title}
        emoji={category.emoji}
        actionLabel="전체보기"
        onAction={() => void navigate(`/${category.slug}`)}
      />

      {isLoading ? (
        <LoadingState className="min-h-[12rem]" />
      ) : !data?.stories.length ? (
        <EmptyState title="등록된 스토리가 없습니다" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {data.stories.map((story) => (
            <StoryCard key={story.id} story={story} onClick={() => handleStorySelect(story)} />
          ))}
        </div>
      )}
    </section>
  );
});

CategorySection.displayName = "CategorySection";
