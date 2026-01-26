import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ChevronLeft, ChevronRight, Loader2, PlayCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CATEGORY_CONFIG } from "@/constants/categories";
import { getParticle } from "@/lib/utils";
import { useHeroSlides, useStories } from "@/queries/useStoriesQueries";
import type { HeroSlide, Story } from "@/types/story";

export const HomePage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // API 호출
  const { data: heroSlides = [], isLoading: isHeroLoading } = useHeroSlides();
  const { data: worldLitData, isLoading: isWorldLitLoading } = useStories({
    category: "world-lit",
    limit: 4,
  });
  const { data: koreanLitData, isLoading: isKoreanLitLoading } = useStories({
    category: "korean-lit",
    limit: 4,
  });
  const { data: creativeData, isLoading: isCreativeLoading } = useStories({
    category: "creative",
    limit: 4,
  });

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

  const handleStorySelect = (story: Story) => {
    void navigate(`/stories/${story.id}`);
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

  const sections = [
    {
      title: `${CATEGORY_CONFIG["world-lit"].emoji} ${CATEGORY_CONFIG["world-lit"].title}`,
      slug: "world-lit",
      data: worldLitData,
      isLoading: isWorldLitLoading,
    },
    {
      title: `${CATEGORY_CONFIG["korean-lit"].emoji} ${CATEGORY_CONFIG["korean-lit"].title}`,
      slug: "korean-lit",
      data: koreanLitData,
      isLoading: isKoreanLitLoading,
    },
    {
      title: `${CATEGORY_CONFIG["creative"].emoji} ${CATEGORY_CONFIG["creative"].title}`,
      slug: "creative",
      data: creativeData,
      isLoading: isCreativeLoading,
    },
  ];

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
                  } ${slide.slide.image || slide.story.coverColor}`}
                >
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

      {/* Category Sections */}
      {sections.map((section) => (
        <section key={section.slug} className="mx-auto max-w-7xl px-4 py-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold text-white md:text-2xl">
              {section.title}
            </h2>
            <Button
              variant="link"
              size="sm"
              className="text-stone-400"
              onClick={() => void navigate(`/${section.slug}`)}
            >
              전체보기 <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {section.isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
          ) : !section.data?.stories.length ? (
            <div className="flex h-48 items-center justify-center">
              <p className="text-stone-500">등록된 스토리가 없습니다</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
              {section.data.stories.map((story) => (
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
                      <span className="rounded bg-stone-800 px-2 py-0.5">
                        {story.category.name}
                      </span>
                      <span className="flex items-center gap-1 font-medium transition-colors hover:text-emerald-500">
                        상세보기 <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ))}
    </main>
  );
};
