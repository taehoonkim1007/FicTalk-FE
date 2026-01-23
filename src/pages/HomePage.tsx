import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HERO_SLIDES, RECOMMENDED_STORIES } from "@/mocks";
import type { Story } from "@/types";

const getParticle = (name: string) => {
  if (!name) return "와";
  const lastChar = name.charCodeAt(name.length - 1);
  const isHangul = lastChar >= 0xac00 && lastChar <= 0xd7a3;
  if (!isHangul) return "와";
  return (lastChar - 0xac00) % 28 > 0 ? "과" : "와";
};

export const HomePage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 타이머 리셋 함수
  const resetInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
  }, []);

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
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    resetInterval();
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    resetInterval();
  };

  const handleStorySelect = (story: Story) => {
    // TODO: Navigate to story detail page
    console.log("Selected story:", story.title);
    void navigate(`/story/${story.id}`);
  };

  const handleStartChat = (context: { title: string; character: string; firstMessage: string }) => {
    // TODO: Navigate to chat page
    console.log("Starting chat with:", context.character);
    void navigate("/chat", { state: context });
  };

  return (
    <main className="pb-20">
      {/* Hero Slider */}
      <section className="group relative h-[400px] w-full overflow-hidden md:h-[480px]">
        <div className="relative h-full w-full">
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
                index === currentSlide ? "z-10 opacity-100" : "z-0 opacity-0"
              } ${slide.image}`}
            >
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative z-10 mx-auto max-w-4xl space-y-4 px-6 text-center">
                <Badge className="animate-in fade-in zoom-in mb-2 bg-emerald-500 text-black duration-500">
                  {slide.tag}
                </Badge>
                <h1 className="animate-in slide-in-from-bottom-4 text-4xl leading-tight font-extrabold text-white drop-shadow-2xl duration-700 md:text-6xl">
                  {slide.title}
                </h1>
                <p className="animate-in slide-in-from-bottom-6 text-lg whitespace-pre-line text-stone-200 duration-1000 md:text-xl">
                  {slide.desc}
                </p>
                <div className="animate-in slide-in-from-bottom-8 pt-6 duration-1000">
                  <Button
                    size="lg"
                    className="rounded-full bg-emerald-500 px-8 text-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-400"
                    onClick={() =>
                      handleStartChat({
                        title: slide.storyTitle,
                        character: slide.character,
                        firstMessage: slide.firstMessage,
                      })
                    }
                  >
                    <PlayCircle className="mr-2 h-5 w-5" /> {slide.character}
                    {getParticle(slide.character)} 대화 시작하기
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slider Controls */}
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
          {HERO_SLIDES.map((_, i) => (
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
      </section>

      {/* Story Recommendations Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold text-white md:text-2xl">
            🔥 지금 가장 핫한 스토리
          </h2>
          <Button variant="link" size="sm" className="text-stone-400">
            전체보기 <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {RECOMMENDED_STORIES.map((story) => (
            <div
              key={story.id}
              className="group cursor-pointer overflow-hidden rounded-xl bg-stone-900 transition-all hover:ring-2 hover:ring-emerald-500"
              onClick={() => handleStorySelect(story)}
            >
              <div className={`relative h-40 overflow-hidden md:h-48 ${story.color}`}>
                {/* Thumbnail Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-40" />
                <div className="absolute right-3 bottom-3 left-3">
                  <h3 className="truncate text-lg leading-tight font-bold text-white">
                    {story.title}
                  </h3>
                  <p className="mt-1 truncate text-xs text-stone-300">{story.author}</p>
                </div>
              </div>
              <div className="space-y-3 p-4">
                <div className="flex flex-wrap gap-1.5">
                  {story.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-stone-700 bg-stone-800 px-1.5 py-0.5 text-[10px] text-stone-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-end border-t border-stone-800 pt-2 text-xs text-stone-500">
                  <span className="flex items-center gap-1 font-medium transition-colors hover:text-emerald-500">
                    상세보기 <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};
