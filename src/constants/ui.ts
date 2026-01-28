export const HERO_CAROUSEL = {
  SLIDE_WIDTH_DESKTOP: 396, // 380px + 16px (px-2 양쪽)
  CLONE_COUNT: 3, // 앞뒤로 복제할 슬라이드 수 (무한 루프)
  AUTOPLAY_DELAY: 5000, // 자동 재생 간격 (ms)
  MOBILE_BREAKPOINT: 768, // md breakpoint (px)
  CONTAINER_WIDTH_DEFAULT: 1200, // 초기 컨테이너 너비 (px)
} as const;
