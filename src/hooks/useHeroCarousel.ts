import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { HERO_CAROUSEL } from "@/constants/ui";
import { useStartChat } from "@/hooks/useStartChat";
import type { HeroSlide } from "@/types/hero-slide";

export const useHeroCarousel = (slides: HeroSlide[]) => {
  // ==========================================
  // 로컬 상태
  // ==========================================
  // 현재 슬라이드 인덱스
  const [currentIndex, setCurrentIndex] = useState<number>(HERO_CAROUSEL.CLONE_COUNT);
  // 애니메이션 진행 여부
  const [isAnimating, setIsAnimating] = useState(false);
  // 모바일 여부
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < HERO_CAROUSEL.MOBILE_BREAKPOINT,
  );
  // 컨테이너 너비
  const [containerWidth, setContainerWidth] = useState<number>(
    HERO_CAROUSEL.CONTAINER_WIDTH_DEFAULT,
  );
  // slides.length 변경 감지용 (Derived State Pattern)
  const [prevSlideLength, setPrevSlideLength] = useState(slides.length);

  // ==========================================
  // Refs
  // ==========================================
  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isTransitioningRef = useRef(false);

  // ==========================================
  // 외부 훅
  // ==========================================
  const { startChat } = useStartChat();

  // ==========================================
  // Derived State (렌더 시점 동기화)
  // ==========================================
  // slides.length가 변경될 때 currentIndex를 리셋
  if (slides.length !== prevSlideLength) {
    setPrevSlideLength(slides.length);
    setCurrentIndex(HERO_CAROUSEL.CLONE_COUNT);
  }

  // ==========================================
  // 계산된 값 (Computed)
  // ==========================================
  // 복제본 포함 슬라이드 배열 생성
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

  // Coverflow 스타일 계산 함수
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

  // ==========================================
  // 핸들러
  // ==========================================
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

  // 다음 슬라이드
  const scrollNext = useCallback(() => {
    if (isTransitioningRef.current) return;
    setIsAnimating(true);
    isTransitioningRef.current = true;
    setCurrentIndex((prev) => prev + 1);
    resetAutoplay();
  }, [resetAutoplay]);

  // 이전 슬라이드
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

  // Autoplay 시작
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

  // Autoplay 정지
  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  // 채팅 시작 핸들러
  const handleStartChat = useCallback(
    (slide: HeroSlide, e: React.MouseEvent) => {
      e.stopPropagation();

      void startChat({
        storyId: slide.story.id,
        storyTitle: slide.story.title,
        characterId: slide.character.id,
        characterName: slide.character.name,
        firstMessage: slide.character.firstMessage,
      });
    },
    [startChat],
  );

  // ==========================================
  // Effects
  // ==========================================
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

  // 초기화 및 Autoplay 시작
  useEffect(() => {
    if (slides.length > 0) {
      startAutoplay();
    }

    return () => stopAutoplay();
  }, [slides.length, startAutoplay, stopAutoplay]);

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
