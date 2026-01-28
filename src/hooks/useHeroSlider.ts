import { useCallback, useEffect, useRef, useState } from "react";

interface UseHeroSliderReturn {
  currentSlide: number;
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (index: number) => void;
}

export const useHeroSlider = (
  totalSlides: number,
  intervalTime: number = 5000,
): UseHeroSliderReturn => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (totalSlides > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, intervalTime);
    }
  }, [totalSlides, intervalTime]);

  useEffect(() => {
    resetInterval();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [resetInterval]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    resetInterval();
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    resetInterval();
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    resetInterval();
  };

  return {
    currentSlide,
    nextSlide,
    prevSlide,
    goToSlide,
  };
};
