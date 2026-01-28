import { useState } from "react";

import { HeroCarousel } from "@/components/home/HeroCarousel";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/queries/useCategoriesQueries";
import { useHeroSlides } from "@/queries/useStoriesQueries";

import { CategoryCharacterSection } from "./category/CategoryCharacterSection";
import { CategorySection } from "./category/CategorySection";

export const HomePage = () => {
  const { data: heroSlides = [], isLoading: isHeroLoading } = useHeroSlides();
  const { data: categories = [] } = useCategories();

  const [activeTab, setActiveTab] = useState<"stories" | "characters">("stories");

  return (
    <main className="pb-20">
      {/* Hero Carousel */}
      <section className="mx-auto mt-6 max-w-7xl px-4">
        <HeroCarousel slides={heroSlides} isLoading={isHeroLoading} />
      </section>

      {/* 탭 네비게이션 */}
      <div className="mx-auto mt-4 max-w-7xl px-4">
        <div className="flex gap-2">
          <Button
            variant={activeTab === "stories" ? "secondary" : "ghost"}
            onClick={() => setActiveTab("stories")}
            className={
              activeTab === "stories"
                ? "bg-emerald-600 text-white hover:bg-emerald-500"
                : "text-stone-400 hover:text-white"
            }
          >
            스토리
          </Button>
          <Button
            variant={activeTab === "characters" ? "secondary" : "ghost"}
            onClick={() => setActiveTab("characters")}
            className={
              activeTab === "characters"
                ? "bg-emerald-600 text-white hover:bg-emerald-500"
                : "text-stone-400 hover:text-white"
            }
          >
            캐릭터
          </Button>
        </div>
      </div>

      {/* Category Sections - 동적 렌더링 */}
      {activeTab === "stories"
        ? categories.map((category) => <CategorySection key={category.slug} category={category} />)
        : categories.map((category) => (
            <CategoryCharacterSection key={category.slug} category={category} />
          ))}
    </main>
  );
};
