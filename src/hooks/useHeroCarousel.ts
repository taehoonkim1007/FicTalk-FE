import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { HERO_CAROUSEL } from "@/constants/ui";
import type { HeroSlide } from "@/types/hero-slide";

export const useHeroCarousel = (slides: HeroSlide[]) => {
  const navigate = useNavigate();

  // Clone & Teleport 캐러셀 상태
  const [currentIndex, setCurrentIndex] = useState<number>(HERO_CAROUSEL.CLONE_COUNT);
  const [isAnimating, setIsAnimating] = useState(false);
  // rerender-lazy-state-init: Lazy initializer for window access
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < HERO_CAROUSEL.MOBILE_BREAKPOINT,
  );
  const [containerWidth, setContainerWidth] = useState<number>(
    HERO_CAROUSEL.CONTAINER_WIDTH_DEFAULT,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isTransitioningRef = useRef(false);

  // 모바일 감지 + 컨테이너 너비 추적
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < HERO_CAROUSEL.MOBILE_BREAKPOINT);
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 복제본 포함 슬라이드 배열 생성 (useMemo로 메모이제이션)
  // [last3, last2, last1, ...original, first1, first2, first3]
  const allSlides = useMemo(() => {
    if (slides.length === 0) return [];

    const cloneStart = slides.slice(-HERO_CAROUSEL.CLONE_COUNT); // 마지막 N개를 앞에
    const cloneEnd = slides.slice(0, HERO_CAROUSEL.CLONE_COUNT); // 처음 N개를 뒤에

    return [...cloneStart, ...slides, ...cloneEnd];
  }, [slides]);

  // 실제 슬라이드 인덱스 (0 ~ slides.length - 1)
  const realIndex =
    slides.length > 0
      ? (((currentIndex - HERO_CAROUSEL.CLONE_COUNT) % slides.length) + slides.length) %
        slides.length
      : 0;

  // 슬라이드 너비 (모바일: 컨테이너 전체, 데스크톱: 고정)
  const slideWidth = isMobile ? containerWidth : HERO_CAROUSEL.SLIDE_WIDTH_DESKTOP;

  // 중앙 정렬을 위한 오프셋 계산
  const getTranslateX = useCallback(
    (index: number) => {
      // 컨테이너 기준으로 중앙 계산
      const center = containerWidth / 2;
      const slideCenter = slideWidth / 2;
      return center - slideCenter - index * slideWidth;
    },
    [containerWidth, slideWidth],
  );

  // Coverflow 스타일 계산
  const getSlideStyle = useCallback(
    (index: number): React.CSSProperties => {
      const distance = index - currentIndex;
      const absDistance = Math.abs(distance);
      const normalizedDistance = Math.min(Math.max(distance, -2), 2);

      // 모바일: 현재 슬라이드만 표시
      if (isMobile) {
        return {
          transform: "scale(1)",
          opacity: absDistance === 0 ? 1 : 0,
          zIndex: absDistance === 0 ? 10 : 0,
        };
      }

      // 데스크톱: Coverflow 효과
      const scale = 1 - absDistance * 0.12;
      const opacity = absDistance > 2 ? 0 : 1 - absDistance * 0.25;
      const translateZ = -absDistance * 120;
      const rotateY = normalizedDistance * -20;
      const translateX = normalizedDistance * 40;

      return {
        transform: `perspective(1000px) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
        opacity,
        zIndex: 10 - absDistance,
      };
    },
    [currentIndex, isMobile],
  );

  // 슬라이드 이동
  const goToSlide = useCallback((index: number, animate = true) => {
    if (isTransitioningRef.current) return;

    setIsAnimating(animate);
    setCurrentIndex(index);

    if (animate) {
      isTransitioningRef.current = true;
    }
  }, []);

  // Autoplay 리셋 (재시작)
  const resetAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
    autoplayRef.current = setInterval(() => {
      // 여기서는 함수형 업데이트를 쓸 수 없으므로(deps 문제),
      // goToSlide 대신 직접 상태 업데이트하거나, ref를 사용해야 하는데
      // 일단 goToSlide가 deps에 들어가 있으므로 안전하게 호출
      setCurrentIndex((prev) => {
        // 주의: goToSlide 내부 로직과 맞추기 위해 직접 구현
        isTransitioningRef.current = true;
        setIsAnimating(true);
        return prev + 1;
      });
    }, HERO_CAROUSEL.AUTOPLAY_DELAY);
  }, []);

  // 다음 슬라이드 (rerender-functional-setstate: Remove currentIndex dependency)
  const scrollNext = useCallback(() => {
    if (isTransitioningRef.current) return;
    setIsAnimating(true);
    isTransitioningRef.current = true;
    setCurrentIndex((prev) => prev + 1);
    resetAutoplay();
  }, [resetAutoplay]);

  // 이전 슬라이드 (rerender-functional-setstate: Remove currentIndex dependency)
  const scrollPrev = useCallback(() => {
    if (isTransitioningRef.current) return;
    setIsAnimating(true);
    isTransitioningRef.current = true;
    setCurrentIndex((prev) => prev - 1);
    resetAutoplay();
  }, [resetAutoplay]);

  // 특정 dot으로 이동
  const scrollTo = useCallback(
    (index: number) => {
      goToSlide(HERO_CAROUSEL.CLONE_COUNT + index, true);
      resetAutoplay();
    },
    [goToSlide, resetAutoplay],
  );

  // 슬라이드 클릭 시 해당 슬라이드로 이동
  const handleSlideClick = useCallback(
    (index: number) => {
      if (index !== currentIndex) {
        goToSlide(index, true);
        resetAutoplay();
      }
    },
    [currentIndex, goToSlide, resetAutoplay],
  );

  // transitionend 핸들러 - Clone & Teleport 핵심 로직
  // rerender-functional-setstate: Use functional setState to remove currentIndex dependency
  const handleTransitionEnd = useCallback(() => {
    isTransitioningRef.current = false;

    if (slides.length === 0) return;

    const lastRealIndex = HERO_CAROUSEL.CLONE_COUNT + slides.length - 1;
    const firstRealIndex = HERO_CAROUSEL.CLONE_COUNT;

    setCurrentIndex((prevIndex) => {
      // 끝 복제본에 도착 → 진짜 첫 슬라이드로 순간이동
      if (prevIndex > lastRealIndex) {
        const overshoot = prevIndex - lastRealIndex;
        setIsAnimating(false);
        return firstRealIndex + overshoot - 1;
      }

      // 앞 복제본에 도착 → 진짜 마지막 슬라이드로 순간이동
      if (prevIndex < firstRealIndex) {
        const undershoot = firstRealIndex - prevIndex;
        setIsAnimating(false);
        return lastRealIndex - undershoot + 1;
      }

      return prevIndex;
    });
  }, [slides.length]);

  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
    autoplayRef.current = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
      setIsAnimating(true);
      isTransitioningRef.current = true;
    }, HERO_CAROUSEL.AUTOPLAY_DELAY);
  }, []);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  // slides.length가 변경될 때 currentIndex를 리셋 (Derived State Pattern)
  const [prevSlideLength, setPrevSlideLength] = useState(slides.length);
  if (slides.length !== prevSlideLength) {
    setPrevSlideLength(slides.length);
    setCurrentIndex(HERO_CAROUSEL.CLONE_COUNT);
  }

  // 초기화 및 Autoplay 시작
  useEffect(() => {
    if (slides.length > 0) {
      startAutoplay();
    }

    return () => stopAutoplay();
  }, [slides.length, startAutoplay, stopAutoplay]);

  // 채팅 시작 핸들러 (rerender-functional-setstate: useCallback for stable reference)
  const handleStartChat = useCallback(
    (slide: HeroSlide, e: React.MouseEvent) => {
      e.stopPropagation();
      void navigate("/chat", {
        state: {
          storyId: slide.story.id,
          storyTitle: slide.story.title,
          characterId: slide.character.id,
          characterName: slide.character.name,
          firstMessage: slide.character.firstMessage,
        },
      });
    },
    [navigate],
  );

  return {
    slideState: {
      currentIndex,
      isAnimating,
      isMobile,
      containerWidth,
      realIndex,
    },
    computed: {
      allSlides,
      getSlideStyle,
      getTranslateX,
    },
    handlers: {
      scrollNext,
      scrollPrev,
      scrollTo,
      handleSlideClick,
      handleTransitionEnd,
      startAutoplay,
      stopAutoplay,
      handleStartChat,
    },
    refs: {
      containerRef,
    },
  };
};
