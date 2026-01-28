import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ChevronLeft, ChevronRight, Loader2, PlayCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/image";
import { getParticle } from "@/lib/utils";
import { useCategories } from "@/queries/useCategoriesQueries";
import { useHeroSlides } from "@/queries/useStoriesQueries";
import type { HeroSlide } from "@/types/story";

import { CategoryCharacterSection } from "./category/CategoryCharacterSection";
import { CategorySection } from "./category/CategorySection";

export const HomePage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<"stories" | "characters">("stories");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // API 호출
  const { data: heroSlides = [], isLoading: isHeroLoading } = useHeroSlides();
  const { data: categories = [] } = useCategories();

  // 타이머 리셋 함수
  const resetInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (heroSlides.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 5000);
    }
  }, [heroSlides.length]);

  // 자동 재생 시작 및 cleanup
  useEffect(() => {
    resetInterval();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [resetInterval]);

  // 슬라이드 선택 시 타이머 리셋
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    resetInterval();
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    resetInterval();
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    resetInterval();
  };

  const handleStartChat = (slide: HeroSlide) => {
    void navigate("/chat", {
      state: {
        storyId: slide.story.id,
        storyTitle: slide.story.title,
        characterId: slide.character.id,
        characterName: slide.character.name,
        firstMessage: slide.character.firstMessage,
      },
    });
  };

  return (
    <main className="pb-20">
      {/* Hero Slider */}
      <section className="mx-auto mt-6 max-w-7xl px-4">
        <div className="group relative h-[400px] w-full overflow-hidden rounded-2xl md:h-[480px]">
          {isHeroLoading ? (
            <div className="flex h-full items-center justify-center bg-stone-900">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
          ) : heroSlides.length === 0 ? (
            <div className="flex h-full items-center justify-center bg-stone-900">
              <p className="text-stone-500">표시할 슬라이드가 없습니다</p>
            </div>
          ) : (
            <div className="relative h-full w-full">
              {heroSlides.map((slide, index) => (
                <div
                  key={`${slide.story.id}-${slide.character.id}`}
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
                    index === currentSlide ? "z-10 opacity-100" : "z-0 opacity-0"
                  } ${!slide.slide.image && !slide.story.coverImage ? slide.story.coverColor : ""}`}
                >
                  {(slide.slide.image || slide.story.coverImage) && (
                    <img
                      src={
                        getImageUrl(slide.slide.image) || getImageUrl(slide.story.coverImage) || ""
                      }
                      alt={slide.story.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="relative z-10 mx-auto max-w-4xl space-y-4 px-6 text-center">
                    <h1 className="animate-in slide-in-from-bottom-4 text-4xl leading-tight font-extrabold text-white drop-shadow-2xl duration-700 md:text-5xl">
                      {slide.slide.title}
                    </h1>
                    <p className="animate-in slide-in-from-bottom-6 text-lg whitespace-pre-line text-stone-200 duration-1000 md:text-lg">
                      {slide.slide.description}
                    </p>
                    <div className="animate-in slide-in-from-bottom-8 pt-6 duration-1000">
                      <Button
                        size="lg"
                        className="rounded-full bg-emerald-500 px-8 text-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-400"
                        onClick={() => handleStartChat(slide)}
                      >
                        <PlayCircle className="mr-2 h-5 w-5" /> {slide.character.name}
                        {getParticle(slide.character.name)} 대화 시작하기
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Slider Controls */}
          {heroSlides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute top-1/2 left-4 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/50"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute top-1/2 right-4 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/50"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
              <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-1">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToSlide(i)}
                    className="flex h-6 w-6 cursor-pointer items-center justify-center"
                    aria-label={`슬라이드 ${i + 1}로 이동`}
                  >
                    <span
                      className={`block h-1.5 rounded-full transition-all ${i === currentSlide ? "w-5 bg-white" : "w-1.5 bg-white/40"}`}
                    />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* 탭 네비게이션 */}
      <div className="mx-auto mt-8 max-w-7xl px-4">
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
