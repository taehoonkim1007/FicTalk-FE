import { ChevronLeft, ChevronRight, Loader2, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useHeroCarousel } from "@/hooks/useHeroCarousel";
import { getImageUrl } from "@/lib/image";
import { getParticle } from "@/lib/utils";
import type { HeroSlide } from "@/types/story";

interface HeroCarouselProps {
  slides: HeroSlide[];
  isLoading: boolean;
}

export const HeroCarousel = ({ slides, isLoading }: HeroCarouselProps) => {
  const { slideState, computed, handlers, refs } = useHeroCarousel(slides);
  const { currentIndex, isAnimating, isMobile, containerWidth, realIndex } = slideState;
  const { allSlides, getSlideStyle, getTranslateX } = computed;
  const {
    scrollNext,
    scrollPrev,
    scrollTo,
    handleSlideClick,
    handleTransitionEnd,
    startAutoplay,
    stopAutoplay,
    handleStartChat,
  } = handlers;
  const { containerRef } = refs;

  return (
    <div
      className="group/carousel relative py-8"
      onMouseEnter={stopAutoplay}
      onMouseLeave={startAutoplay}
    >
      {isLoading ? (
        <div className="flex h-[600px] items-center justify-center md:h-[720px]">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      ) : slides.length === 0 ? (
        <div className="flex h-[600px] items-center justify-center md:h-[720px]">
          <p className="text-stone-500">표시할 슬라이드가 없습니다</p>
        </div>
      ) : (
        <>
          {/* Custom Carousel with Clone & Teleport */}
          <div ref={containerRef} className="overflow-hidden">
            <div
              className={`flex ${isAnimating ? "transition-transform duration-500 ease-out" : ""}`}
              style={{
                transform: `translateX(${getTranslateX(currentIndex)}px)`,
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {allSlides.map((slide, index) => (
                <div
                  key={`${slide.story.id}-${slide.character.id}-${index}`}
                  className={`flex-shrink-0 cursor-pointer px-2 ${isMobile ? "" : "w-[396px]"}`}
                  style={{
                    ...(isMobile && { width: `${containerWidth}px` }),
                    ...getSlideStyle(index),
                    transition: isAnimating
                      ? "transform 0.5s ease-out, opacity 0.5s ease-out"
                      : "none",
                  }}
                  onClick={() => handleSlideClick(index)}
                >
                  <div className="group relative aspect-[2/3] overflow-hidden rounded-3xl bg-stone-900 shadow-2xl">
                    {/* Cover Image */}
                    {slide.slide.image || slide.story.coverImage ? (
                      <img
                        src={
                          getImageUrl(slide.slide.image) ||
                          getImageUrl(slide.story.coverImage) ||
                          ""
                        }
                        alt={slide.story.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className={`absolute inset-0 ${slide.story.coverColor}`} />
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                    {/* Text Content */}
                    <div className="absolute inset-x-0 bottom-0 space-y-4 p-6 md:p-8">
                      {/* Marketing Title & Description */}
                      <div>
                        <h3 className="line-clamp-3 text-2xl leading-tight font-bold text-white drop-shadow-lg md:text-3xl">
                          {slide.slide.marketingTitle}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm text-stone-300 drop-shadow-md md:text-base">
                          {slide.slide.description}
                        </p>
                      </div>

                      {/* CTA Button */}
                      <Button
                        size="lg"
                        className="w-full rounded-full bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-400"
                        onClick={(e) => handleStartChat(slide, e)}
                      >
                        <MessageCircle className="mr-2 h-5 w-5" />
                        {slide.character.name}
                        {getParticle(slide.character.name)} 대화하기
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="mt-6 flex justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === realIndex ? "w-4 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                }`}
                onClick={() => scrollTo(index)}
                aria-label={`슬라이드 ${index + 1}로 이동`}
              />
            ))}
          </div>

          {/* Custom Navigation Buttons */}
          <button
            className="absolute top-1/2 left-2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white opacity-0 transition-all group-hover/carousel:opacity-100 hover:bg-black/70 md:left-4"
            aria-label="이전 슬라이드"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
          </button>
          <button
            className="absolute top-1/2 right-2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white opacity-0 transition-all group-hover/carousel:opacity-100 hover:bg-black/70 md:right-4"
            aria-label="다음 슬라이드"
            onClick={scrollNext}
          >
            <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
          </button>
        </>
      )}
    </div>
  );
};
